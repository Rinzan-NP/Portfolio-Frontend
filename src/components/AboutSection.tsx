import SketchReveal from "./SketchReveal";

const experience = [
  {
    year: "Dec 2025 - Present",
    role: "AI Engineer",
    company: "Solinify Tech Studio",
    detail: "Architecting LLM-powered backend services, RAG pipelines, and agentic workflows using FastAPI and LangChain."
  },
  {
    year: "Aug 2025 - Nov 2025",
    role: "Full Stack AI Developer",
    company: "Prospello Technologies",
    detail: "Built AI-enabled full-stack applications with Next.js, FastAPI, and optimized data pipelines."
  },
  {
    year: "Jun 2024 - Aug 2025",
    role: "Django Developer",
    company: "Gingr Informatics",
    detail: "Developed scalable backend systems with Django/DRF, focusing on normalized database schemas and JWT security."
  },
];

const education = [
  {
    year: "2024 - 2028",
    degree: "B.Tech in Computer Science",
    school: "APJ Abdul Kalam Technological University",
    detail: "Specializing in Data Structures, AI, and Software Engineering."
  },
  {
    year: "2022 - 2023",
    degree: "Full Stack Development BootCamp",
    school: "Brototype",
    detail: "Intensive training in modern web technologies and building production-grade applications."
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 paper-texture">
      <div className="container max-w-5xl mx-auto">
        <SketchReveal variant="pencil">
          <h2 className="text-4xl md:text-5xl font-hand font-bold text-center mb-4">👨‍💻 About Me</h2>
          <p className="text-center font-sketch text-muted-foreground mb-16 text-lg">~ my story & credentials ~</p>
        </SketchReveal>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <SketchReveal variant="sticky" className="flex-1 w-full lg:max-w-md">
            <div className="sticky-note p-8 space-y-6">
              <h3 className="font-hand text-3xl font-bold text-foreground">Hi, I'm Rinzan 👋</h3>
              <p className="font-sketch text-pencil text-lg leading-relaxed">
                I'm an AI Engineer with a passion for building production-grade LLM systems.
                I specialize in turning raw document corpora into intelligent, agentic systems that reason and execute tasks.
              </p>
              <div className="space-y-4 pt-4 border-t border-ink/10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <span className="font-sketch text-pencil">FastAPI & Django Expert</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔗</span>
                  <span className="font-sketch text-pencil">RAG & Agentic Workflow Design</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">☁️</span>
                  <span className="font-sketch text-pencil">AWS & Docker Deployment</span>
                </div>
              </div>
            </div>
          </SketchReveal>

          <div className="flex-1 space-y-12 w-full">
            <div>
              <h3 className="font-hand text-3xl font-bold mb-6 text-primary underline underline-offset-4">Experience</h3>
              <div className="space-y-8 pl-4 border-l-2 border-border/50">
                {experience.map((item, i) => (
                  <SketchReveal key={i} variant="pencil" delay={i * 0.1}>
                    <div className="relative pl-6">
                      <div className="absolute -left-[33px] top-2 w-4 h-4 rounded-full bg-primary sketch-border" />
                      <span className="font-mono text-xs text-primary font-semibold">{item.year}</span>
                      <h4 className="font-hand text-2xl font-bold text-foreground">{item.role}</h4>
                      <p className="font-sketch text-sm text-primary mb-1">{item.company}</p>
                      <p className="font-sketch text-pencil">{item.detail}</p>
                    </div>
                  </SketchReveal>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-hand text-3xl font-bold mb-6 text-primary underline underline-offset-4">Education</h3>
              <div className="space-y-8 pl-4 border-l-2 border-border/50">
                {education.map((item, i) => (
                  <SketchReveal key={i} variant="pencil" delay={0.3 + i * 0.1}>
                    <div className="relative pl-6">
                      <div className="absolute -left-[33px] top-2 w-4 h-4 rounded-full bg-border sketch-border" />
                      <span className="font-mono text-xs text-pencil font-semibold">{item.year}</span>
                      <h4 className="font-hand text-2xl font-bold text-foreground">{item.degree}</h4>
                      <p className="font-sketch text-sm text-primary mb-1">{item.school}</p>
                      <p className="font-sketch text-pencil">{item.detail}</p>
                    </div>
                  </SketchReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
