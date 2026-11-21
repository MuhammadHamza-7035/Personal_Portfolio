import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type DiagonalPhoto = {
  title: string;
  caption?: string;
  image?: string;
};

const SPRING = { type: "spring", stiffness: 190, damping: 27, mass: 0.9 } as const;
const EASE = [0.23, 1, 0.32, 1] as const;

// Layout (as % of the stage): main = 52% wide at left 21%, thumbs = 18% wide.
// THUMB_SCALE = thumb width / main width. The x/y offsets place thumbs in the corners.
const THUMB_SCALE = 0.346;
const POSES = {
  prev: { x: "-73.1%", y: "-32.7%", scale: THUMB_SCALE, opacity: 1, dim: 0.3 },
  main: { x: "0%", y: "0%", scale: 1, opacity: 1, dim: 0 },
  next: { x: "73.1%", y: "32.7%", scale: THUMB_SCALE, opacity: 1, dim: 0.3 },
  hidden: { x: "0%", y: "0%", scale: 0.9, opacity: 0, dim: 0.6 },
};
type Slot = keyof typeof POSES;

function slotFor(i: number, active: number, n: number): Slot {
  let o = (((i - active) % n) + n) % n;
  if (o > n / 2) o -= n;
  if (o === 0) return "main";
  if (o === 1) return "next";
  if (o === -1) return "prev";
  return "hidden";
}

function Tile({
  photo,
  slot,
  reduce,
  onPress,
}: {
  photo: DiagonalPhoto;
  slot: Slot;
  reduce: boolean;
  onPress: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const p = POSES[slot];
  const transition = reduce ? { duration: 0.2 } : SPRING;
  const isMain = slot === "main";
  const hidden = slot === "hidden";

  return (
    <motion.button
      type="button"
      onClick={onPress}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden}
      aria-label={isMain ? `${photo.title}, show next photo` : `Show ${photo.title}`}
      initial={false}
      animate={{ x: p.x, y: p.y, scale: p.scale, opacity: p.opacity }}
      transition={transition}
      className="group absolute left-[21%] top-0 aspect-[4/5] w-[52%] select-none focus-visible:outline-none"
      style={{
        zIndex: isMain ? 30 : hidden ? 10 : 20,
        pointerEvents: hidden ? "none" : "auto",
        cursor: isMain ? "grab" : "pointer",
        willChange: "transform",
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#141416] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] group-focus-visible:ring-2 group-focus-visible:ring-[#ff1f3d]">
        {photo.image && !failed ? (
          <img
            src={photo.image}
            alt={isMain ? photo.title : ""}
            draggable={false}
            decoding="async"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,31,61,0.25),transparent_60%),#141416]">
            <span className="text-7xl font-bold text-white/20">{photo.title.charAt(0)}</span>
          </div>
        )}
        <motion.div
          className="absolute inset-0 bg-black transition-opacity duration-300 [@media(hover:hover)]:group-hover:!opacity-10"
          initial={false}
          animate={{ opacity: p.dim }}
          transition={transition}
        />
      </div>
    </motion.button>
  );
}

export default function DiagonalGallery({
  photos,
  label = "Photography",
}: {
  photos: DiagonalPhoto[];
  label?: string;
}) {
  const n = photos.length;
  const [active, setActive] = useState(0);
  const reduce = !!useReducedMotion();
  const drag = useRef({ down: false, startX: 0, moved: 0 });

  const go = (d: number) => setActive((a) => (((a + d) % n) + n) % n);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { down: true, startX: e.clientX, moved: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(e.clientX - drag.current.startX));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    setTimeout(() => (drag.current.moved = 0), 0);
  };
  const press = (slot: Slot) => {
    if (drag.current.moved > 6) return; // it was a swipe, not a click
    go(slot === "prev" ? -1 : 1);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };

  const current = photos[active];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="relative w-full"
    >
      {/* Stage */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative w-full"
        style={{ touchAction: "pan-y" }}
      >
        {/* spacer: gives the stage its height from the main photo's ratio */}
        <div aria-hidden className="invisible ml-[21%] aspect-[4/5] w-[52%]" />
        {photos.map((photo, i) => {
          const slot = slotFor(i, active, n);
          return (
            <Tile
              key={photo.title + i}
              photo={photo}
              slot={slot}
              reduce={reduce}
              onPress={() => press(slot)}
            />
          );
        })}
      </div>

      {/* Caption: top-right column on desktop, below the stage on mobile */}
      <div
        aria-live="polite"
        className="mt-6 text-center md:absolute md:left-[76%] md:top-0 md:mt-0 md:w-[24%] md:pr-2 md:text-left"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <p className="font-mono text-xs uppercase tracking-widest text-[#ff1f3d]">
              {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">{current.title}</h3>
            {current.caption && (
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">{current.caption}</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}