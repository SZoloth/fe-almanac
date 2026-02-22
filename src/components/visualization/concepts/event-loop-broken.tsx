"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { VisualizationProps } from "@/lib/types";
import QueueBox from "../primitives/queue-box";
import Label from "../primitives/label";

export default function EventLoopBroken({
  isPlaying,
  onTimelineReady,
  reducedMotion,
}: VisualizationProps) {
  const containerRef = useRef<SVGSVGElement>(null);

  // Element refs
  const blockingTaskRef = useRef<SVGGElement>(null);
  const eventLoopRef = useRef<SVGCircleElement>(null);
  const eventLoopLabelRef = useRef<SVGGElement>(null);
  const queuedTask1Ref = useRef<SVGGElement>(null);
  const queuedTask2Ref = useRef<SVGGElement>(null);
  const queuedTask3Ref = useRef<SVGGElement>(null);
  const microtask1Ref = useRef<SVGGElement>(null);
  const uiFrozenRef = useRef<SVGGElement>(null);
  const renderRef = useRef<SVGRectElement>(null);

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current) return;

      const tl = gsap.timeline({
        paused: true,
        repeat: -1,
        repeatDelay: 1,
      });

      // 1. (0s) Blocking task slides into Call Stack (red)
      tl.fromTo(
        blockingTaskRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        0
      );

      // 2. (0.5s) Call Stack item grows/pulses — shows it's executing
      tl.to(
        blockingTaskRef.current,
        {
          scale: 1.1,
          transformOrigin: "center center",
          duration: 0.4,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        },
        0.5
      );

      // 3. (1s) Event loop turns gray — it stops (can't continue)
      tl.to(
        eventLoopRef.current,
        {
          stroke: "#71717a",
          fill: "#27272a",
          duration: 0.5,
          ease: "power2.inOut",
        },
        1
      );

      // 4. (1.5s) Tasks pile up in Task Queue (can't be processed)
      tl.fromTo(
        queuedTask1Ref.current,
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        1.5
      );
      tl.fromTo(
        queuedTask2Ref.current,
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        1.8
      );
      tl.fromTo(
        queuedTask3Ref.current,
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        2.1
      );

      // 5. (2.5s) Microtask appears in Microtask Queue, also waiting
      tl.fromTo(
        microtask1Ref.current,
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        2.5
      );

      // 6. (3s) "UI Frozen" label fades in (red)
      tl.fromTo(
        uiFrozenRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        3
      );

      // 7. (3.5s) Render box gets red stroke/glow (can't render)
      tl.to(
        renderRef.current,
        {
          stroke: "#ef4444",
          strokeWidth: 2.5,
          duration: 0.4,
          ease: "power2.inOut",
        },
        3.5
      );

      // 8. (4.5s) Blocking task finally completes (fades out from call stack)
      tl.to(
        blockingTaskRef.current,
        { opacity: 0, duration: 0.4, ease: "power2.out" },
        4.5
      );

      // 9. (5s) Event loop resumes — pulses blue, "UI Frozen" fades out
      tl.to(
        eventLoopRef.current,
        {
          stroke: "#2563eb",
          fill: "#18181b",
          scale: 1.15,
          transformOrigin: "center center",
          duration: 0.3,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        },
        5
      );
      tl.to(
        uiFrozenRef.current,
        { opacity: 0, duration: 0.4, ease: "power2.out" },
        5
      );

      // Reset render box stroke
      tl.to(
        renderRef.current,
        {
          stroke: "#52525b",
          strokeWidth: 1.5,
          duration: 0.3,
          ease: "power2.out",
        },
        5
      );

      // 10. (5.5s) Microtask processes first — moves to call stack, executes, fades
      tl.to(
        microtask1Ref.current,
        {
          x: -330,
          y: 60,
          duration: 0.6,
          ease: "power3.inOut",
        },
        5.5
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
        6.1
      );
      tl.to(
        microtask1Ref.current,
        { opacity: 0, duration: 0.3, ease: "power2.out" },
        6.4
      );

      // 11. (6.5s) First queued task processes — moves to call stack, fades
      tl.to(
        queuedTask1Ref.current,
        {
          x: -330,
          y: -140,
          duration: 0.6,
          ease: "power3.inOut",
        },
        6.5
      );
      tl.to(
        queuedTask1Ref.current,
        { opacity: 0, duration: 0.3, ease: "power2.out" },
        6.8
      );

      // 12. (7s) Render fires (green flash)
      tl.to(
        renderRef.current,
        {
          fill: "#22c55e",
          duration: 0.3,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        },
        7
      );

      // 13. (7.5s) Everything remaining fades for loop restart
      tl.to(
        queuedTask2Ref.current,
        { opacity: 0, duration: 0.5, ease: "power2.inOut" },
        7.5
      );
      tl.to(
        queuedTask3Ref.current,
        { opacity: 0, duration: 0.5, ease: "power2.inOut" },
        7.5
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
        {/* Static blocked state */}
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
          y={180}
          width={220}
          height={80}
          label="Task Queue"
        />

        {/* Event loop — gray/stopped */}
        <circle cx={270} cy={200} r={35} fill="#27272a" stroke="#71717a" strokeWidth={2} />
        <text
          x={270}
          y={196}
          textAnchor="middle"
          fontSize={9}
          fill="#71717a"
          fontFamily="var(--font-geist-mono)"
        >
          Event
        </text>
        <text
          x={270}
          y={208}
          textAnchor="middle"
          fontSize={9}
          fill="#71717a"
          fontFamily="var(--font-geist-mono)"
        >
          Loop
        </text>

        {/* Render box — red stroke (can't render) */}
        <rect x={350} y={300} width={220} height={60} rx={6} fill="#27272a" stroke="#ef4444" strokeWidth={2.5} />
        <Label x={460} y={336} text="Render" size="sm" anchor="middle" />

        {/* Blocking task in Call Stack */}
        <rect x={50} y={60} width={80} height={24} rx={3} fill="#ef4444" />
        <text x={90} y={76} textAnchor="middle" fontSize={8} fill="#fafafa" fontFamily="var(--font-geist-mono)">
          sync loop
        </text>

        {/* Tasks piled in Task Queue */}
        <rect x={370} y={196} width={40} height={20} rx={3} fill="#2563eb" />
        <text x={390} y={210} textAnchor="middle" fontSize={8} fill="#fafafa" fontFamily="var(--font-geist-mono)">task 1</text>
        <rect x={420} y={196} width={40} height={20} rx={3} fill="#2563eb" />
        <text x={440} y={210} textAnchor="middle" fontSize={8} fill="#fafafa" fontFamily="var(--font-geist-mono)">task 2</text>
        <rect x={470} y={196} width={40} height={20} rx={3} fill="#2563eb" />
        <text x={490} y={210} textAnchor="middle" fontSize={8} fill="#fafafa" fontFamily="var(--font-geist-mono)">task 3</text>

        {/* Microtask waiting */}
        <rect x={370} y={58} width={40} height={20} rx={3} fill="#fbbf24" />
        <text x={390} y={72} textAnchor="middle" fontSize={8} fill="#09090b" fontFamily="var(--font-geist-mono)">
          {"μtask"}
        </text>

        {/* UI Frozen label */}
        <text
          x={270}
          y={270}
          textAnchor="middle"
          fontSize={14}
          fill="#ef4444"
          fontWeight="600"
          fontFamily="var(--font-geist-mono)"
        >
          UI Frozen
        </text>
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
        y={180}
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
      <g ref={eventLoopLabelRef}>
        <text
          x={270}
          y={196}
          textAnchor="middle"
          fontSize={9}
          fill="#a1a1aa"
          fontFamily="var(--font-geist-mono)"
        >
          Event
        </text>
        <text
          x={270}
          y={208}
          textAnchor="middle"
          fontSize={9}
          fill="#a1a1aa"
          fontFamily="var(--font-geist-mono)"
        >
          Loop
        </text>
      </g>

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
      <Label x={460} y={336} text="Render" size="sm" anchor="middle" />

      {/* Blocking task (red) — starts positioned in Call Stack area */}
      <g ref={blockingTaskRef} opacity={0}>
        <rect x={50} y={60} width={80} height={24} rx={3} fill="#ef4444" />
        <text
          x={90}
          y={76}
          textAnchor="middle"
          fontSize={8}
          fill="#fafafa"
          fontFamily="var(--font-geist-mono)"
        >
          sync loop
        </text>
      </g>

      {/* Queued tasks (blue) — positioned in Task Queue area */}
      <g ref={queuedTask1Ref} opacity={0}>
        <rect x={370} y={200} width={40} height={20} rx={3} fill="#2563eb" />
        <text
          x={390}
          y={214}
          textAnchor="middle"
          fontSize={8}
          fill="#fafafa"
          fontFamily="var(--font-geist-mono)"
        >
          task 1
        </text>
      </g>
      <g ref={queuedTask2Ref} opacity={0}>
        <rect x={420} y={200} width={40} height={20} rx={3} fill="#2563eb" />
        <text
          x={440}
          y={214}
          textAnchor="middle"
          fontSize={8}
          fill="#fafafa"
          fontFamily="var(--font-geist-mono)"
        >
          task 2
        </text>
      </g>
      <g ref={queuedTask3Ref} opacity={0}>
        <rect x={470} y={200} width={40} height={20} rx={3} fill="#2563eb" />
        <text
          x={490}
          y={214}
          textAnchor="middle"
          fontSize={8}
          fill="#fafafa"
          fontFamily="var(--font-geist-mono)"
        >
          task 3
        </text>
      </g>

      {/* Microtask (amber) — positioned in Microtask Queue area */}
      <g ref={microtask1Ref} opacity={0}>
        <rect x={370} y={58} width={40} height={20} rx={3} fill="#fbbf24" />
        <text
          x={390}
          y={72}
          textAnchor="middle"
          fontSize={8}
          fill="#09090b"
          fontFamily="var(--font-geist-mono)"
        >
          {"μtask"}
        </text>
      </g>

      {/* UI Frozen label (red, centered below event loop) */}
      <g ref={uiFrozenRef} opacity={0}>
        <text
          x={270}
          y={270}
          textAnchor="middle"
          fontSize={14}
          fill="#ef4444"
          fontWeight="600"
          fontFamily="var(--font-geist-mono)"
        >
          UI Frozen
        </text>
      </g>
    </svg>
  );
}
