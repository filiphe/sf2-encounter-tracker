

import { createSignal } from "solid-js";

export default function ActiveEncounterRow(props: any) {
    const isActiveCombatant = props.creature.activeCombatant;
    const [localInitiative, setLocalInitiative] = createSignal(String(props.creature.initiative ?? ""));
    return (
        <div class="font-bold grid col-span-4 m-1 {{ ${isActiveCombatant} ? 'bg-red-500' : '' }} odd:bg-gray-300 dark:odd:bg-gray-500" onDblClick={() => {
            props.setSelectedCreatures(props.selectedCreatures().filter((creature: any) => creature.id !== props.creature.id));
        }}>
            <div class="grid grid-cols-4">
                <div class="flex items-center">
                    <span>{isActiveCombatant ? '👉' : ''}</span>
                    <input
                        class="bg-transparent w-12 text-center mx-1"
                        type="text"
                        value={localInitiative()}
                        onInput={(e) => {
                            setLocalInitiative(e.currentTarget.value);
                        }}
                        onBlur={() => {
                            const raw = localInitiative();
                            const val = raw === '' ? '' : Number(raw);
                            props.setSelectedCreatures(
                                props.selectedCreatures().map((c: any) =>
                                    c.id === props.creature.id ? { ...c, initiative: val } : c
                                )
                            );
                        }}
                    />
                </div>
                <p>{props.creature.ac}</p>
                <input
                    class="bg-amber-200 dark:bg-amber-600 rounded-lg m-1"
                    type="number"
                    style="width: 40px; text-align: center;"
                    value={Number(props.creature.hp.split(" ")[0])}
                    placeholder="HP"
                    />
                <p>{props.creature.name}</p>
            </div>
        </div>
    )
}