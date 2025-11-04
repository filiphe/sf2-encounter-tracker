
function getRandomId() {
    return Math.floor(Math.random() * 1000000);
}

function getRandomD20() {
    return Math.floor(Math.random() * 20) + 1;
}

export default function CreatureRow(props) {
    return (
        <tr class="m-8" onClick={() => {
            const currentCreature = { ...props.creature };
            currentCreature.id = getRandomId();
            currentCreature.initiative = Number(props.creature.perception.replace("+","")) + getRandomD20();
            props.setSelectedCreatures(() => [...props.selectedCreatures(), currentCreature]);
        }}>
            <td class="text-right">{props.creature.name}</td>
            <td class="text-right">{props.creature.level}</td>
        </tr>
    )
}