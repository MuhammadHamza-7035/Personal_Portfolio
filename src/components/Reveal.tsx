import { createContext, useContext, useMemo } from 'react';
import type { ElementType, ReactNode } from 'react';
import { motion } from 'motion/react';
import type { HTMLMotionProps, Variants } from 'motion/react';
import {
  DISTANCE,
  DURATION,
  EASE_OUT,
  STAGGER,
  revealViewport,
  useReducedMotionSafe,
} from '../lib/motion';

export type RevealTag =
  | 'div'
  | 'section'
  | 'article'
  | 'header'
  | 'footer'
  | 'ul'
  | 'ol'
  | 'li'
  | 'p'
  | 'span'
  | 'h1'
  | 'h2'
  | 'h3';

const tags: Record<RevealTag, ElementType> = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  footer: motion.footer,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  p: motion.p,
  span: motion.span,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
};

/** True inside a stagger container: children then inherit its trigger. */
const GroupContext = createContext(false);

function buildItemVariants(reduced: boolean, delay: number): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: DURATION.reduced, ease: EASE_OUT, delay },
      },
    };
  }
  return {
    hidden: { opacity: 0, y: DISTANCE.reveal },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.reveal, ease: EASE_OUT, delay },
    },
  };
}

function buildGroupVariants(
  reduced: boolean,
  delay: number,
  interval: number,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: reduced
        ? { staggerChildren: 0, delayChildren: 0 }
        : { staggerChildren: interval, delayChildren: STAGGER.delay + delay },
    },
  };
}

export interface RevealProps
  extends Omit<
    HTMLMotionProps<'div'>,
    'children' | 'variants' | 'initial' | 'animate' | 'exit' | 'whileInView' | 'viewport'
  > {
  /** Element to render. Defaults to "div". */
  as?: RevealTag;
  /** Delay in seconds before this element reveals (or before its children start). */
  delay?: number;
  /**
   * Makes this element a stagger container: nested Reveal components reveal in
   * sequence. Pass a number to set the interval in seconds (default 0.06).
   */
  stagger?: boolean | number;
  children?: ReactNode;
}

export default function Reveal({
  as = 'div',
  delay = 0,
  stagger = false,
  children,
  ...rest
}: RevealProps) {
  const { reduced, fadeUp } = useReducedMotionSafe();
  const inGroup = useContext(GroupContext);

  const interval = typeof stagger === 'number' ? stagger : STAGGER.child;

  const itemVariants = useMemo<Variants>(
    () => (delay > 0 ? buildItemVariants(reduced, delay) : fadeUp),
    [reduced, delay, fadeUp],
  );

  const groupVariants = useMemo<Variants>(
    () => buildGroupVariants(reduced, delay, interval),
    [reduced, delay, interval],
  );

  const Component = tags[as];

  // Inside a stagger container the parent owns the trigger; reveal once, in view.
  const triggerProps = inGroup
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: revealViewport,
      };

  if (stagger !== false) {
    return (
      <Component variants={groupVariants} {...triggerProps} {...rest}>
        <GroupContext.Provider value={true}>{children}</GroupContext.Provider>
      </Component>
    );
  }

  return (
    <Component variants={itemVariants} {...triggerProps} {...rest}>
      {children}
    </Component>
  );
}