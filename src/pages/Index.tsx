import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import TechStackSection from "@/components/TechStackSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import NotepadNav from "@/components/NotepadNav";
import FloatingChat from "@/components/FloatingChat";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const sectionMap: Record<string, string> = {
  about: "about",
  experience: "experience",
  education: "education",
  skills: "skills",
  projects: "projects",
  services: "services",
  tech: "tech",
  contact: "contact",
};

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash]);

  useEffect(() => {
    const handler = (e: Event) => {
      const section = (e as CustomEvent<{ section: string }>).detail.section;
      const id = sectionMap[section];
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Flash highlight
      el.classList.add("ring-4", "ring-primary", "ring-offset-4");
      setTimeout(() => el.classList.remove("ring-4", "ring-primary", "ring-offset-4"), 1200);
    };
    window.addEventListener("rinzan:highlight-section", handler);
    return () => window.removeEventListener("rinzan:highlight-section", handler);
  }, []);

  return (
    <main className="min-h-screen">
      <NotepadNav />
      <HeroSection />
      <SkillsSection />
      <TechStackSection />
      <ServicesSection />
      <ProjectsSection />
      <AboutSection />
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
