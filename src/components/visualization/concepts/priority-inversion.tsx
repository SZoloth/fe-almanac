"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { VisualizationProps } from "@/lib/types";
import QueueBox from "../primitives/queue-box";
import Label from "../primitives/label";

export default function PriorityInversion({
  isPlaying,
  onTimelineReady,
  reducedMotion,
}: VisualizationProps) {
  const containerRef = useRef<SVGSVGElement>(null);

  // Animated bar refs
  const lowBarRef = useRef<SVGRectElement>(null);
  const lowResumeBarRef = useRef<SVGRectElement>(null);
  const medBarRef = useRef<SVGRectElement>(null);
  const highBlockedRef = useRef<SVGGElement>(null);
  const highFinalBarRef = useRef<SVGRectElement>(null);

  // Lock icon refs
  const lockIconRef = useRef<SVGGElement>(null);
  const lockTransferRef = useRef<SVGGElement>(null);

  // Shared resource box refs
  const resourceLockIndicatorRef = useRef<SVGRectElement>(null);
  const resourceLockLabelRef = useRef<SVGTextElement>(null);

  // Annotation text refs
  const annotLockAcquiredRef = useRef<SVGGElement>(null);
  const annotHighWaitingRef = useRef<SVGGElement>(null);
  const annotMedPreemptsRef = useRef<SVGGElement>(null);
  const annotWarningRef = useRef<SVGGElement>(null);
  const annotLockReleasedRef = useRef<SVGGElement>(null);
  const annotHighRunsRef = useRef<SVGGElement>(null);

  // Padlock SVG path helper
  const LockIcon = ({
    x,
    y,
    ref,
  }: {
    x: number;
    y: number;
    ref?: React.Ref<SVGGElement>;
  }) => (
    <g ref={ref} opacity={0}>
      <rect x={x} y={y + 6} width={12} height={10} rx={2} fill="#fbbf24" />
      <path
        d={`M${x + 2} ${y + 6} V${y + 3} a4 4 0 0 1 8 0 V${y + 6}`}
        fill="none"
        stroke="#fbbf24"
        strokeWidth={1.5}
      />
    </g>
  );

  useGSAP(
    () => {
      if (reducedMotion || !containerRef.current) return;

      const tl = gsap.timeline({
        paused: true,
        repeat: -1,
        repeatDelay: 1,
      });

      // 1. (0s) Low-priority task bar starts growing — acquires the lock
      tl.fromTo(
        lowBarRef.current,
        { attr: { width: 0 } },
        { attr: { width: 80 }, duration: 0.8, ease: "none" },
        0
      );

      // 2. (0.8s) Lock icon appears on low-priority task
      tl.fromTo(
        lockIconRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" },
        0.8
      );

      // 3. (0.8s) Shared resource box turns blue — locked by low
      tl.to(
        resourceLockIndicatorRef.current,
        { attr: { fill: "#3b82f6" }, duration: 0.3, ease: "power2.out" },
        0.8
      );
      tl.fromTo(
        resourceLockLabelRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        0.8
      );

      // 4. (1.1s) "Lock acquired by Low" annotation
      tl.fromTo(
        annotLockAcquiredRef.current,
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        1.1
      );

      // 5. (1.8s) High-priority task appears, immediately blocked
      tl.fromTo(
        highBlockedRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        1.8
      );

      // 6. (2.1s) "High waiting..." annotation — pulsing blocked indicator
      tl.fromTo(
        annotHighWaitingRef.current,
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        2.1
      );

      // Pulse the blocked indicator red while waiting
      tl.to(
        highBlockedRef.current,
        {
          opacity: 0.4,
          duration: 0.4,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 5,
        },
        2.4
      );

      // 7. (2.8s) Fade lock acquired annotation
      tl.to(
        annotLockAcquiredRef.current,
        { opacity: 0, duration: 0.2, ease: "power2.in" },
        2.8
      );

      // 8. (3s) Medium-priority task appears and starts running
      tl.fromTo(
        medBarRef.current,
        { attr: { width: 0 }, opacity: 1 },
        { attr: { width: 0 }, opacity: 1, duration: 0 },
        3
      );
      tl.to(
        medBarRef.current,
        { attr: { width: 200 }, duration: 2.5, ease: "none" },
        3
      );

      // 9. (3.2s) "Medium preempts!" annotation
      tl.fromTo(
        annotMedPreemptsRef.current,
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        3.2
      );

      // 10. (3.8s) Warning banner — "Priority inversion! Medium runs before High"
      tl.fromTo(
        annotWarningRef.current,
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        3.8
      );

      // 11. (5.2s) Fade medium preempts annotation
      tl.to(
        annotMedPreemptsRef.current,
        { opacity: 0, duration: 0.2, ease: "power2.in" },
        5.2
      );

      // 12. (5.5s) Medium completes, low-priority resumes
      tl.fromTo(
        lowResumeBarRef.current,
        { attr: { width: 0 }, opacity: 1 },
        { attr: { width: 80 }, opacity: 1, duration: 1, ease: "none" },
        5.5
      );

      // 13. (6.5s) Low-priority finishes, releases lock
      tl.to(
        lockIconRef.current,
        { opacity: 0, scale: 0.5, duration: 0.3, ease: "power2.in" },
        6.5
      );

      // 14. (6.5s) "Lock released" annotation
      tl.to(
        annotHighWaitingRef.current,
        { opacity: 0, duration: 0.2, ease: "power2.in" },
        6.5
      );
      tl.fromTo(
        annotLockReleasedRef.current,
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        6.5
      );

      // 15. (6.5s) Shared resource — lock transfers to high
      tl.to(
        resourceLockIndicatorRef.current,
        { attr: { fill: "#27272a" }, duration: 0.2, ease: "power2.in" },
        6.5
      );
      tl.to(
        resourceLockLabelRef.current,
        { opacity: 0, duration: 0.2, ease: "power2.in" },
        6.5
      );

      // 16. (6.8s) Lock transfer animation — lock icon moves to high lane
      tl.fromTo(
        lockTransferRef.current,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -220, duration: 0.5, ease: "power3.in" },
        6.8
      );

      // 17. (6.8s) High-priority blocked indicator fades
      tl.to(
        highBlockedRef.current,
        { opacity: 0, duration: 0.2 },
        6.8
      );

      // 18. (7.2s) Shared resource turns red briefly — high acquires
      tl.to(
        resourceLockIndicatorRef.current,
        { attr: { fill: "#ef4444" }, duration: 0.2, ease: "power2.out" },
        7.2
      );

      // 19. (7.2s) High-priority finally executes
      tl.fromTo(
        highFinalBarRef.current,
        { attr: { width: 0 }, opacity: 1 },
        { attr: { width: 120 }, opacity: 1, duration: 0.6, ease: "power2.out" },
        7.2
      );

      // 20. (7.2s) "High finally runs" annotation
      tl.to(
        annotLockReleasedRef.current,
        { opacity: 0, duration: 0.2, ease: "power2.in" },
        7.2
      );
      tl.fromTo(
        annotHighRunsRef.current,
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        7.4
      );

      // 21. (7.8s) Resource resets
      tl.to(
        resourceLockIndicatorRef.current,
        { attr: { fill: "#27272a" }, duration: 0.3, ease: "power2.out" },
        7.8
      );

      // 22. (8.2s) Fade everything for reset
      tl.to(
        [
          lowBarRef.current,
          lowResumeBarRef.current,
          medBarRef.current,
          highFinalBarRef.current,
          annotWarningRef.current,
          annotHighRunsRef.current,
        ],
        { opacity: 0, duration: 0.5, ease: "power2.inOut" },
        8.2
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
        {/* Lane backgrounds */}
        <rect x={0} y={40} width={600} height={80} fill="#18181b" />
        <rect x={0} y={160} width={600} height={80} fill="#09090b" />
        <rect x={0} y={280} width={600} height={80} fill="#18181b" />

        {/* Lane labels */}
        <Label x={10} y={85} text="High" size="md" color="#ef4444" />
        <Label x={10} y={205} text="Medium" size="md" color="#a855f7" />
        <Label x={10} y={325} text="Low" size="md" color="#3b82f6" />

        {/* Shared resource box */}
        <QueueBox x={490} y={160} width={100} height={80} label="Shared" />
        <rect x={510} y={200} width={60} height={24} rx={3} fill="#3b82f6" />
        <text
          x={540}
          y={216}
          textAnchor="middle"
          fontSize={8}
          fill="#fafafa"
          fontFamily="var(--font-geist-mono)"
        >
          Locked
        </text>

        {/* Timeline axis */}
        <line
          x1={80}
          y1={380}
          x2={480}
          y2={380}
          stroke="#52525b"
          strokeWidth={1}
        />
        <Label x={80} y={396} text="0ms" size="sm" />
        <Label x={180} y={396} text="100ms" size="sm" />
        <Label x={280} y={396} text="200ms" size="sm" />
        <Label x={380} y={396} text="300ms" size="sm" />
        <Label x={480} y={396} text="time" size="sm" anchor="end" />

        {/* Tick marks */}
        <line x1={80} y1={378} x2={80} y2={382} stroke="#52525b" strokeWidth={1} />
        <line x1={180} y1={378} x2={180} y2={382} stroke="#52525b" strokeWidth={1} />
        <line x1={280} y1={378} x2={280} y2={382} stroke="#52525b" strokeWidth={1} />
        <line x1={380} y1={378} x2={380} y2={382} stroke="#52525b" strokeWidth={1} />

        {/* Static bars showing the inversion */}
        {/* Low: runs first, holds lock, gets preempted, resumes later */}
        <rect x={100} y={300} width={80} height={24} rx={3} fill="#3b82f6" />
        <rect x={340} y={300} width={80} height={24} rx={3} fill="#3b82f6" opacity={0.6} />
        <Label x={105} y={296} text="Holds lock" size="sm" color="#3b82f6" />
        <Label x={345} y={296} text="Resumes" size="sm" color="#3b82f6" />

        {/* Medium: runs in the middle, preempting low */}
        <rect x={180} y={180} width={160} height={24} rx={3} fill="#a855f7" />
        <Label x={185} y={176} text="Preempts low (no lock needed)" size="sm" color="#a855f7" />

        {/* High: blocked, then finally runs */}
        <rect x={420} y={60} width={60} height={24} rx={3} fill="#ef4444" />
        <Label x={425} y={56} text="Finally runs!" size="sm" color="#22c55e" />

        {/* Blocked indicator for high */}
        <rect
          x={140}
          y={60}
          width={280}
          height={24}
          rx={3}
          fill="none"
          stroke="#ef4444"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
        <Label x={180} y={56} text="Blocked - waiting for lock held by Low" size="sm" color="#ef4444" />

        {/* Lock icon on low task */}
        <g>
          <rect x={165} y={302} width={12} height={10} rx={2} fill="#fbbf24" />
          <path
            d={`M167 302 V299 a4 4 0 0 1 8 0 V302`}
            fill="none"
            stroke="#fbbf24"
            strokeWidth={1.5}
          />
        </g>

        {/* Warning annotation */}
        <rect x={100} y={10} width={340} height={22} rx={4} fill="#fbbf24" opacity={0.15} />
        <text
          x={115}
          y={25}
          fontSize={11}
          fill="#fbbf24"
          fontFamily="var(--font-geist-mono)"
        >
          Priority inversion! Medium runs before High
        </text>

        {/* Connecting arrows showing the problem */}
        <line x1={180} y1={84} x2={180} y2={180} stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
        <Label x={185} y={140} text="High must wait" size="sm" color="#ef4444" />
      </svg>
    );
  }

  return (
    <svg
      ref={containerRef}
      viewBox="0 0 600 400"
      fontFamily="var(--font-geist-mono)"
    >
      {/* Lane backgrounds */}
      <rect x={0} y={40} width={600} height={80} fill="#18181b" />
      <rect x={0} y={160} width={600} height={80} fill="#09090b" />
      <rect x={0} y={280} width={600} height={80} fill="#18181b" />

      {/* Lane labels */}
      <Label x={10} y={85} text="High" size="md" color="#ef4444" />
      <Label x={10} y={205} text="Medium" size="md" color="#a855f7" />
      <Label x={10} y={325} text="Low" size="md" color="#3b82f6" />

      {/* Shared resource box */}
      <QueueBox x={490} y={160} width={100} height={80} label="Shared" />
      <rect
        ref={resourceLockIndicatorRef}
        x={510}
        y={200}
        width={60}
        height={24}
        rx={3}
        fill="#27272a"
      />
      <text
        ref={resourceLockLabelRef}
        x={540}
        y={216}
        textAnchor="middle"
        fontSize={8}
        fill="#fafafa"
        fontFamily="var(--font-geist-mono)"
        opacity={0}
      >
        Locked
      </text>

      {/* Timeline axis */}
      <line
        x1={80}
        y1={380}
        x2={480}
        y2={380}
        stroke="#52525b"
        strokeWidth={1}
      />
      <Label x={80} y={396} text="0ms" size="sm" />
      <Label x={180} y={396} text="100ms" size="sm" />
      <Label x={280} y={396} text="200ms" size="sm" />
      <Label x={380} y={396} text="300ms" size="sm" />

      {/* Tick marks */}
      <line x1={80} y1={378} x2={80} y2={382} stroke="#52525b" strokeWidth={1} />
      <line x1={180} y1={378} x2={180} y2={382} stroke="#52525b" strokeWidth={1} />
      <line x1={280} y1={378} x2={280} y2={382} stroke="#52525b" strokeWidth={1} />
      <line x1={380} y1={378} x2={380} y2={382} stroke="#52525b" strokeWidth={1} />

      {/* ── Animated elements ── */}

      {/* Low-priority execution bar (first phase) */}
      <rect
        ref={lowBarRef}
        x={100}
        y={300}
        width={0}
        height={24}
        rx={3}
        fill="#3b82f6"
      />

      {/* Low-priority execution bar (resume phase) */}
      <rect
        ref={lowResumeBarRef}
        x={340}
        y={300}
        width={0}
        height={24}
        rx={3}
        fill="#3b82f6"
        opacity={0}
      />

      {/* Lock icon on low-priority task */}
      <LockIcon x={165} y={290} ref={lockIconRef} />

      {/* Lock transfer animation icon (starts at low lane, flies to high) */}
      <LockIcon x={415} y={290} ref={lockTransferRef} />

      {/* High-priority blocked indicator — dashed rect with pulsing */}
      <g ref={highBlockedRef} opacity={0}>
        <rect
          x={140}
          y={60}
          width={280}
          height={24}
          rx={3}
          fill="none"
          stroke="#ef4444"
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
        <text
          x={280}
          y={76}
          textAnchor="middle"
          fontSize={9}
          fill="#ef4444"
          fontFamily="var(--font-geist-mono)"
        >
          BLOCKED
        </text>
      </g>

      {/* Medium-priority bar */}
      <rect
        ref={medBarRef}
        x={180}
        y={180}
        width={0}
        height={24}
        rx={3}
        fill="#a855f7"
        opacity={0}
      />

      {/* High-priority final execution bar */}
      <rect
        ref={highFinalBarRef}
        x={420}
        y={60}
        width={0}
        height={24}
        rx={3}
        fill="#ef4444"
        opacity={0}
      />

      {/* ── Annotation labels ── */}

      {/* "Lock acquired by Low" */}
      <g ref={annotLockAcquiredRef} opacity={0}>
        <Label x={100} y={290} text="Lock acquired by Low" size="sm" color="#3b82f6" />
      </g>

      {/* "High waiting..." */}
      <g ref={annotHighWaitingRef} opacity={0}>
        <Label x={140} y={52} text="High waiting for lock..." size="sm" color="#ef4444" />
      </g>

      {/* "Medium preempts!" */}
      <g ref={annotMedPreemptsRef} opacity={0}>
        <Label x={180} y={176} text="Medium preempts!" size="sm" color="#a855f7" />
      </g>

      {/* Warning banner */}
      <g ref={annotWarningRef} opacity={0}>
        <rect x={80} y={10} width={360} height={22} rx={4} fill="#fbbf24" opacity={0.15} />
        <text
          x={95}
          y={25}
          fontSize={11}
          fill="#fbbf24"
          fontFamily="var(--font-geist-mono)"
        >
          Priority inversion! Medium runs before High
        </text>
      </g>

      {/* "Lock released" */}
      <g ref={annotLockReleasedRef} opacity={0}>
        <Label x={340} y={290} text="Lock released" size="sm" color="#fbbf24" />
      </g>

      {/* "High finally runs" */}
      <g ref={annotHighRunsRef} opacity={0}>
        <Label x={420} y={52} text="High finally runs!" size="sm" color="#22c55e" />
      </g>
    </svg>
  );
}
