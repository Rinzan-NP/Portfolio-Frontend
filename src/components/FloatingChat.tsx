import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl } from "@/lib/api";
import { X, MessageCircle } from "lucide-react";
import { useChat } from "@/store/ChatContext";
import { trackEvent } from "@/lib/analytics";

interface Message {
  role: "user" | "ai";
  text: string;
}

let _currentAudio: HTMLAudioElement | null = null;
let _ttsQueue: string[] = [];
let _ttsPlaying = false;

const playNextTTS = async (ttsEnabled: boolean) => {
  if (!ttsEnabled || _ttsQueue.length === 0) {
    _ttsPlaying = false;
    return;
  }
  _ttsPlaying = true;
  const text = _ttsQueue.shift()!;
  try {
    const response = await fetch(getApiUrl("/speak/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!response.body) { playNextTTS(ttsEnabled); return; }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    _currentAudio = new Audio(url);
    _currentAudio.onended = () => {
      URL.revokeObjectURL(url);
      _currentAudio = null;
      playNextTTS(ttsEnabled);
    };
    _currentAudio.onerror = () => {
      URL.revokeObjectURL(url);
      _currentAudio = null;
      playNextTTS(ttsEnabled);
    };
    _currentAudio.play();
  } catch {
    _ttsPlaying = false;
  }
};

const playTTSSentence = async (text: string, ttsEnabled: boolean) => {
  if (!ttsEnabled) return;
  _ttsQueue.push(text);
  if (!_ttsPlaying) playNextTTS(ttsEnabled);
};

const cleanChatText = (raw: string) => {
  return raw
    .replace(/^data:\s*/gm, "")
    .replace(/\[SECTION:\w+\]/g, "")
    .trimStart();
};

const renderMessageText = (rawText: string) => {
  const text = cleanChatText(rawText);
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const label = match[1];
    const url = match[2];
    parts.push(
      <a
        key={lastIndex}
        href={url}
        target={url.startsWith("/") ? "_self" : "_blank"}
        rel="noopener noreferrer"
        download={url.endsWith(".pdf") ? true : undefined}
        className="text-primary underline font-bold hover:text-primary/80 transition-colors"
      >
        {label}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

const FloatingChat = () => {
  const { isOpen, toggleChat, isAiReady } = useChat();
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hey, I'm Rinzan's AI version. Ask me anything about him!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [streamingText, setStreamingText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAiReady && ttsEnabled && messages.length === 1) {
      playTTSSentence(messages[0].text, ttsEnabled);
    }
  }, [isAiReady, ttsEnabled]);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [isOpen, messages, streamingText]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput("");
    setIsLoading(true);
    setStreamingText("");

    trackEvent("chat_message_sent", { location: "floating_chat" });

    // Add only user message initially
    setMessages(prev => [...prev, { role: "user", text: userQuery }]);

    try {
      const response = await fetch(getApiUrl("/query/stream"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery, history: messages }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";
      let wordBuffer = "";
      let hasAddedAiBubble = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            let data = line.slice(6);
            if (data === "[DONE]") continue;

            // Extract section tags
            const sectionMatches = data.match(/\[SECTION:(\w+)\]/g);
            if (sectionMatches) {
              for (const matchStr of sectionMatches) {
                const sec = matchStr.replace("[SECTION:", "").replace("]", "");
                window.dispatchEvent(
                  new CustomEvent("rinzan:highlight-section", { detail: { section: sec } })
                );
              }
              data = data.replace(/\[SECTION:\w+\]/g, "");
            }

            data = data.replace(/^data:\s*/, "");
            if (!data) continue;

            fullText += data;
            wordBuffer += data;
            const cleanDisplay = cleanChatText(fullText);
            setStreamingText(cleanDisplay);

            // Add or update the AI message bubble once text starts streaming
            setMessages(prev => {
              if (!hasAddedAiBubble) {
                hasAddedAiBubble = true;
                return [...prev, { role: "ai", text: cleanDisplay }];
              }
              const updated = [...prev];
              updated[updated.length - 1] = { role: "ai", text: cleanDisplay };
              return updated;
            });

            // TTS each sentence as it completes
            const sentenceMatch = wordBuffer.match(/^[^.!?]*[.!?]+/);
            if (sentenceMatch) {
              const sentence = cleanChatText(sentenceMatch[0]);
              wordBuffer = wordBuffer.slice(sentenceMatch[0].length);
              if (sentence.trim()) {
                playTTSSentence(sentence, ttsEnabled);
              }
            }
          }
        }
      }

      const cleanRemaining = cleanChatText(wordBuffer);
      if (ttsEnabled && cleanRemaining.trim()) playTTSSentence(cleanRemaining, ttsEnabled);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Oops, can't reach the brain right now. Make sure the backend's running!" }]);
    } finally {
      setIsLoading(false);
      setStreamingText("");
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-sticky-yellow sketch-border shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        onClick={() => {
          trackEvent("chat_toggle", { action: !isOpen ? "open" : "close" });
          toggleChat();
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>


      {/* Chat Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.15,
              rotateX: 65,
              rotateZ: -12,
              skewX: 4,
              y: 50,
              transformOrigin: "bottom right",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: 0,
              rotateZ: 0,
              skewX: 0,
              y: 0,
              transition: {
                type: "spring",
                damping: 18,
                stiffness: 220,
                mass: 0.8,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.1,
              rotateX: 75,
              rotateZ: 8,
              skewX: -6,
              y: 40,
              transformOrigin: "bottom right",
              transition: {
                duration: 0.22,
                ease: "easeInOut",
              },
            }}
            style={{ perspective: 1200 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-md max-h-[70vh] flex flex-col"
          >
            <div className="sticky-note sticky-note-blue p-4 md:p-6 flex flex-col max-h-[70vh] shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-2 pb-3 border-b border-ink/10 mb-3">
                <span className="text-xl">👨‍💻</span>
                <span className="font-hand text-lg font-semibold">Talk to Rinzan (AI)</span>
                <button
                  onClick={() => setTtsEnabled(v => !v)}
                  className="ml-auto text-lg hover:scale-110 transition-transform"
                  title={ttsEnabled ? "Mute voice" : "Enable voice"}
                >
                  {ttsEnabled ? "🔊" : "🔇"}
                </button>
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>

              {/* Messages */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar" ref={scrollRef}>
                {messages.map((msg, i) => {
                  const cleanText = cleanChatText(msg.text);
                  if (!cleanText) return null;
                  return (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] p-3 font-sketch text-sm leading-relaxed ${msg.role === "user"
                        ? "sketch-border bg-card text-card-foreground"
                        : "sketch-border-light bg-sticky-yellow/50 text-foreground"
                        }`}>
                        <p className="whitespace-pre-wrap">{renderMessageText(cleanText)}</p>
                      </div>
                    </div>
                  );
                })}
                {isLoading && !streamingText && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] p-3 font-sketch text-sm leading-relaxed sketch-border-light bg-sticky-yellow/40 text-muted-foreground italic flex items-center gap-2 shadow-sm animate-pulse">
                      <span>Thinking...</span>
                      <span className="text-base animate-bounce">✏️</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-ink/10">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about Rinzan..."
                  className="flex-1 sketch-border-light bg-card/50 px-3 py-2 font-sketch text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="sketch-border bg-primary text-primary-foreground px-4 py-2 font-hand text-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                >
                  {isLoading ? "..." : "✏️"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat;
