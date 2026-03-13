import { For, Show, createSignal } from "solid-js";

import ActiveEncounterRow from "./ActiveEncounterRow";
import PlayerCharacterCombatantAdder from "./PlayerCharacterCombatantAdder";
import CreatureStatsModal from "../CreatureStatsModal/CreatureStatsModal";

export default function ActiveEncounterTable(props) {
    const [selectedCreature, setSelectedCreature] = createSignal<any>(null);

    const handleUpdateHp = (creatureId: number, newHp: number) => {
        const updatedCreatures = props.selectedCreatures().map((c: any) =>
            c.id === creatureId ? { ...c, currentHp: newHp } : c
        );
        props.setSelectedCreatures(updatedCreatures);
        setSelectedCreature(updatedCreatures.find((c: any) => c.id === creatureId));
    };

    return (
        <>
            <div class="mb-3">
                <PlayerCharacterCombatantAdder sortedSelectedCreatures={props.sortedSelectedCreatures} selectedCreatures={props.selectedCreatures} setSelectedCreatures={props.setSelectedCreatures} />
            </div>
            <div class="grid grid-cols-5 border-b border-slate-300 dark:border-slate-600 pb-2 mb-2">
                <p class="col-span-1 text-center font-semibold text-slate-700 dark:text-slate-300">Initiative</p>
                <p class="col-span-1 text-center font-semibold text-slate-700 dark:text-slate-300">AC</p>
                <p class="col-span-1 text-center font-semibold text-slate-700 dark:text-slate-300">HP</p>
                <p class="col-span-1 text-left pl-2 font-semibold text-slate-700 dark:text-slate-300">Name</p>
                <p class="col-span-1"></p>
            </div>
            <Show when={props.selectedCreatures().length === 0}>
                <div class="text-slate-500 dark:text-slate-400 py-4">No combatants added yet.</div>
            </Show>
            <div class="max-h-[400px] overflow-y-auto pr-2">
                <For each={props.sortedSelectedCreatures()}>
                    {(creature) =>
                        <ActiveEncounterRow 
                            creature={creature} 
                            selectedCreatures={props.selectedCreatures} 
                            setSelectedCreatures={props.setSelectedCreatures}
                            onClick={() => setSelectedCreature(creature)}
                        />
                    }
                </For>
            </div>
            <Show when={selectedCreature()}>
                <CreatureStatsModal 
                    creature={selectedCreature()} 
                    onClose={() => setSelectedCreature(null)}
                    onUpdateHp={(hp) => handleUpdateHp(selectedCreature().id, hp)}
                />
            </Show>
        </>
    )
}