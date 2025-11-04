

export default function ActiveEncounterRow(props) {
    return (
        <tr onDblClick={() => {
            props.setSelectedCreatures(props.selectedCreatures().filter(creature => creature.id !== props.creature.id));
        }}>
            <td>
                {props.creature.initiative}
            </td>
            <td>
                {props.creature.ac}
            </td>
            <td>
                <input
                    type="number"
                    style="width: 40px"
                    value={Number(props.creature.hp.split(" ")[0])}
                    placeholder="HP"
                    />
            </td>
            <td>
                {props.creature.name}
            </td>
        </tr>
    )
}