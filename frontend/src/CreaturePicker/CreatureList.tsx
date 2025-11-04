import { children, createSignal } from "solid-js";
import CreatureListEntry from "./CreatureListEntry";

export default function CreatureList(props) {

    const [content, setContent] = createSignal("");

    const safeLoading = children(() => props.loading);
    const safeCreatures = children(() => props.creatures);

    const filteredCreatures = () => {
        return safeCreatures().filter((creature) =>
            creature.name.toLowerCase().includes(content().toLowerCase())
        );
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Search creatures..."
                onInput={(e) => setContent(e.currentTarget.value)}
            />
            <Show when={safeLoading()}>
                <p>Loading creatures...</p>
            </Show>
            <Show when={!safeLoading()}>
                <ul>
                <For each={filteredCreatures()}>
                    {(creature) => <CreatureListEntry name={creature.name} level={creature.level} />}
                </For>
                </ul>
            </Show>
        </div>
    )
}
