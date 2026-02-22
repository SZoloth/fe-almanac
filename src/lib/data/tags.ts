import type { TagDefinition } from "@/lib/types";

const tags: Record<string, TagDefinition> = {
  async: {
    id: "async",
    label: "Async",
    description:
      "Patterns for non-blocking code execution using promises, callbacks, and async/await.",
  },
  microtasks: {
    id: "microtasks",
    label: "Microtasks",
    description:
      "High-priority tasks like promise callbacks that run to completion before the browser yields to rendering or macrotasks.",
  },
  macrotasks: {
    id: "macrotasks",
    label: "Macrotasks",
    description:
      "Standard-priority tasks like setTimeout and I/O callbacks that the event loop processes one per cycle.",
  },
  rendering: {
    id: "rendering",
    label: "Rendering",
    description:
      "The browser's pipeline for computing styles, layout, and painting pixels to the screen each frame.",
  },
  performance: {
    id: "performance",
    label: "Performance",
    description:
      "Techniques and APIs for measuring, monitoring, and improving runtime speed and responsiveness.",
  },
  blocking: {
    id: "blocking",
    label: "Blocking",
    description:
      "Operations that monopolize the main thread and prevent other work from executing.",
  },
  scheduling: {
    id: "scheduling",
    label: "Scheduling",
    description:
      "Strategies for ordering and prioritizing work to maximize throughput and responsiveness.",
  },
  concurrency: {
    id: "concurrency",
    label: "Concurrency",
    description:
      "Managing multiple in-flight operations that share resources or compete for execution time.",
  },
  resources: {
    id: "resources",
    label: "Resources",
    description:
      "Shared state like locks, memory, or DOM nodes that concurrent tasks contend for access to.",
  },
  monitoring: {
    id: "monitoring",
    label: "Monitoring",
    description:
      "Observing runtime behavior through browser APIs to detect regressions and diagnose issues.",
  },
  "web-vitals": {
    id: "web-vitals",
    label: "Web Vitals",
    description:
      "Google's standardized metrics — LCP, INP, and CLS — for measuring real-world user experience.",
  },
  observer: {
    id: "observer",
    label: "Observer",
    description:
      "Browser APIs that asynchronously notify code when specific events or state changes occur.",
  },
};

export function getTagDefinition(id: string): TagDefinition | undefined {
  return tags[id];
}

export function getAllTags(): TagDefinition[] {
  return Object.values(tags);
}
