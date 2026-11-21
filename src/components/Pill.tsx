import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../lib/utils';

export type PillVariant = 'neutral' | 'accent';

export interface PillProps extends ComponentPropsWithoutRef<'span'> {
  variant?: PillVariant;
}

export default function Pill({
  variant = 'neutral',
  className,
  children,
  ...rest
}: PillProps) {
  return (
    <span
      className={cn(
        'pill whitespace-nowrap',
        variant === 'accent' && 'border-accent/40 bg-accent/10 text-accent',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}