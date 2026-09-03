import SketchReveal from "./SketchReveal";

const services = [
  {
    icon: "🤖",
    title: "LLM & AI Agents",
    desc: "Build agentic workflows with tool-calling, multi-step reasoning, and persistent memory using LangChain and OpenAI.",
    tags: ["LangChain", "OpenAI", "Tool-Calling", "Agentic"],
  },
  {
    icon: "📚",
    title: "RAG Pipelines",
    desc: "Design and deploy retrieval-augmented generation systems — from document ingestion to grounded, cited answers.",
    tags: ["Vector Search", "Embeddings", "ChromaDB", "LangChain"],
  },
  {
    icon: "⚡",
    title: "AI Microservices",
    desc: "Ship production-grade FastAPI services that power AI features at scale, containerized with Docker on AWS.",
    tags: ["FastAPI", "Docker", "AWS EC2", "Async"],
  },
  {
    icon: "🌐",
    title: "Full-Stack AI Apps",
    desc: "Ship end-to-end applications — Next.js frontends wired to Django/FastAPI backends with AI baked in.",
    tags: ["Next.js", "React", "Django", "PostgreSQL"],
  },
  {
    icon: "🔐",
    title: "Backend & APIs",
    desc: "Secure, scalable REST APIs with JWT auth, RBAC, optimized SQL, and clean architecture patterns.",
    tags: ["Django REST", "JWT", "PostgreSQL", "RBAC"],
  },
  {
    icon: "☁️",
    title: "Cloud & DevOps",
    desc: "Deploy and maintain containerized stacks on AWS — EC2, S3, Docker, and CI/CD pipelines.",
    tags: ["AWS", "Docker", "Linux", "CI/CD"],
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 px-4 paper-texture">
      <div className="container max-w-5xl mx-auto">
        <SketchReveal variant="pencil">
          <h2 className="text-4xl md:text-5xl font-hand font-bold text-center mb-4">📋 Services</h2>
          <p className="text-center font-sketch text-muted-foreground mb-12 text-lg">~ what I can build for you ~</p>
        </SketchReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <SketchReveal key={service.title} variant="sticky" delay={i * 0.1}>
              <div className={`sticky-note ${i % 3 === 1 ? "sticky-note-green" : i % 3 === 2 ? "sticky-note-pink" : "sticky-note-blue"} p-6 h-full`}>
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="font-hand text-xl font-bold mb-2">{service.title}</h3>
                <p className="font-sketch text-sm text-foreground mb-4 leading-relaxed">{service.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map(tag => (
                    <span key={tag} className="font-mono text-xs px-2.5 py-1 bg-background/70 border border-ink/15 rounded-sm hover:bg-primary/15 hover:border-primary/40 hover:scale-105 transition-all cursor-default select-none">
                      {tag}
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

export default ServicesSection;
