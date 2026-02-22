"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Category, Concept } from "@/lib/types";
import { springs, stagger } from "@/lib/motion";
import ConceptLink from "@/components/sidebar/concept-link";

interface CategoryGroupProps {
  category: Category;
  concepts: Concept[];
  activeConceptId: string | null;
  onSelectConcept: (id: string) => void;
}

export default function CategoryGroup({
  category,
  concepts,
  activeConceptId,
  onSelectConcept,
}: CategoryGroupProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-sm font-medium text-text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset rounded"
      >
        <span>{category.icon}</span>
        <span className="flex-1 text-left">{category.title}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={springs.snappy}
          className="h-4 w-4 text-text-tertiary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springs.gentle}
            className="overflow-hidden"
          >
            <ul className="flex flex-col gap-0.5 pb-2">
              {concepts.map((concept, i) => (
                <motion.li
                  key={concept.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    ...springs.gentle,
                    delay: i * stagger.fast,
                  }}
                >
                  <ConceptLink
                    title={concept.title}
                    isActive={concept.id === activeConceptId}
                    onClick={() => onSelectConcept(concept.id)}
                  />
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
