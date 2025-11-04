import { For, Show } from "solid-js";

import ActiveEncounterRow from "./ActiveEncounterRow";
import PlayerCharacterCombatantAdder from "./PlayerCharacterCombatantAdder";

export default function ActiveEncounterTable(props) {
    return (
        <>
            <div>
                <PlayerCharacterCombatantAdder selectedCreatures={props.selectedCreatures} setSelectedCreatures={props.setSelectedCreatures} />
            </div>
            <table class="table-fixed m-3">
                <thead>
                    <tr class="border-b-2 border-gray-300">
                        <th class="p-3">Initiative</th>
                        <th class="p-3">AC</th>
                        <th class="p-3">HP</th>
                        <th class="p-3">Name</th>
                    </tr>
                </thead>
                <tbody>
                    <Show when={props.selectedCreatures().length === 0}>
                        <tr>
                            <td colspan="4">No combatants added yet.</td>
                        </tr>
                    </Show>
                    <For each={props.sortedSelectedCreatures()}>
                        {(creature) =>
                            <ActiveEncounterRow creature={creature} selectedCreatures={props.selectedCreatures} setSelectedCreatures={props.setSelectedCreatures} />
                        }
                    </For>
                </tbody>
            </table>
        </>
    )
}