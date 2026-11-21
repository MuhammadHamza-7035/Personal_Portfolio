import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, UIEvent } from 'react';
import GlassCard from './GlassCard';
import Pill from './Pill';
import Reveal from './Reveal';
import type { PlanItem } from '../data/content';
import { cn } from '../lib/utils';

/** Lists longer than this scroll inside the card. */
export const PLAN_MAX_ROWS = 6;

const FADE_MASK =
  'linear-gradient(to bottom, black calc(100% - 3.5rem), transparent)';

export interface PlanListProps {
  /** Small red column label, e.g. "PLAN TO PLAY". */
  label: string;
  items: PlanItem[];
  maxRows?: number;
  className?: string;
}

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, '0');
}

export default function PlanList({
  label,
  items,
  maxRows = PLAN_MAX_ROWS,
  className,
}: PlanListProps) {
  const labelId = useId();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollable = items.length > maxRows;
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !scrollable) return;

    const update = () => {
      setAtEnd(
        element.scrollHeight - element.clientHeight - element.scrollTop <= 2,
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [scrollable, items.length]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    setAtEnd(
      element.scrollHeight - element.clientHeight - element.scrollTop <= 2,
    );
  };

  const maskStyle: CSSProperties | undefined =
    scrollable && !atEnd
      ? { maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }
      : undefined;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <p id={labelId} className="eyebrow">
        {label}
      </p>

      {/*
        Long lists: on desktop the card is absolutely positioned inside this
        wrapper, so its height always equals the neighbouring column (never taller),
        and the inner area scrolls. The min-height keeps about six rows visible.
      */}
      <div
        className={cn(
          'relative flex flex-1 flex-col',
          scrollable && 'lg:min-h-[28.5rem]',
        )}
      >
        <GlassCard
          padding="none"
          className={cn(
            'flex min-h-0 flex-1 flex-col overflow-hidden',
            scrollable && 'max-h-[28.5rem] lg:absolute lg:inset-0 lg:max-h-none',
          )}
        >
          <div
            ref={scrollRef}
            onScroll={scrollable ? handleScroll : undefined}
            role={scrollable ? 'region' : undefined}
            aria-labelledby={scrollable ? labelId : undefined}
            tabIndex={scrollable ? 0 : undefined}
            style={maskStyle}
            className={cn(
              'min-h-0 flex-1',
              scrollable &&
                'overflow-y-auto overscroll-contain [scrollbar-width:none] focus-visible:[outline-offset:-2px] [&::-webkit-scrollbar]:hidden',
            )}
          >
            <Reveal
              as="ol"
              stagger
              role="list"
              aria-labelledby={labelId}
              className="divide-y"
            >
              {items.map((item, index) => (
                <Reveal
                  as="li"
                  key={item.id}
                  className="group grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-3 gap-y-2 px-5 py-4 transition-colors duration-fast ease-out-strong sm:grid-cols-[2rem_minmax(0,1fr)_auto] sm:items-center [@media(hover:hover)]:hover:bg-white/[0.04]"
                >
                  <span
                    aria-hidden="true"
                    className="relative inline-flex font-mono text-label text-accent"
                  >
                    {/* Glow layer: only its opacity changes on hover. */}
                    <span className="absolute -inset-x-1.5 -inset-y-2 rounded-full bg-accent/30 opacity-0 blur-md transition-opacity duration-fast ease-out-strong [@media(hover:hover)]:group-hover:opacity-100" />
                    <span className="relative">{formatIndex(index)}</span>
                  </span>

                  <div className="min-w-0">
                    <p className="text-base font-medium tracking-tight text-text">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {item.note}
                    </p>
                  </div>

                  {item.tag ? (
                    <div className="col-start-2 sm:col-start-3">
                      <Pill>{item.tag}</Pill>
                    </div>
                  ) : null}
                </Reveal>
              ))}
            </Reveal>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}