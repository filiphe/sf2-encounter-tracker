export default function SearchBar(props) {
  return (
    <input
      class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
      type="text"
      value={props.filterText()}
      placeholder="Search creatures..."
      onInput={(e) => props.onFilterTextChange(e.currentTarget.value)}
    />
  );
}
