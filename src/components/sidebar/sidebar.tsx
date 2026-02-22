"use client";

import { useState } from "react";
import { LayoutGroup } from "motion/react";
import { categories } from "@/lib/data/categories";
import { concepts } from "@/lib/data/concepts";
import { filterConcepts } from "@/lib/utils/search";
import SearchInput from "@/components/sidebar/search-input";
import CategoryGroup from "@/components/sidebar/category-group";

interface SidebarProps {
  activeConceptId: string | null;
  onSelectConcept: (id: string) => void;
  onClearSelection: () => void;
  isCollapsed: boolean;
}

export default function Sidebar({
  activeConceptId,
  onSelectConcept,
  onClearSelection,
  isCollapsed,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = filterConcepts(concepts, searchQuery);
  const hasResults = filtered.length > 0;

  return (
    <aside
      className="flex h-dvh min-w-0 flex-col overflow-hidden bg-surface-1"
      style={{
        boxShadow: "inset -1px 0 0 0 var(--color-surface-2)",
      }}
      aria-hidden={isCollapsed}
      tabIndex={isCollapsed ? -1 : undefined}
    >
      <div className="flex flex-col gap-4 p-4">
        <button
          onClick={onClearSelection}
          className="cursor-pointer text-left font-mono text-lg font-bold tracking-tight text-text-primary transition-colors hover:text-accent-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset rounded"
        >
          FE Almanac
        </button>
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>
      <nav aria-label="Concept navigation" className="flex-1 overflow-y-auto px-1">
        <LayoutGroup>
          {categories.map((category) => {
            const categoryConcepts = filtered.filter(
              (c) => c.category === category.id
            );
            if (categoryConcepts.length === 0) return null;
            return (
              <CategoryGroup
                key={category.id}
                category={category}
                concepts={categoryConcepts}
                activeConceptId={activeConceptId}
                onSelectConcept={onSelectConcept}
              />
            );
          })}
        </LayoutGroup>
        {!hasResults && searchQuery && (
          <p className="px-3 py-8 text-center text-sm text-text-tertiary">
            No concepts match &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </nav>
    </aside>
  );
}
