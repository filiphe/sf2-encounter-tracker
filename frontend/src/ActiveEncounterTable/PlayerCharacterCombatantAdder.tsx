
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
        <div class="flex flex-wrap items-center gap-2">
            <button 
                class="px-3 py-1.5 bg-red-400 hover:bg-red-500 text-white rounded-lg shadow transition-colors" 
                onClick={() => {
                    setNextActiveCombatant(props.sortedSelectedCreatures, props.setSelectedCreatures);
                }}
                title="Next combatant"
            >
                ⏩
            </button>
            <input 
                class="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm w-20" 
                type="number" 
                placeholder="Init" 
                id="pcPerception"
            />
            <input 
                class="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm flex-1 min-w-[120px]" 
                type="text" 
                placeholder="Player Character Name" 
                id="pcName" 
            />
            <input 
                class="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm w-16" 
                type="number" 
                placeholder="AC" 
                id="pcAC"
            />
            <button 
                class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow transition-colors"
                onClick={() => {
                    const pcCombatant = {
                        name: document.getElementById("pcName").value,
                        perception: document.getElementById("pcPerception").value,
                        ac: document.getElementById("pcAC").value,
                        hp: "0",
                        id: getRandomId(),
                        initiative: Number(document.getElementById("pcPerception").value) + getRandomD20(),
                        isPlayerCharacter: true,
                        conditions: [],
                    };
                    props.setSelectedCreatures(() => [...props.selectedCreatures(), pcCombatant]);
                    document.getElementById("pcName").value = "";
                    document.getElementById("pcPerception").value = "";
                    document.getElementById("pcAC").value = "";
                }}
            >
                + Add PC
            </button>
            <button 
                class="px-3 py-1.5 bg-slate-400 hover:bg-slate-500 text-white rounded-lg font-medium shadow transition-colors"
                onClick={() => props.setSelectedCreatures([])}
            >
                Clear All
            </button>
        </div>
    )
}