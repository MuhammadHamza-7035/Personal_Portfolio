import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '../lib/utils';

export type GlassCardPadding = 'none' | 'md' | 'lg';

interface GlassCardOwnProps<E extends ElementType> {
  /** Element or component to render. Defaults to "div". */
  as?: E;
  /** Lifts 4px on hover. Pointer devices only, disabled for reduced motion. */
  hoverLift?: boolean;
  /** Scales to 0.97 while pressed. Disabled for reduced motion. */
  pressable?: boolean;
  padding?: GlassCardPadding;
  className?: string;
  children?: ReactNode;
}

export type GlassCardProps<E extends ElementType> = GlassCardOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof GlassCardOwnProps<E>>;

const paddingClasses: Record<GlassCardPadding, string> = {
  none: '',
  md: 'p-6 sm:p-8',
  lg: 'p-8 sm:p-10',
};

export default function GlassCard<E extends ElementType = 'div'>({
  as,
  hoverLift = false,
  pressable = false,
  padding = 'md',
  className,
  children,
  ...rest
}: GlassCardProps<E>) {
  const Component: ElementType = as ?? 'div';

  return (
    <Component
      className={cn(
        'glass transition-[transform,border-color,background-color] duration-base ease-out-strong',
        paddingClasses[padding],
        hoverLift &&
          'motion-safe:[@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:border-white/20',
        pressable && 'cursor-pointer motion-safe:active:scale-[0.97]',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}