import { createSignal, createMemo, For, Show } from "solid-js";
import { CONDITIONS, Condition, searchConditions } from "../data/conditions";
import { AppliedCondition } from "../utils/conditionEffects";

interface ConditionAdderProps {
  existingConditions: AppliedCondition[];
  onAdd: (condition: AppliedCondition) => void;
  onClose: () => void;
}

export default function ConditionAdder(props: ConditionAdderProps) {
  const [searchQuery, setSearchQuery] = createSignal("");
  const [selectedCondition, setSelectedCondition] = createSignal<Condition | null>(null);
  const [conditionValue, setConditionValue] = createSignal(1);

  const filteredConditions = createMemo(() => searchConditions(searchQuery()));

  // Get IDs of already-applied conditions
  const appliedIds = createMemo(() => new Set(props.existingConditions.map(c => c.conditionId)));

  const handleAdd = () => {
    const condition = selectedCondition();
    if (!condition) return;

    const applied: AppliedCondition = {
      conditionId: condition.id,
      name: condition.name,
      value: condition.hasValue ? conditionValue() : undefined,
      color: condition.color
    };

    props.onAdd(applied);
    props.onClose();
  };

  const selectCondition = (condition: Condition) => {
    setSelectedCondition(condition);
    // Set default value based on condition type
    if (condition.id === "dying") setConditionValue(1);
    else if (condition.id === "doomed") setConditionValue(1);
    else if (condition.id === "persistent-damage") setConditionValue(1);
    else setConditionValue(1);
  };

  return (
    <div
      class="fixed inset-0 flex items-center justify-center z-[70]"
      style="background-color: rgba(0, 0, 0, 0.5)"
      onClick={(e) => {
        if (e.target === e.currentTarget) props.onClose();
      }}
    >
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto m-4 border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Add Condition</h3>
          <button
            class="text-xl text-slate-400 hover:text-red-500 transition-colors"
            onClick={props.onClose}
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          class="w-full px-3 py-2 mb-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
          placeholder="Search conditions..."
          value={searchQuery()}
          onInput={(e) => setSearchQuery(e.currentTarget.value)}
        />

        {/* Condition list */}
        <div class="max-h-48 overflow-y-auto mb-4 space-y-1">
          <For each={filteredConditions()}>
            {(condition) => (
              <button
                class={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                  selectedCondition()?.id === condition.id
                    ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500"
                    : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 border-2 border-transparent"
                } ${appliedIds().has(condition.id) ? "opacity-50" : ""}`}
                onClick={() => !appliedIds().has(condition.id) && selectCondition(condition)}
                disabled={appliedIds().has(condition.id)}
              >
                <div>
                  <span class="font-medium text-slate-800 dark:text-slate-200">{condition.name}</span>
                  {condition.hasValue && (
                    <span class="ml-2 text-xs text-slate-500 dark:text-slate-400">(has value)</span>
                  )}
                  {appliedIds().has(condition.id) && (
                    <span class="ml-2 text-xs text-green-600 dark:text-green-400">(already applied)</span>
                  )}
                </div>
                <span class={`w-3 h-3 rounded-full ${condition.color}`} />
              </button>
            )}
          </For>
          <Show when={filteredConditions().length === 0}>
            <p class="text-slate-500 dark:text-slate-400 text-center py-4">No conditions found.</p>
          </Show>
        </div>

        {/* Selected condition details */}
        <Show when={selectedCondition()}>
          {(condition) => (
            <div class="mb-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <p class="text-sm text-slate-600 dark:text-slate-400 mb-2">{condition().summary}</p>

              {/* Value input for value-based conditions */}
              <Show when={condition().hasValue}>
                <div class="flex items-center gap-2 mt-2">
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {condition().valueLabel || "Value"}:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    class="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-center"
                    value={conditionValue()}
                    onInput={(e) => setConditionValue(Number(e.currentTarget.value))}
                  />
                </div>
              </Show>

              {/* Effects preview */}
              <Show when={condition().effects.length > 0}>
                <div class="mt-2 space-y-1">
                  <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Effects:</p>
                  <For each={condition().effects}>
                    {(effect) => (
                      <p class="text-xs text-slate-600 dark:text-slate-400">
                        • {effect.description.replace("X", String(condition().hasValue ? conditionValue() : 1))}
                      </p>
                    )}
                  </For>
                </div>
              </Show>

              {/* Special effects */}
              <Show when={condition().specialEffects?.length}>
                <div class="mt-2 space-y-1">
                  <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Special:</p>
                  <For each={condition().specialEffects ?? []}>
                    {(effect) => (
                      <p class="text-xs text-slate-600 dark:text-slate-400">• {effect}</p>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          )}
        </Show>

        {/* Actions */}
        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            onClick={props.onClose}
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAdd}
            disabled={!selectedCondition()}
          >
            Add Condition
          </button>
        </div>
      </div>
    </div>
  );
}
