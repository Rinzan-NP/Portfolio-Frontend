import SketchReveal from "./SketchReveal";

const techStack = [
  { name: "FastAPI", description: "High-performance Python microservices for AI inference and backend logic.", emoji: "⚡", color: "sticky-note sticky-note-green" },
  { name: "LangChain", description: "Orchestration for RAG pipelines, agents, and multi-step reasoning.", emoji: "🔗", color: "sticky-note" },
  { name: "Django & DRF", description: "Robust backend systems with secure authentication and complex data models.", emoji: "🐍", color: "sticky-note sticky-note-blue" },
  { name: "Next.js & React", description: "SSR and interactive frontends for building seamless user experiences.", emoji: "⚛️", color: "sticky-note sticky-note-blue" },
  { name: "PostgreSQL & Vector DBs", description: "Traditional relational data combined with semantic vector storage.", emoji: "📂", color: "sticky-note sticky-note-pink" },
  { name: "AWS & Docker", description: "Containerized cloud deployment on EC2 with scalable architectures.", emoji: "☁️", color: "sticky-note sticky-note-pink" },
];

const TechStackSection = () => {
  return (
    <section id="tech" className="py-20 px-4">
      <div className="container max-w-5xl mx-auto">
        <SketchReveal variant="pencil">
          <h2 className="text-4xl md:text-5xl font-hand font-bold text-center mb-4">🧰 Tech Stack</h2>
          <p className="text-center font-sketch text-muted-foreground mb-12 text-lg">~ index cards from my digital desk ~</p>
        </SketchReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {techStack.map((tech, i) => (
            <SketchReveal key={tech.name} variant="sticky" delay={i * 0.1}>
              <div
                className={`${tech.color} p-6 tape-effect hover:scale-105 transition-transform`}
                style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1.5}deg)` }}
              >
                <div className="text-4xl mb-3">{tech.emoji}</div>
                <h3 className="font-hand text-2xl font-bold text-foreground mb-2">{tech.name}</h3>
                <p className="font-sketch text-sm text-pencil leading-relaxed">{tech.description}</p>
              </div>
            </SketchReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
