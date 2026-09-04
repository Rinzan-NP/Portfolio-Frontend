import React, { useState, useEffect } from "react";
import PencilWrittenTitle from "./PencilWrittenTitle";
import HeroAgentBlueprint from "./HeroAgentBlueprint";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@/store/ChatContext";
import { trackEvent } from "@/lib/analytics";

const TypewriterRole: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const fullText = "AI_Systems_Architect";
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setDisplayed(fullText.slice(0, idx));
      if (idx >= fullText.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 40);
    return () => clearInterval(interval);
  }, [onComplete]);

  // Format parts with custom highlighting
  return (
    <span className="font-mono text-lg md:text-2xl inline-block mt-2 font-medium">
      <span className="text-muted-foreground/70">› </span>
      <span className="text-primary font-bold">
        {displayed.slice(0, 2)}
      </span>
      <span className="text-muted-foreground/60">
        {displayed.length > 2 ? "_" : ""}
      </span>
      <span className="text-amber-700 dark:text-amber-400 font-bold">
        {displayed.slice(3, 10)}
      </span>
      <span className="text-muted-foreground/60">
        {displayed.length > 10 ? "_" : ""}
      </span>
      <span className="text-foreground font-bold">
        {displayed.slice(11)}
      </span>
      <span className="animate-pulse text-primary ml-0.5 font-bold">▋</span>
    </span>
  );
};

const HeroSection = () => {
  const { openChat } = useChat();
  const [isTitleDrawn, setIsTitleDrawn] = useState(false);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 paper-texture relative overflow-hidden">
      <div className="absolute left-16 md:left-24 top-0 bottom-0 w-px bg-destructive/20" />

      <div className="container max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-14">
        {/* Left Column: Headline & Intro */}
        <div className="flex-1 space-y-6">
          {/* Top Pin Tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="inline-block sticky-note px-4 py-1.5 text-sm font-mono mb-2 cursor-pointer select-none">
              📌 Rinzan's Portfolio
            </div>
          </motion.div>

          {/* Title with Pencil Drawing Animation */}
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-hand font-bold leading-tight text-foreground">
              <PencilWrittenTitle
                delay={0.2}
                onWritingComplete={() => setIsTitleDrawn(true)}
              />
              <br />
              <AnimatePresence>
                {isTitleDrawn && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <TypewriterRole />
                  </motion.div>
                )}
              </AnimatePresence>
            </h1>
          </div>

          {/* Description Paragraph: Flows in smoothly after title */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={isTitleDrawn ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-lg md:text-2xl font-sketch text-muted-foreground max-w-lg leading-relaxed">
              Expert in building RAG, LLM Agents, and scalable AI microservices with 2+ years of experience.
            </p>
          </motion.div>

          {/* Action Button: Flows in smoothly */}
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={isTitleDrawn ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 14, scale: 0.95 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              className="sketch-border bg-primary text-primary-foreground px-6 md:px-8 py-3 text-lg md:text-xl font-hand font-semibold hover:scale-105 transition-transform active:scale-95 shadow-md"
              onClick={() => {
                trackEvent("chat_open", { location: "hero_cta" });
                openChat();
              }}
            >
              ✏️ Chat with My Career
            </button>
          </motion.div>

          {/* Social / Portfolio Links: Flows in smoothly */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isTitleDrawn ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap gap-2 md:gap-4 pt-2">
              {[
                { label: "Resume", href: "/Rinzan_Resume.pdf", event: "resume_download" },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/rinzan-np-477154284/", event: "linkedin_click" },
                { label: "GitHub", href: "https://github.com/Rinzan-NP", event: "github_click" },
                { label: "Instagram", href: "https://www.instagram.com/_rinzan_np_/", event: "instagram_click" }
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={() => trackEvent(link.event, { location: "hero_social_bar" })}
                  className="hand-drawn-border px-3 py-1 font-mono text-xs md:text-sm hover:bg-pencil-hover transition-colors"
                >
                  #{link.label.toLowerCase()}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Interactive RAG Pipeline Architecture Blueprint Card */}
        <div className="flex-1 flex justify-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={isTitleDrawn ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex justify-center"
          >
            <HeroAgentBlueprint />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
