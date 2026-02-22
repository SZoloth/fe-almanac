"use client";

import { useState, useEffect, useCallback } from "react";

function getHashSlug(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.slice(1);
  return hash || null;
}

export function useConceptNavigation() {
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setSelectedConceptId(getHashSlug());

    function handleHashChange() {
      setSelectedConceptId(getHashSlug());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const selectConcept = useCallback((id: string) => {
    window.location.hash = id;
  }, []);

  const clearSelection = useCallback(() => {
    history.pushState(null, "", window.location.pathname);
    setSelectedConceptId(null);
  }, []);

  return { selectedConceptId, selectConcept, clearSelection };
}
