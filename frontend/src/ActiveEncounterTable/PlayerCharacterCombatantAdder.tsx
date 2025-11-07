
function getRandomId() {
    return Math.floor(Math.random() * 1000000);
}

function getRandomD20() {
    return Math.floor(Math.random() * 20) + 1;
}

function getCurrentActiveCombatant(sortedSelectedCreatures) {
    for (let creature of sortedSelectedCreatures()) {
        if (creature.activeCombatant) {
            return creature;
        }
    }
    return null;
}

function setNextActiveCombatant(sortedSelectedCreatures, setSelectedCreatures) {
    const currentActive = getCurrentActiveCombatant(sortedSelectedCreatures);
    let nextActiveIndex = 0;
    if (currentActive) {
        const currentIndex = sortedSelectedCreatures().findIndex(creature => creature.id === currentActive.id);
        nextActiveIndex = (currentIndex + 1) % sortedSelectedCreatures().length;
    }
    const updatedCreatures = sortedSelectedCreatures().map((creature, index) => {
        return {
            ...creature,
            activeCombatant: index === nextActiveIndex
        };
    });
    setSelectedCreatures(updatedCreatures);
}

export default function PlayerCharacterCombatantAdder(props) {
    return (
        <div class="m-3">
            <button class="bg-red-400 rounded-xl p-2 m-1 shadow-lg" onClick={() => {
                setNextActiveCombatant(props.sortedSelectedCreatures, props.setSelectedCreatures);
            }}>⏩</button>
            <input class="rounded-xl p-2 m-1 shadow-xl" type="number" placeholder="Initiative skill value" id="pcPerception" style="width: 80px"/>
            <input class="rounded-xl p-2 m-1 shadow-xl" type="text" placeholder="Player Character Name" id="pcName" />
            <input class="rounded-xl p-2 m-1 shadow-xl" type="number" placeholder="AC" id="pcAC" style="width: 40px"/>
            <button class="font-bold bg-blue-500 rounded-xl p-2 m-1 shadow-lg" onClick={() => {
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
            <button class="font-bold bg-blue-500 rounded-xl p-2 m-1 shadow-lg" onClick={() => props.setSelectedCreatures([])}>Clear All</button>
        </div>
    )
}