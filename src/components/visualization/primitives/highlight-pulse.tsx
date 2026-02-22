"use client";

import { forwardRef } from "react";

interface HighlightPulseProps {
  cx: number;
  cy: number;
  r: number;
  color?: string;
  className?: string;
}

const HighlightPulse = forwardRef<SVGCircleElement, HighlightPulseProps>(
  ({ cx, cy, r, color = "#fbbf24", className }, ref) => {
    return (
      <g>
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 0.3; }
              50% { opacity: 1; }
              100% { opacity: 0.3; }
            }
          `}
        </style>
        <circle
          ref={ref}
          cx={cx}
          cy={cy}
          r={r}
          fill={color}
          className={className}
          style={{ animation: "pulse 1.5s ease-in-out infinite" }}
        />
      </g>
    );
  }
);

HighlightPulse.displayName = "HighlightPulse";

export default HighlightPulse;
