"use client";

import { AnimatePresence, motion } from "motion/react";
import { springs } from "@/lib/motion";

interface ConceptLinkProps {
  title: string;
  isActive: boolean;
  onClick: () => void;
}

export default function ConceptLink({
  title,
  isActive,
  onClick,
}: ConceptLinkProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      transition={springs.snappy}
      className="relative w-full cursor-pointer text-left px-3 py-2 text-sm rounded-r-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
    >
      <AnimatePresence>
        {isActive && (
          <>
            <motion.div
              layoutId="sidebar-active-bg"
              className="absolute inset-0 rounded-r-md bg-accent-muted"
              transition={springs.gentle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              layoutId="sidebar-active-indicator"
              className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent rounded-full"
              transition={springs.gentle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </>
        )}
      </AnimatePresence>
      <span
        className={`relative transition-colors ${
          isActive
            ? "text-accent-text"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        {title}
      </span>
    </motion.button>
  );
}
