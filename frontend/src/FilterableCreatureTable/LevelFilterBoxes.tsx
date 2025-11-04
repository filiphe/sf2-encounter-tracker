
export default function LevelFilterBoxes(props) {
    return (
        <>
            <input
                class="shadow-xl rounded-2xl p-1 m-3"
                type="number"
                value={props.minLevel()}
                placeholder="Min level"
                onInput={(e) => props.setMinLevel(Number(e.currentTarget.value))}
                style="width: 40px"
            />
            <input
                class="shadow-xl rounded-2xl p-1 m-3"
                type="number"
                value={props.maxLevel()}
                placeholder="Max level"
                onInput={(e) => props.setMaxLevel(Number(e.currentTarget.value))}
                style="width: 40px"
            />
        </>
    );
}