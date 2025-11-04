
export default function SearchBar(props) {
    return (
            <input
                type="text"
                value={props.filterText()}
                placeholder="Search creatures..."
                onInput={(e) => props.onFilterTextChange(e.currentTarget.value)}
            />
    )
}