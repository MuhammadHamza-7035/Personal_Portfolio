import { useId } from 'react';
import type { ReactNode } from 'react';
import GlassCard from './GlassCard';
import { cn } from '../lib/utils';

export interface InfoCardProps {
  /** Small uppercase label. Rendered as the card's h2 and used as its accessible name. */
  label: string;
  /** Optional element shown before the label, e.g. a status dot. */
  adornment?: ReactNode;
  /** Content slot. */
  children?: ReactNode;
  className?: string;
}

export default function InfoCard({
  label,
  adornment,
  children,
  className,
}: InfoCardProps) {
  const labelId = useId();

  return (
    <GlassCard
      as="section"
      aria-labelledby={labelId}
      padding="none"
      className={cn('flex flex-col gap-3 p-5 sm:p-6', className)}
    >
      <div className="flex items-center gap-2.5">
        {adornment}
        <h2 id={labelId} className="eyebrow">
          {label}
        </h2>
      </div>
      {children}
    </GlassCard>
  );
}