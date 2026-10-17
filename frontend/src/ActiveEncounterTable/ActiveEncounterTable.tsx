import { For, Show, createSignal } from "solid-js";

import ActiveEncounterRow from "./ActiveEncounterRow";
import PlayerCharacterCombatantAdder from "./PlayerCharacterCombatantAdder";
import CreatureStatsModal from "../CreatureStatsModal/CreatureStatsModal";
import { useMediaQuery } from "../hooks/useMediaQuery";

export default function ActiveEncounterTable(props) {
    const [selectedCreature, setSelectedCreature] = createSignal<any>(null);
    // Show side panel on xl screens (1280px+) where there's enough room
    const isWideScreen = useMediaQuery("(min-width: 1280px)");

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
            <div class="flex flex-col xl:flex-row gap-4">
                <div class="flex-1 min-w-0">
                    <div class="grid grid-cols-[3rem_2.25rem_3.5rem_1fr_1.5rem] gap-1 border-b border-slate-300 dark:border-slate-600 pb-1.5 mb-2 text-sm">
                        <p class="text-center font-semibold text-slate-700 dark:text-slate-300">Init</p>
                        <p class="text-center font-semibold text-slate-700 dark:text-slate-300">AC</p>
                        <p class="text-center font-semibold text-slate-700 dark:text-slate-300">HP</p>
                        <p class="text-left font-semibold text-slate-700 dark:text-slate-300">Name</p>
                        <p></p>
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
                                    onClick={() => {
                                        // Don't open stats for player characters
                                        if (!creature.isPlayerCharacter) {
                                            setSelectedCreature(creature);
                                        }
                                    }}
                                />
                            }
                        </For>
                    </div>
                </div>
                {/* Side panel on wide screens */}
                <Show when={selectedCreature() && isWideScreen()}>
                    <div class="xl:w-80 xl:shrink-0">
                        <CreatureStatsModal
                            creature={selectedCreature()}
                            onClose={() => setSelectedCreature(null)}
                            onUpdateHp={(hp) => handleUpdateHp(selectedCreature().id, hp)}
                            variant="panel"
                        />
                    </div>
                </Show>
            </div>
            {/* Modal overlay on small screens */}
            <Show when={selectedCreature() && !isWideScreen()}>
                <CreatureStatsModal
                    creature={selectedCreature()}
                    onClose={() => setSelectedCreature(null)}
                    onUpdateHp={(hp) => handleUpdateHp(selectedCreature().id, hp)}
                    variant="modal"
                />
            </Show>
        </>
    )
}
