import { KBarResults, useMatches } from "kbar";
import ResultsItem from "./results-item";

export default function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="px-4 py-2 text-sm uppercase text-gray-600 opacity-50 dark:text-gray-400">
            {item}
          </div>
        ) : (
          <ResultsItem
            action={item}
            active={active}
            currentRootActionId={rootActionId ?? ""}
          />
        )
      }
    />
  );
}
