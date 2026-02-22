"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { VisualizationProps } from "@/lib/types";
import QueueBox from "../primitives/queue-box";
import Label from "../primitives/label";

export default function EventLoop({
  isPlaying,
  onTimelineReady,
  reducedMotion,
}: VisualizationProps) {
  const containerRef = useRef<SVGSVGElement>(null);

  const task1Ref = useRef<SVGGElement>(null);
  const task2Ref = useRef<SVGGElement>(null);
  const microtask1Ref = useRef<SVGGElement>(null);
  const rafRef = useRef<SVGGElement>(null);
  const eventLoopRef = useRef<SVGCircleElement>(null);
  const renderRef = useRef<SVGRectElement>(null);
  const styleRef = useRef<SVGGElement>(null);
  const layoutRef = useRef<SVGGElement>(null);
  const paintRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current) return;

      const tl = gsap.timeline({
        paused: true,
        repeat: -1,
        repeatDelay: 1,
      });

      // 1. (0s) Task slides into Task Queue
      tl.fromTo(
        task1Ref.current,
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        0
      );

      // 2. (0.8s) Event loop pulses blue
      tl.to(
        eventLoopRef.current,
        {
          fill: "#2563eb",
          scale: 1.15,
          transformOrigin: "center center",
          duration: 0.3,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        },
        0.8
      );

      // 3. (1.2s) Task moves to Call Stack
      tl.to(
        task1Ref.current,
        { x: -330, y: -140, duration: 0.8, ease: "power3.inOut" },
        1.2
      );

      // 4. (2s) Task executes (flash)
      tl.to(
        task1Ref.current,
        {
          opacity: 0.4,
          duration: 0.2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 3,
        },
        2
      );

      // 5. (2.5s) Task spawns a microtask AND a rAF callback
      tl.fromTo(
        microtask1Ref.current,
        { x: -320, y: -100, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
        2.5
      );
      tl.fromTo(
        rafRef.current,
        { x: -320, y: -200, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
        2.7
      );

      // Task fades out
      tl.to(
        task1Ref.current,
        { opacity: 0, duration: 0.3, ease: "power2.out" },
        2.8
      );

      // 6. (3.5s) Event loop pulses — drains microtask queue first
      tl.to(
        eventLoopRef.current,
        {
          fill: "#2563eb",
          scale: 1.15,
          transformOrigin: "center center",
          duration: 0.3,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        },
        3.5
      );

      // 7. (4s) Microtask moves to Call Stack, executes, fades
      tl.to(
        microtask1Ref.current,
        { x: -330, y: 60, duration: 0.7, ease: "power3.inOut" },
        4
      );
      tl.to(
        microtask1Ref.current,
        {
          opacity: 0.4,
          duration: 0.15,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 3,
        },
        4.7
      );
      tl.to(
        microtask1Ref.current,
        { opacity: 0, duration: 0.3, ease: "power2.out" },
        5.3
      );

      // 8. (5.5s) Render phase begins — box glows green
      tl.to(
        renderRef.current,
        {
          stroke: "#22c55e",
          strokeWidth: 2.5,
          duration: 0.3,
          ease: "power2.inOut",
        },
        5.5
      );

      // 9. (5.8s) rAF callback moves into render box, executes, fades
      tl.to(
        rafRef.current,
        { x: -10, y: 220, duration: 0.6, ease: "power3.inOut" },
        5.8
      );
      tl.to(
        rafRef.current,
        {
          opacity: 0.4,
          duration: 0.15,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 2,
        },
        6.4
      );
      tl.to(
        rafRef.current,
        { opacity: 0, duration: 0.3, ease: "power2.out" },
        6.7
      );

      // 10. (6.5s) Style → Layout → Paint sub-steps light up sequentially
      tl.to(
        styleRef.current,
        { opacity: 1, duration: 0.25, ease: "power2.out" },
        6.5
      );
      tl.to(
        styleRef.current,
        { opacity: 0, duration: 0.25, ease: "power2.out" },
        7.0
      );
      tl.to(
        layoutRef.current,
        { opacity: 1, duration: 0.25, ease: "power2.out" },
        7.0
      );
      tl.to(
        layoutRef.current,
        { opacity: 0, duration: 0.25, ease: "power2.out" },
        7.5
      );
      tl.to(
        paintRef.current,
        { opacity: 1, duration: 0.25, ease: "power2.out" },
        7.5
      );
      tl.to(
        paintRef.current,
        { opacity: 0, duration: 0.25, ease: "power2.out" },
        8.0
      );

      // 11. (8s) Render box resets
      tl.to(
        renderRef.current,
        {
          stroke: "#52525b",
          strokeWidth: 1.5,
          fill: "#27272a",
          duration: 0.3,
          ease: "power2.out",
        },
        8.0
      );

      // 12. (8.5s) New task appears — cycle continues
      tl.fromTo(
        task2Ref.current,
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        8.5
      );

      // 13. (9.5s) Fade for loop restart
      tl.to(
        task2Ref.current,
        { opacity: 0, duration: 0.5, ease: "power2.inOut" },
        9.5
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
        <QueueBox x={30} y={40} width={120} height={200} label="Call Stack" />
        <QueueBox x={30} y={260} width={120} height={100} label="Web APIs" />
        <QueueBox
          x={350}
          y={40}
          width={220}
          height={80}
          label="Microtask Queue"
        />
        <QueueBox
          x={350}
          y={140}
          width={220}
          height={40}
          label="rAF Queue"
        />
        <QueueBox
          x={350}
          y={200}
          width={220}
          height={80}
          label="Task Queue"
        />
        <circle cx={270} cy={200} r={35} fill="#18181b" stroke="#2563eb" strokeWidth={2} />
        <text x={270} y={196} textAnchor="middle" fontSize={9} fill="#a1a1aa" fontFamily="var(--font-geist-mono)">Event</text>
        <text x={270} y={208} textAnchor="middle" fontSize={9} fill="#a1a1aa" fontFamily="var(--font-geist-mono)">Loop</text>
        <rect x={350} y={300} width={220} height={60} rx={6} fill="#27272a" stroke="#22c55e" strokeWidth={2} />
        <Label x={460} y={336} text="Render" size="sm" anchor="middle" />
        {/* Static items */}
        <rect x={370} y={220} width={40} height={20} rx={3} fill="#2563eb" />
        <text x={390} y={234} textAnchor="middle" fontSize={8} fill="#fafafa" fontFamily="var(--font-geist-mono)">task</text>
        <rect x={370} y={58} width={40} height={20} rx={3} fill="#fbbf24" />
        <text x={390} y={72} textAnchor="middle" fontSize={8} fill="#09090b" fontFamily="var(--font-geist-mono)">μtask</text>
        <rect x={370} y={155} width={40} height={16} rx={3} fill="#22c55e" />
        <text x={390} y={167} textAnchor="middle" fontSize={7} fill="#09090b" fontFamily="var(--font-geist-mono)">rAF</text>
        {/* Render sub-steps */}
        <rect x={370} y={310} width={50} height={16} rx={2} fill="#22c55e" opacity={0.5} />
        <text x={395} y={321} textAnchor="middle" fontSize={7} fill="#09090b" fontFamily="var(--font-geist-mono)">Style</text>
        <rect x={430} y={310} width={50} height={16} rx={2} fill="#22c55e" opacity={0.5} />
        <text x={455} y={321} textAnchor="middle" fontSize={7} fill="#09090b" fontFamily="var(--font-geist-mono)">Layout</text>
        <rect x={490} y={310} width={50} height={16} rx={2} fill="#22c55e" opacity={0.5} />
        <text x={515} y={321} textAnchor="middle" fontSize={7} fill="#09090b" fontFamily="var(--font-geist-mono)">Paint</text>
        {/* Annotations */}
        <Label x={355} y={130} text="← Higher priority" size="sm" color="#fbbf24" />
        <Label x={355} y={298} text="← Waits for microtasks" size="sm" color="#a1a1aa" />
      </svg>
    );
  }

  return (
    <svg
      ref={containerRef}
      viewBox="0 0 600 400"
      fontFamily="var(--font-geist-mono)"
    >
      {/* Structural boxes */}
      <QueueBox x={30} y={40} width={120} height={200} label="Call Stack" />
      <QueueBox x={30} y={260} width={120} height={100} label="Web APIs" />
      <QueueBox
        x={350}
        y={40}
        width={220}
        height={80}
        label="Microtask Queue"
      />
      <QueueBox
        x={350}
        y={140}
        width={220}
        height={40}
        label="rAF Queue"
      />
      <QueueBox
        x={350}
        y={200}
        width={220}
        height={80}
        label="Task Queue"
      />

      {/* Event Loop circle */}
      <circle
        ref={eventLoopRef}
        cx={270}
        cy={200}
        r={35}
        fill="#18181b"
        stroke="#52525b"
        strokeWidth={2}
      />
      <text x={270} y={196} textAnchor="middle" fontSize={9} fill="#a1a1aa" fontFamily="var(--font-geist-mono)">Event</text>
      <text x={270} y={208} textAnchor="middle" fontSize={9} fill="#a1a1aa" fontFamily="var(--font-geist-mono)">Loop</text>

      {/* Render box */}
      <rect
        ref={renderRef}
        x={350}
        y={300}
        width={220}
        height={60}
        rx={6}
        fill="#27272a"
        stroke="#52525b"
        strokeWidth={1.5}
      />
      <Label x={460} y={322} text="Render" size="sm" anchor="middle" />

      {/* Render sub-step indicators inside render box */}
      <g ref={styleRef} opacity={0}>
        <rect x={370} y={334} width={50} height={16} rx={2} fill="#22c55e" />
        <text x={395} y={345} textAnchor="middle" fontSize={7} fill="#09090b" fontFamily="var(--font-geist-mono)">Style</text>
      </g>
      <g ref={layoutRef} opacity={0}>
        <rect x={430} y={334} width={50} height={16} rx={2} fill="#22c55e" />
        <text x={455} y={345} textAnchor="middle" fontSize={7} fill="#09090b" fontFamily="var(--font-geist-mono)">Layout</text>
      </g>
      <g ref={paintRef} opacity={0}>
        <rect x={490} y={334} width={50} height={16} rx={2} fill="#22c55e" />
        <text x={515} y={345} textAnchor="middle" fontSize={7} fill="#09090b" fontFamily="var(--font-geist-mono)">Paint</text>
      </g>

      {/* Task 1 (blue) — starts in Task Queue */}
      <g ref={task1Ref} opacity={0}>
        <rect x={370} y={220} width={40} height={20} rx={3} fill="#2563eb" />
        <text x={390} y={234} textAnchor="middle" fontSize={8} fill="#fafafa" fontFamily="var(--font-geist-mono)">task</text>
      </g>

      {/* Microtask 1 (amber) — starts in Microtask Queue */}
      <g ref={microtask1Ref} opacity={0}>
        <rect x={370} y={58} width={40} height={20} rx={3} fill="#fbbf24" />
        <text x={390} y={72} textAnchor="middle" fontSize={8} fill="#09090b" fontFamily="var(--font-geist-mono)">μtask</text>
      </g>

      {/* rAF callback (green) — starts in rAF Queue */}
      <g ref={rafRef} opacity={0}>
        <rect x={370} y={152} width={40} height={16} rx={3} fill="#22c55e" />
        <text x={390} y={164} textAnchor="middle" fontSize={7} fill="#09090b" fontFamily="var(--font-geist-mono)">rAF</text>
      </g>

      {/* Task 2 (blue) — new task at end */}
      <g ref={task2Ref} opacity={0}>
        <rect x={370} y={240} width={40} height={20} rx={3} fill="#2563eb" />
        <text x={390} y={254} textAnchor="middle" fontSize={8} fill="#fafafa" fontFamily="var(--font-geist-mono)">task</text>
      </g>
    </svg>
  );
}
