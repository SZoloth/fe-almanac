import { lazy } from "react";
import type { Concept } from "@/lib/types";

export const concepts: Concept[] = [
  {
    id: "event-loop",
    title: "Event Loop",
    category: "javascript-runtime",
    description:
      "The event loop is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It continuously cycles through microtasks, macrotasks, and rendering steps to keep the main thread responsive.",
    intuitiveDescription:
      "Think of the event loop as a traffic cop at a busy intersection — it decides which cars (tasks) go next, always letting emergency vehicles (microtasks) through before regular traffic, and periodically letting pedestrians cross (rendering).",
    tags: ["async", "microtasks", "macrotasks", "rendering"],
    visualization: lazy(
      () => import("@/components/visualization/concepts/event-loop")
    ),
    brokenVisualization: lazy(
      () => import("@/components/visualization/concepts/event-loop-broken")
    ),
    brokenLabel: "Blocking operation",
  },
  {
    id: "task-starvation",
    title: "Task Starvation",
    category: "javascript-runtime",
    description:
      "Task starvation occurs when microtasks continuously schedule additional microtasks, creating an infinite microtask loop that prevents macrotasks from ever executing. This can freeze the UI and block timers, I/O callbacks, and rendering.",
    intuitiveDescription:
      "Imagine a hospital ER where 'urgent' patients keep arriving non-stop. The 'routine' patients in the waiting room never get seen because every time the doctor finishes one urgent case, another walks in — the routine patients starve for attention.",
    tags: ["microtasks", "macrotasks", "performance", "blocking"],
    visualization: lazy(
      () => import("@/components/visualization/concepts/task-starvation")
    ),
  },
  {
    id: "priority-inversion",
    title: "Priority Inversion",
    category: "javascript-runtime",
    description:
      "Priority inversion is a scheduling anomaly where a high-priority task is indirectly blocked by a low-priority task because a medium-priority task preempts the low-priority one while it holds a shared resource the high-priority task needs.",
    intuitiveDescription:
      "Picture a relay race where the fastest runner can't start because the slowest runner is still holding the baton, and a medium-speed runner keeps cutting in line on the track — the fastest runner is stuck waiting even though they should go first.",
    tags: ["scheduling", "concurrency", "blocking", "resources"],
    visualization: lazy(
      () => import("@/components/visualization/concepts/priority-inversion")
    ),
    brokenLabel: "Lock contention",
  },
  {
    id: "long-tasks-api",
    title: "Long Tasks API",
    category: "javascript-runtime",
    description:
      "The Long Tasks API uses PerformanceObserver to detect tasks that block the main thread for more than 50 milliseconds. It helps identify jank-causing operations and is a key input for metrics like Total Blocking Time and Interaction to Next Paint.",
    intuitiveDescription:
      "Like a speed camera on a highway — it doesn't prevent speeding, but it records every car going over 50mph (50ms), giving you evidence to find and fix the bottlenecks causing traffic jams.",
    tags: ["performance", "monitoring", "web-vitals", "observer"],
    visualization: lazy(
      () => import("@/components/visualization/concepts/long-tasks-api")
    ),
  },
];

export function getConceptById(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id);
}

export function getAllConcepts(): Concept[] {
  return concepts;
}

export function getConceptsByCategory(categoryId: string): Concept[] {
  return concepts.filter((c) => c.category === categoryId);
}

export function getConceptsByTag(tag: string): Concept[] {
  return concepts.filter((c) => c.tags.includes(tag));
}
