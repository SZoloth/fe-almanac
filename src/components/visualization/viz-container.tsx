"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import type { Concept, VizMode, VisualizationProps } from "@/lib/types";
import { useVisualizationControls } from "@/lib/hooks/use-visualization-controls";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import VizControls from "@/components/visualization/viz-controls";
import { GOLDEN_EASE, springs } from "@/lib/motion";

interface VizContainerProps {
  concept: Concept;
}

function VizSkeleton() {
  return (
    <div className="h-full w-full animate-pulse rounded-lg bg-surface-2" />
  );
}

// --- VizPane: a single visualization with its own timeline ---

interface VizPaneProps {
  component: ComponentType<VisualizationProps>;
  label: string;
  isActive: boolean;
  onActivate: () => void;
  accentColor: string;
  dotColor: string;
  reducedMotion: boolean;
  onPlayingChange: (playing: boolean) => void;
  onProgressChange: (progress: number) => void;
  controlRef: React.RefObject<VizPaneControls | null>;
}

interface VizPaneControls {
  play: () => void;
  pause: () => void;
  restart: () => void;
}

function VizPane({
  component: Visualization,
  label,
  isActive,
  onActivate,
  accentColor,
  dotColor,
  reducedMotion,
  onPlayingChange,
  onProgressChange,
  controlRef,
}: VizPaneProps) {
  const { isPlaying, progress, play, pause, restart, onTimelineReady } =
    useVisualizationControls();

  // Expose imperative controls to parent via mutable ref
  useEffect(() => {
    if (controlRef) {
      (controlRef as React.MutableRefObject<VizPaneControls | null>).current = { play, pause, restart };
    }
  }, [controlRef, play, pause, restart]);

  // Report state changes to parent (only when this pane is active)
  useEffect(() => {
    if (isActive) onPlayingChange(isPlaying);
  }, [isActive, isPlaying, onPlayingChange]);

  useEffect(() => {
    if (isActive) onProgressChange(progress);
  }, [isActive, progress, onProgressChange]);

  // Pause when becoming inactive
  useEffect(() => {
    if (!isActive && isPlaying) pause();
  }, [isActive, isPlaying, pause]);

  return (
    <button
      type="button"
      onClick={isActive ? undefined : onActivate}
      className={`relative flex-1 min-h-0 overflow-hidden rounded-lg border bg-surface-1 text-left ${
        isActive ? "" : "cursor-pointer opacity-50 hover:opacity-70"
      }`}
      style={{
        borderColor: isActive && isPlaying
          ? `color-mix(in srgb, ${accentColor} 20%, transparent)`
          : "var(--color-surface-2)",
        boxShadow: isActive && isPlaying
          ? `0 0 24px -8px color-mix(in srgb, ${accentColor} 20%, transparent)`
          : "none",
        transition: `border-color 200ms ${GOLDEN_EASE}, box-shadow 200ms ${GOLDEN_EASE}, opacity 200ms ${GOLDEN_EASE}`,
      }}
      aria-pressed={isActive}
      aria-label={`${label} visualization${isActive ? " (active)" : ""}`}
    >
      {/* Label */}
      <div className="absolute top-2 left-3 z-10 flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
        <span className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
          {label}
        </span>
      </div>

      {/* Play overlay on inactive pane */}
      {!isActive && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2/80 backdrop-blur-sm">
            <svg className="h-4 w-4 text-text-secondary ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          </div>
        </div>
      )}

      <div className="h-full [&_svg]:h-full [&_svg]:w-full">
        <Suspense fallback={<VizSkeleton />}>
          <Visualization
            isPlaying={isPlaying}
            onTimelineReady={onTimelineReady}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </div>
    </button>
  );
}

// --- VizContainer: orchestrates one or two panes ---

export default function VizContainer({ concept }: VizContainerProps) {
  const reducedMotion = useReducedMotion();
  const hasBrokenMode = !!concept.brokenVisualization;

  if (hasBrokenMode) {
    return (
      <DualVizContainer concept={concept} reducedMotion={reducedMotion} />
    );
  }

  return (
    <SingleVizContainer concept={concept} reducedMotion={reducedMotion} />
  );
}

// Single viz (no broken mode)
function SingleVizContainer({
  concept,
  reducedMotion,
}: {
  concept: Concept;
  reducedMotion: boolean;
}) {
  const { isPlaying, progress, play, pause, restart, onTimelineReady } =
    useVisualizationControls();

  return (
    <div className="flex h-full flex-col gap-2">
      <div
        className="flex-1 min-h-0 overflow-hidden rounded-lg border bg-surface-1 [&_svg]:h-full [&_svg]:w-full"
        style={{
          borderColor: isPlaying
            ? "color-mix(in srgb, var(--color-accent) 20%, transparent)"
            : "var(--color-surface-2)",
          boxShadow: isPlaying
            ? "0 0 24px -8px color-mix(in srgb, var(--color-accent) 20%, transparent)"
            : "none",
          transition: `border-color 200ms ${GOLDEN_EASE}, box-shadow 200ms ${GOLDEN_EASE}`,
        }}
      >
        <Suspense fallback={<VizSkeleton />}>
          <concept.visualization
            isPlaying={isPlaying}
            onTimelineReady={onTimelineReady}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </div>
      <div aria-live="polite" className="sr-only">
        {isPlaying ? "Animation playing" : "Animation paused"}
      </div>
      <VizControls
        isPlaying={isPlaying}
        progress={progress}
        onPlay={play}
        onPause={pause}
        onRestart={restart}
      />
    </div>
  );
}

// Dual viz (working + broken stacked)
function DualVizContainer({
  concept,
  reducedMotion,
}: {
  concept: Concept;
  reducedMotion: boolean;
}) {
  const [activeViz, setActiveViz] = useState<VizMode>("working");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const workingControlRef = useRef<VizPaneControls | null>(null);
  const brokenControlRef = useRef<VizPaneControls | null>(null);

  // Reset to working on concept change
  useEffect(() => {
    setActiveViz("working");
  }, [concept.id]);

  const activeControlRef = activeViz === "working" ? workingControlRef : brokenControlRef;

  const switchTo = useCallback(
    (mode: VizMode) => {
      if (mode === activeViz) return;
      // Pause the currently active pane
      const currentRef = activeViz === "working" ? workingControlRef : brokenControlRef;
      currentRef.current?.pause();
      setActiveViz(mode);
      // Play the new pane after a tick (so the pane gets isActive=true first)
      const nextRef = mode === "working" ? workingControlRef : brokenControlRef;
      requestAnimationFrame(() => nextRef.current?.restart());
    },
    [activeViz]
  );

  const handlePlayingChange = useCallback((playing: boolean) => {
    setIsPlaying(playing);
  }, []);

  const handleProgressChange = useCallback((p: number) => {
    setProgress(p);
  }, []);

  const play = useCallback(() => activeControlRef.current?.play(), [activeControlRef]);
  const pause = useCallback(() => activeControlRef.current?.pause(), [activeControlRef]);
  const restart = useCallback(() => activeControlRef.current?.restart(), [activeControlRef]);

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-1 min-h-0 flex-col gap-2">
        <VizPane
          component={concept.visualization}
          label="Working"
          isActive={activeViz === "working"}
          onActivate={() => switchTo("working")}
          accentColor="var(--color-accent)"
          dotColor="#22c55e"
          reducedMotion={reducedMotion}
          onPlayingChange={handlePlayingChange}
          onProgressChange={handleProgressChange}
          controlRef={workingControlRef}
        />
        {concept.brokenVisualization && (
          <VizPane
            component={concept.brokenVisualization}
            label={concept.brokenLabel ?? "Broken"}
            isActive={activeViz === "broken"}
            onActivate={() => switchTo("broken")}
            accentColor="var(--color-danger)"
            dotColor="#ef4444"
            reducedMotion={reducedMotion}
            onPlayingChange={handlePlayingChange}
            onProgressChange={handleProgressChange}
            controlRef={brokenControlRef}
          />
        )}
      </div>
      <div aria-live="polite" className="sr-only">
        {isPlaying ? "Animation playing" : "Animation paused"}
      </div>
      <VizControls
        isPlaying={isPlaying}
        progress={progress}
        onPlay={play}
        onPause={pause}
        onRestart={restart}
      />
    </div>
  );
}
