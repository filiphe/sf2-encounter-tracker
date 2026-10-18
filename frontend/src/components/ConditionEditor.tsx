import { createSignal, For, Show } from "solid-js";
import { AppliedCondition } from "../utils/conditionEffects";
import { getConditionById } from "../data/conditions";

interface ConditionEditorProps {
  condition: AppliedCondition;
  onSave: (condition: AppliedCondition) => void;
  onRemove: () => void;
  onClose: () => void;
}

export default function ConditionEditor(props: ConditionEditorProps) {
  const conditionData = () => getConditionById(props.condition.conditionId);
  const isTextValue = () => conditionData()?.valueInputType === "text";
  const [value, setValue] = createSignal<number | string>(props.condition.value ?? 1);

  const numericValue = () => {
    const v = value();
    if (typeof v === "number") return v;
    const parsed = parseInt(v, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  const changeNumericValue = (delta: number) => {
    setValue(Math.max(0, numericValue() + delta));
  };

  const handleSave = () => {
    const data = conditionData();
    if (!data?.hasValue) {
      props.onClose();
      return;
    }
    if (isTextValue()) {
      const text = String(value()).trim();
      if (!text) return;
      props.onSave({ ...props.condition, value: text });
    } else {
      const num = numericValue();
      if (num <= 0) {
        // A value of 0 means the condition has ended (e.g., Frightened ticking down each round)
        props.onRemove();
      } else {
        props.onSave({ ...props.condition, value: num });
      }
    }
    props.onClose();
  };

  const handleRemove = () => {
    props.onRemove();
    props.onClose();
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
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
            Edit: {props.condition.name}
          </h3>
          <button
            class="text-xl text-slate-400 hover:text-red-500 transition-colors"
            onClick={props.onClose}
          >
            ✕
          </button>
        </div>

        {/* Summary */}
        <Show when={conditionData()?.summary}>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">{conditionData()!.summary}</p>
        </Show>

        {/* Value editor for value-based conditions */}
        <Show when={conditionData()?.hasValue}>
          <div class="flex items-center gap-2 mb-1">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">
              {conditionData()!.valueLabel || "Value"}:
            </label>
            <Show
              when={isTextValue()}
              fallback={
                <div class="flex items-center gap-1">
                  <button
                    class="w-8 h-8 rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-colors"
                    onClick={() => changeNumericValue(-1)}
                    title="Decrease value (0 removes the condition)"
                  >
                    –
                  </button>
                  <input
                    type="number"
                    min="0"
                    class="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-center"
                    value={numericValue()}
                    onInput={(e) => setValue(Number(e.currentTarget.value))}
                  />
                  <button
                    class="w-8 h-8 rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-colors"
                    onClick={() => changeNumericValue(1)}
                    title="Increase value"
                  >
                    +
                  </button>
                </div>
              }
            >
              <input
                type="text"
                class="w-32 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                placeholder="e.g. 1d6 Fire"
                value={value()}
                onInput={(e) => setValue(e.currentTarget.value)}
              />
            </Show>
          </div>
          <Show when={!isTextValue()}>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">Set the value to 0 to remove the condition.</p>
          </Show>
        </Show>

        {/* Effects preview */}
        <Show when={(conditionData()?.effects.length ?? 0) > 0}>
          <div class="mb-4 space-y-1">
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Effects:</p>
            <For each={conditionData()!.effects}>
              {(effect) => (
                <p class="text-xs text-slate-600 dark:text-slate-400">
                  • {effect.description.replace("X", String(value()))}
                </p>
              )}
            </For>
          </div>
        </Show>

        {/* Special effects */}
        <Show when={(conditionData()?.specialEffects?.length ?? 0) > 0}>
          <div class="mb-4 space-y-1">
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Special:</p>
            <For each={conditionData()!.specialEffects ?? []}>
              {(effect) => (
                <p class="text-xs text-slate-600 dark:text-slate-400">
                  • {effect.replaceAll("X", String(value()))}
                </p>
              )}
            </For>
          </div>
        </Show>

        {/* Actions */}
        <div class="flex justify-between items-center gap-2">
          <button
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            onClick={handleRemove}
          >
            Remove
          </button>
          <div class="flex gap-2">
            <button
              class="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              onClick={props.onClose}
            >
              Cancel
            </button>
            <Show
              when={conditionData()?.hasValue}
              fallback={
                <button
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  onClick={props.onClose}
                >
                  Close
                </button>
              }
            >
              <button
                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={isTextValue() && String(value()).trim() === ""}
              >
                Save
              </button>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
