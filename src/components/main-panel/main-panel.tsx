"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Concept } from "@/lib/types";
import { springs, fadeSlideBlur } from "@/lib/motion";
import LandingHero from "@/components/main-panel/landing-hero";
import ConceptDetail from "@/components/main-panel/concept-detail";

interface MainPanelProps {
  concept: Concept | null;
  onToggleSidebar: () => void;
  isCollapsed: boolean;
  onNavigateConcept?: (id: string) => void;
}

export default function MainPanel({
  concept,
  onToggleSidebar,
  isCollapsed,
  onNavigateConcept,
}: MainPanelProps) {
  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="flex h-12 shrink-0 items-center px-4">
        <button
          onClick={onToggleSidebar}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-surface-2 text-text-secondary hover:text-text-primary transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1.5"
              y="2.5"
              width="13"
              height="11"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.25"
            />
            <line
              x1="5.5"
              y1="2.5"
              x2="5.5"
              y2="13.5"
              stroke="currentColor"
              strokeWidth="1.25"
            />
          </svg>
        </button>
      </div>
      <div className="min-h-0 flex-1">
        <AnimatePresence mode="wait">
          {concept ? (
            <motion.div
              key={concept.id}
              variants={fadeSlideBlur}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={springs.reveal}
              className="h-full"
            >
              <ConceptDetail
                concept={concept}
                onNavigateConcept={onNavigateConcept}
              />
            </motion.div>
          ) : (
            <motion.div
              key="landing"
              variants={fadeSlideBlur}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={springs.reveal}
              className="h-full"
            >
              <LandingHero />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
