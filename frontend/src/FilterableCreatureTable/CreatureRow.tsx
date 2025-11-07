
function getRandomId() {
    return Math.floor(Math.random() * 1000000);
}

function getRandomD20() {
    return Math.floor(Math.random() * 20) + 1;
}

export default function CreatureRow(props) {
    return (
        <div class="grid grid-cols-2 w-3/4 dark:odd:bg-gray-500 odd:bg-gray-300" onClick={() => {
            const currentCreature = { ...props.creature };
            currentCreature.id = getRandomId();
            currentCreature.initiative = Number(props.creature.perception.replace("+","")) + getRandomD20();
            currentCreature.activeCombatant = false;
            props.setSelectedCreatures(() => [...props.selectedCreatures(), currentCreature]);
        }}>
            <div>{props.creature.name}</div>
            <div class="text-center">{props.creature.level}</div>
        </div>
    )
}