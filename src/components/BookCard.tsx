import GlassCard from './GlassCard';
import Pill from './Pill';
import type { BookStatus } from '../data/content';
import { cn } from '../lib/utils';

export interface BookCardProps {
  title: string;
  author: string;
  status: BookStatus;
  /** Visible label for the status Pill, e.g. "Want to Read". */
  statusLabel: string;
  className?: string;
}

export default function BookCard({
  title,
  author,
  status,
  statusLabel,
  className,
}: BookCardProps) {
  return (
    <GlassCard
      as="article"
      hoverLift
      className={cn('flex h-full flex-col gap-4', className)}
    >
      <Pill
        variant={status === 'reading' ? 'accent' : 'neutral'}
        className="self-start"
      >
        {statusLabel}
      </Pill>
      <div className="flex flex-col gap-1.5">
        <h4 className="text-title text-text">{title}</h4>
        <p className="text-sm leading-relaxed text-muted">{author}</p>
      </div>
    </GlassCard>
  );
}