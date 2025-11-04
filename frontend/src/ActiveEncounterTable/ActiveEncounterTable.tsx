import { For, Show } from "solid-js";

import ActiveEncounterRow from "./ActiveEncounterRow";
import PlayerCharacterCombatantAdder from "./PlayerCharacterCombatantAdder";

export default function ActiveEncounterTable(props) {
    return (
        <>
            <div>
                <PlayerCharacterCombatantAdder selectedCreatures={props.selectedCreatures} setSelectedCreatures={props.setSelectedCreatures} />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Initiative</th>
                        <th>AC</th>
                        <th>HP</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    <Show when={props.selectedCreatures().length === 0}>
                        <tr>
                            <td colspan="4">No combatants added yet.</td>
                        </tr>
                    </Show>
                    <For each={props.sortedSelectedCreatures()}>
                        {(creature, index) =>
                            <ActiveEncounterRow creature={creature} selectedCreatures={props.selectedCreatures} setSelectedCreatures={props.setSelectedCreatures} />
                        }
                    </For>
                </tbody>
            </table>
        </>
    )
}