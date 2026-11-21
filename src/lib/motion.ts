import { useReducedMotion } from 'motion/react';
import type { MotionProps, Transition, Variants } from 'motion/react';

/* ------------------------------------------------------------------
   Easing
------------------------------------------------------------------- */
export type Bezier = [number, number, number, number];

/** Entrances and exits. */
export const EASE_OUT: Bezier = [0.23, 1, 0.32, 1];
/** Elements that move while already on screen (layout, indicators). */
export const EASE_IN_OUT: Bezier = [0.77, 0, 0.175, 1];

export const EASE_OUT_CSS = 'cubic-bezier(0.23, 1, 0.32, 1)';
export const EASE_IN_OUT_CSS = 'cubic-bezier(0.77, 0, 0.175, 1)';

/* ------------------------------------------------------------------
   Durations (seconds)
------------------------------------------------------------------- */
export const DURATION = {
  micro: 0.15,
  fast: 0.2,
  base: 0.25,
  move: 0.28,
  reveal: 0.38,
  pageIn: 0.28,
  pageOut: 0.18,
  reduced: 0.15,
} as const;

/** Small travel distances in px. */
export const DISTANCE = {
  reveal: 12,
  page: 8,
  pageExit: 4,
  blur: 8,
} as const;

export const STAGGER = {
  child: 0.06,
  delay: 0.04,
} as const;

export const PRESS_SCALE = 0.97;
/** Entrances never start from scale(0). */
export const ENTER_SCALE = 0.95;

/* ------------------------------------------------------------------
   Transitions
------------------------------------------------------------------- */
export const enterTransition: Transition = {
  duration: DURATION.reveal,
  ease: EASE_OUT,
};

export const microTransition: Transition = {
  duration: DURATION.micro,
  ease: EASE_OUT,
};

/** Shared layout animation (nav indicator via layoutId). */
export const layoutTransition: Transition = {
  duration: DURATION.move,
  ease: EASE_IN_OUT,
};

/* ------------------------------------------------------------------
   Viewport settings: reveal once, slightly before fully in view.
------------------------------------------------------------------- */
export const revealViewport = {
  once: true,
  amount: 0.2,
  margin: '0px 0px -8% 0px',
} as const;

/* ------------------------------------------------------------------
   Preset builder
------------------------------------------------------------------- */
export interface MotionPreset {
  /** True when the user prefers reduced motion. */
  reduced: boolean;
  /** hidden -> visible. Opacity + small y. */
  fadeUp: Variants;
  /** hidden -> visible. Opacity + small y + light blur. Use sparingly. */
  fadeUpBlur: Variants;
  /** hidden -> visible. Opacity + scale from 0.95. */
  scaleIn: Variants;
  /** hidden -> visible. Opacity only. */
  fade: Variants;
  /** Container: staggers children that use hidden/visible variants. */
  stagger: Variants;
  /** initial / animate / exit for route changes (crossfade + small y). */
  pageTransition: Variants;
  /** Spread onto a motion element: scale(0.97) on press. */
  pressable: MotionProps;
  /** Spread onto a motion element: reveal once when scrolled into view. */
  reveal: MotionProps;
  /** Spread onto a container; children use `variants={fadeUp}`. */
  revealGroup: MotionProps;
  layoutTransition: Transition;
}

const fadeOnlyTransition: Transition = {
  duration: DURATION.reduced,
  ease: EASE_OUT,
};

function buildPreset(reduced: boolean): MotionPreset {
  const fade: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: fadeOnlyTransition },
  };

  const fadeUp: Variants = reduced
    ? fade
    : {
        hidden: { opacity: 0, y: DISTANCE.reveal },
        visible: { opacity: 1, y: 0, transition: enterTransition },
      };

  const fadeUpBlur: Variants = reduced
    ? fade
    : {
        hidden: {
          opacity: 0,
          y: DISTANCE.blur,
          filter: 'blur(6px)',
        },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: enterTransition,
        },
      };

  const scaleIn: Variants = reduced
    ? fade
    : {
        hidden: { opacity: 0, scale: ENTER_SCALE },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: DURATION.base, ease: EASE_OUT },
        },
      };

  const stagger: Variants = {
    hidden: {},
    visible: {
      transition: reduced
        ? { staggerChildren: 0, delayChildren: 0 }
        : { staggerChildren: STAGGER.child, delayChildren: STAGGER.delay },
    },
  };

  const pageTransition: Variants = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: fadeOnlyTransition },
        exit: { opacity: 0, transition: fadeOnlyTransition },
      }
    : {
        initial: { opacity: 0, y: DISTANCE.page },
        animate: {
          opacity: 1,
          y: 0,
          transition: { duration: DURATION.pageIn, ease: EASE_OUT },
        },
        exit: {
          opacity: 0,
          y: -DISTANCE.pageExit,
          transition: { duration: DURATION.pageOut, ease: EASE_OUT },
        },
      };

  const pressable: MotionProps = reduced
    ? {}
    : {
        whileTap: { scale: PRESS_SCALE },
        transition: microTransition,
      };

  const reveal: MotionProps = {
    variants: fadeUp,
    initial: 'hidden',
    whileInView: 'visible',
    viewport: revealViewport,
  };

  const revealGroup: MotionProps = {
    variants: stagger,
    initial: 'hidden',
    whileInView: 'visible',
    viewport: revealViewport,
  };

  return {
    reduced,
    fadeUp,
    fadeUpBlur,
    scaleIn,
    fade,
    stagger,
    pageTransition,
    pressable,
    reveal,
    revealGroup,
    layoutTransition: reduced ? { duration: 0 } : layoutTransition,
  };
}

const FULL_MOTION: MotionPreset = buildPreset(false);
const REDUCED_MOTION: MotionPreset = buildPreset(true);

/* Static, full-motion exports for non-hook usage. */
export const fadeUp: Variants = FULL_MOTION.fadeUp;
export const stagger: Variants = FULL_MOTION.stagger;
export const pageTransition: Variants = FULL_MOTION.pageTransition;
export const pressable: MotionProps = FULL_MOTION.pressable;

/**
 * Returns the preset that matches the user's motion preference.
 * Under prefers-reduced-motion every variant drops movement, scale and blur
 * and keeps only a short opacity fade. Returned objects are stable references.
 */
export function useReducedMotionSafe(): MotionPreset {
  const prefersReduced = useReducedMotion();
  return prefersReduced === true ? REDUCED_MOTION : FULL_MOTION;
}