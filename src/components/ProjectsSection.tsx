import SketchReveal from "./SketchReveal";

const projects = [
  {
    icon: "🧠",
    title: "Agentic AI Research & Automation System",
    desc: "Multi-step LLM agent with dynamic tool-calling, persistent memory (MongoDB), and structured task execution using LangChain. Full orchestration exposed via FastAPI REST endpoints. Containerized and deployed on AWS EC2.",
    tags: ["LangChain", "FastAPI", "MongoDB", "AWS EC2", "Docker"],
    color: "sticky-note-blue",
  },
  {
    icon: "📚",
    title: "LLM-Based RAG Knowledge Platform",
    desc: "End-to-end document pipeline: ingestion, chunking, embedding, and vector store indexing using OpenAI and LangChain. FastAPI + PostgreSQL backend with Next.js SSR frontend. Full containerized stack deployed on AWS.",
    tags: ["OpenAI", "LangChain", "Next.js", "PostgreSQL", "AWS S3"],
    color: "sticky-note-green",
  },
  {
    icon: "🎓",
    title: "EdTech AI Tutor Platform",
    desc: "AI-powered personalized learning platform with multi-modal content generation, adaptive assessments, and real-time doubt resolution using LLM agents.",
    tags: ["LLM Agents", "React", "FastAPI", "Vector DB"],
    color: "sticky-note-pink",
  },
  {
    icon: "🏥",
    title: "Medical Report Analyzer",
    desc: "NLP-powered system that ingests medical reports, extracts key findings, and generates structured summaries using fine-tuned models and RAG.",
    tags: ["NLP", "RAG", "FastAPI", "PostgreSQL"],
    color: "sticky-note-blue",
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-20 px-4 paper-texture">
      <div className="container max-w-5xl mx-auto">
        <SketchReveal variant="pencil">
          <h2 className="text-4xl md:text-5xl font-hand font-bold text-center mb-4">🚀 Projects</h2>
          <p className="text-center font-sketch text-muted-foreground mb-12 text-lg">~ things I've built ~</p>
        </SketchReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <SketchReveal key={project.title} variant="sticky" delay={i * 0.15}>
              <div className={`sticky-note ${project.color} p-6 md:p-8 h-full transform ${i % 2 === 1 ? "rotate-1" : "-rotate-1"}`}>
                <div className="text-4xl mb-4">{project.icon}</div>
                <h3 className="font-hand text-xl font-bold mb-3 leading-tight">{project.title}</h3>
                <p className="font-sketch text-sm text-foreground mb-5 leading-relaxed">{project.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="font-mono text-xs px-2 py-0.5 bg-background/60 border border-ink/10">
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

export default ProjectsSection;
