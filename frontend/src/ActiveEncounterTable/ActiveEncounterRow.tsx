import { createSignal, createMemo } from "solid-js";

export default function ActiveEncounterRow(props: any) {
  const isActiveCombatant = props.creature.activeCombatant;
  const [localInitiative, setLocalInitiative] = createSignal(
    String(props.creature.initiative ?? ""),
  );

  const maxHp = createMemo(() => Number(props.creature.hp.split(" ")[0]));
  const currentHp = createMemo(() => props.creature.currentHp ?? maxHp());
  const hpPercentage = createMemo(() => (currentHp() / maxHp()) * 100);

  const hpColor = createMemo(() => {
    const pct = hpPercentage();
    if (pct > 50) return "bg-green-500";
    if (pct > 25) return "bg-yellow-500";
    return "bg-red-500";
  });

  return (
    <div
      class={`grid grid-cols-5 gap-2 items-center py-2 px-1 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${isActiveCombatant ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
      onClick={() => props.onClick?.()}
      onDblClick={() => {
        props.setSelectedCreatures(
          props
            .selectedCreatures()
            .filter((creature: any) => creature.id !== props.creature.id),
        );
      }}
    >
      <div class="flex items-center justify-center">
        <span>{isActiveCombatant ? "👉" : ""}</span>
        <input
          class="bg-transparent w-12 text-center text-slate-800 dark:text-slate-200"
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
      <p class="text-center text-slate-800 dark:text-slate-200">{props.creature.ac}</p>
      <div class="flex justify-center">
        <input
          class={`${hpColor()} rounded-lg text-center text-white font-bold w-12`}
          type="number"
          value={currentHp()}
          placeholder="HP"
        />
      </div>
      <p class="truncate text-slate-800 dark:text-slate-200">{props.creature.name}</p>
      <button
        class="text-slate-400 hover:text-red-500 text-center transition-colors"
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
