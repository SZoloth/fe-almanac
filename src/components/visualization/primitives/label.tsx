"use client";

import { forwardRef } from "react";

interface LabelProps {
  x: number;
  y: number;
  text: string;
  size?: "sm" | "md";
  color?: string;
  anchor?: "start" | "middle" | "end" | "inherit";
  className?: string;
}

const Label = forwardRef<SVGTextElement, LabelProps>(
  (
    {
      x,
      y,
      text,
      size = "sm",
      color = "#a1a1aa",
      anchor = "start",
      className,
    },
    ref
  ) => {
    return (
      <text
        ref={ref}
        x={x}
        y={y}
        fontFamily="var(--font-geist-mono)"
        fontSize={size === "sm" ? 10 : 12}
        fill={color}
        textAnchor={anchor}
        className={className}
      >
        {text}
      </text>
    );
  }
);

Label.displayName = "Label";

export default Label;
