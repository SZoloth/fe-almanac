"use client";

import { forwardRef, useId, useRef, useEffect, useState } from "react";

interface FlowArrowProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
  dashed?: boolean;
  className?: string;
}

const FlowArrow = forwardRef<SVGGElement, FlowArrowProps>(
  ({ from, to, color = "#52525b", dashed = false, className }, ref) => {
    const markerId = useId();
    const pathRef = useRef<SVGLineElement>(null);
    const [pathLength, setPathLength] = useState(0);

    useEffect(() => {
      if (pathRef.current) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        setPathLength(Math.sqrt(dx * dx + dy * dy));
      }
    }, [from, to]);

    return (
      <g ref={ref} className={className}>
        <defs>
          <marker
            id={markerId}
            markerWidth={8}
            markerHeight={6}
            refX={7}
            refY={3}
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={color} />
          </marker>
        </defs>
        <line
          ref={pathRef}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray={dashed ? "6 4" : pathLength}
          markerEnd={`url(#${markerId})`}
        />
      </g>
    );
  }
);

FlowArrow.displayName = "FlowArrow";

export default FlowArrow;
