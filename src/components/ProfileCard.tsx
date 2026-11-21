import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useState } from "react";

type Props = {
  name: string;
  role: string;
  handle: string;
  image?: string;
  status?: string;
  contactHref?: string;
  contactLabel?: string;
};

const SPRING = { stiffness: 180, damping: 22, mass: 0.6 };

export default function ProfileCard({
  name,
  role,
  handle,
  image = "/profile.jpg",
  status = "Online",
  contactHref = "/contact",
  contactLabel = "Contact",
}: Props) {
  const reduce = !!useReducedMotion();
  const [failed, setFailed] = useState(false);

  // tilt: pointer position inside the card, -0.5 to 0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, SPRING);
  const sy = useSpring(py, SPRING);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-7, 7]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div className="relative mx-auto w-full max-w-[340px]" style={{ perspective: 1000 }}>
      {/* red aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,31,61,0.30) 0%, rgba(255,31,61,0.08) 45%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", willChange: "transform" }}
        className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-2.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl"
      >
        {/* photo */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#141416]">
          {image && !failed ? (
            <img
              src={image}
              alt={name}
              draggable={false}
              decoding="async"
              onError={() => setFailed(true)}
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,31,61,0.25),transparent_60%),#141416]">
              <span className="text-8xl font-bold text-white/20">{name.charAt(0)}</span>
            </div>
          )}

          {/* bottom fade + text */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-5 pt-24">
            <p className="text-xl font-semibold leading-tight text-white">{name}</p>
            <p className="mt-1 text-sm text-white/60">{role}</p>
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between gap-3 px-3 pb-2 pt-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{handle}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/55">
                <span className="relative flex h-2 w-2">
                {!reduce && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-70" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                </span>
              {status}
            </p>
          </div>

          <Link
            to={contactHref}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white transition-[transform,background-color,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff1f3d] [@media(hover:hover)]:hover:border-[#ff1f3d]/60 [@media(hover:hover)]:hover:bg-white/10 [@media(hover:hover)]:hover:shadow-[0_0_24px_-6px_rgba(255,31,61,0.6)]"
          >
            <Mail size={16} aria-hidden />
            {contactLabel}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}