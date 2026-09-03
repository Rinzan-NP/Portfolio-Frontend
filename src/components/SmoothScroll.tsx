import React, { useEffect } from "react";
import Lenis from "lenis";

// Global reference so any component or nav link can call window.lenis.scrollTo(...)
declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // 1. Enforce manual scroll restoration so browsers don't jump down on page reload
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // 2. Always start fresh at the top on page load/reload to view Hero animation
    window.scrollTo(0, 0);

    // If there is a hash in the URL on fresh reload, strip it so it doesn't cause auto-scroll
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.lenis = lenis;

    // Immediately snap to top in lenis engine as well
    lenis.scrollTo(0, { immediate: true });

    let animId: number;
    function raf(time: number) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }

    animId = requestAnimationFrame(raf);

    // Global anchor click interceptor for silky smooth scrolling to hashes
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (href && href.startsWith("/#")) {
        const id = href.replace("/#", "");
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element, { offset: -90, duration: 1.2 });
        }
      } else if (href && href.startsWith("#") && href.length > 1) {
        const id = href.slice(1);
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element, { offset: -90, duration: 1.2 });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(animId);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
