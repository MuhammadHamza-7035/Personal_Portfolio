import type { MouseEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';
import { useReducedMotionSafe } from '../lib/motion';
import { cn, isInternalHref } from '../lib/utils';

export type ButtonVariant = 'primary' | 'ghost';
export type ButtonSize = 'md' | 'lg';

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, keeps the width, and blocks interaction. */
  loading?: boolean;
  /** Optional leading icon. */
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

type ButtonAsAnchor = ButtonOwnProps &
  Omit<HTMLMotionProps<'a'>, keyof ButtonOwnProps> & {
    href: string;
  };

type ButtonAsButton = ButtonOwnProps &
  Omit<HTMLMotionProps<'button'>, keyof ButtonOwnProps | 'href'> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsAnchor | ButtonAsButton;

const baseClasses =
  'relative inline-flex select-none items-center justify-center rounded-pill font-medium tracking-tight ' +
  'transition-[background-color,border-color,color,box-shadow,opacity] duration-fast ease-out-strong ' +
  'disabled:cursor-not-allowed disabled:opacity-70';

const sizeClasses: Record<ButtonSize, string> = {
  md: 'min-h-11 px-6 text-sm',
  lg: 'min-h-12 px-8 text-base',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent font-semibold text-bg [@media(hover:hover)]:hover:shadow-glow',
  ghost:
    'border bg-white/5 text-text [@media(hover:hover)]:hover:border-white/25 [@media(hover:hover)]:hover:bg-white/10',
};

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    className,
    children,
    ...rest
  } = props;

  const navigate = useNavigate();
  const { pressable } = useReducedMotionSafe();

  const classes = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className,
  );

  const inner = (
    <>
      <span
        className={cn(
          'inline-flex items-center gap-2 transition-opacity duration-fast ease-out-strong',
          loading && 'opacity-0',
        )}
      >
        {icon ? (
          <span aria-hidden="true" className="inline-flex">
            {icon}
          </span>
        ) : null}
        {children}
      </span>
      {loading ? (
        <span className="absolute inset-0 inline-flex items-center justify-center">
          <Spinner />
        </span>
      ) : null}
    </>
  );

  if (rest.href !== undefined) {
    const { href, onClick, target, rel, download, ...anchorProps } = rest;

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      if (loading) {
        event.preventDefault();
        return;
      }
      const plainClick =
        event.button === 0 &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey;
      if (isInternalHref(href) && !target && download === undefined && plainClick) {
        event.preventDefault();
        navigate(href);
      }
    };

    return (
      <motion.a
        {...(loading ? {} : pressable)}
        {...anchorProps}
        href={href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        download={download}
        aria-busy={loading || undefined}
        aria-disabled={loading || undefined}
        onClick={handleClick}
        className={cn(classes, loading && 'pointer-events-none opacity-70')}
      >
        {inner}
      </motion.a>
    );
  }

  const { type = 'button', disabled, ...buttonProps } = rest;
  const isDisabled = Boolean(disabled) || loading;

  return (
    <motion.button
      {...(isDisabled ? {} : pressable)}
      {...buttonProps}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={classes}
    >
      {inner}
    </motion.button>
  );
}