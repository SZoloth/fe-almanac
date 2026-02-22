"use client";

import { AnimatePresence, motion } from "motion/react";
import { springs } from "@/lib/motion";

interface VizControlsProps {
  isPlaying: boolean;
  progress: number;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
}

export default function VizControls({
  isPlaying,
  progress,
  onPlay,
  onPause,
  onRestart,
}: VizControlsProps) {
  return (
    <div className="flex shrink-0 items-center gap-3 py-2">
      <motion.button
        onClick={isPlaying ? onPause : onPlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={springs.snappy}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface-2 transition-colors hover:bg-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isPlaying ? (
            <motion.svg
              key="pause"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x={6} y={4} width={4} height={16} rx={1} />
              <rect x={14} y={4} width={4} height={16} rx={1} />
            </motion.svg>
          ) : (
            <motion.svg
              key="play"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="6,4 20,12 6,20" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
      <motion.button
        onClick={onRestart}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={springs.snappy}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-surface-2 transition-colors hover:bg-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label="Restart"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </motion.button>
      <div
        className="flex-1 overflow-hidden rounded-full bg-surface-2 h-1"
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Animation progress"
      >
        <div
          className="h-full bg-accent origin-left transition-transform duration-100"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
