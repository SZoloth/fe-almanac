"use client";

import { forwardRef } from "react";

interface QueueBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  fill?: string;
  stroke?: string;
  className?: string;
}

const QueueBox = forwardRef<SVGGElement, QueueBoxProps>(
  (
    {
      x,
      y,
      width,
      height,
      label,
      fill = "#27272a",
      stroke = "#52525b",
      className,
    },
    ref
  ) => {
    return (
      <g ref={ref} className={className}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={6}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.5}
        />
        <text
          x={x + width / 2}
          y={y + 16}
          textAnchor="middle"
          fontFamily="var(--font-geist-mono)"
          fontSize={11}
          fill="#a1a1aa"
        >
          {label}
        </text>
      </g>
    );
  }
);

QueueBox.displayName = "QueueBox";

export default QueueBox;
