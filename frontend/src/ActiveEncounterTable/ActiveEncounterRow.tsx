import { createSignal, createMemo, Show } from "solid-js";

// Color palette for duplicate creature indicators
const DUPLICATE_COLORS = [
  "bg-red-500",      // 1st
  "bg-green-500",    // 2nd
  "bg-blue-500",     // 3rd
  "bg-purple-500",   // 4th
  "bg-pink-500",     // 5th
  "bg-amber-700",    // 6th (brown)
];

// Safely evaluate a basic arithmetic expression (supports +, -, *, /)
function evaluateExpression(expr: string, currentValue: number): number | null {
  const trimmed = expr.trim();
  if (trimmed === "") return null;

  // If it's a plain number, use it directly
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  // Check for arithmetic expression: number followed by operator and number
  const match = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)$/);
  if (match) {
    const left = parseFloat(match[1]);
    const operator = match[2];
    const right = parseFloat(match[3]);

    // Use currentValue as the left operand if the expression starts with an operator
    const actualLeft = match[1] === "" ? currentValue : left;

    switch (operator) {
      case "+": return actualLeft + right;
      case "-": return actualLeft - right;
      case "*": return actualLeft * right;
      case "/": return right !== 0 ? actualLeft / right : null;
      default: return null;
    }
  }

  // Expression starting with operator (e.g., "-10", "+5")
  const opMatch = trimmed.match(/^([+\-*/])\s*(-?\d+(?:\.\d+)?)$/);
  if (opMatch) {
    const operator = opMatch[1];
    const right = parseFloat(opMatch[2]);
    switch (operator) {
      case "+": return currentValue + right;
      case "-": return currentValue - right;
      case "*": return currentValue * right;
      case "/": return right !== 0 ? currentValue / right : null;
      default: return null;
    }
  }

  return null;
}

export default function ActiveEncounterRow(props: any) {
  const isActiveCombatant = props.creature.activeCombatant;
  const [localInitiative, setLocalInitiative] = createSignal(
    String(props.creature.initiative ?? ""),
  );
  const [localHp, setLocalHp] = createSignal("");

  const maxHp = createMemo(() => Number(props.creature.hp.split(" ")[0]));
  const currentHp = createMemo(() => props.creature.currentHp ?? maxHp());
  const hpPercentage = createMemo(() => (currentHp() / maxHp()) * 100);

  const hpColor = createMemo(() => {
    const pct = hpPercentage();
    if (pct > 50) return "bg-green-500";
    if (pct > 25) return "bg-yellow-500";
    return "bg-red-500";
  });

  // Find all creatures with the same name (to detect duplicates)
  const sameTypeCreatures = createMemo(() => {
    return props.selectedCreatures().filter((c: any) => c.name === props.creature.name);
  });

  // Index of this creature within its same-type group (by order added)
  const duplicateIndex = createMemo(() => {
    return sameTypeCreatures().findIndex((c: any) => c.id === props.creature.id);
  });

  // Color indicator - only show if there are multiple creatures of the same type
  const indicatorColor = createMemo(() => {
    if (sameTypeCreatures().length <= 1) return null;
    return DUPLICATE_COLORS[duplicateIndex() % DUPLICATE_COLORS.length];
  });

  const handleHpBlur = () => {
    const raw = localHp().trim();
    if (raw === "") {
      setLocalHp("");
      return;
    }
    const result = evaluateExpression(raw, currentHp());
    if (result !== null) {
      props.setSelectedCreatures(
        props
          .selectedCreatures()
          .map((c: any) =>
            c.id === props.creature.id ? { ...c, currentHp: Math.round(result) } : c,
          ),
      );
    }
    setLocalHp("");
  };

  return (
    <div
      class={`grid grid-cols-[3rem_2.25rem_3.5rem_1fr_1.5rem] gap-1 items-center py-1.5 px-1 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${isActiveCombatant ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
      onClick={() => props.onClick?.()}
      onDblClick={() => {
        props.setSelectedCreatures(
          props
            .selectedCreatures()
            .filter((creature: any) => creature.id !== props.creature.id),
        );
      }}
    >
      <div class="flex items-center justify-center gap-0.5" onClick={(e) => e.stopPropagation()}>
        <span class="text-xs w-3 text-center">{isActiveCombatant ? "👉" : ""}</span>
        <input
          class="bg-transparent w-7 text-center text-sm text-slate-800 dark:text-slate-200"
          type="text"
          value={localInitiative()}
          onInput={(e) => {
            setLocalInitiative(e.currentTarget.value);
          }}
          onBlur={() => {
            const raw = localInitiative();
            const val = raw === "" ? "" : Number(raw);
            props.setSelectedCreatures(
              props
                .selectedCreatures()
                .map((c: any) =>
                  c.id === props.creature.id ? { ...c, initiative: val } : c,
                ),
            );
          }}
        />
      </div>
      <p class="text-center text-sm text-slate-800 dark:text-slate-200">{props.creature.ac}</p>
      <div class="flex justify-center" onClick={(e) => e.stopPropagation()}>
        <input
          class={`${hpColor()} rounded px-1 py-0.5 text-center text-white font-bold text-sm w-12`}
          type="text"
          value={localHp() || currentHp()}
          placeholder="HP"
          title="Enter a number or expression (e.g., 50, -10, +5, 30*2)"
          onInput={(e) => {
            setLocalHp(e.currentTarget.value);
          }}
          onBlur={handleHpBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
        />
      </div>
      <p class="truncate text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1">
        <Show when={indicatorColor()}>
          <span
            class={`inline-block w-2 h-2 rounded-full shrink-0 ${indicatorColor()}`}
            title={`Duplicate #${duplicateIndex() + 1}`}
          />
        </Show>
        {props.creature.name}
      </p>
      <button
        class="text-slate-400 hover:text-red-500 text-center text-sm transition-colors px-1"
        onClick={(e) => {
          e.stopPropagation();
          props.setSelectedCreatures(
            props.selectedCreatures().filter((c: any) => c.id !== props.creature.id)
          );
        }}
      >
        🗑️
      </button>
    </div>
  );
}
