import { createSignal, Show } from "solid-js";

interface CreatureStatsModalProps {
  creature: any;
  onClose: () => void;
  onUpdateHp: (hp: number) => void;
}

export default function CreatureStatsModal(props: CreatureStatsModalProps) {
  const [currentHp, setCurrentHp] = createSignal(
    props.creature.currentHp ?? Number(props.creature.hp.split(" ")[0])
  );

  const handleHpChange = (newHp: number) => {
    setCurrentHp(newHp);
    props.onUpdateHp(newHp);
  };

  return (
    <div
      class="fixed inset-0 flex items-center justify-center z-50" style="background-color: rgba(0, 0, 0, 0.3)"
      onClick={(e) => {
        if (e.target === e.currentTarget) props.onClose();
      }}
    >
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4 border border-slate-200 dark:border-slate-700">
        <div class="flex justify-between items-center mb-6 pb-3 border-b border-slate-200 dark:border-slate-700">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">{props.creature.name}</h2>
          <button
            class="text-2xl text-slate-400 hover:text-red-500 transition-colors"
            onClick={props.onClose}
          >
            ✕
          </button>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="space-y-1">
            <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Level:</span> {props.creature.level}</p>
            <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Size:</span> {props.creature.size}</p>
            <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Traits:</span> {props.creature.trait}</p>
          </div>
          <div class="space-y-1">
            <p class="text-slate-700 dark:text-slate-300">
              <span class="font-semibold">HP:</span>{" "}
              <input
                class="bg-amber-200 dark:bg-amber-600 rounded px-2 py-1 w-20 text-center text-slate-800 dark:text-slate-100 font-semibold"
                type="number"
                value={currentHp()}
                onInput={(e) => handleHpChange(Number(e.currentTarget.value))}
              />{" "}
              / {props.creature.hp}
            </p>
            <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">AC:</span> {props.creature.ac}</p>
            <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Speed:</span> {props.creature.speed}</p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-4">
          <div class="text-center p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <p class="font-semibold text-slate-700 dark:text-slate-300">Fortitude</p>
            <p class="text-slate-800 dark:text-slate-200">{props.creature.fortitude}</p>
          </div>
          <div class="text-center p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <p class="font-semibold text-slate-700 dark:text-slate-300">Reflex</p>
            <p class="text-slate-800 dark:text-slate-200">{props.creature.reflex}</p>
          </div>
          <div class="text-center p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <p class="font-semibold text-slate-700 dark:text-slate-300">Will</p>
            <p class="text-slate-800 dark:text-slate-200">{props.creature.will}</p>
          </div>
        </div>

        <div class="mb-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p class="font-semibold text-slate-700 dark:text-slate-300 mb-1">Abilities</p>
          <p class="text-slate-800 dark:text-slate-200 text-sm">{props.creature.creature_ability}</p>
        </div>

        <Show when={props.creature.spell}>
          <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p class="font-semibold text-slate-700 dark:text-slate-300 mb-1">Spells</p>
            <p class="text-slate-800 dark:text-slate-200 text-sm">{props.creature.spell}</p>
          </div>
        </Show>

        <Show when={props.creature.immunity}>
          <div class="mb-3">
            <p class="font-semibold text-slate-700 dark:text-slate-300">Immunities</p>
            <p class="text-slate-600 dark:text-slate-400 text-sm">{props.creature.immunity}</p>
          </div>
        </Show>

        <Show when={props.creature.resistance}>
          <div class="mb-3">
            <p class="font-semibold text-slate-700 dark:text-slate-300">Resistances</p>
            <p class="text-slate-600 dark:text-slate-400 text-sm">{props.creature.resistance}</p>
          </div>
        </Show>

        <Show when={props.creature.weakness}>
          <div class="mb-3">
            <p class="font-semibold text-slate-700 dark:text-slate-300">Weaknesses</p>
            <p class="text-slate-600 dark:text-slate-400 text-sm">{props.creature.weakness}</p>
          </div>
        </Show>

        <Show when={props.creature.sense}>
          <div class="mb-3">
            <p class="font-semibold text-slate-700 dark:text-slate-300">Senses</p>
            <p class="text-slate-600 dark:text-slate-400 text-sm">{props.creature.sense}</p>
          </div>
        </Show>

        <Show when={props.creature.language}>
          <div class="mb-3">
            <p class="font-semibold text-slate-700 dark:text-slate-300">Languages</p>
            <p class="text-slate-600 dark:text-slate-400 text-sm">{props.creature.language}</p>
          </div>
        </Show>

        <div class="grid grid-cols-6 gap-2 mb-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div class="text-center"><span class="font-semibold text-slate-700 dark:text-slate-300">STR</span><br/><span class="text-slate-800 dark:text-slate-200">{props.creature.strength}</span></div>
          <div class="text-center"><span class="font-semibold text-slate-700 dark:text-slate-300">DEX</span><br/><span class="text-slate-800 dark:text-slate-200">{props.creature.dexterity}</span></div>
          <div class="text-center"><span class="font-semibold text-slate-700 dark:text-slate-300">CON</span><br/><span class="text-slate-800 dark:text-slate-200">{props.creature.constitution}</span></div>
          <div class="text-center"><span class="font-semibold text-slate-700 dark:text-slate-300">INT</span><br/><span class="text-slate-800 dark:text-slate-200">{props.creature.intelligence}</span></div>
          <div class="text-center"><span class="font-semibold text-slate-700 dark:text-slate-300">WIS</span><br/><span class="text-slate-800 dark:text-slate-200">{props.creature.wisdom}</span></div>
          <div class="text-center"><span class="font-semibold text-slate-700 dark:text-slate-300">CHA</span><br/><span class="text-slate-800 dark:text-slate-200">{props.creature.charisma}</span></div>
        </div>

        <Show when={props.creature.skill}>
          <div class="mb-4">
            <p class="font-semibold text-slate-700 dark:text-slate-300">Skills</p>
            <p class="text-slate-600 dark:text-slate-400 text-sm">{props.creature.skill}</p>
          </div>
        </Show>

        <div class="text-sm text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
          <p><span class="font-semibold">Source:</span> {props.creature.source}</p>
        </div>
      </div>
    </div>
  );
}