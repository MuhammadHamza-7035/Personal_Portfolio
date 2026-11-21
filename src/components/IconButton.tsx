import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';
import { useReducedMotionSafe } from '../lib/motion';
import { cn, isExternalHref } from '../lib/utils';

interface IconButtonOwnProps {
  /** Accessible name. Required because the button has no visible text. */
  label: string;
  /** The icon, e.g. a lucide-react element. */
  children: ReactNode;
  /** Opens in a new tab. Defaults to true for absolute http(s) links. */
  external?: boolean;
  className?: string;
}

type OmittedKeys = keyof IconButtonOwnProps | 'aria-label';

type IconButtonAsAnchor = IconButtonOwnProps &
  Omit<HTMLMotionProps<'a'>, OmittedKeys> & {
    href: string;
  };

type IconButtonAsButton = IconButtonOwnProps &
  Omit<HTMLMotionProps<'button'>, OmittedKeys | 'href'> & {
    href?: undefined;
  };

export type IconButtonProps = IconButtonAsAnchor | IconButtonAsButton;

const classesBase =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white/5 text-muted ' +
  'transition-[color,border-color,background-color,box-shadow] duration-fast ease-out-strong ' +
  '[@media(hover:hover)]:hover:border-accent/50 [@media(hover:hover)]:hover:bg-accent/10 ' +
  '[@media(hover:hover)]:hover:text-accent [@media(hover:hover)]:hover:shadow-glow ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

export default function IconButton(props: IconButtonProps) {
  const { label, children, external, className, ...rest } = props;
  const { pressable } = useReducedMotionSafe();

  const icon = (
    <span aria-hidden="true" className="inline-flex [&_svg]:h-5 [&_svg]:w-5">
      {children}
    </span>
  );

  if (rest.href !== undefined) {
    const { href, target, rel, ...anchorProps } = rest;
    const opensNewTab = external ?? isExternalHref(href);

    return (
      <motion.a
        {...pressable}
        {...anchorProps}
        href={href}
        target={target ?? (opensNewTab ? '_blank' : undefined)}
        rel={rel ?? (opensNewTab ? 'noopener noreferrer' : undefined)}
        aria-label={label}
        className={cn(classesBase, className)}
      >
        {icon}
      </motion.a>
    );
  }

  const { type = 'button', disabled, ...buttonProps } = rest;

  return (
    <motion.button
      {...(disabled ? {} : pressable)}
      {...buttonProps}
      type={type}
      disabled={disabled}
      aria-label={label}
      className={cn(classesBase, className)}
    >
      {icon}
    </motion.button>
  );
}