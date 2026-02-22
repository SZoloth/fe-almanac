"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { springs, fadeSlide } from "@/lib/motion";
import type { Category } from "@/lib/types";
import { getConceptsByCategory } from "@/lib/data/concepts";

interface CategoryBadgeProps {
  category: Category;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const count = getConceptsByCategory(category.id).length;

  return (
    <div ref={wrapperRef} className="relative inline-flex">
      <motion.button
        variants={fadeSlide}
        transition={springs.reveal}
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex w-fit cursor-pointer items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium uppercase tracking-wider text-text-tertiary transition-colors hover:bg-accent-muted hover:text-accent-text"
      >
        {category.title}
        <svg
          width={8}
          height={8}
          viewBox="0 0 8 8"
          fill="none"
          className="transition-transform"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path
            d="M1.5 3L4 5.5L6.5 3"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={springs.snappy}
            className="absolute left-0 top-full z-20 mt-2 w-64 rounded-lg border border-surface-2 bg-surface-1 p-3 shadow-lg"
          >
            <div className="flex items-center gap-1.5">
              <span>{category.icon}</span>
              <span className="text-sm font-medium text-text-primary">
                {category.title}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">
              {category.description}
            </p>
            <p className="mt-2 text-xs text-text-tertiary">
              {count} concept{count !== 1 ? "s" : ""}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
