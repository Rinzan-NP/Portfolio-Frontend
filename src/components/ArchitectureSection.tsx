import SketchReveal from "./SketchReveal";

const steps = [
  { label: "Frontend", emoji: "⚛️", note: "React / Vite" },
  { label: "Backend", emoji: "⚡", note: "FastAPI" },
  { label: "Brain", emoji: "🚀", note: "Groq (Llama 3)" },
  { label: "Memory", emoji: "🔍", note: "ChromaDB" },
  { label: "Bridge", emoji: "🔗", note: "LangChain" },
];

const ArchitectureSection = () => {
  return (
    <section className="py-20 px-4 paper-texture">
      <div className="container max-w-5xl mx-auto">
        <SketchReveal variant="pencil">
          <h2 className="text-4xl md:text-5xl font-hand font-bold text-center mb-4">🏗️ Architecture</h2>
          <p className="text-center font-sketch text-muted-foreground mb-16 text-lg">~ how it all connects ~</p>
        </SketchReveal>

        {/* Desktop flow */}
        <div className="hidden md:flex items-center justify-center gap-2">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <SketchReveal variant="pop" delay={i * 0.15}>
                <div className="sketch-border bg-card p-4 text-center min-w-[120px] hover:scale-105 transition-transform">
                  <div className="text-3xl mb-1">{step.emoji}</div>
                  <div className="font-hand text-xl font-bold text-foreground">{step.label}</div>
                  <div className="font-mono text-xs text-pencil mt-1">{step.note}</div>
                </div>
              </SketchReveal>
              {i < steps.length - 1 && (
                <SketchReveal variant="pencil" delay={i * 0.15 + 0.1}>
                  <div className="w-16 h-5 hand-drawn-arrow mx-1 flex-shrink-0" />
                </SketchReveal>
              )}
            </div>
          ))}
        </div>

        {/* Mobile flow */}
        <div className="md:hidden space-y-3">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center">
              <SketchReveal variant="pop" delay={i * 0.1}>
                <div className="sketch-border bg-card p-4 text-center w-full max-w-[200px] hover:scale-105 transition-transform">
                  <div className="text-3xl mb-1">{step.emoji}</div>
                  <div className="font-hand text-xl font-bold text-foreground">{step.label}</div>
                  <div className="font-mono text-xs text-pencil mt-1">{step.note}</div>
                </div>
              </SketchReveal>
              {i < steps.length - 1 && <div className="text-2xl text-pencil my-1">↓</div>}
            </div>
          ))}
        </div>

        <SketchReveal variant="sketch" delay={0.8}>
          <div className="text-center mt-12 font-hand text-muted-foreground text-lg">
            <span className="sketch-border-light px-4 py-2 inline-block rotate-1">
              * each arrow = an API call or data flow *
            </span>
          </div>
        </SketchReveal>
      </div>
    </section>
  );
};

export default ArchitectureSection;
