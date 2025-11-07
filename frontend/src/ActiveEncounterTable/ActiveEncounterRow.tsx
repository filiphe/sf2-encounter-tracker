

export default function ActiveEncounterRow(props) {
    const isActiveCombatant = props.creature.activeCombatant;
    return (
        <div class="font-bold grid col-span-4 m-1 {{ ${isActiveCombatant} ? 'bg-red-500' : '' }} odd:bg-gray-300 dark:odd:bg-gray-500" onDblClick={() => {
            props.setSelectedCreatures(props.selectedCreatures().filter(creature => creature.id !== props.creature.id));
        }}>
            <div class="grid grid-cols-4">
                <p>{isActiveCombatant ? '👉' :''} {props.creature.initiative}</p>
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