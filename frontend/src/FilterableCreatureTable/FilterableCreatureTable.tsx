import { createSignal } from "solid-js";
import CreatureTable from "./CreatureTable";
import SearchBar from "./SearchBar";
import LevelFilterBoxes from "./LevelFilterBoxes";
import FilterTableHeader from "./FilterTableHeader";

export default function FilterableCreatureTable(props) {
    const [filterText, setFilterText] = createSignal("");
    const [minLevel, setMinLevel] = createSignal(-1);
    const [maxLevel, setMaxLevel] = createSignal(25);
    return (
        <>
            <FilterTableHeader filterText={filterText} onFilterTextChange={setFilterText} minLevel={minLevel} maxLevel={maxLevel} setMinLevel={setMinLevel} setMaxLevel={setMaxLevel} />
            <CreatureTable minLevel={minLevel} maxLevel={maxLevel} selectedCreatures={props.selectedCreatures} setSelectedCreatures={props.setSelectedCreatures} filterText={filterText} creatures={props.creatures} loading={props.loading} />
        </>
    )
}