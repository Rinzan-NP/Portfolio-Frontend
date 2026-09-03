import SketchReveal from "./SketchReveal";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 paper-texture">
      <div className="container max-w-4xl mx-auto">
        <SketchReveal variant="pencil">
          <h2 className="text-4xl md:text-5xl font-hand font-bold text-center mb-4">👨‍💻 About Me</h2>
          <p className="text-center font-sketch text-muted-foreground mb-14 text-lg">~ who I am & how I work ~</p>
        </SketchReveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Main Sticky Note */}
          <SketchReveal variant="sticky" className="md:col-span-7">
            <div className="sticky-note p-6 md:p-8 space-y-6">
              <h3 className="font-hand text-3xl font-bold text-foreground">Hi, I'm Rinzan 👋</h3>
              <p className="font-sketch text-pencil text-lg leading-relaxed">
                I'm an AI Systems Architect & Backend Engineer with over 2 years of experience building production-grade LLM applications.
              </p>
              <p className="font-sketch text-pencil text-base leading-relaxed">
                I specialize in designing scalable RAG pipelines, agentic multi-tool workflows, and high-throughput microservices using FastAPI, LangChain, and AWS.
              </p>
              
              <div className="space-y-3.5 pt-4 border-t border-ink/10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <span className="font-sketch text-pencil text-base font-medium">FastAPI & Python Microservices Specialist</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧠</span>
                  <span className="font-sketch text-pencil text-base font-medium">Agentic Reasoning & Tool-Calling Architectures</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">☁️</span>
                  <span className="font-sketch text-pencil text-base font-medium">Containerized Deployment (Docker & AWS EC2)</span>
                </div>
              </div>
            </div>
          </SketchReveal>

          {/* Right Side Stat & Quick Info Cards */}
          <div className="md:col-span-5 space-y-5">
            <SketchReveal variant="pop" delay={0.2}>
              <div className="sticky-note sticky-note-blue p-5 rotate-1">
                <div className="text-3xl mb-1">🎯</div>
                <h4 className="font-hand text-xl font-bold text-foreground mb-1">Core Philosophy</h4>
                <p className="font-sketch text-sm text-pencil leading-relaxed">
                  "AI should not just chat — it should actively reason, connect tools, and execute workflows reliably."
                </p>
              </div>
            </SketchReveal>

            <SketchReveal variant="pop" delay={0.35}>
              <div className="sticky-note sticky-note-green p-5 -rotate-1">
                <div className="text-3xl mb-1">🚀</div>
                <h4 className="font-hand text-xl font-bold text-foreground mb-1">Experience & Impact</h4>
                <p className="font-sketch text-sm text-pencil leading-relaxed">
                  2+ years architecting scalable backends, shipping production vector stores, and building autonomous agent swarms.
                </p>
              </div>
            </SketchReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
