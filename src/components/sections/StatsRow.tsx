import { useEffect, useMemo, useRef } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from 'motion/react';
import GlassCard from '../GlassCard';
import Reveal from '../Reveal';
import { content } from '../../data/content';
import { EASE_OUT, useReducedMotionSafe } from '../../lib/motion';

const COUNT_DURATION = 1.2;

interface ParsedStat {
  prefix: string;
  suffix: string;
  target: number;
  /** Zero-padded width, e.g. "00" keeps two digits while counting. */
  pad: number;
  decimals: number;
}

/**
 * Splits a stat such as "24", "5+" or "[00]" into prefix, number and suffix.
 * Returns null when there is no single number to animate (e.g. "1,200").
 */
function parseStat(value: string): ParsedStat | null {
  const match = /^(\D*?)(\d+(?:\.\d+)?)(\D*)$/.exec(value.trim());
  if (!match) return null;

  const prefix = match[1];
  const digits = match[2];
  const suffix = match[3];
  const hasDecimals = digits.includes('.');

  return {
    prefix,
    suffix,
    target: Number(digits),
    pad: !hasDecimals && digits.length > 1 && digits.startsWith('0') ? digits.length : 0,
    decimals: hasDecimals ? digits.split('.')[1].length : 0,
  };
}

function formatStat(parsed: ParsedStat, current: number): string {
  const body =
    parsed.decimals > 0
      ? current.toFixed(parsed.decimals)
      : Math.round(current).toString().padStart(parsed.pad, '0');
  return `${parsed.prefix}${body}${parsed.suffix}`;
}

interface CountUpProps {
  value: string;
  reduced: boolean;
}

function CountUp({ value, reduced }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const parsed = useMemo(() => parseStat(value), [value]);
  const progress = useMotionValue(0);
  const text = useTransform(progress, (latest) =>
    parsed ? formatStat(parsed, latest) : value,
  );

  useEffect(() => {
    if (!inView || reduced || !parsed) return;
    const controls = animate(progress, parsed.target, {
      duration: COUNT_DURATION,
      ease: EASE_OUT,
    });
    return () => controls.stop();
  }, [inView, reduced, parsed, progress]);

  // Reduced motion (or nothing to count): show the final value instantly.
  if (reduced || !parsed) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <motion.span aria-hidden="true">{text}</motion.span>
    </span>
  );
}

interface StatItem {
  id: string;
  label: string;
  value: string;
}

const stats: StatItem[] = [
  { id: 'age', label: 'AGE', value: content.age },
  { id: 'years-exp', label: 'YEARS EXP', value: content.yearsExp },
  { id: 'projects-done', label: 'PROJECTS DONE', value: content.projectsDone },
];

export default function StatsRow() {
  const { reduced } = useReducedMotionSafe();

  return (
    <div className="container-page pb-section">
      <Reveal
        as="ul"
        stagger
        role="list"
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3"
      >
        {stats.map((stat) => (
          <Reveal as="li" key={stat.id} className="h-full">
            <GlassCard padding="none" className="h-full p-5 sm:p-7 lg:p-8">
              <div className="flex h-full flex-col-reverse justify-end gap-3">
                <p className="font-mono text-label uppercase text-muted">
                  {stat.label}
                </p>
                <p
                  className="font-mono font-medium leading-none tracking-tight text-accent tabular-nums"
                  style={{ fontSize: 'clamp(2.25rem, 1.6rem + 2.6vw, 4rem)' }}
                >
                  <CountUp value={stat.value} reduced={reduced} />
                </p>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </Reveal>
    </div>
  );
}