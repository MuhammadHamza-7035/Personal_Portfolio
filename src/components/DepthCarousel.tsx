import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export type DepthItem = {
  title: string;
  note?: string;
  genre?: string;
  image?: string;
};

const SPRING = { type: "spring", stiffness: 220, damping: 28, mass: 0.8 } as const;

// pose of a card depending on its distance from the active card
function pose(offset: number) {
  if (offset < 0) return { x: "-28%", scale: 0.94, opacity: 0, dim: 0.6 };
  if (offset === 0) return { x: "0%", scale: 1, opacity: 1, dim: 0 };
  if (offset === 1) return { x: "34%", scale: 0.92, opacity: 1, dim: 0.35 };
  if (offset === 2) return { x: "46%", scale: 0.84, opacity: 1, dim: 0.6 };
  return { x: "46%", scale: 0.78, opacity: 0, dim: 0.7 };
}

function Card({
  item,
  offset,
  onSelect,
  reduce,
}: {
  item: DepthItem;
  offset: number;
  onSelect: () => void;
  reduce: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const p = pose(offset);
  const transition = reduce ? { duration: 0.15 } : SPRING;

  return (
    <motion.div
      role="group"
      aria-label={item.title}
      aria-hidden={offset !== 0}
      onClick={onSelect}
      initial={false}
      animate={{ x: p.x, scale: p.scale, opacity: p.opacity }}
      transition={transition}
      className="group absolute left-0 top-0 aspect-[3/4] w-[72%] select-none"
      style={{
        zIndex: 20 - Math.abs(offset),
        pointerEvents: offset < 0 || offset > 2 ? "none" : "auto",
        cursor: offset === 0 ? "grab" : "pointer",
        willChange: "transform",
      }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#141416] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]">
        {item.image && !failed ? (
          <img
            src={item.image}
            alt=""
            loading="lazy"
            draggable={false}
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)]:group-hover:scale-[1.05]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,31,61,0.25),transparent_60%),#141416]">
            <span className="text-7xl font-bold text-white/20">
              {item.title.charAt(0)}
            </span>
          </div>
        )}

        {/* depth dimming */}
        <motion.div
          className="absolute inset-0 bg-black"
          initial={false}
          animate={{ opacity: p.dim }}
          transition={transition}
        />

        {/* caption only on the front card */}
        <motion.div
          initial={false}
          animate={{ opacity: offset === 0 ? 1 : 0, y: offset === 0 ? 0 : 8 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-20"
        >
          {item.genre && (
            <span className="mb-2 inline-block rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] text-white/80 backdrop-blur">
              {item.genre}
            </span>
          )}
          <p className="text-lg font-semibold leading-tight text-white">
            {item.title}
          </p>
          {item.note && (
            <p className="mt-1 line-clamp-2 text-sm text-white/65">{item.note}</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function DepthCarousel({
  items,
  label = "Carousel",
}: {
  items: DepthItem[];
  label?: string;
}) {
  const [active, setActive] = useState(0);
  const reduce = !!useReducedMotion();
  const drag = useRef({ down: false, startX: 0, moved: 0 });
  const n = items.length;

  const goTo = (i: number) => setActive(Math.max(0, Math.min(n - 1, i)));

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { down: true, startX: e.clientX, moved: 0 };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down) return;
    drag.current.moved = Math.max(
      drag.current.moved,
      Math.abs(e.clientX - drag.current.startX)
    );
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down) return;
    d.down = false;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 40) goTo(active + (dx < 0 ? 1 : -1));
    setTimeout(() => (drag.current.moved = 0), 0);
  };

  const select = (i: number) => {
    if (drag.current.moved > 6) return; // it was a drag, not a click
    goTo(i);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(active + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(active - 1); }
  };

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff1f3d]/70 rounded-2xl"
        style={{ touchAction: "pan-y" }}
      >
        {/* spacer sets the height from the card's aspect ratio */}
        <div aria-hidden className="invisible aspect-[3/4] w-[72%]" />
        {items.map((item, i) => (
          <Card
            key={item.title + i}
            item={item}
            offset={i - active}
            onSelect={() => select(i)}
            reduce={reduce}
          />
        ))}
      </div>

      {/* pagination dots */}
      <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label={`${label} pagination`}>
        {items.map((item, i) => {
          const on = i === active;
          return (
            <motion.button
              key={item.title + i}
              type="button"
              role="tab"
              aria-selected={on}
              aria-label={`Go to ${item.title}`}
              onClick={() => goTo(i)}
              layout
              transition={reduce ? { duration: 0.1 } : SPRING}
              className={`h-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff1f3d] ${
                on ? "w-6 bg-white" : "w-2 bg-white/30 [@media(hover:hover)]:hover:bg-white/60"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}