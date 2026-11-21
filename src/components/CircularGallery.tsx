import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export type GalleryProject = {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  repoUrl?: string;
};

const SPRING = { type: "spring", stiffness: 170, damping: 26, mass: 0.9 } as const;
const wrap = (v: number, n: number) => ((((v + n / 2) % n) + n) % n) - n / 2;
const mod = (v: number, n: number) => ((v % n) + n) % n;

type CardProps = {
  item: GalleryProject;
  i: number;
  m: number;
  cw: number;
  pos: MotionValue<number>;
  spacing: MotionValue<number>;
  onSelect: (i: number) => void;
};

function GalleryCard({ item, i, m, cw, pos, spacing, onSelect }: CardProps) {
  const [failed, setFailed] = useState(false);
  const offset = useTransform(pos, (p) => wrap(i - p, m));
  const x = useTransform([offset, spacing], ([o, s]: number[]) => o * s);
  const y = useTransform([offset, spacing], ([o, s]: number[]) => o * o * s * 0.1);
  const rotate = useTransform(offset, (o) => o * 12);
  const scale = useTransform(offset, (o) => 1 - Math.min(Math.abs(o), 2) * 0.07);
  const opacity = useTransform(offset, (o) => {
    const a = Math.abs(o);
    return a > 2.5 ? 0 : a > 1.8 ? 1 - (a - 1.8) / 0.7 : 1;
  });
  const dim = useTransform(offset, (o) => Math.min(Math.abs(o), 1) * 0.45);
  const zIndex = useTransform(offset, (o) => Math.round(100 - Math.abs(o) * 10));
  const pointerEvents = useTransform(offset, (o) => (Math.abs(o) > 2.5 ? "none" : "auto"));

  return (
    <motion.div
      role="group"
      aria-label={item.title}
      onClick={() => onSelect(i)}
      className="absolute top-5 cursor-grab select-none active:cursor-grabbing"
      style={{
        left: "50%",
        width: cw,
        marginLeft: -cw / 2,
        x,
        y,
        rotate,
        scale,
        opacity,
        zIndex,
        pointerEvents,
        willChange: "transform",
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card,1.25rem)] border border-white/10 bg-[#141416] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]">
        {item.image && !failed ? (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            draggable={false}
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,31,61,0.25),transparent_60%),#141416]">
            <span className="text-7xl font-bold text-white/20">{item.title.charAt(0)}</span>
          </div>
        )}
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: dim }} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-16">
          <p className="text-lg font-semibold leading-tight text-white">{item.title}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function CircularGallery({ items }: { items: GalleryProject[] }) {
  const n = items.length;
  // repeat items so the loop always has enough cards to look seamless
  const reps = Math.max(1, Math.ceil(6 / n));
  const slides = Array.from({ length: n * reps }, (_, k) => items[k % n]);
  const m = slides.length;

  const reduce = useReducedMotion();
  const pos = useMotionValue(0);
  const spacing = useMotionValue(300);
  const [cw, setCw] = useState(260);
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const controls = useRef<ReturnType<typeof animate> | null>(null);
  const drag = useRef({ down: false, captured: false, startX: 0, startPos: 0, moved: 0, lastX: 0, lastT: 0, v: 0 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setCw(Math.min(300, Math.max(190, Math.round(el.clientWidth * 0.26))));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    spacing.set(cw * 1.20);
  }, [cw, spacing]);

  useMotionValueEvent(pos, "change", (p) => setActive(mod(Math.round(p), m) % n));

  const goTo = (target: number) => {
    controls.current?.stop();
    controls.current = animate(pos, target, reduce ? { duration: 0 } : SPRING);
  };
  const step = (d: number) => goTo(Math.round(pos.get()) + d);

  const onSelect = (i: number) => {
    if (drag.current.moved > 6) return;
    const o = Math.round(wrap(i - pos.get(), m));
    if (o !== 0) goTo(Math.round(pos.get()) + o);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    controls.current?.stop();
    drag.current = { down: true, captured: false, startX: e.clientX, startPos: pos.get(), moved: 0, lastX: e.clientX, lastT: performance.now(), v: 0 };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down) return;
    const dx = e.clientX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(dx));
    if (d.moved > 6 && !d.captured) {
      d.captured = true;
      stageRef.current?.setPointerCapture(e.pointerId);
    }
    const now = performance.now();
    const dt = now - d.lastT;
    if (dt > 0) d.v = 0.8 * d.v + 0.2 * ((d.lastX - e.clientX) / spacing.get() / dt) * 1000;
    d.lastX = e.clientX;
    d.lastT = now;
    pos.set(d.startPos - dx / spacing.get());
  };

  const onPointerUp = () => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    if (d.moved > 6) {
      const cur = pos.get();
      const flick = Math.max(-2, Math.min(2, d.v * 0.18));
      goTo(Math.round(cur + flick));
    }
    setTimeout(() => (drag.current.moved = 0), 0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  };

  const current = items[active];
  const btn =
    "grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur transition-[transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.94] [@media(hover:hover)]:hover:border-[#ff1f3d]/60 [@media(hover:hover)]:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff1f3d]";

  return (
    <div>
      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative w-full overflow-hidden focus-visible:outline-none"
        style={{ height: Math.round(cw * 1.25 + 90), touchAction: "pan-y" }}
      >
        {slides.map((item, i) => (
          <GalleryCard key={i} item={item} i={i} m={m} cw={cw} pos={pos} spacing={spacing} onSelect={onSelect} />
        ))}
      </div>

      <div className="mx-auto mt-4 flex max-w-2xl items-start gap-4">
        <button type="button" aria-label="Previous project" onClick={() => step(-1)} className={btn}>
          <ChevronLeft size={20} />
        </button>

        <div className="min-h-[9.5rem] flex-1 text-center" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -8 }}
              transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              <p className="font-mono text-xs uppercase tracking-widest text-[#ff1f3d]">
                {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-white">{current.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{current.description}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {current.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex justify-center gap-3">
                {current.repoUrl && (
                  <a href={current.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-white/10 px-4 py-2 text-sm text-white transition-colors duration-200 [@media(hover:hover)]:hover:border-[#ff1f3d]/60 [@media(hover:hover)]:hover:text-[#ff1f3d]">
                    Code <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button type="button" aria-label="Next project" onClick={() => step(1)} className={btn}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}