
function getRandomId() {
    return Math.floor(Math.random() * 1000000);
}

function getRandomD20() {
    return Math.floor(Math.random() * 20) + 1;
}

export default function CreatureRow(props) {
    return (
        <div 
            class="grid grid-cols-2 py-2 px-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
            onClick={() => {
                const currentCreature = { ...props.creature };
                currentCreature.id = getRandomId();
                currentCreature.initiative = Number(props.creature.perception.replace("+","")) + getRandomD20();
                currentCreature.activeCombatant = false;
                props.setSelectedCreatures(() => [...props.selectedCreatures(), currentCreature]);
            }}
        >
            <div class="text-slate-800 dark:text-slate-200 truncate">{props.creature.name}</div>
            <div class="text-center text-slate-600 dark:text-slate-400">{props.creature.level}</div>
        </div>
    )
}