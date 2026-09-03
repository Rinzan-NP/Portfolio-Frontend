import SketchReveal from "./SketchReveal";

const experience = [
  {
    year: "Dec 2025 - Present",
    role: "AI Engineer",
    company: "Solinify Tech Studio",
    badge: "Current Role",
    detail: "Architecting LLM-powered backend services, RAG pipelines, and agentic workflows using FastAPI and LangChain.",
    highlights: [
      "Designing and deploying production multi-tenant RAG pipelines with ChromaDB and hybrid vector retrieval.",
      "Building tool-calling AI agents with persistent state memory, streaming responses, and automated task execution.",
      "Engineering high-throughput asynchronous FastAPI microservices containerized with Docker on AWS EC2."
    ],
    skills: ["LangChain", "FastAPI", "RAG", "ChromaDB", "Llama 3", "AWS EC2", "Docker"]
  },
  {
    year: "Aug 2025 - Nov 2025",
    role: "Full Stack AI Developer",
    company: "Prospello Technologies",
    badge: "AI & Full Stack",
    detail: "Built AI-enabled full-stack applications with Next.js, FastAPI, and optimized data pipelines.",
    highlights: [
      "Developed interactive generative AI features combining Next.js SSR frontends with Python API backends.",
      "Implemented document chunking, embeddings pipelines, and semantic search interfaces.",
      "Streamlined API response times and optimized PostgreSQL vector storage queries."
    ],
    skills: ["Next.js", "React", "FastAPI", "OpenAI API", "PostgreSQL", "Tailwind CSS"]
  },
  {
    year: "Jun 2024 - Aug 2025",
    role: "Django Developer",
    company: "Gingr Informatics",
    badge: "Backend & Systems",
    detail: "Developed scalable backend systems with Django/DRF, focusing on normalized database schemas and JWT security.",
    highlights: [
      "Engineered robust RESTful APIs with Django REST Framework (DRF), JWT authentication, and RBAC.",
      "Designed normalized PostgreSQL schemas and optimized complex ORM query performance.",
      "Integrated third-party payment gateways, webhook pipelines, and automated background jobs."
    ],
    skills: ["Django", "Django REST", "PostgreSQL", "JWT Auth", "REST APIs", "Python"]
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-20 px-4 paper-texture">
      <div className="container max-w-4xl mx-auto">
        <SketchReveal variant="pencil">
          <h2 className="text-4xl md:text-5xl font-hand font-bold text-center mb-4">💼 Experience</h2>
          <p className="text-center font-sketch text-muted-foreground mb-16 text-lg">~ places I've built & grown ~</p>
        </SketchReveal>

        <div className="space-y-12 pl-6 md:pl-8 border-l-2 border-dashed border-primary/40">
          {experience.map((item, i) => (
            <SketchReveal key={item.company} variant="pencil" delay={i * 0.15}>
              <div className="relative pl-6 md:pl-8 group">
                {/* Timeline Bullet Node */}
                <div className="absolute -left-[35px] md:-left-[43px] top-1.5 w-5 h-5 rounded-full bg-sticky-yellow border-2 border-primary shadow-sm flex items-center justify-center group-hover:scale-125 group-hover:bg-primary transition-all duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-background transition-colors" />
                </div>

                {/* Timeline Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs md:text-sm font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/20">
                      {item.year}
                    </span>
                    {item.badge && (
                      <span className="font-sketch text-xs px-2 py-0.5 bg-accent/30 text-foreground/80 rounded border border-accent/40">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="font-sketch text-base md:text-lg text-primary font-bold">
                    {item.company}
                  </span>
                </div>

                {/* Role Title */}
                <h3 className="font-hand text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {item.role}
                </h3>

                {/* Overview */}
                <p className="font-sketch text-base md:text-lg text-foreground/85 leading-relaxed mb-4">
                  {item.detail}
                </p>

                {/* Highlights Card */}
                <div className="bg-card/60 p-4 md:p-6 rounded-lg sketch-border-light mb-4 group-hover:shadow-md transition-shadow">
                  <ul className="space-y-2.5">
                    {item.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 font-sketch text-sm md:text-base text-pencil leading-relaxed">
                        <span className="text-primary font-bold mt-0.5">›</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="font-mono text-xs px-2.5 py-1 bg-background/80 border border-ink/15 rounded-sm hover:bg-primary/15 hover:border-primary/40 hover:scale-105 transition-all cursor-default select-none"
                    >
                      #{skill.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            </SketchReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
