import aiBrainDoodle from "@/assets/ai-brain-doodle.png";
import SketchReveal from "./SketchReveal";
import { motion } from "framer-motion";
import { useChat } from "@/store/ChatContext";

const HeroSection = () => {
  const { openChat } = useChat();

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 paper-texture relative overflow-hidden">
      <div className="absolute left-16 md:left-24 top-0 bottom-0 w-px bg-destructive/20" />

      <div className="container max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <SketchReveal variant="sticky" delay={0.1}>
            <div className="inline-block sticky-note px-4 py-1 text-sm font-mono mb-2">
              📌 Rinzan's Portfolio 
            </div>
          </SketchReveal>

          <SketchReveal variant="pencil" delay={0.3}>
            <h1 className="text-4xl md:text-7xl font-hand font-bold leading-tight text-foreground">
              Rinzan N P<br />
              <span className="font-mono text-lg md:text-2xl">
                <span className="text-muted-foreground">› </span>
                <span className="text-primary">AI</span>
                <span className="text-foreground">_</span>
                <span className="text-secondary">Systems</span>
                <span className="text-foreground">_</span>
                <span className="text-muted-foreground">Architect</span>
                <span className="animate-pulse text-primary">▋</span>
              </span>
            </h1>
          </SketchReveal>

          <SketchReveal variant="pencil" delay={0.5}>
            <p className="text-lg md:text-2xl font-sketch text-muted-foreground max-w-lg">
              Expert in building RAG, LLM Agents, and scalable AI microservices with 2+ years of experience.
            </p>
          </SketchReveal>

          <SketchReveal variant="sketch" delay={0.7}>
            <button
              className="sketch-border bg-primary text-primary-foreground px-6 md:px-8 py-3 text-lg md:text-xl font-hand font-semibold hover:scale-105 transition-transform active:scale-95"
              onClick={openChat}
            >
              ✏️ Chat with My Career
            </button>
          </SketchReveal>

          <SketchReveal variant="sketch" delay={0.9}>
            <div className="flex flex-wrap gap-2 md:gap-4 pt-4">
              {[
                { label: "Resume", href: "/Rinzan_Resume.pdf" },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/rinzan-np-477154284/" },
                { label: "GitHub", href: "https://github.com/Rinzan-NP" },
                { label: "Instagram", href: "https://www.instagram.com/_rinzan_np_/" }
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sketch-border-light px-2 md:px-3 py-1 text-xs md:sm font-mono text-pencil hover:bg-primary/10 transition-colors"
                >
                  #{link.label.toLowerCase()}
                </a>
              ))}
            </div>
          </SketchReveal>
        </div>

        <SketchReveal variant="pop" delay={0.4} className="flex-shrink-0">
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <img src={aiBrainDoodle} alt="AI network doodle illustration" className="w-48 h-48 md:w-80 md:h-80 opacity-80 object-contain" />
            <div className="hidden sm:block absolute -top-4 -right-4 font-hand text-sm text-primary rotate-12">
              Llama 3 Powered! →
            </div>
            <div className="hidden sm:block absolute -bottom-2 left-4 font-hand text-sm text-pencil -rotate-6">
              ← ChromaDB Vector Memory
            </div>
          </motion.div>
        </SketchReveal>
      </div>
    </section>
  );
};

export default HeroSection;
