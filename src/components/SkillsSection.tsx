import SketchReveal from "./SketchReveal";

const skills = [
    { name: "AI & LLM (RAG, Agentic, LangChain)", level: "95%" },
    { name: "Backend (FastAPI, Django, Python)", level: "90%" },
    { name: "Fullstack (Next.js, React, Node)", level: "85%" },
    { name: "Databases (PostgreSQL, Vector DBs)", level: "88%" },
    { name: "DevOps (Docker, AWS, Linux)", level: "80%" },
];

const SkillsSection = () => {
    return (
        <section id="skills" className="py-20 px-4 paper-texture">
            <div className="container max-w-4xl mx-auto">
                <SketchReveal variant="pencil">
                    <h2 className="text-4xl md:text-5xl font-hand font-bold text-center mb-4">🎨 Core Expertise</h2>
                    <p className="text-center font-sketch text-muted-foreground mb-16 text-lg">~ what I bring to the table ~</p>
                </SketchReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-8">
                    {skills.map((skill, i) => (
                        <SketchReveal key={skill.name} variant="pencil" delay={i * 0.1}>
                            <div className="space-y-2 group p-2.5 rounded-lg hover:bg-card/60 transition-all hover:-translate-y-0.5 cursor-pointer select-none">
                                <div className="flex justify-between font-hand text-xl group-hover:text-primary transition-colors">
                                    <span>{skill.name}</span>
                                    <span className="text-sm font-sketch text-primary font-semibold group-hover:scale-110 transition-transform">{skill.level}</span>
                                </div>
                                <div className="h-4 sketch-border relative overflow-hidden bg-card/50 group-hover:shadow-md transition-shadow">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-primary/25 group-hover:bg-primary/35 transition-colors"
                                        style={{
                                            width: skill.level,
                                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.05) 5px, rgba(0,0,0,0.05) 10px)'
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-around opacity-10 pointer-events-none">
                                        {[...Array(10)].map((_, i) => <div key={i} className="w-px h-full bg-foreground" />)}
                                    </div>
                                </div>
                            </div>
                        </SketchReveal>
                    ))}
                </div>

                <SketchReveal variant="sketch" delay={0.6}>
                    <div className="text-center mt-12 font-hand text-muted-foreground text-lg italic">
                        * building robust, intelligence-driven applications *
                    </div>
                </SketchReveal>
            </div>
        </section>
    );
};

export default SkillsSection;
