import { createSignal, createResource, Show, For } from "solid-js";
import { searchAbility, searchCreature, AbilityResult } from "../utils/abilitySearch";

interface AbilityModalProps {
  abilityName: string;
  creatureName?: string;
  onClose: () => void;
}

export default function AbilityModal(props: AbilityModalProps) {
  const [ability] = createResource(() => props.abilityName, searchAbility);
  const [creature] = createResource(
    () => (!ability.loading && !ability() && props.creatureName) ? props.creatureName : undefined,
    (name) => name ? searchCreature(name) : Promise.resolve(null)
  );

  const getActionIcon = (actionsNumber?: number) => {
    if (actionsNumber === undefined || actionsNumber === null) return "◆";
    if (actionsNumber === 0) return "◇"; // Free action
    if (actionsNumber === 3) return "❖"; // Three actions
    if (actionsNumber === 4) return "❖❖"; // Two actions (actually 4 half-actions? No, 2 actions)
    return "⬢".repeat(actionsNumber); // Single/double action
  };

  return (
    <div
      class="fixed inset-0 flex items-center justify-center z-[60]"
      style="background-color: rgba(0, 0, 0, 0.5)"
      onClick={(e) => {
        if (e.target === e.currentTarget) props.onClose();
      }}
    >
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto m-4 border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div class="flex justify-between items-start mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100">
              {props.abilityName}
            </h3>
            <Show when={ability()}>
              {(a) => (
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {a().type} • {a().category}
                </p>
              )}
            </Show>
          </div>
          <button
            class="text-xl text-slate-400 hover:text-red-500 transition-colors ml-4"
            onClick={props.onClose}
          >
            ✕
          </button>
        </div>

        {/* Loading state */}
        <Show when={ability.loading}>
          <div class="py-8 text-center text-slate-500 dark:text-slate-400">
            <p>Searching Archives of Nethys...</p>
          </div>
        </Show>

        {/* Ability found in AoN database */}
        <Show when={!ability.loading && ability()}>
          {(a) => (
            <div class="space-y-4">
              {/* Actions and Traits */}
              <div class="flex flex-wrap items-center gap-2">
                <Show when={a().actions}>
                  <span class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm font-medium">
                    <Show when={a().actionsNumber !== undefined && a().actionsNumber !== null && a().actionsNumber! > 0}>
                      {getActionIcon(a().actionsNumber)}
                    </Show>
                    {a().actions}
                  </span>
                </Show>
                <For each={a().traits || []}>
                  {(trait) => (
                    <span class="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded text-sm">
                      {trait}
                    </span>
                  )}
                </For>
              </div>

              {/* Prerequisites */}
              <Show when={a().prerequisites}>
                <p class="text-sm text-slate-600 dark:text-slate-400">
                  <span class="font-semibold">Prerequisites:</span> {a().prerequisites}
                </p>
              </Show>

              {/* Summary/Description */}
              <Show when={a().summary}>
                <div class="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <p class="text-sm text-slate-700 dark:text-slate-300">{a().summary}</p>
                </div>
              </Show>

              {/* Source */}
              <Show when={a().source && a().source!.length > 0}>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  <span class="font-semibold">Source:</span> {a().source!.join(", ")}
                </p>
              </Show>

              {/* Link to full page */}
              <a
                href={a().fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                View on Archives of Nethys ↗
              </a>
            </div>
          )}
        </Show>

        {/* Ability not found in AoN database (unique to creature) */}
        <Show when={!ability.loading && !ability()}>
          <div class="space-y-4">
            <div class="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <p class="text-sm text-amber-800 dark:text-amber-200">
                This ability is unique to this creature and doesn't have a separate entry in the Archives of Nethys database.
              </p>
            </div>
            <Show when={props.creatureName}>
              <Show when={creature.loading}>
                <p class="text-sm text-slate-500 dark:text-slate-400">Looking up creature...</p>
              </Show>
              <Show when={!creature.loading && creature()}>
                {(c) => (
                  <a
                    href={c().fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    View {c().name} on Archives of Nethys ↗
                  </a>
                )}
              </Show>
              <Show when={!creature.loading && !creature()}>
                <a
                  href={`https://2e.aonsrd.com/creatures?display=table&q=${encodeURIComponent(props.abilityName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Search Archives of Nethys ↗
                </a>
              </Show>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}
