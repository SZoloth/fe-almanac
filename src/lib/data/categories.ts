import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "javascript-runtime",
    title: "JavaScript Runtime",
    icon: "\u26A1",
    description:
      "Core mechanisms that govern how JavaScript executes code, schedules work, and keeps the main thread responsive.",
    conceptIds: [
      "event-loop",
      "task-starvation",
      "priority-inversion",
      "long-tasks-api",
    ],
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
