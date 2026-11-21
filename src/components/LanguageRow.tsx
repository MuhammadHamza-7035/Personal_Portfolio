import { motion } from 'motion/react';
import GlassCard from './GlassCard';
import Pill from './Pill';
import type { PillVariant } from './Pill';
import {
  DURATION,
  EASE_OUT,
  revealViewport,
  useReducedMotionSafe,
} from '../lib/motion';

export interface LanguageRowProps {
  name: string;
  levelLabel: string;
  /** 0 to 100. */
  proficiency: number;
  levelVariant?: PillVariant;
}

export default function LanguageRow({
  name,
  levelLabel,
  proficiency,
  levelVariant = 'neutral',
}: LanguageRowProps) {
  const { reduced } = useReducedMotionSafe();
  const target = Math.min(100, Math.max(0, proficiency)) / 100;

  return (
    <GlassCard
      padding="none"
      className="flex flex-col gap-4 p-5"
    >
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-lg font-medium tracking-tight text-text">{name}</h4>
        <Pill variant={levelVariant}>{levelLabel}</Pill>
      </div>

      {/* Decorative: the level Pill carries the meaning for assistive tech. */}
      <div
        aria-hidden="true"
        className="h-1 w-full overflow-hidden rounded-pill bg-white/10"
      >
        <motion.div
          className="h-full w-full origin-left bg-accent"
          style={{ willChange: reduced ? undefined : 'transform' }}
          initial={reduced ? { opacity: 0, scaleX: target } : { scaleX: 0 }}
          whileInView={reduced ? { opacity: 1 } : { scaleX: target }}
          viewport={revealViewport}
          transition={{
            duration: reduced ? DURATION.reduced : DURATION.reveal,
            ease: EASE_OUT,
            delay: reduced ? 0 : 0.12,
          }}
        />
      </div>
    </GlassCard>
  );
}