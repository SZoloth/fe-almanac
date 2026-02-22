"use client";

import { useEffect, useRef } from "react";
import { GOLDEN_EASE } from "@/lib/motion";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        !e.metaKey &&
        !e.ctrlKey &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="group relative flex items-center rounded-lg bg-surface-2 ring-1 ring-transparent transition-all duration-200 focus-within:ring-accent">
      <svg
        className="absolute left-3 h-4 w-4 text-text-tertiary group-focus-within:text-accent"
        style={{ transition: `color 200ms ${GOLDEN_EASE}` }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx={11} cy={11} r={8} />
        <line x1={21} y1={21} x2={16.65} y2={16.65} />
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search concepts..."
        aria-label="Search concepts"
        className="w-full bg-transparent py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
      />
    </div>
  );
}
