import { Show } from "solid-js";
import { AppliedCondition } from "../utils/conditionEffects";
import { getConditionById } from "../data/conditions";

interface ConditionBadgeProps {
  condition: AppliedCondition;
  onRemove?: () => void;
  onClick?: () => void;
  size?: "sm" | "md";
}

export default function ConditionBadge(props: ConditionBadgeProps) {
  const conditionData = () => getConditionById(props.condition.conditionId);
  const displayName = () =>
    props.condition.value !== undefined
      ? `${props.condition.name} ${props.condition.value}`
      : props.condition.name;

  const sizeClasses = () => props.size === "sm" ? "text-xs px-1.5 py-0.5" : "text-sm px-2 py-1";

  const title = () => {
    const summary = conditionData()?.summary;
    if (props.onClick) return summary ? `${summary} (click to edit)` : "Click to edit";
    return summary;
  };

  return (
    <span
      class={`inline-flex items-center gap-1 ${sizeClasses()} rounded font-medium text-white ${props.condition.color} ${
        props.onClick ? "cursor-pointer hover:opacity-80" : ""
      } transition-opacity`}
      title={title()}
      onClick={(e) => {
        e.stopPropagation();
        props.onClick?.();
      }}
    >
      {displayName()}
      <Show when={props.onRemove}>
        <button
          class="ml-0.5 hover:text-red-200 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            props.onRemove?.();
          }}
          title={`Remove ${displayName()}`}
        >
          ✕
        </button>
      </Show>
    </span>
  );
}
