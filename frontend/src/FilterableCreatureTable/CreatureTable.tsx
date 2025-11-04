import { children, createSignal } from "solid-js";
import CreatureRow from "./CreatureRow";
import CreatureTableHeader from "./CreatureTableHeader";

export default function CreatureTable(props) {

    const safeLoading = children(() => props.loading);
    const safeCreatures = children(() => props.creatures);

    const filteredCreatures = () => {
        return safeCreatures().filter((creature) =>
            creature.name.toLowerCase().includes(props.filterText().toLowerCase()) &&
            creature.level >= props.minLevel() &&
            creature.level <= props.maxLevel()
        );
    }

    return (
        <div>
            <Show when={safeLoading()}>
                <p>Loading creatures...</p>
            </Show>
            <Show when={!safeLoading()}>
                <table>
                    <CreatureTableHeader />
                    <tbody>
                        <For each={filteredCreatures()}>
                            {(creature) => <CreatureRow creature={creature} selectedCreatures={props.selectedCreatures} setSelectedCreatures={props.setSelectedCreatures}/>}
                        </For>
                    </tbody>
                </table>
            </Show>
        </div>
    )
}
