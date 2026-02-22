import type { ComponentType } from "react";

export interface Concept {
  id: string;
  title: string;
  category: string;
  description: string;
  intuitiveDescription: string;
  tags: string[];
  visualization: ComponentType<VisualizationProps>;
  brokenVisualization?: ComponentType<VisualizationProps>;
  brokenLabel?: string;
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  conceptIds: string[];
}

export interface TagDefinition {
  id: string;
  label: string;
  description: string;
}

export type VizMode = "working" | "broken";

export interface VisualizationProps {
  isPlaying: boolean;
  onTimelineReady: (timeline: gsap.core.Timeline) => void;
  reducedMotion: boolean;
}
