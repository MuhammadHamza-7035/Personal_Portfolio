import { useEffect, useRef } from "react";

const CELL = 80; // grid spacing in px (bigger = lines further apart)
const RADIUS = 240; // glow radius in px
const RED = "255, 31, 61"; // accent as r, g, b

const gridImage = (color: string, width: number) =>
  `linear-gradient(to right, ${color} ${width}px, transparent ${width}px),
   linear-gradient(to bottom, ${color} ${width}px, transparent ${width}px)`;

const cursorMask = `radial-gradient(circle ${RADIUS}px at var(--mx) var(--my), #000 0%, transparent 100%)`;

export default function GridBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = reduce ? 1 : 0.14;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let raf = 0;

    const tick = () => {
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      tx = e.clientX;
      ty = e.clientY;
      el.style.setProperty("--glow", "1");
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => el.style.setProperty("--glow", "0");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const size = `${CELL}px ${CELL}px`;
  const fade = "radial-gradient(ellipse 80% 70% at 50% 35%, #000 25%, transparent 100%)";

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={
        {
          "--mx": "50vw",
          "--my": "40vh",
          "--glow": "0",
        } as React.CSSProperties
      }
    >
      {/* Static base grid, faded toward the edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: gridImage("rgba(rgba(255,255,255,0.09)", 1),
          backgroundSize: size,
          WebkitMaskImage: fade,
          maskImage: fade,
        }}
      />

      {/* Cursor glow */}
      <div
        className="absolute inset-0"
        style={{
          opacity: "var(--glow)",
          transition: "opacity 450ms cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        {/* soft ambient light under the cursor */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle ${RADIUS}px at var(--mx) var(--my), rgba(${RED}, 0.07), transparent 100%)`,
          }}
        />
        {/* blurred wide lines = the glow */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: gridImage(`rgba(${RED}, 0.55)`, 2),
            backgroundSize: size,
            filter: "blur(3px)",
            WebkitMaskImage: cursorMask,
            maskImage: cursorMask,
          }}
        />
        {/* crisp red lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: gridImage(`rgba(${RED}, 0.85)`, 1),
            backgroundSize: size,
            WebkitMaskImage: cursorMask,
            maskImage: cursorMask,
          }}
        />
      </div>
    </div>
  );
}