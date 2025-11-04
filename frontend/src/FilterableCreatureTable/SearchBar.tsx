
export default function SearchBar(props) {
    return (
            <input
                class="m-3 p-1 shadow-xl rounded-2xl"
                type="text"
                value={props.filterText()}
                placeholder="Search creatures..."
                onInput={(e) => props.onFilterTextChange(e.currentTarget.value)}
            />
    )
}