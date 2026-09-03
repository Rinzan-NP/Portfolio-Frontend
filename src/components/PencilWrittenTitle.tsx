import React, { useEffect, useRef, useState, useCallback } from "react";
import { useChat } from "@/store/ChatContext";

interface StrokeDef {
  id: string;
  char: string;
  d: string;
  len: number;
  startX: number;
  startY: number;
  strokeWidth?: number;
  duration?: number;
}

// 1. Initial strokes: 'R', 'i', 'n', 'z'
const INITIAL_STROKES: StrokeDef[] = [
  // --- 'R' ---
  { id: "R_stem", char: "R", d: "M 22 14 C 20 28 17 44 15 60", len: 48, startX: 22, startY: 14, strokeWidth: 5.6, duration: 190 },
  { id: "R_loop", char: "R", d: "M 21 15 C 27 10 42 10 44 24 C 45 36 30 37 20 37 C 28 41 37 49 42 60 C 43 62 45 61 48 58", len: 125, startX: 21, startY: 15, strokeWidth: 5.6, duration: 300 },

  // --- 'i' ---
  { id: "i_stem", char: "i", d: "M 60 30 C 59 39 60 50 62 58 C 63 60 65 59 68 56", len: 34, startX: 60, startY: 30, strokeWidth: 5.6, duration: 140 },
  { id: "i_dot", char: "i", d: "M 59.5 18 C 60 18.5 60.5 18.5 60.5 19", len: 4, startX: 59.5, startY: 18, strokeWidth: 6.2, duration: 70 },

  // --- 'n' ---
  { id: "n1_stem", char: "n", d: "M 78 31 C 77 39 75 49 74 59", len: 30, startX: 78, startY: 31, strokeWidth: 5.6, duration: 140 },
  { id: "n1_arch", char: "n", d: "M 76 40 C 80 30 89 29 93 35 C 95 40 94 49 95 57 C 96 60 98 59 101 56", len: 56, startX: 76, startY: 40, strokeWidth: 5.6, duration: 220 },

  // --- 'z' ---
  { id: "z_body", char: "z", d: "M 112 32 C 119 30 127 30 131 31 C 127 39 119 49 113 58 C 121 59 129 57 135 53", len: 76, startX: 112, startY: 32, strokeWidth: 5.6, duration: 260 },
];

// 2. The Mistake: Uppercase 'A' (written right after 'z')
const MISTAKE_STROKES: StrokeDef[] = [
  { id: "bad_A_left", char: "A", d: "M 143 58 C 146 43 150 27 153 14", len: 48, startX: 143, startY: 58, strokeWidth: 5.6, duration: 180 },
  { id: "bad_A_right", char: "A", d: "M 153 14 C 156 28 160 44 163 58", len: 48, startX: 153, startY: 14, strokeWidth: 5.6, duration: 180 },
  { id: "bad_A_bar", char: "A", d: "M 146 38 C 151 37 156 37 161 38", len: 18, startX: 146, startY: 38, strokeWidth: 5.2, duration: 120 },
];

// 3. Final strokes after erase: correct lowercase 'a', 'n', 'N', 'P'
const REMAINING_STROKES: StrokeDef[] = [
  // --- correct 'a' ---
  { id: "a_oval", char: "a", d: "M 153 34 C 146 30 138 35 138 45 C 138 54 146 59 152 56 C 154 52 154 40 153 34", len: 52, startX: 153, startY: 34, strokeWidth: 5.6, duration: 240 },
  { id: "a_stem", char: "a", d: "M 153 33 C 153 42 153 51 155 57 C 156 60 160 59 163 55", len: 30, startX: 153, startY: 33, strokeWidth: 5.6, duration: 130 },

  // --- 'n' ---
  { id: "n2_stem", char: "n", d: "M 174 31 C 173 39 171 49 170 59", len: 30, startX: 174, startY: 31, strokeWidth: 5.6, duration: 140 },
  { id: "n2_arch", char: "n", d: "M 172 40 C 176 30 185 29 189 35 C 191 40 190 49 191 57 C 192 60 195 59 198 56", len: 56, startX: 172, startY: 40, strokeWidth: 5.6, duration: 220 },

  // --- 'N' ---
  { id: "N_stem1", char: "N", d: "M 228 14 C 226 28 223 44 221 60", len: 48, startX: 228, startY: 14, strokeWidth: 5.6, duration: 180 },
  { id: "N_diag", char: "N", d: "M 227 15 C 234 29 247 47 255 60", len: 60, startX: 227, startY: 15, strokeWidth: 5.6, duration: 210 },
  { id: "N_stem2", char: "N", d: "M 256 60 C 257 45 259 29 261 14", len: 48, startX: 256, startY: 60, strokeWidth: 5.6, duration: 180 },

  // --- 'P' ---
  { id: "P_stem", char: "P", d: "M 288 14 C 286 28 284 44 282 60", len: 48, startX: 288, startY: 14, strokeWidth: 5.6, duration: 180 },
  { id: "P_bowl", char: "P", d: "M 288 15 C 296 10 312 10 313 24 C 314 36 299 37 285 37", len: 78, startX: 288, startY: 15, strokeWidth: 5.6, duration: 240 },
];

const ALL_CORRECT_STROKES = [...INITIAL_STROKES, ...REMAINING_STROKES];

interface PencilWrittenTitleProps {
  className?: string;
  delay?: number;
  onWritingComplete?: () => void;
}

export const PencilWrittenTitle: React.FC<PencilWrittenTitleProps> = ({
  className = "",
  delay = 0.2,
  onWritingComplete,
}) => {
  const { startAiAgent } = useChat();

  const initPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const mistakePathRefs = useRef<(SVGPathElement | null)[]>([]);
  const remainingPathRefs = useRef<(SVGPathElement | null)[]>([]);

  // State-driven progress for reliable rendering without React reset glitch
  const [offsets, setOffsets] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    ALL_CORRECT_STROKES.forEach((s) => (initial[s.id] = s.len));
    MISTAKE_STROKES.forEach((s) => (initial[s.id] = s.len));
    return initial;
  });

  // Track which strokes are visible so un-drawn strokes have opacity: 0 (no stray round caps!)
  const [visibleStrokes, setVisibleStrokes] = useState<Set<string>>(new Set());

  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [mistakeOpacity, setMistakeOpacity] = useState<number>(0);
  const [shavings, setShavings] = useState<Array<{ x: number; y: number; opacity: number }>>([]);

  const [pencil, setPencil] = useState<{
    x: number;
    y: number;
    rotate: number;
    opacity: number;
    scale: number;
    isDrawing: boolean;
    isEraserEnd: boolean;
  }>({
    x: 22,
    y: 14,
    rotate: 42,
    opacity: 0,
    scale: 1,
    isDrawing: false,
    isEraserEnd: false,
  });

  const isAnimatingRef = useRef<boolean>(false);
  const hasStartedRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const watchdogTimerRef = useRef<NodeJS.Timeout | null>(null);

  const forceComplete = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
    isAnimatingRef.current = false;
    setIsCompleted(true);
    setMistakeOpacity(0);
    setShavings([]);

    const fullOffsets: Record<string, number> = {};
    ALL_CORRECT_STROKES.forEach((s) => (fullOffsets[s.id] = 0));
    setOffsets(fullOffsets);
    setVisibleStrokes(new Set(ALL_CORRECT_STROKES.map((s) => s.id)));

    setPencil((prev) => ({
      ...prev,
      opacity: 0,
      isDrawing: false,
      isEraserEnd: false,
    }));

    startAiAgent();
    if (onWritingComplete) onWritingComplete();
  }, [startAiAgent, onWritingComplete]);

  const runFullSequence = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    // Reset state
    setIsCompleted(false);
    setMistakeOpacity(0);
    setShavings([]);
    setVisibleStrokes(new Set());

    // Reset all offsets to their full length (hidden)
    const resetOffsets: Record<string, number> = {};
    ALL_CORRECT_STROKES.forEach((s) => (resetOffsets[s.id] = s.len));
    MISTAKE_STROKES.forEach((s) => (resetOffsets[s.id] = s.len));
    setOffsets(resetOffsets);

    // Watchdog fallback: safety ceiling so it never cuts off normal drawing
    if (watchdogTimerRef.current) clearTimeout(watchdogTimerRef.current);
    watchdogTimerRef.current = setTimeout(() => {
      if (isAnimatingRef.current) {
        forceComplete();
      }
    }, 25000);

    const firstPath = initPathRefs.current[0];
    const startPt = firstPath ? firstPath.getPointAtLength(0) : { x: 22, y: 14 };

    // 1. Entrance animation
    const entranceDuration = 320;
    const entranceStart = performance.now();

    const animateEntrance = (now: number) => {
      const elapsed = now - entranceStart;
      const t = Math.min(1, elapsed / entranceDuration);
      const ease = 1 - Math.pow(1 - t, 3);

      setPencil({
        x: startPt.x + 30 * (1 - ease),
        y: startPt.y - 45 * (1 - ease),
        rotate: 26 + 16 * ease,
        opacity: ease,
        scale: 1,
        isDrawing: false,
        isEraserEnd: false,
      });

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animateEntrance);
      } else {
        setTimeout(() => {
          drawInitialStrokes(0);
        }, 50);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateEntrance);

    // Generic stroke runner
    const drawStrokeList = (
      index: number,
      defs: StrokeDef[],
      refs: React.MutableRefObject<(SVGPathElement | null)[]>,
      onAllComplete: () => void
    ) => {
      if (index >= defs.length) {
        onAllComplete();
        return;
      }

      const strokeDef = defs[index];
      const pathEl = refs.current[index];
      const totalLen = strokeDef.len;
      const duration = strokeDef.duration || 130;
      const startTime = performance.now();

      // Make this stroke visible immediately upon starting
      setVisibleStrokes((prev) => new Set([...prev, strokeDef.id]));

      const animatePath = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);

        const currentDist = progress * (pathEl ? pathEl.getTotalLength() : totalLen);
        const pt = pathEl
          ? pathEl.getPointAtLength(currentDist)
          : {
              x: strokeDef.startX,
              y: strokeDef.startY,
            };
        const curOffset = totalLen * (1 - progress);

        setOffsets((prev) => ({ ...prev, [strokeDef.id]: curOffset }));

        setPencil({
          x: pt.x,
          y: pt.y,
          rotate: 42 + Math.sin(progress * Math.PI * 2) * 2.5,
          opacity: 1,
          scale: 1,
          isDrawing: true,
          isEraserEnd: false,
        });

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animatePath);
        } else {
          setOffsets((prev) => ({ ...prev, [strokeDef.id]: 0 }));

          if (index + 1 < defs.length) {
            const nextDef = defs[index + 1];
            const nextPath = refs.current[index + 1];
            const nextStart = nextPath
              ? nextPath.getPointAtLength(0)
              : { x: nextDef.startX, y: nextDef.startY };

            liftAndTravel(pt as DOMPoint, nextStart as DOMPoint, () => {
              drawStrokeList(index + 1, defs, refs, onAllComplete);
            });
          } else {
            drawStrokeList(index + 1, defs, refs, onAllComplete);
          }
        }
      };

      animFrameRef.current = requestAnimationFrame(animatePath);
    };

    // 2. Draw 'R', 'i', 'n', 'z'
    const drawInitialStrokes = (idx: number) => {
      drawStrokeList(idx, INITIAL_STROKES, initPathRefs, () => {
        // Fly over directly to start drawing mistake: uppercase 'A' right next to 'z'
        const lastInit = initPathRefs.current[INITIAL_STROKES.length - 1];
        const lastPt = lastInit ? lastInit.getPointAtLength(lastInit.getTotalLength()) : { x: 135, y: 53 };
        const firstMistake = mistakePathRefs.current[0];
        const mistakeStart = firstMistake
          ? firstMistake.getPointAtLength(0)
          : { x: MISTAKE_STROKES[0].startX, y: MISTAKE_STROKES[0].startY };

        // Make mistake 'A' active
        setMistakeOpacity(1);

        liftAndTravel(lastPt as DOMPoint, mistakeStart as DOMPoint, () => {
          drawMistakeStrokes();
        });
      });
    };

    // 3. Draw Mistake: capital 'A'
    const drawMistakeStrokes = () => {
      drawStrokeList(0, MISTAKE_STROKES, mistakePathRefs, () => {
        // Pause in realization ("Wait, I wrote capital A instead of small a!")
        setTimeout(() => {
          performEraserSequence();
        }, 280);
      });
    };

    // 4. Flip to pink rubber eraser, scrub 'A' away with shavings
    const performEraserSequence = () => {
      const eraseCenterX = 153;
      const eraseCenterY = 36;
      const eraseStart = performance.now();
      const eraseDuration = 800;

      const animateScrub = (now: number) => {
        const elapsed = now - eraseStart;
        const progress = Math.min(1, elapsed / eraseDuration);

        // Back-and-forth scrubbing trajectory across 'A'
        const scrubX = eraseCenterX + Math.sin(progress * Math.PI * 6) * 12;
        const scrubY = eraseCenterY + Math.cos(progress * Math.PI * 6) * 3.5;
        const scrubRot = 215 + Math.sin(progress * Math.PI * 6) * 12;

        setPencil({
          x: scrubX,
          y: scrubY,
          rotate: scrubRot,
          opacity: 1,
          scale: 1,
          isDrawing: false,
          isEraserEnd: true,
        });

        // 'A' progressively fades away as eraser scrubs it
        setMistakeOpacity(Math.max(0, 1 - progress * 1.3));

        // Scattering eraser shavings
        if (Math.random() < 0.38) {
          setShavings((prev) => [
            ...prev.slice(-10),
            {
              x: scrubX + (Math.random() - 0.5) * 14,
              y: scrubY + Math.random() * 9,
              opacity: 0.85,
            },
          ]);
        }

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animateScrub);
        } else {
          setMistakeOpacity(0);

          // Fade out shavings
          setTimeout(() => setShavings([]), 220);

          // Flip pencil back to lead tip and start writing correct lowercase 'a'
          const firstRem = remainingPathRefs.current[0];
          const remStart = firstRem
            ? firstRem.getPointAtLength(0)
            : { x: REMAINING_STROKES[0].startX, y: REMAINING_STROKES[0].startY };

          flipToLeadAndContinue(remStart as DOMPoint);
        }
      };

      animFrameRef.current = requestAnimationFrame(animateScrub);
    };

    // 5. Flip back to lead tip
    const flipToLeadAndContinue = (destPt: DOMPoint) => {
      const flipStart = performance.now();
      const flipDuration = 260;

      const animateFlip = (now: number) => {
        const elapsed = now - flipStart;
        const t = Math.min(1, elapsed / flipDuration);
        const ease = 0.5 - Math.cos(t * Math.PI) / 2;

        setPencil({
          x: 153 + (destPt.x - 153) * ease,
          y: 36 + (destPt.y - 36) * ease - Math.sin(t * Math.PI) * 14,
          rotate: 215 - (215 - 42) * ease,
          opacity: 1,
          scale: 1,
          isDrawing: false,
          isEraserEnd: ease < 0.5,
        });

        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(animateFlip);
        } else {
          // Draw remaining letters: 'a', 'n', 'N', 'P'
          drawRemainingStrokes(0);
        }
      };

      animFrameRef.current = requestAnimationFrame(animateFlip);
    };

    // 6. Draw remaining correct letters
    const drawRemainingStrokes = (idx: number) => {
      drawStrokeList(idx, REMAINING_STROKES, remainingPathRefs, () => {
        finishAndExit();
      });
    };

    // 7. Travel in air between strokes
    const liftAndTravel = (
      fromPt: DOMPoint,
      toPt: DOMPoint,
      onComplete: () => void
    ) => {
      const travelDist = Math.hypot(toPt.x - fromPt.x, toPt.y - fromPt.y);
      const travelDuration = Math.min(180, Math.max(85, travelDist * 2.8));
      const travelStart = performance.now();

      const animateTravel = (now: number) => {
        const elapsed = now - travelStart;
        const t = Math.min(1, elapsed / travelDuration);
        const ease = 0.5 - Math.cos(t * Math.PI) / 2;

        const curX = fromPt.x + (toPt.x - fromPt.x) * ease;
        const arcHeight = Math.min(14, 4 + travelDist * 0.15);
        const curY = fromPt.y + (toPt.y - fromPt.y) * ease - Math.sin(t * Math.PI) * arcHeight;
        const curRot = 42 - Math.sin(t * Math.PI) * 7;

        setPencil({
          x: curX,
          y: curY,
          rotate: curRot,
          opacity: 1,
          scale: 1 + Math.sin(t * Math.PI) * 0.06,
          isDrawing: false,
          isEraserEnd: false,
        });

        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(animateTravel);
        } else {
          onComplete();
        }
      };

      animFrameRef.current = requestAnimationFrame(animateTravel);
    };

    // 8. Clean Exit & Activate AI Agent
    const finishAndExit = () => {
      const lastPath = remainingPathRefs.current[REMAINING_STROKES.length - 1];
      const endPt = lastPath
        ? lastPath.getPointAtLength(lastPath.getTotalLength())
        : { x: REMAINING_STROKES[REMAINING_STROKES.length - 1].startX, y: 37 };

      const exitStart = performance.now();
      const exitDuration = 360;

      const animateExit = (now: number) => {
        const elapsed = now - exitStart;
        const t = Math.min(1, elapsed / exitDuration);
        const ease = 1 - Math.pow(1 - t, 2);

        const curX = endPt.x + 20 * ease;
        const curY = endPt.y - 32 * ease;
        const curRot = 42 - 15 * ease;
        const curOpacity = 1 - ease;

        setPencil({
          x: curX,
          y: curY,
          rotate: curRot,
          opacity: curOpacity,
          scale: 1 - 0.15 * ease,
          isDrawing: false,
          isEraserEnd: false,
        });

        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(animateExit);
        } else {
          setPencil({
            x: endPt.x + 20,
            y: endPt.y - 32,
            rotate: 27,
            opacity: 0,
            scale: 0.85,
            isDrawing: false,
            isEraserEnd: false,
          });
          setIsCompleted(true);
          isAnimatingRef.current = false;

          // Writing complete -> Start AI Agent & trigger callbacks
          startAiAgent();
          if (onWritingComplete) onWritingComplete();
        }
      };

      animFrameRef.current = requestAnimationFrame(animateExit);
    };
  }, [startAiAgent, onWritingComplete]);

  // Initial trigger exactly once
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const timer = setTimeout(() => {
      runFullSequence();
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [delay, runFullSequence]);

  const handleReplay = () => {
    if (!isAnimatingRef.current) {
      runFullSequence();
    }
  };

  return (
    <div
      className={`relative inline-block select-none cursor-pointer group w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] ${className}`}
      onClick={handleReplay}
      title="Click to write again ✏️"
    >
      <svg
        viewBox="0 0 320 72"
        className="w-full h-auto overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pencilLeadGrad" x1="14" y1="62" x2="14" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#404040" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
          <linearGradient id="pencilWoodGrad" x1="9" y1="48" x2="19" y2="62" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#fde047" />
          </linearGradient>
          <linearGradient id="pencilMetalGrad" x1="8" y1="8" x2="20" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {/* 1. Initial Letter Strokes ('R', 'i', 'n', 'z') */}
        <g className="text-foreground" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          {INITIAL_STROKES.map((stroke, i) => {
            const isVisible = isCompleted || visibleStrokes.has(stroke.id);
            const offset = isCompleted ? 0 : offsets[stroke.id] ?? stroke.len;
            return (
              <path
                key={stroke.id}
                ref={(el) => (initPathRefs.current[i] = el)}
                d={stroke.d}
                strokeWidth={stroke.strokeWidth || 5}
                fill="none"
                style={{
                  opacity: isVisible ? 1 : 0,
                  strokeDasharray: stroke.len,
                  strokeDashoffset: isCompleted ? 0 : offset,
                }}
              />
            );
          })}
        </g>

        {/* 2. The Mistake: Uppercase 'A' (always mounted, controlled by mistakeOpacity & visibleStrokes) */}
        <g
          className="text-foreground"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: mistakeOpacity, pointerEvents: "none" }}
        >
          {MISTAKE_STROKES.map((stroke, i) => {
            const isVisible = visibleStrokes.has(stroke.id);
            const offset = offsets[stroke.id] ?? stroke.len;
            return (
              <path
                key={stroke.id}
                ref={(el) => (mistakePathRefs.current[i] = el)}
                d={stroke.d}
                strokeWidth={stroke.strokeWidth || 5}
                fill="none"
                style={{
                  opacity: isVisible ? 1 : 0,
                  strokeDasharray: stroke.len,
                  strokeDashoffset: offset,
                }}
              />
            );
          })}
        </g>

        {/* 3. Correct Remaining Letter Strokes ('a', 'n', 'N', 'P') */}
        <g className="text-foreground" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          {REMAINING_STROKES.map((stroke, i) => {
            const isVisible = isCompleted || visibleStrokes.has(stroke.id);
            const offset = isCompleted ? 0 : offsets[stroke.id] ?? stroke.len;
            return (
              <path
                key={stroke.id}
                ref={(el) => (remainingPathRefs.current[i] = el)}
                d={stroke.d}
                strokeWidth={stroke.strokeWidth || 5}
                fill="none"
                style={{
                  opacity: isVisible ? 1 : 0,
                  strokeDasharray: stroke.len,
                  strokeDashoffset: isCompleted ? 0 : offset,
                }}
              />
            );
          })}
        </g>

        {/* Eraser Shavings / Crumbs */}
        {shavings.map((s, idx) => (
          <circle
            key={idx}
            cx={s.x}
            cy={s.y}
            r={0.9 + Math.random() * 0.8}
            fill="#64748b"
            opacity={s.opacity}
          />
        ))}

        {/* The Animated Wooden Pencil */}
        {pencil.opacity > 0 && !isCompleted && (
          <g
            style={{
              transform: `translate(${pencil.x}px, ${pencil.y}px) rotate(${pencil.rotate}deg) scale(${pencil.scale * 0.56})`,
              transformOrigin: "0px 0px",
              opacity: pencil.opacity,
              pointerEvents: "none",
            }}
          >
            {/* If erasing, anchor is the pink rubber eraser (14, 4); if drawing, anchor is graphite lead (14, 69) */}
            <g transform={pencil.isEraserEnd ? "translate(-14, -4)" : "translate(-14, -69)"}>
              {/* Rubber Eraser */}
              <path
                d="M 9 10 C 9 4, 19 4, 19 10 Z"
                fill="#f472b6"
                stroke="#1f2937"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              {/* Metal Ferrule with crimp ribs */}
              <rect
                x="8.5"
                y="10"
                width="11"
                height="7"
                rx="0.5"
                fill="url(#pencilMetalGrad)"
                stroke="#1f2937"
                strokeWidth="1.2"
              />
              <line x1="8.5" y1="12.5" x2="19.5" y2="12.5" stroke="#64748b" strokeWidth="0.8" />
              <line x1="8.5" y1="14.5" x2="19.5" y2="14.5" stroke="#475569" strokeWidth="0.8" />

              {/* Hexagonal Pencil Barrel (3 facets) */}
              <rect x="8.5" y="17" width="3.5" height="32" fill="#d97706" />
              <rect x="12" y="17" width="4" height="32" fill="#fbbf24" />
              <rect x="16" y="17" width="3.5" height="32" fill="#f59e0b" />

              <rect
                x="8.5"
                y="17"
                width="11"
                height="32"
                fill="none"
                stroke="#1f2937"
                strokeWidth="1.2"
              />
              <line x1="12" y1="17" x2="12" y2="49" stroke="#b45309" strokeWidth="0.7" />
              <line x1="16" y1="17" x2="16" y2="49" stroke="#b45309" strokeWidth="0.7" />

              {/* Sharpened Wood Section */}
              <path
                d="M 8.5 49 C 10.5 51, 12 51, 14 49 C 16 51, 17.5 51, 19.5 49 L 16.5 63 L 11.5 63 Z"
                fill="url(#pencilWoodGrad)"
                stroke="#1f2937"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              {/* Sharp Lead Tip — contact point at (14, 69) */}
              <polygon
                points="14,69 11.5,63 16.5,63"
                fill="url(#pencilLeadGrad)"
                stroke="#1f2937"
                strokeWidth="1"
                strokeLinejoin="round"
              />

              {/* Tiny graphite contact point while drawing */}
              {pencil.isDrawing && (
                <circle cx="14" cy="69" r="1.2" fill="currentColor" opacity="0.6" />
              )}
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default PencilWrittenTitle;
