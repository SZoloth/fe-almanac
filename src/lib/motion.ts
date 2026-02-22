import type { Transition, Variants } from "motion/react";

// Spring presets
export const springs = {
  snappy: { type: "spring", stiffness: 500, damping: 30 } as Transition,
  gentle: { type: "spring", stiffness: 300, damping: 25 } as Transition,
  reveal: { type: "spring", stiffness: 200, damping: 20 } as Transition,
};

// CSS easing
export const GOLDEN_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

// Stagger delays
export const stagger = {
  fast: 0.04,
  default: 0.06,
};

// Variants — exits are subtler than enters
export const fadeSlideBlur: Variants = {
  initial: { opacity: 0, y: 8, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -4, filter: "blur(2px)" },
};

export const fadeSlide: Variants = {
  initial: { opacity: 0, y: 6, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -3, filter: "blur(1px)" },
};
