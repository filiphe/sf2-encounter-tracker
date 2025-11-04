import SearchBar from "./SearchBar";
import LevelFilterBoxes from "./LevelFilterBoxes";

export default function FilterTableHeader(props) {
    return (
        <>
            <SearchBar filterText={props.filterText} onFilterTextChange={props.onFilterTextChange} />
            <LevelFilterBoxes minLevel={props.minLevel} maxLevel={props.maxLevel} setMinLevel={props.setMinLevel} setMaxLevel={props.setMaxLevel} />
        </>
    )
}