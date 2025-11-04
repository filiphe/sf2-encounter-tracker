

export default function ActiveEncounterRow(props) {
    return (
        <tr class="m-8" onDblClick={() => {
            props.setSelectedCreatures(props.selectedCreatures().filter(creature => creature.id !== props.creature.id));
        }}>
            <td class="text-center">
                {props.creature.initiative}
            </td>
            <td class="text-center">
                {props.creature.ac}
            </td>
            <td class="text-right">
                <input
                    class="bg-amber-200 rounded-lg m-1"
                    type="number"
                    style="width: 40px; text-align: center;"
                    value={Number(props.creature.hp.split(" ")[0])}
                    placeholder="HP"
                    />
            </td>
            <td class="text-center">
                {props.creature.name}
            </td>
        </tr>
    )
}