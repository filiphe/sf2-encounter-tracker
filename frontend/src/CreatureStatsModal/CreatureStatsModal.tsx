import { createSignal, createMemo, Show, For } from "solid-js";
import AbilityModal from "../components/AbilityModal";
import ConditionBadge from "../components/ConditionBadge";
import { parseCreatureAbilities, isAttack, cleanAbilityName } from "../utils/abilitySearch";
import { AppliedCondition, getModifiedStat, getAllModifiers, getSpecialEffects, parseStatValue, formatStatValue } from "../utils/conditionEffects";

interface CreatureStatsModalProps {
  creature: any;
  onClose: () => void;
  onUpdateHp: (hp: number) => void;
  variant?: "modal" | "panel";
}

interface ParsedAbility {
  raw: string;
  name: string;
  isAttack: boolean;
}

function CreatureStatsContent(props: { creature: any; onUpdateHp: (hp: number) => void; currentHp: () => number; setCurrentHp: (hp: number) => void }) {
  const [selectedAbility, setSelectedAbility] = createSignal<string | null>(null);

  const handleHpChange = (newHp: number) => {
    props.setCurrentHp(newHp);
    props.onUpdateHp(newHp);
  };

  // Parse creature abilities into individual entries
  const parsedAbilities = createMemo((): ParsedAbility[] => {
    const rawAbilities = parseCreatureAbilities(props.creature.creature_ability);
    return rawAbilities.map(raw => ({
      raw,
      name: cleanAbilityName(raw),
      isAttack: isAttack(raw)
    }));
  });

  // Separate abilities from attacks
  const abilities = createMemo(() => parsedAbilities().filter(a => !a.isAttack));
  const attacks = createMemo(() => parsedAbilities().filter(a => a.isAttack));

  // Conditions on this creature
  const conditions = createMemo((): AppliedCondition[] => props.creature.conditions ?? []);
  const allModifiers = createMemo(() => getAllModifiers(conditions()));
  const specialEffects = createMemo(() => getSpecialEffects(conditions()));

  // Modified stats
  const modifiedAc = createMemo(() => getModifiedStat(parseStatValue(props.creature.ac), conditions(), "ac"));
  const modifiedPerception = createMemo(() => getModifiedStat(parseStatValue(props.creature.perception), conditions(), "perception"));
  const modifiedFortitude = createMemo(() => getModifiedStat(parseStatValue(props.creature.fortitude), conditions(), "fortitude"));
  const modifiedReflex = createMemo(() => getModifiedStat(parseStatValue(props.creature.reflex), conditions(), "reflex"));
  const modifiedWill = createMemo(() => getModifiedStat(parseStatValue(props.creature.will), conditions(), "will"));

  // Helper to render a stat with modifiers
  const renderStat = (label: string, baseValue: string, modified: ReturnType<typeof getModifiedStat>) => {
    const hasModifiers = modified.modifiers.length > 0;
    return (
      <div class={`text-center p-2 rounded-lg ${hasModifiers ? "bg-orange-100 dark:bg-orange-900/30" : "bg-slate-100 dark:bg-slate-800"}`}>
        <p class="font-semibold text-slate-700 dark:text-slate-300">{label}</p>
        <p class={hasModifiers ? "text-orange-600 dark:text-orange-400 font-bold" : "text-slate-800 dark:text-slate-200"}>
          {hasModifiers ? (
            <span title={modified.modifiers.map(m => `${formatStatValue(m.value)} (${m.source})`).join(", ")}>
              {modified.finalValue}
              <span class="text-xs ml-1 opacity-70">({baseValue})</span>
            </span>
          ) : (
            baseValue
          )}
        </p>
      </div>
    );
  };

  return (
    <>
      {/* Active Conditions */}
      <Show when={conditions().length > 0}>
        <div class="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <p class="font-semibold text-slate-700 dark:text-slate-300 mb-2">Active Conditions</p>
          <div class="flex flex-wrap gap-1.5 mb-2">
            <For each={conditions()}>
              {(condition) => <ConditionBadge condition={condition} size="md" />}
            </For>
          </div>
          {/* Numeric modifiers */}
          <Show when={allModifiers().length > 0}>
            <div class="text-xs space-y-0.5">
              <p class="font-semibold text-slate-500 dark:text-slate-400 uppercase">Modifiers:</p>
              <For each={allModifiers()}>
                {(mod) => (
                  <p class={mod.value < 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
                    {mod.description} <span class="opacity-70">({mod.source})</span>
                  </p>
                )}
              </For>
            </div>
          </Show>
          {/* Special effects */}
          <Show when={specialEffects().length > 0}>
            <div class="text-xs space-y-0.5 mt-2">
              <p class="font-semibold text-slate-500 dark:text-slate-400 uppercase">Special:</p>
              <For each={specialEffects()}>
                {(effect) => (
                  <p class="text-slate-600 dark:text-slate-400">• {effect}</p>
                )}
              </For>
            </div>
          </Show>
        </div>
      </Show>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="space-y-1">
          <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Level:</span> {props.creature.level}</p>
          <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Size:</span> {props.creature.size}</p>
          <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Traits:</span> {props.creature.trait}</p>
        </div>
        <div class="space-y-1">
          <p class="text-slate-700 dark:text-slate-300 flex items-center gap-1 whitespace-nowrap">
            <span class="font-semibold">HP:</span>
            <input
              class="bg-amber-200 dark:bg-amber-600 rounded px-2 py-1 w-16 text-center text-slate-800 dark:text-slate-100 font-semibold"
              type="number"
              value={props.currentHp()}
              onInput={(e) => handleHpChange(Number(e.currentTarget.value))}
            />
            <span>/ {props.creature.hp}</span>
          </p>
          <p class="text-slate-700 dark:text-slate-300">
            <span class="font-semibold">AC:</span>{" "}
            <Show when={modifiedAc().modifiers.length > 0}>
              <span class="text-orange-600 dark:text-orange-400 font-semibold" title={modifiedAc().modifiers.map(m => `${formatStatValue(m.value)} (${m.source})`).join(", ")}>
                {modifiedAc().finalValue}
              </span>
              <span class="text-slate-500 dark:text-slate-400 text-sm"> ({props.creature.ac})</span>
            </Show>
            <Show when={modifiedAc().modifiers.length === 0}>
              {props.creature.ac}
            </Show>
          </p>
          <p class="text-slate-700 dark:text-slate-300">
            <span class="font-semibold">Perception:</span>{" "}
            <Show when={modifiedPerception().modifiers.length > 0}>
              <span class="text-orange-600 dark:text-orange-400 font-semibold" title={modifiedPerception().modifiers.map(m => `${formatStatValue(m.value)} (${m.source})`).join(", ")}>
                {formatStatValue(modifiedPerception().finalValue)}
              </span>
              <span class="text-slate-500 dark:text-slate-400 text-sm"> ({props.creature.perception})</span>
            </Show>
            <Show when={modifiedPerception().modifiers.length === 0}>
              {props.creature.perception}
            </Show>
          </p>
          <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Speed:</span> {props.creature.speed}</p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-4">
        {renderStat("Fortitude", String(props.creature.fortitude), modifiedFortitude())}
        {renderStat("Reflex", String(props.creature.reflex), modifiedReflex())}
        {renderStat("Will", String(props.creature.will), modifiedWill())}
      </div>

      {/* Abilities - clickable */}
      <Show when={abilities().length > 0}>
        <div class="mb-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p class="font-semibold text-slate-700 dark:text-slate-300 mb-2">Abilities</p>
          <div class="flex flex-wrap gap-1.5">
            <For each={abilities()}>
              {(ability) => (
                <button
                  class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded text-sm transition-colors cursor-pointer"
                  onClick={() => setSelectedAbility(ability.name)}
                  title={`Click to view details for ${ability.name}`}
                >
                  {ability.name}
                  <span class="text-xs opacity-60">🔗</span>
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* Attacks/Strikes - not clickable */}
      <Show when={attacks().length > 0}>
        <div class="mb-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p class="font-semibold text-slate-700 dark:text-slate-300 mb-1">Attacks</p>
          <p class="text-slate-800 dark:text-slate-200 text-sm">
            <For each={attacks()}>
              {(attack, index) => (
                <>
                  {index() > 0 && ", "}
                  {attack.raw}
                </>
              )}
            </For>
          </p>
        </div>
      </Show>

      {/* Fallback: if no abilities parsed but creature_ability exists, show raw */}
      <Show when={parsedAbilities().length === 0 && props.creature.creature_ability}>
        <div class="mb-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p class="font-semibold text-slate-700 dark:text-slate-300 mb-1">Abilities</p>
          <p class="text-slate-800 dark:text-slate-200 text-sm">{props.creature.creature_ability}</p>
        </div>
      </Show>

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

      {/* Ability detail modal */}
      <Show when={selectedAbility()}>
        <AbilityModal
          abilityName={selectedAbility()!}
          creatureName={props.creature.name}
          onClose={() => setSelectedAbility(null)}
        />
      </Show>
    </>
  );
}

export default function CreatureStatsModal(props: CreatureStatsModalProps) {
  const variant = () => props.variant ?? "modal";
  const [currentHp, setCurrentHp] = createSignal(
    props.creature.currentHp ?? Number(props.creature.hp.split(" ")[0])
  );

  const header = (
    <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
      <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">{props.creature.name}</h2>
      <button
        class="text-xl text-slate-400 hover:text-red-500 transition-colors"
        onClick={props.onClose}
      >
        ✕
      </button>
    </div>
  );

  const content = (
    <CreatureStatsContent
      creature={props.creature}
      onUpdateHp={props.onUpdateHp}
      currentHp={currentHp}
      setCurrentHp={setCurrentHp}
    />
  );

  // Panel variant: side panel, no overlay
  if (variant() === "panel") {
    return (
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-200 dark:border-slate-700 max-h-[600px] overflow-y-auto xl:sticky xl:top-4">
        {header}
        {content}
      </div>
    );
  }

  // Modal variant: centered overlay (default)
  return (
    <div
      class="fixed inset-0 flex items-center justify-center z-50" style="background-color: rgba(0, 0, 0, 0.3)"
      onClick={(e) => {
        if (e.target === e.currentTarget) props.onClose();
      }}
    >
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto m-4 border border-slate-200 dark:border-slate-700">
        <div class="flex justify-between items-center mb-6 pb-3 border-b border-slate-200 dark:border-slate-700">
          <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100">{props.creature.name}</h2>
          <button
            class="text-2xl text-slate-400 hover:text-red-500 transition-colors"
            onClick={props.onClose}
          >
            ✕
          </button>
        </div>
        {content}
      </div>
    </div>
  );
}
