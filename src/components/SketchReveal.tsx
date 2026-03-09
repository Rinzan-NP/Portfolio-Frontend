import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

const sketchIn: Variants = {
  hidden: { opacity: 0, y: 40, rotate: -2, scale: 0.96 },
  visible: { opacity: 1, y: 0, rotate: 0, scale: 1 },
};

const stickyDrop: Variants = {
  hidden: { opacity: 0, y: -30, rotate: -6, scale: 0.9 },
  visible: { opacity: 1, y: 0, rotate: -1, scale: 1 },
};

const pencilDraw: Variants = {
  hidden: { opacity: 0, x: -30, scaleX: 0.8 },
  visible: { opacity: 1, x: 0, scaleX: 1 },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: { opacity: 1, scale: 1 },
};

export type AnimationVariant = "sketch" | "sticky" | "pencil" | "pop";

const variantMap: Record<AnimationVariant, Variants> = {
  sketch: sketchIn,
  sticky: stickyDrop,
  pencil: pencilDraw,
  pop: popIn,
};

interface SketchRevealProps {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  className?: string;
  once?: boolean;
}

const SketchReveal = ({
  children,
  variant = "sketch",
  delay = 0,
  className = "",
  once = true,
}: SketchRevealProps) => {
  return (
    <motion.div
      variants={variantMap[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SketchReveal;
