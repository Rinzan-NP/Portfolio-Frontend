import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TechStackSection from "@/components/TechStackSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import NotepadNav from "@/components/NotepadNav";
import FloatingChat from "@/components/FloatingChat";
import PencilPointerGuide from "@/components/PencilPointerGuide";

import { useEffect } from "react";

const sectionMap: Record<string, string> = {
  about: "about",
  skills: "skills",
  tech: "skills",
  projects: "projects",
  experience: "experience",
  contact: "contact",
};

const Index = () => {
  // Listen for AI assistant deep-link highlight events
  useEffect(() => {
    const handler = (e: Event) => {
      const section = (e as CustomEvent<{ section: string }>).detail.section;
      const id = sectionMap[section];
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      if (window.lenis) {
        window.lenis.scrollTo(el, { offset: -85, duration: 1.25 });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      // Flash highlight
      el.classList.add("ring-4", "ring-primary", "ring-offset-4");
      setTimeout(() => el.classList.remove("ring-4", "ring-primary", "ring-offset-4"), 1200);
    };
    window.addEventListener("rinzan:highlight-section", handler);
    return () => window.removeEventListener("rinzan:highlight-section", handler);
  }, []);

  return (
    <main className="min-h-screen relative">
      <NotepadNav />
      <PencilPointerGuide />
      <HeroSection />
      <AboutSection />
      <TechStackSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-border">
        <p className="font-hand text-lg text-muted-foreground">
          ✏️ Crafted by Rinzan — 2025
        </p>
      </footer>

      <FloatingChat />
    </main>
  );
};

export default Index;
