import { For, Show } from "solid-js";

import ActiveEncounterRow from "./ActiveEncounterRow";
import PlayerCharacterCombatantAdder from "./PlayerCharacterCombatantAdder";

export default function ActiveEncounterTable(props) {
    return (
        <>
            <div>
                <PlayerCharacterCombatantAdder sortedSelectedCreatures={props.sortedSelectedCreatures} selectedCreatures={props.selectedCreatures} setSelectedCreatures={props.setSelectedCreatures} />
            </div>
            <div class="grid grid-cols-4 w-3/4 m-3">
                <div class="grid col-span-4 border-b-2 border-gray-300">
                    <div class="grid grid-cols-4">
                        <p>Initiative</p>
                        <p>AC</p>
                        <p>HP</p>
                        <p>Name</p>
                    </div>
                </div>
                <Show when={props.selectedCreatures().length === 0}>
                        <div class="grid col-span-4">No combatants added yet.</div>
                </Show>
                <For each={props.sortedSelectedCreatures()}>
                    {(creature) =>
                        <ActiveEncounterRow creature={creature} selectedCreatures={props.selectedCreatures} setSelectedCreatures={props.setSelectedCreatures} />
                    }
                </For>
            </div>
        </>
    )
}