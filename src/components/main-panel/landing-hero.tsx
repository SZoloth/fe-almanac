"use client";

import { motion } from "motion/react";
import { springs, fadeSlideBlur, stagger } from "@/lib/motion";

export default function LandingHero() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden">
      {/* Radial gradient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, var(--color-accent-muted), transparent)",
        }}
      />

      {/* Noise texture overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Content */}
      <motion.div
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: stagger.default }}
        className="relative z-10 flex flex-col items-center gap-3"
      >
        <motion.h2
          variants={fadeSlideBlur}
          transition={springs.reveal}
          className="font-mono text-5xl font-bold tracking-tighter text-text-primary"
        >
          FE Almanac
        </motion.h2>
        <motion.p
          variants={fadeSlideBlur}
          transition={springs.reveal}
          className="text-lg text-text-secondary"
        >
          An interactive glossary of advanced frontend concepts
        </motion.p>
        <motion.p
          variants={fadeSlideBlur}
          transition={springs.reveal}
          className="mt-6 text-sm text-text-tertiary"
        >
          <kbd className="rounded border border-surface-2 bg-surface-1 px-1.5 py-0.5 font-mono text-xs">
            /
          </kbd>{" "}
          to search, or select a concept
        </motion.p>
      </motion.div>
    </div>
  );
}
