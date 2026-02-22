"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { VisualizationProps } from "@/lib/types";
import QueueBox from "../primitives/queue-box";
import Label from "../primitives/label";

export default function LongTasksApi({
  isPlaying,
  onTimelineReady,
  reducedMotion,
}: VisualizationProps) {
  const containerRef = useRef<SVGSVGElement>(null);

  // Structural refs
  const timelineAxisRef = useRef<SVGLineElement>(null);
  const thresholdLineRef = useRef<SVGGElement>(null);

  // Task bar refs (below-threshold portion: gray)
  const bar1Ref = useRef<SVGRectElement>(null);
  const bar2Ref = useRef<SVGRectElement>(null);
  const bar3BelowRef = useRef<SVGRectElement>(null);
  const bar4BelowRef = useRef<SVGRectElement>(null);

  // Task bar refs (above-threshold portion: red, only for long tasks)
  const bar3AboveRef = useRef<SVGRectElement>(null);
  const bar4AboveRef = useRef<SVGRectElement>(null);

  // Duration labels below bars
  const dur1Ref = useRef<SVGTextElement>(null);
  const dur2Ref = useRef<SVGTextElement>(null);
  const dur3Ref = useRef<SVGTextElement>(null);
  const dur4Ref = useRef<SVGTextElement>(null);

  // Status labels above bars
  const ok1Ref = useRef<SVGTextElement>(null);
  const ok2Ref = useRef<SVGTextElement>(null);
  const long3Ref = useRef<SVGTextElement>(null);
  const long4Ref = useRef<SVGTextElement>(null);

  // Observer box
  const observerBoxRef = useRef<SVGGElement>(null);
  const observerRectRef = useRef<SVGRectElement>(null);
  const observerTextRef = useRef<SVGTextElement>(null);

  // Callout arrows
  const arrow1Ref = useRef<SVGLineElement>(null);
  const arrow2Ref = useRef<SVGLineElement>(null);

  // TBT calculation
  const tbtLine1Ref = useRef<SVGGElement>(null);
  const tbtLine2Ref = useRef<SVGGElement>(null);
  const tbtSumRef = useRef<SVGGElement>(null);

  // Main thread label
  const mainThreadRef = useRef<SVGGElement>(null);

  // Timeline labels
  const timeLabelsRef = useRef<SVGGElement>(null);

  // Layout constants
  const baseline = 290;
  const thresholdY = 170;
  // Bar heights: bar1=60 (20ms), bar2=40 (15ms), bar3=160 (80ms), bar4=180 (90ms)
  // Scale: ~2px per ms. Threshold at 50ms = 100px above baseline
  // thresholdY = baseline - 100 = 190... but we use 170 to give more visual space
  // Below-threshold height for long bars = baseline - thresholdY = 120
  const bar3Total = 160;
  const bar3Below = baseline - thresholdY; // 120
  const bar3Above = bar3Total - bar3Below; // 40
  const bar4Total = 180;
  const bar4Below = baseline - thresholdY; // 120
  const bar4Above = bar4Total - bar4Below; // 60

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current) return;

      const tl = gsap.timeline({
        paused: true,
        repeat: -1,
        repeatDelay: 1,
      });

      // 1. (0s) "Main Thread" label fades in + timeline axis draws in
      tl.fromTo(
        mainThreadRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        0
      );
      tl.fromTo(
        timelineAxisRef.current,
        { attr: { x2: 40 } },
        { attr: { x2: 560 }, duration: 0.5, ease: "power2.out" },
        0
      );

      // 2. (0.5s) Time labels appear along baseline
      tl.fromTo(
        timeLabelsRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        0.5
      );

      // 3. (0.7s) Threshold dashed line + label fade in
      tl.fromTo(
        thresholdLineRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        0.7
      );

      // 4. (1.2s) First task bar rises (short, height=60, 20ms)
      tl.fromTo(
        bar1Ref.current,
        { attr: { height: 0, y: baseline } },
        {
          attr: { height: 60, y: baseline - 60 },
          duration: 0.4,
          ease: "power3.out",
        },
        1.2
      );
      // Duration label appears
      tl.fromTo(
        dur1Ref.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" },
        1.6
      );
      // Green "OK" label
      tl.fromTo(
        ok1Ref.current,
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
        1.7
      );

      // 5. (2s) Second task bar rises (short, height=40, 15ms)
      tl.fromTo(
        bar2Ref.current,
        { attr: { height: 0, y: baseline } },
        {
          attr: { height: 40, y: baseline - 40 },
          duration: 0.4,
          ease: "power3.out",
        },
        2
      );
      tl.fromTo(
        dur2Ref.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" },
        2.4
      );
      tl.fromTo(
        ok2Ref.current,
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
        2.5
      );

      // 6. (2.8s) Third task bar rises — below-threshold portion first (gray)
      tl.fromTo(
        bar3BelowRef.current,
        { attr: { height: 0, y: baseline } },
        {
          attr: { height: bar3Below, y: thresholdY },
          duration: 0.35,
          ease: "power3.out",
        },
        2.8
      );

      // 7. (3.15s) Third task — above-threshold portion rises (red)
      tl.fromTo(
        bar3AboveRef.current,
        { attr: { height: 0, y: thresholdY } },
        {
          attr: { height: bar3Above, y: thresholdY - bar3Above },
          duration: 0.25,
          ease: "power3.out",
        },
        3.15
      );

      // 8. (3.4s) Red flash on above-threshold portion
      tl.to(
        bar3AboveRef.current,
        {
          opacity: 0.5,
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        },
        3.4
      );
      // Duration + "Long!" labels
      tl.fromTo(
        dur3Ref.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" },
        3.5
      );
      tl.fromTo(
        long3Ref.current,
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
        3.6
      );

      // 9. (3.8s) Fourth task bar rises — below-threshold portion (gray)
      tl.fromTo(
        bar4BelowRef.current,
        { attr: { height: 0, y: baseline } },
        {
          attr: { height: bar4Below, y: thresholdY },
          duration: 0.35,
          ease: "power3.out",
        },
        3.8
      );

      // 10. (4.15s) Fourth task — above-threshold portion rises (red)
      tl.fromTo(
        bar4AboveRef.current,
        { attr: { height: 0, y: thresholdY } },
        {
          attr: { height: bar4Above, y: thresholdY - bar4Above },
          duration: 0.25,
          ease: "power3.out",
        },
        4.15
      );

      // 11. (4.4s) Red flash
      tl.to(
        bar4AboveRef.current,
        {
          opacity: 0.5,
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        },
        4.4
      );
      tl.fromTo(
        dur4Ref.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" },
        4.5
      );
      tl.fromTo(
        long4Ref.current,
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
        4.6
      );

      // 12. (5s) Observer box highlights — rect stroke turns blue
      tl.to(
        observerRectRef.current,
        {
          attr: { stroke: "#2563eb", strokeWidth: 2 },
          duration: 0.3,
          ease: "power2.out",
        },
        5
      );
      tl.fromTo(
        observerTextRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        5
      );

      // 13. (5.5s) Callout arrows from observer to the long task bars
      tl.fromTo(
        arrow1Ref.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        5.5
      );
      tl.fromTo(
        arrow2Ref.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        5.5
      );

      // 14. (6s) TBT calculation — show red portions being summed
      // "30ms" above bar3's red portion
      tl.fromTo(
        tbtLine1Ref.current,
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        6
      );
      // "40ms" above bar4's red portion
      tl.fromTo(
        tbtLine2Ref.current,
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        6.3
      );

      // 15. (6.8s) TBT sum appears
      tl.fromTo(
        tbtSumRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        6.8
      );

      // 16. (8s) Fade all animated elements for reset
      const allRefs = [
        mainThreadRef,
        timeLabelsRef,
        thresholdLineRef,
        bar1Ref,
        bar2Ref,
        bar3BelowRef,
        bar3AboveRef,
        bar4BelowRef,
        bar4AboveRef,
        dur1Ref,
        dur2Ref,
        dur3Ref,
        dur4Ref,
        ok1Ref,
        ok2Ref,
        long3Ref,
        long4Ref,
        observerTextRef,
        arrow1Ref,
        arrow2Ref,
        tbtLine1Ref,
        tbtLine2Ref,
        tbtSumRef,
      ];

      allRefs.forEach((ref, i) => {
        tl.to(
          ref.current,
          {
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
          },
          8 + i * 0.02
        );
      });

      // Reset observer rect stroke
      tl.to(
        observerRectRef.current,
        {
          attr: { stroke: "#52525b", strokeWidth: 1.5 },
          duration: 0.3,
          ease: "power2.inOut",
        },
        8
      );

      // Fade axis last
      tl.to(
        timelineAxisRef.current,
        { opacity: 0, duration: 0.4, ease: "power2.inOut" },
        8.3
      );

      onTimelineReady(tl);
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  if (reducedMotion) {
    return (
      <svg
        ref={containerRef}
        viewBox="0 0 600 400"
        fontFamily="var(--font-geist-mono)"
      >
        {/* Main thread label */}
        <Label x={45} y={24} text="Main Thread" size="md" color="#fafafa" />
        <Label x={45} y={38} text="Task execution over time" size="sm" />

        {/* Timeline axis */}
        <line
          x1={40}
          y1={baseline}
          x2={560}
          y2={baseline}
          stroke="#52525b"
          strokeWidth={1}
        />
        <Label x={40} y={baseline + 16} text="0ms" size="sm" />
        <Label x={540} y={baseline + 16} text="time" size="sm" />

        {/* Threshold line */}
        <line
          x1={40}
          y1={thresholdY}
          x2={560}
          y2={thresholdY}
          stroke="#ef4444"
          strokeWidth={1}
          strokeDasharray="6 4"
        />
        <Label
          x={565}
          y={thresholdY + 4}
          text="50ms threshold"
          size="sm"
          color="#ef4444"
        />

        {/* Task bar 1 — short, 20ms (gray, fully below threshold) */}
        <rect
          x={100}
          y={baseline - 60}
          width={55}
          height={60}
          rx={3}
          fill="#3f3f46"
        />
        <Label
          x={127}
          y={baseline + 16}
          text="20ms"
          size="sm"
          anchor="middle"
        />
        <Label
          x={127}
          y={baseline - 66}
          text="OK"
          size="sm"
          color="#22c55e"
          anchor="middle"
        />

        {/* Task bar 2 — short, 15ms (gray, fully below threshold) */}
        <rect
          x={195}
          y={baseline - 40}
          width={55}
          height={40}
          rx={3}
          fill="#3f3f46"
        />
        <Label
          x={222}
          y={baseline + 16}
          text="15ms"
          size="sm"
          anchor="middle"
        />
        <Label
          x={222}
          y={baseline - 46}
          text="OK"
          size="sm"
          color="#22c55e"
          anchor="middle"
        />

        {/* Task bar 3 — long, 80ms (gray below + red above threshold) */}
        <rect
          x={310}
          y={thresholdY}
          width={55}
          height={bar3Below}
          rx={0}
          fill="#3f3f46"
        />
        <rect
          x={310}
          y={thresholdY - bar3Above}
          width={55}
          height={bar3Above}
          rx={3}
          fill="#ef4444"
          opacity={0.85}
        />
        <Label
          x={337}
          y={baseline + 16}
          text="80ms"
          size="sm"
          anchor="middle"
          color="#ef4444"
        />
        <Label
          x={337}
          y={thresholdY - bar3Above - 6}
          text="Long!"
          size="sm"
          color="#ef4444"
          anchor="middle"
        />
        {/* Annotation: excess above threshold */}
        <Label
          x={370}
          y={thresholdY - bar3Above / 2 + 3}
          text="30ms"
          size="sm"
          color="#fbbf24"
        />

        {/* Task bar 4 — long, 90ms (gray below + red above threshold) */}
        <rect
          x={420}
          y={thresholdY}
          width={55}
          height={bar4Below}
          rx={0}
          fill="#3f3f46"
        />
        <rect
          x={420}
          y={thresholdY - bar4Above}
          width={55}
          height={bar4Above}
          rx={3}
          fill="#ef4444"
          opacity={0.85}
        />
        <Label
          x={447}
          y={baseline + 16}
          text="90ms"
          size="sm"
          anchor="middle"
          color="#ef4444"
        />
        <Label
          x={447}
          y={thresholdY - bar4Above - 6}
          text="Long!"
          size="sm"
          color="#ef4444"
          anchor="middle"
        />
        <Label
          x={480}
          y={thresholdY - bar4Above / 2 + 3}
          text="40ms"
          size="sm"
          color="#fbbf24"
        />

        {/* Observer box */}
        <QueueBox
          x={40}
          y={320}
          width={520}
          height={44}
          label="PerformanceObserver"
          stroke="#2563eb"
        />
        <Label
          x={300}
          y={352}
          text="Detected 2 long tasks (>50ms)"
          size="sm"
          color="#fafafa"
          anchor="middle"
        />

        {/* Callout arrows from observer to long task bars */}
        <line
          x1={250}
          y1={320}
          x2={337}
          y2={baseline - bar3Total + 10}
          stroke="#2563eb"
          strokeWidth={1}
          strokeDasharray="4 3"
        />
        <line
          x1={350}
          y1={320}
          x2={447}
          y2={baseline - bar4Total + 10}
          stroke="#2563eb"
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        {/* TBT calculation */}
        <Label
          x={45}
          y={thresholdY - 20}
          text="TBT = 30ms + 40ms = 70ms"
          size="md"
          color="#fbbf24"
        />
        <Label
          x={45}
          y={thresholdY - 6}
          text="Sum of time above 50ms threshold"
          size="sm"
          color="#a1a1aa"
        />
      </svg>
    );
  }

  return (
    <svg
      ref={containerRef}
      viewBox="0 0 600 400"
      fontFamily="var(--font-geist-mono)"
    >
      {/* Main thread label */}
      <g ref={mainThreadRef} opacity={0}>
        <Label x={45} y={24} text="Main Thread" size="md" color="#fafafa" />
      </g>

      {/* Timeline axis */}
      <line
        ref={timelineAxisRef}
        x1={40}
        y1={baseline}
        x2={40}
        y2={baseline}
        stroke="#52525b"
        strokeWidth={1}
      />

      {/* Time labels along baseline */}
      <g ref={timeLabelsRef} opacity={0}>
        <Label x={40} y={baseline + 16} text="0ms" size="sm" />
        <Label x={540} y={baseline + 16} text="time" size="sm" />
      </g>

      {/* Threshold line + label */}
      <g ref={thresholdLineRef} opacity={0}>
        <line
          x1={40}
          y1={thresholdY}
          x2={560}
          y2={thresholdY}
          stroke="#ef4444"
          strokeWidth={1}
          strokeDasharray="6 4"
        />
        <Label
          x={565}
          y={thresholdY + 4}
          text="50ms threshold"
          size="sm"
          color="#ef4444"
        />
      </g>

      {/* Task bar 1 (short, height=60, 20ms) — fully gray */}
      <rect
        ref={bar1Ref}
        x={100}
        y={baseline}
        width={55}
        height={0}
        rx={3}
        fill="#3f3f46"
      />
      <text
        ref={dur1Ref}
        x={127}
        y={baseline + 16}
        textAnchor="middle"
        fontSize={10}
        fill="#a1a1aa"
        fontFamily="var(--font-geist-mono)"
        opacity={0}
      >
        20ms
      </text>
      <text
        ref={ok1Ref}
        x={127}
        y={baseline - 66}
        textAnchor="middle"
        fontSize={10}
        fill="#22c55e"
        fontFamily="var(--font-geist-mono)"
        opacity={0}
      >
        OK
      </text>

      {/* Task bar 2 (short, height=40, 15ms) — fully gray */}
      <rect
        ref={bar2Ref}
        x={195}
        y={baseline}
        width={55}
        height={0}
        rx={3}
        fill="#3f3f46"
      />
      <text
        ref={dur2Ref}
        x={222}
        y={baseline + 16}
        textAnchor="middle"
        fontSize={10}
        fill="#a1a1aa"
        fontFamily="var(--font-geist-mono)"
        opacity={0}
      >
        15ms
      </text>
      <text
        ref={ok2Ref}
        x={222}
        y={baseline - 46}
        textAnchor="middle"
        fontSize={10}
        fill="#22c55e"
        fontFamily="var(--font-geist-mono)"
        opacity={0}
      >
        OK
      </text>

      {/* Task bar 3 (long, 80ms) — gray below threshold */}
      <rect
        ref={bar3BelowRef}
        x={310}
        y={baseline}
        width={55}
        height={0}
        fill="#3f3f46"
      />
      {/* Task bar 3 — red above threshold */}
      <rect
        ref={bar3AboveRef}
        x={310}
        y={thresholdY}
        width={55}
        height={0}
        rx={3}
        fill="#ef4444"
        opacity={0.85}
      />
      <text
        ref={dur3Ref}
        x={337}
        y={baseline + 16}
        textAnchor="middle"
        fontSize={10}
        fill="#ef4444"
        fontFamily="var(--font-geist-mono)"
        opacity={0}
      >
        80ms
      </text>
      <text
        ref={long3Ref}
        x={337}
        y={thresholdY - bar3Above - 6}
        textAnchor="middle"
        fontSize={10}
        fill="#ef4444"
        fontFamily="var(--font-geist-mono)"
        opacity={0}
      >
        Long!
      </text>

      {/* Task bar 4 (long, 90ms) — gray below threshold */}
      <rect
        ref={bar4BelowRef}
        x={420}
        y={baseline}
        width={55}
        height={0}
        fill="#3f3f46"
      />
      {/* Task bar 4 — red above threshold */}
      <rect
        ref={bar4AboveRef}
        x={420}
        y={thresholdY}
        width={55}
        height={0}
        rx={3}
        fill="#ef4444"
        opacity={0.85}
      />
      <text
        ref={dur4Ref}
        x={447}
        y={baseline + 16}
        textAnchor="middle"
        fontSize={10}
        fill="#ef4444"
        fontFamily="var(--font-geist-mono)"
        opacity={0}
      >
        90ms
      </text>
      <text
        ref={long4Ref}
        x={447}
        y={thresholdY - bar4Above - 6}
        textAnchor="middle"
        fontSize={10}
        fill="#ef4444"
        fontFamily="var(--font-geist-mono)"
        opacity={0}
      >
        Long!
      </text>

      {/* Observer box — uses QueueBox primitive */}
      <QueueBox
        ref={observerBoxRef}
        x={40}
        y={320}
        width={520}
        height={44}
        label="PerformanceObserver"
      />
      <rect
        ref={observerRectRef}
        x={40}
        y={320}
        width={520}
        height={44}
        rx={6}
        fill="transparent"
        stroke="#52525b"
        strokeWidth={1.5}
      />
      <text
        ref={observerTextRef}
        x={300}
        y={352}
        textAnchor="middle"
        fontSize={10}
        fill="#fafafa"
        fontFamily="var(--font-geist-mono)"
        opacity={0}
      >
        Detected 2 long tasks (&gt;50ms)
      </text>

      {/* Callout arrows from observer to long task bars */}
      <line
        ref={arrow1Ref}
        x1={250}
        y1={320}
        x2={337}
        y2={baseline - bar3Total + 10}
        stroke="#2563eb"
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0}
      />
      <line
        ref={arrow2Ref}
        x1={350}
        y1={320}
        x2={447}
        y2={baseline - bar4Total + 10}
        stroke="#2563eb"
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0}
      />

      {/* TBT calculation — excess time labels next to red portions */}
      <g ref={tbtLine1Ref} opacity={0}>
        <Label
          x={370}
          y={thresholdY - bar3Above / 2 + 3}
          text="30ms"
          size="sm"
          color="#fbbf24"
        />
      </g>
      <g ref={tbtLine2Ref} opacity={0}>
        <Label
          x={480}
          y={thresholdY - bar4Above / 2 + 3}
          text="40ms"
          size="sm"
          color="#fbbf24"
        />
      </g>
      <g ref={tbtSumRef} opacity={0}>
        <Label
          x={45}
          y={thresholdY - 20}
          text="TBT = 30ms + 40ms = 70ms"
          size="md"
          color="#fbbf24"
        />
        <Label
          x={45}
          y={thresholdY - 6}
          text="Sum of time above 50ms threshold"
          size="sm"
        />
      </g>
    </svg>
  );
}
