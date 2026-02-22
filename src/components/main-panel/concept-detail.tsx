import type { Concept } from "@/lib/types";
import { getCategoryById } from "@/lib/data/categories";
import Explanation from "@/components/main-panel/explanation";
import VizContainer from "@/components/visualization/viz-container";

interface ConceptDetailProps {
  concept: Concept;
  onNavigateConcept?: (id: string) => void;
}

export default function ConceptDetail({
  concept,
  onNavigateConcept,
}: ConceptDetailProps) {
  const category = getCategoryById(concept.category);

  return (
    <div className="grid h-full grid-cols-[minmax(0,2fr)_minmax(0,3fr)] grid-rows-[minmax(0,1fr)] gap-8 px-8 pb-4 pt-2">
      <div className="self-start overflow-y-auto">
        <Explanation
          concept={concept}
          category={category ?? null}
          onNavigateConcept={onNavigateConcept}
        />
      </div>
      <VizContainer concept={concept} />
    </div>
  );
}
