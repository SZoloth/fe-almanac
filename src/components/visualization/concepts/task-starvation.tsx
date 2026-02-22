"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { VisualizationProps } from "@/lib/types";
import QueueBox from "../primitives/queue-box";
import Label from "../primitives/label";

export default function TaskStarvation({
  isPlaying,
  onTimelineReady,
  reducedMotion,
}: VisualizationProps) {
  const containerRef = useRef<SVGSVGElement>(null);

  const macrotaskRef = useRef<SVGGElement>(null);
  const macrotaskRectRef = useRef<SVGRectElement>(null);
  const microtask1Ref = useRef<SVGGElement>(null);
  const microtask2Ref = useRef<SVGGElement>(null);
  const microtask3Ref = useRef<SVGGElement>(null);
  const microtask4Ref = useRef<SVGGElement>(null);
  const microtask5Ref = useRef<SVGGElement>(null);
  const execTaskRef = useRef<SVGGElement>(null);
  const eventLoopRef = useRef<SVGCircleElement>(null);
  const spawnArrowRef = useRef<SVGGElement>(null);
  const counterRef = useRef<SVGTextElement>(null);
  const warningRef = useRef<SVGGElement>(null);
  const starvationLabelRef = useRef<SVGTextElement>(null);

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current) return;

      const tl = gsap.timeline({
        paused: true,
        repeat: -1,
        repeatDelay: 1,
      });

      // 1. (0s) Macrotask slides into Task Queue
      tl.fromTo(
        macrotaskRef.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        0
      );

      // 2. (0.5s) First microtask enters Microtask Queue
      tl.fromTo(
        microtask1Ref.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
        0.5
      );

      // 3. (1s) Event loop pulses amber — checks microtask queue
      tl.to(
        eventLoopRef.current,
        {
          fill: "#fbbf24",
          scale: 1.15,
          transformOrigin: "center center",
          duration: 0.3,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        },
        1
      );

      // 4. (1.4s) Microtask moves to execution area
      tl.fromTo(
        execTaskRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" },
        1.4
      );
      tl.to(
        microtask1Ref.current,
        { opacity: 0.3, duration: 0.2 },
        1.4
      );
      tl.set(counterRef.current, { textContent: "Microtasks: 1" }, 1.4);

      // 5. (1.8s) Spawn arrow appears — microtask spawns microtask
      tl.fromTo(
        spawnArrowRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        1.8
      );

      // 6. (2s) Second microtask enters queue (spawned by first)
      tl.fromTo(
        microtask2Ref.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
        2
      );

      // 7. (2.4s) Second microtask executes, exec area flashes
      tl.to(
        microtask2Ref.current,
        { opacity: 0.3, duration: 0.2 },
        2.4
      );
      tl.to(
        execTaskRef.current,
        { opacity: 0.5, duration: 0.15, yoyo: true, repeat: 1 },
        2.4
      );
      tl.set(counterRef.current, { textContent: "Microtasks: 2" }, 2.4);

      // 8. (2.6s) Third microtask spawned
      tl.fromTo(
        microtask3Ref.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
        2.6
      );

      // 9. (3s) Third executes, counter: 3, fourth spawns
      tl.to(
        microtask3Ref.current,
        { opacity: 0.3, duration: 0.2 },
        3
      );
      tl.to(
        execTaskRef.current,
        { opacity: 0.5, duration: 0.15, yoyo: true, repeat: 1 },
        3
      );
      tl.set(counterRef.current, { textContent: "Microtasks: 3" }, 3);
      tl.fromTo(
        microtask4Ref.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
        3.2
      );

      // 10. (3.5s) Fourth executes, counter: 4, fifth spawns
      tl.to(
        microtask4Ref.current,
        { opacity: 0.3, duration: 0.2 },
        3.5
      );
      tl.set(counterRef.current, { textContent: "Microtasks: 4" }, 3.5);
      tl.fromTo(
        microtask5Ref.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
        3.7
      );

      // 11. (4s) Fifth executes, counter accelerates
      tl.to(
        microtask5Ref.current,
        { opacity: 0.3, duration: 0.2 },
        4
      );
      tl.to(
        execTaskRef.current,
        { opacity: 0.5, duration: 0.15, yoyo: true, repeat: 1 },
        4
      );
      tl.set(counterRef.current, { textContent: "Microtasks: 5" }, 4);

      // 12. (4.3s) Counter keeps climbing — queue never empties
      tl.set(counterRef.current, { textContent: "Microtasks: 8" }, 4.3);
      tl.set(counterRef.current, { textContent: "Microtasks: 13" }, 4.6);
      tl.set(counterRef.current, { textContent: "Microtasks: 21" }, 4.9);

      // 13. (5s) Event loop pulses again — still draining microtasks
      tl.to(
        eventLoopRef.current,
        {
          fill: "#fbbf24",
          scale: 1.15,
          transformOrigin: "center center",
          duration: 0.3,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        },
        5
      );

      // 14. (5.5s) Macrotask turns red — it has been starved
      tl.to(
        macrotaskRectRef.current,
        {
          attr: { fill: "#ef4444" },
          duration: 0.3,
          ease: "power2.inOut",
        },
        5.5
      );
      tl.to(
        macrotaskRef.current,
        {
          opacity: 0.4,
          duration: 0.3,
          yoyo: true,
          repeat: 3,
          ease: "power2.inOut",
        },
        5.5
      );

      // 15. (6s) Starvation label fades in
      tl.fromTo(
        starvationLabelRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        6
      );

      // 16. (6.3s) Warning message appears
      tl.fromTo(
        warningRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        6.3
      );

      // 17. (7.5s) Fade out all animated elements for loop restart
      const fadeTargets = [
        macrotaskRef.current,
        microtask1Ref.current,
        microtask2Ref.current,
        microtask3Ref.current,
        microtask4Ref.current,
        microtask5Ref.current,
        execTaskRef.current,
        spawnArrowRef.current,
        warningRef.current,
        starvationLabelRef.current,
      ];
      tl.to(
        fadeTargets,
        { opacity: 0, duration: 0.5, ease: "power2.inOut", stagger: 0.03 },
        7.5
      );
      tl.set(counterRef.current, { textContent: "Microtasks: 0" }, 8.2);
      tl.to(
        counterRef.current,
        { opacity: 0, duration: 0.01 },
        8.2
      );
      tl.set(counterRef.current, { opacity: 1 }, 8.3);

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
        {/* Structural containers */}
        <QueueBox x={30} y={30} width={200} height={160} label="Microtask Queue" />
        <QueueBox x={30} y={230} width={200} height={80} label="Task Queue" />
        <QueueBox x={370} y={30} width={200} height={120} label="Execution" />

        {/* Event Loop circle */}
        <circle cx={285} cy={110} r={30} fill="#18181b" stroke="#fbbf24" strokeWidth={2} />
        <text x={285} y={106} textAnchor="middle" fontSize={8} fill="#a1a1aa" fontFamily="var(--font-geist-mono)">Event</text>
        <text x={285} y={118} textAnchor="middle" fontSize={8} fill="#a1a1aa" fontFamily="var(--font-geist-mono)">Loop</text>

        {/* Stacked microtasks filling the queue */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect x={50} y={52 + i * 22} width={45} height={18} rx={3} fill="#fbbf24" opacity={0.3 + i * 0.15} />
            <text x={72} y={65 + i * 22} textAnchor="middle" fontSize={7} fill="#09090b" fontFamily="var(--font-geist-mono)">
              {`\u03BC${i + 1}`}
            </text>
          </g>
        ))}

        {/* Spawn arrow — microtask spawns microtask */}
        <path
          d="M 200 90 C 220 90, 220 60, 200 60"
          fill="none"
          stroke="#fbbf24"
          strokeWidth={1.5}
          strokeDasharray="4 2"
          markerEnd="url(#arrowHead)"
        />
        <defs>
          <marker id="arrowHead" markerWidth={6} markerHeight={4} refX={5} refY={2} orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#fbbf24" />
          </marker>
        </defs>
        <Label x={150} y={60} text="spawns" size="sm" color="#fbbf24" />

        {/* Executing microtask */}
        <rect x={400} y={60} width={60} height={24} rx={3} fill="#fbbf24" />
        <text x={430} y={76} textAnchor="middle" fontSize={8} fill="#09090b" fontFamily="var(--font-geist-mono)">{"\u03BCtask"}</text>

        {/* Starving macrotask — red to show blocked */}
        <rect x={50} y={256} width={55} height={22} rx={3} fill="#ef4444" />
        <text x={77} y={271} textAnchor="middle" fontSize={8} fill="#fafafa" fontFamily="var(--font-geist-mono)">task</text>

        {/* Counter */}
        <Label x={370} y={180} text="Microtasks: 21" size="md" color="#fbbf24" />

        {/* Warning */}
        <text x={370} y={202} fontSize={12} fill="#ef4444" fontFamily="var(--font-geist-mono)">
          Task starved!
        </text>

        {/* Annotation labels */}
        <Label x={115} y={260} text="Blocked" size="sm" color="#ef4444" />
        <Label x={285} y={158} text="Always picks microtasks" size="sm" color="#fbbf24" anchor="middle" />
        <Label x={370} y={222} text="Microtasks keep spawning new microtasks," size="sm" color="#a1a1aa" />
        <Label x={370} y={236} text="so the macrotask queue never gets a turn." size="sm" color="#a1a1aa" />
        <Label x={50} y={328} text="Tasks can never run" size="sm" color="#ef4444" />
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
      <QueueBox x={30} y={30} width={200} height={160} label="Microtask Queue" />
      <QueueBox x={30} y={230} width={200} height={80} label="Task Queue" />
      <QueueBox x={370} y={30} width={200} height={120} label="Execution" />

      {/* Event Loop circle */}
      <circle
        ref={eventLoopRef}
        cx={285}
        cy={110}
        r={30}
        fill="#18181b"
        stroke="#52525b"
        strokeWidth={2}
      />
      <text x={285} y={106} textAnchor="middle" fontSize={8} fill="#a1a1aa" fontFamily="var(--font-geist-mono)">Event</text>
      <text x={285} y={118} textAnchor="middle" fontSize={8} fill="#a1a1aa" fontFamily="var(--font-geist-mono)">Loop</text>

      {/* Spawn arrow — shows recursive microtask spawning */}
      <defs>
        <marker id="spawnArrow" markerWidth={6} markerHeight={4} refX={5} refY={2} orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="#fbbf24" />
        </marker>
      </defs>
      <g ref={spawnArrowRef} opacity={0}>
        <path
          d="M 200 90 C 225 90, 225 60, 200 60"
          fill="none"
          stroke="#fbbf24"
          strokeWidth={1.5}
          strokeDasharray="4 2"
          markerEnd="url(#spawnArrow)"
        />
        <text x={210} y={68} fontSize={8} fill="#fbbf24" fontFamily="var(--font-geist-mono)">spawns</text>
      </g>

      {/* Executing microtask indicator */}
      <g ref={execTaskRef} opacity={0}>
        <rect x={400} y={60} width={60} height={24} rx={3} fill="#fbbf24" />
        <text
          x={430}
          y={76}
          textAnchor="middle"
          fontSize={8}
          fill="#09090b"
          fontFamily="var(--font-geist-mono)"
        >
          {"\u03BCtask"}
        </text>
      </g>

      {/* Macrotask in Task Queue */}
      <g ref={macrotaskRef} opacity={0}>
        <rect ref={macrotaskRectRef} x={50} y={256} width={55} height={22} rx={3} fill="#2563eb" />
        <text
          x={77}
          y={271}
          textAnchor="middle"
          fontSize={8}
          fill="#fafafa"
          fontFamily="var(--font-geist-mono)"
        >
          task
        </text>
      </g>

      {/* Microtasks in queue */}
      <g ref={microtask1Ref} opacity={0}>
        <rect x={50} y={52} width={45} height={18} rx={3} fill="#fbbf24" />
        <text x={72} y={65} textAnchor="middle" fontSize={7} fill="#09090b" fontFamily="var(--font-geist-mono)">{"\u03BC1"}</text>
      </g>
      <g ref={microtask2Ref} opacity={0}>
        <rect x={50} y={74} width={45} height={18} rx={3} fill="#fbbf24" />
        <text x={72} y={87} textAnchor="middle" fontSize={7} fill="#09090b" fontFamily="var(--font-geist-mono)">{"\u03BC2"}</text>
      </g>
      <g ref={microtask3Ref} opacity={0}>
        <rect x={50} y={96} width={45} height={18} rx={3} fill="#fbbf24" />
        <text x={72} y={109} textAnchor="middle" fontSize={7} fill="#09090b" fontFamily="var(--font-geist-mono)">{"\u03BC3"}</text>
      </g>
      <g ref={microtask4Ref} opacity={0}>
        <rect x={50} y={118} width={45} height={18} rx={3} fill="#fbbf24" />
        <text x={72} y={131} textAnchor="middle" fontSize={7} fill="#09090b" fontFamily="var(--font-geist-mono)">{"\u03BC4"}</text>
      </g>
      <g ref={microtask5Ref} opacity={0}>
        <rect x={50} y={140} width={45} height={18} rx={3} fill="#fbbf24" />
        <text x={72} y={153} textAnchor="middle" fontSize={7} fill="#09090b" fontFamily="var(--font-geist-mono)">{"\u03BC5"}</text>
      </g>

      {/* Starvation annotation — appears when macrotask is blocked */}
      <text
        ref={starvationLabelRef}
        x={120}
        y={271}
        fontSize={9}
        fill="#ef4444"
        fontFamily="var(--font-geist-mono)"
        opacity={0}
      >
        {"Tasks can\u2019t run \u2192"}
      </text>

      {/* Counter */}
      <text
        ref={counterRef}
        x={370}
        y={180}
        fontSize={12}
        fill="#fbbf24"
        fontFamily="var(--font-geist-mono)"
      >
        Microtasks: 0
      </text>

      {/* Warning message */}
      <g ref={warningRef} opacity={0}>
        <text
          x={370}
          y={202}
          fontSize={12}
          fill="#ef4444"
          fontFamily="var(--font-geist-mono)"
        >
          Task starved!
        </text>
        <Label x={370} y={222} text="Microtasks keep spawning," size="sm" color="#a1a1aa" />
        <Label x={370} y={236} text="macrotask never gets a turn." size="sm" color="#a1a1aa" />
      </g>
    </svg>
  );
}
