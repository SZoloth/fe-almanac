"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export function useVisualizationControls() {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const rafRef = useRef<number>(0);
  const autoPlayRef = useRef(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback(() => {
    const tl = timelineRef.current;
    if (tl) {
      setProgress(tl.progress());
      if (tl.isActive()) {
        rafRef.current = requestAnimationFrame(updateProgress);
      }
    }
  }, []);

  const onTimelineReady = useCallback(
    (tl: gsap.core.Timeline) => {
      timelineRef.current = tl;
      tl.eventCallback("onStart", () => {
        setIsPlaying(true);
        rafRef.current = requestAnimationFrame(updateProgress);
      });
      tl.eventCallback("onComplete", () => {
        setIsPlaying(false);
        setProgress(1);
      });
      tl.eventCallback("onUpdate", () => {
        setProgress(tl.progress());
      });

      // Auto-play new timelines immediately when registered
      if (autoPlayRef.current) {
        tl.restart();
        setIsPlaying(true);
      }
    },
    [updateProgress]
  );

  const play = useCallback(() => {
    autoPlayRef.current = true;
    const tl = timelineRef.current;
    if (!tl) return;
    if (tl.progress() >= 1) tl.restart();
    else tl.play();
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    autoPlayRef.current = false;
    timelineRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const restart = useCallback(() => {
    autoPlayRef.current = true;
    timelineRef.current?.restart();
    setIsPlaying(true);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return { isPlaying, progress, play, pause, restart, onTimelineReady };
}
