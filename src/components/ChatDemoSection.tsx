import { useState, useRef, useEffect } from "react";
import SketchReveal from "./SketchReveal";
import axios from "axios";
import { getApiUrl } from "@/lib/api";

interface Message {
  role: "user" | "ai";
  text: string;
}

const renderMessageText = (text: string) => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

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

const ChatDemoSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hey! I'm Rinzan's virtual double. You can ask me about my journey, the tech I use, or some of the cool projects I've built!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    };

    // Use a small timeout to ensure DOM has updated
    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userQuery = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userQuery }]);
    setIsLoading(true);

    try {
      const response = await axios.post(getApiUrl("/query/"), {
        query: userQuery,
        history: messages
      });

      setMessages(prev => [...prev, { role: "ai", text: response.data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, I'm having trouble connecting to my brain right now. Please make sure the backend server is running!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="demo" className="py-20 px-4">
      <div className="container max-w-4xl mx-auto">
        <SketchReveal variant="pencil">
          <h2 className="text-4xl md:text-5xl font-hand font-bold text-center mb-4">📝 Chat with my Portfolio</h2>
          <p className="text-center font-sketch text-muted-foreground mb-12 text-lg">~ powered by Groq & Llama 3 ~</p>
        </SketchReveal>

        <SketchReveal variant="sticky" delay={0.2}>
          <div className="sticky-note sticky-note-blue p-4 md:p-8 max-w-2xl mx-auto space-y-4 md:space-y-6">
            <div className="flex items-center gap-2 pb-2 md:pb-3 border-b border-ink/10">
              <span className="text-xl md:text-2xl">👨‍💻</span>
              <span className="font-hand text-lg md:text-xl font-semibold">Talk to Rinzan (AI)</span>
              <span className="ml-auto w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-primary" />
            </div>

            <div className="space-y-4 h-[350px] md:h-[450px] overflow-y-auto pr-2 custom-scrollbar" ref={scrollRef}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[90%] md:max-w-[85%] p-2.5 md:p-3 font-sketch text-sm md:text-base leading-relaxed ${msg.role === "user"
                    ? "sketch-border bg-card text-card-foreground"
                    : "sketch-border-light bg-sticky-yellow/50 text-foreground"
                    }`}>
                    <p className="whitespace-pre-wrap">{renderMessageText(msg.text)}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-2.5 md:p-3 font-sketch text-sm md:text-base leading-relaxed sketch-border-light bg-sticky-yellow/30 text-muted-foreground italic">
                    Thinking... ✏️
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about Rinzan..."
                className="flex-1 sketch-border-light bg-card/50 px-3 md:px-4 py-2 font-sketch text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="sketch-border bg-primary text-primary-foreground px-4 py-2 font-hand text-lg md:text-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 whitespace-nowrap"
              >
                {isLoading ? "..." : "Send ✏️"}
              </button>
            </div>
          </div>
        </SketchReveal>
      </div>
    </section>
  );
};

export default ChatDemoSection;
