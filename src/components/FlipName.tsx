import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";


type Props = {
  front: string[]; // e.g. ["Muhammad", "Hamza"]
  back: string[]; // e.g. ["AI / ML", "Engineer"]
  className?: string;
};

const EASE = [0.77, 0, 0.175, 1] as const;
const DURATION = 0.55;
const STAGGER = 0.07;

export default function FlipName({ front, back, className = "" }: Props) {
  const [flipped, setFlipped] = useState(false);
  const reduce = useReducedMotion();
  const pointerType = useRef<string>("mouse");

  const count = Math.max(front.length, back.length);
  useEffect(() => {
  if (!flipped || pointerType.current === "mouse") return;
  const t = setTimeout(() => setFlipped(false), 2500);
  return () => clearTimeout(t);
}, [flipped]);
  

  return (
    <span
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}
      onPointerEnter={(e) => {
        pointerType.current = e.pointerType;
        if (e.pointerType === "mouse") setFlipped(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setFlipped(false);
      }}
      onPointerDown={(e) => {
        pointerType.current = e.pointerType;
      }}
      onClick={() => {
        // touch devices have no hover, so tap toggles
        if (pointerType.current !== "mouse") setFlipped((f) => !f);
      }}
      style={{ cursor: "default" }}
    >
      {/* Screen readers get the real name once */}
      <span className="sr-only">{front.join(" ")}</span>

      {Array.from({ length: count }).map((_, i) => {
        const delay = i * STAGGER;
        const transition = {
          duration: reduce ? 0.2 : DURATION,
          ease: EASE,
          delay: reduce ? 0 : delay,
        };

        return (
          <span
            key={i}
            aria-hidden="true"
            className="inline-grid"
            style={{ perspective: 900 }}
          >
            {/* Front face: the name */}
            <motion.span
              className="col-start-1 row-start-1 origin-center"
              initial={false}
              animate={
                flipped
                  ? { rotateX: reduce ? 0 : -90, opacity: 0 }
                  : { rotateX: 0, opacity: 1 }
              }
              transition={transition}
            >
              {front[i] ?? "\u00A0"}
            </motion.span>

            {/* Back face: the role, in red */}
            <motion.span
              className="col-start-1 row-start-1 origin-center text-[#ff1f3d]"
              style={{ textShadow: "0 0 32px rgba(255,31,61,0.45)" }}
              initial={false}
              animate={
                flipped
                  ? { rotateX: 0, opacity: 1 }
                  : { rotateX: reduce ? 0 : 90, opacity: 0 }
              }
              transition={transition}
            >
              {back[i] ?? "\u00A0"}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}