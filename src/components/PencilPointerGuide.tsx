import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PointerState {
  section: string;
  label: string;
  top: number;
  left: number;
}

const SECTION_LABELS: Record<string, string> = {
  about: "About Me",
  skills: "Skills & Tech Stack",
  tech: "Skills & Tech Stack",
  projects: "Featured Projects",
  experience: "Work Experience",
  contact: "Get in Touch",
};

export const PencilPointerGuide: React.FC = () => {
  const [pointer, setPointer] = useState<PointerState | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleHighlight = (e: Event) => {
      const section = (e as CustomEvent<{ section: string }>).detail.section;
      const targetId = section === "tech" ? "skills" : section;
      const element = document.getElementById(targetId);
      if (!element) return;

      // Calculate position relative to document
      const rect = element.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

      // Position right on top of the section header
      const top = Math.max(80, rect.top + scrollTop - 30);
      const left = Math.min(window.innerWidth - 260, Math.max(20, rect.left + scrollLeft + (rect.width / 2) - 100));

      setPointer({
        section: targetId,
        label: SECTION_LABELS[targetId] || targetId,
        top,
        left,
      });

      // Clear previous timeout and hide after 4s
      clearTimeout(timer);
      timer = setTimeout(() => {
        setPointer(null);
      }, 4000);
    };

    window.addEventListener("rinzan:highlight-section", handleHighlight);
    return () => {
      window.removeEventListener("rinzan:highlight-section", handleHighlight);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {pointer && (
          <motion.div
            key={pointer.section}
            initial={{ opacity: 0, y: -25, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            style={{
              position: "absolute",
              top: pointer.top,
              left: pointer.left,
              zIndex: 9999,
              pointerEvents: "none",
            }}
            className="flex flex-col items-center select-none filter drop-shadow-xl"
          >
            {/* Sticky Handwritten Callout Banner */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="bg-sticky-yellow text-foreground px-4 py-1.5 rounded-lg sketch-border shadow-md font-hand font-bold text-lg flex items-center gap-2"
            >
              <span>✏️</span>
              <span className="text-primary font-black">Showing {pointer.label}</span>
              <span>👇</span>
            </motion.div>

            {/* Bouncing Hand-Drawn Pencil pointing downward */}
            <motion.div
              animate={{
                y: [0, 8, 0],
                rotate: [-20, -10, -20],
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="-mt-1"
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transform rotate-90"
              >
                <path
                  d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                  fill="#ffdd00"
                  stroke="#1a1c22"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 5l4 4"
                  stroke="#1a1c22"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <polygon points="2 22 5 21 3 19" fill="#1a1c22" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PencilPointerGuide;
