"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "fe-almanac:sidebar-collapsed";

export function useSidebarCollapse() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setIsCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  const toggle = useCallback(() => setIsCollapsed((prev) => !prev), []);

  return { isCollapsed, toggle };
}
