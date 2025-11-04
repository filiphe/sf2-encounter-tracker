
export default function LevelFilterBoxes(props) {
    return (
        <>
            <input
                type="number"
                value={props.minLevel()}
                placeholder="Min level"
                onInput={(e) => props.setMinLevel(Number(e.currentTarget.value))}
                style="width: 40px"
            />
            <input
                type="number"
                value={props.maxLevel()}
                placeholder="Max level"
                onInput={(e) => props.setMaxLevel(Number(e.currentTarget.value))}
                style="width: 40px"
            />
        </>
    );
}