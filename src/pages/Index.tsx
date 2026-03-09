import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import TechStackSection from "@/components/TechStackSection";
import AboutSection from "@/components/AboutSection";
import NotepadNav from "@/components/NotepadNav";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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

  return (
    <main className="min-h-screen">
      <NotepadNav />
      <HeroSection />
      <SkillsSection />
      <TechStackSection />
      <AboutSection />

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-border">
        <p className="font-hand text-lg text-muted-foreground">
          ✏️ Crafted by Rinzan — 2025
        </p>
      </footer>
    </main>
  );
};

export default Index;
