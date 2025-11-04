
function getRandomId() {
    return Math.floor(Math.random() * 1000000);
}

function getRandomD20() {
    return Math.floor(Math.random() * 20) + 1;
}

export default function CreatureRow(props) {
    return (
        <tr>
            <td>{props.creature.name}</td>
            <td>{props.creature.level}</td>
            <td>
                <button onClick={() => {
                    const currentCreature = { ...props.creature };
                    currentCreature.id = getRandomId();
                    currentCreature.initiative = Number(props.creature.perception.replace("+","")) + getRandomD20();
                    props.setSelectedCreatures(() => [...props.selectedCreatures(), currentCreature]);
                }}>Add</button>
            </td>
        </tr>
    )
}