import { children, Show, For } from "solid-js";
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
        <div class="font-bold">
            <Show when={safeLoading()}>
                <p class="text-slate-600 dark:text-slate-400">Loading creatures...</p>
            </Show>
            <Show when={!safeLoading()}>
                <div class="max-h-[500px] overflow-y-auto pr-2">
                    <CreatureTableHeader />
                    <For each={filteredCreatures()}>
                        {(creature) => <CreatureRow creature={creature} selectedCreatures={props.selectedCreatures} setSelectedCreatures={props.setSelectedCreatures}/>}
                    </For>
                </div>
            </Show>
        </div>
    )
}
