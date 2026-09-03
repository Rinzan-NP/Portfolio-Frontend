import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Sparkles, CheckCircle2, Cpu, Database, Zap, Terminal } from "lucide-react";

interface PipelineStep {
  id: string;
  label: string;
  tech: string;
  icon: React.ReactNode;
  detail: string;
  color: string;
}

const STEPS: PipelineStep[] = [
  {
    id: "input",
    label: "User Prompt",
    tech: "Query / Context",
    icon: <Terminal className="w-4 h-4" />,
    detail: "Raw intent parsed & sanitized",
    color: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
  },
  {
    id: "agent",
    label: "Agent Router",
    tech: "LangChain • ReAct",
    icon: <Cpu className="w-4 h-4" />,
    detail: "Multi-tool decision & task planning",
    color: "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
  },
  {
    id: "retrieval",
    label: "Vector Store",
    tech: "ChromaDB • Top-K",
    icon: <Database className="w-4 h-4" />,
    detail: "Cosine sim > 0.89 semantic match",
    color: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
  },
  {
    id: "inference",
    label: "LLM Synthesis",
    tech: "Llama 3 • FastAPI",
    icon: <Zap className="w-4 h-4" />,
    detail: "Streaming token generation (220 tok/s)",
    color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  },
];

export const HeroAgentBlueprint: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSims, setCompletedSims] = useState<number>(142);

  // Auto step pulse cycle
  useEffect(() => {
    if (isRunning) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isRunning]);

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(0);

    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      if (current < STEPS.length) {
        setActiveStep(current);
      } else {
        clearInterval(timer);
        setIsRunning(false);
        setCompletedSims((prev) => prev + 1);
      }
    }, 450);
  };

  const currentInfo = STEPS[activeStep];

  return (
    <div className="relative w-full max-w-[420px] select-none">
      {/* Top Scotch Tape Effect */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-accent/40 rounded-sm transform -rotate-1 z-20 shadow-xs pointer-events-none" />

      {/* Main Drafting Blueprint Paper Card - Stable Grounded (No hover lift) */}
      <div className="bg-card/90 sketch-border p-5 sm:p-6 shadow-xl relative z-10 backdrop-blur-xs">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b-2 border-dashed border-ink/15 pb-3.5 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-hand font-bold text-lg text-foreground">
              RAG Pipeline Engine
            </span>
          </div>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold">
            v2.4 • Active
          </span>
        </div>

        {/* Interactive Pipeline Node Stack - Static positioning */}
        <div className="space-y-2.5 relative">
          {STEPS.map((step, idx) => {
            const isActive = activeStep === idx;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-lg border-2 transition-colors cursor-pointer relative ${
                  isActive
                    ? `${step.color} shadow-sm`
                    : "bg-background/50 border-ink/10 opacity-75"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-background/80 shadow-xs">
                      {step.icon}
                    </div>
                    <div>
                      <div className="font-hand font-bold text-base text-foreground leading-tight">
                        {step.label}
                      </div>
                      <div className="font-mono text-[11px] text-pencil">
                        {step.tech}
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="flex items-center gap-1 font-mono text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-background border border-primary/30"
                    >
                      <Sparkles className="w-3 h-3 animate-spin" />
                      <span>PROCESSING</span>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-Time Live Status Terminal Console */}
        <div className="mt-4 p-3 bg-background/80 rounded-md sketch-border-light font-mono text-xs text-pencil">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground border-b border-ink/10 pb-1 mb-1.5">
            <span>TERMINAL OUTPUT</span>
            <span className="text-emerald-600 dark:text-emerald-400">● STREAMING</span>
          </div>
          <div className="text-foreground font-semibold flex items-center gap-1.5">
            <span className="text-primary font-bold">›</span>
            <span className="truncate">{currentInfo.detail}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between gap-3">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="flex-1 hand-drawn-border py-2 px-3 bg-primary text-primary-foreground font-hand font-bold text-base hover:bg-primary/90 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
            <span>{isRunning ? "Simulating Query..." : "⚡ Test RAG Pipeline"}</span>
          </button>

          <div className="flex items-center gap-1 font-mono text-[11px] text-pencil px-2 py-1 bg-background/50 rounded border border-ink/10">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{completedSims} runs</span>
          </div>
        </div>
      </div>

      {/* Floating Corner Decorative Badges */}
      <div className="absolute -bottom-3 -right-3 bg-sticky-yellow px-3 py-1 text-xs font-hand transform rotate-3 border border-ink/20 rounded shadow-xs z-20 pointer-events-none">
        ⚡ 180ms End-to-End
      </div>
      <div className="absolute -top-3 -left-3 bg-sticky-pink px-3 py-1 text-xs font-mono transform -rotate-4 border border-ink/20 rounded shadow-xs z-20 pointer-events-none">
        #LangChain #FastAPI
      </div>
    </div>
  );
};

export default HeroAgentBlueprint;
