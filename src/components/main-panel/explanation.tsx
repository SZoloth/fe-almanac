"use client";

import { motion } from "motion/react";
import type { Concept, Category } from "@/lib/types";
import { springs, fadeSlide, stagger } from "@/lib/motion";
import CategoryBadge from "@/components/main-panel/category-badge";
import { getTagDefinition } from "@/lib/data/tags";
import { getConceptsByTag } from "@/lib/data/concepts";

interface ExplanationProps {
  concept: Concept;
  category: Category | null;
  onNavigateConcept?: (id: string) => void;
}

export default function Explanation({
  concept,
  category,
  onNavigateConcept,
}: ExplanationProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      transition={{ staggerChildren: stagger.default }}
      className="flex flex-col gap-3"
    >
      <motion.h2
        variants={fadeSlide}
        transition={springs.reveal}
        className="text-2xl font-bold tracking-tight text-text-primary text-balance"
      >
        {concept.title}
      </motion.h2>
      {category ? (
        <CategoryBadge category={category} />
      ) : (
        <motion.span
          variants={fadeSlide}
          transition={springs.reveal}
          className="inline-flex w-fit items-center rounded-full bg-surface-2 px-2 py-0.5 text-xs uppercase tracking-wider font-medium text-text-tertiary"
        >
          {concept.category}
        </motion.span>
      )}
      <motion.div variants={fadeSlide} transition={springs.reveal}>
        <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">
          In plain English
        </h3>
        <p className="leading-relaxed text-text-secondary text-pretty">
          {concept.intuitiveDescription}
        </p>
      </motion.div>
      <motion.div variants={fadeSlide} transition={springs.reveal}>
        <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">
          Technical
        </h3>
        <p className="leading-relaxed text-text-secondary text-pretty">
          {concept.description}
        </p>
      </motion.div>
      <motion.div variants={fadeSlide} transition={springs.reveal} className="mt-1">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">
          Related topics
        </h3>
        <ul className="space-y-2">
          {concept.tags.map((tag) => {
            const definition = getTagDefinition(tag);
            const related = onNavigateConcept
              ? getConceptsByTag(tag).filter((c) => c.id !== concept.id)
              : [];

            return (
              <li key={tag} className="text-sm leading-relaxed">
                <span className="font-medium text-text-primary">
                  {definition?.label ?? tag}
                </span>
                {definition && (
                  <span className="text-text-secondary">
                    {" — "}
                    {definition.description}
                  </span>
                )}
                {related.length > 0 && (
                  <span className="text-text-secondary">
                    {" See also: "}
                    {related.map((c, i) => (
                      <span key={c.id}>
                        {i > 0 && ", "}
                        <button
                          className="cursor-pointer text-accent-text hover:underline"
                          onClick={() => onNavigateConcept!(c.id)}
                        >
                          {c.title}
                        </button>
                      </span>
                    ))}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </motion.div>
    </motion.div>
  );
}
