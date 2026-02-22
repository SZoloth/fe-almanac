"use client";

import { useEffect } from "react";
import { MotionConfig, motion } from "motion/react";
import { useConceptNavigation } from "@/lib/hooks/use-concept-navigation";
import { useSidebarCollapse } from "@/lib/hooks/use-sidebar-collapse";
import { getConceptById } from "@/lib/data/concepts";
import { springs } from "@/lib/motion";
import Sidebar from "@/components/sidebar/sidebar";
import MainPanel from "@/components/main-panel/main-panel";
import { Agentation } from "agentation";

export default function AppShell() {
  const { selectedConceptId, selectConcept, clearSelection } =
    useConceptNavigation();
  const { isCollapsed, toggle } = useSidebarCollapse();
  const concept = selectedConceptId
    ? getConceptById(selectedConceptId) ?? null
    : null;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "\\") {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="grid h-dvh bg-surface-0"
        initial={false}
        animate={{
          gridTemplateColumns: isCollapsed
            ? "0px minmax(0, 1fr)"
            : "280px minmax(0, 1fr)",
        }}
        transition={springs.gentle}
      >
        <Sidebar
          activeConceptId={selectedConceptId}
          onSelectConcept={selectConcept}
          onClearSelection={clearSelection}
          isCollapsed={isCollapsed}
        />
        <MainPanel
          concept={concept}
          isCollapsed={isCollapsed}
          onToggleSidebar={toggle}
          onNavigateConcept={selectConcept}
        />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </motion.div>
    </MotionConfig>
  );
}
