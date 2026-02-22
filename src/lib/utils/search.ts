import type { Concept } from "@/lib/types";

export function filterConcepts(concepts: Concept[], query: string): Concept[] {
  const q = query.toLowerCase().trim();
  if (!q) return concepts;

  return concepts.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
  );
}
