
function getRandomId() {
    return Math.floor(Math.random() * 1000000);
}

function getRandomD20() {
    return Math.floor(Math.random() * 20) + 1;
}

export default function PlayerCharacterCombatantAdder(props) {
    return (
        <div>
            <input type="number" placeholder="Initiative skill value" id="pcPerception" style="width: 80px"/>
            <input type="text" placeholder="Player Character Name" id="pcName" />
            <input type="number" placeholder="AC" id="pcAC" style="width: 40px"/>
            <button onClick={() => {
                const pcCombatant = {
                    name: document.getElementById("pcName").value,
                    perception: document.getElementById("pcPerception").value,
                    ac: document.getElementById("pcAC").value,
                    hp: "0",
                    id: getRandomId(),
                    initiative: Number(document.getElementById("pcPerception").value) + getRandomD20(),
                };
                props.setSelectedCreatures(() => [...props.selectedCreatures(), pcCombatant]);
                document.getElementById("pcName").value = "";
                document.getElementById("pcPerception").value = "";
                document.getElementById("pcAC").value = "";
            }}>Add Player Character</button>
            <button onClick={() => props.setSelectedCreatures([])}>Clear All</button>
        </div>
    )
}