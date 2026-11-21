import { useEffect, useMemo, useRef } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from 'motion/react';
import { EASE_OUT } from '../lib/motion';

const DEFAULT_DURATION = 1.2;

interface ParsedStat {
  prefix: string;
  suffix: string;
  target: number;
  /** Zero-padded width, e.g. "00" keeps two digits while counting. */
  pad: number;
  decimals: number;
}

/**
 * Splits a value such as "24", "5+" or "[00]" into prefix, number and suffix.
 * Returns null when there is no single number to animate (e.g. "1,200").
 */
function parseStat(value: string): ParsedStat | null {
  const match = /^(\D*?)(\d+(?:\.\d+)?)(\D*)$/.exec(value.trim());
  if (!match) return null;

  const digits = match[2];
  const hasDecimals = digits.includes('.');

  return {
    prefix: match[1],
    suffix: match[3],
    target: Number(digits),
    pad:
      !hasDecimals && digits.length > 1 && digits.startsWith('0')
        ? digits.length
        : 0,
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

export interface CountUpProps {
  value: string;
  /** When true the final value is shown instantly. */
  reduced: boolean;
  duration?: number;
}

/** Counts up once, when first scrolled into view. Driven by motion values. */
export default function CountUp({
  value,
  reduced,
  duration = DEFAULT_DURATION,
}: CountUpProps) {
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
      duration,
      ease: EASE_OUT,
    });
    return () => controls.stop();
  }, [inView, reduced, parsed, progress, duration]);

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