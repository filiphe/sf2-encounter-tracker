
export default function LevelFilterBoxes(props) {
    return (
        <div class="flex gap-3 mb-3">
            <div class="flex items-center gap-2">
                <label class="text-sm text-slate-600 dark:text-slate-300">Min:</label>
                <input
                    class="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    value={props.minLevel()}
                    onInput={(e) => props.setMinLevel(Number(e.currentTarget.value))}
                />
            </div>
            <div class="flex items-center gap-2">
                <label class="text-sm text-slate-600 dark:text-slate-300">Max:</label>
                <input
                    class="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="number"
                    value={props.maxLevel()}
                    onInput={(e) => props.setMaxLevel(Number(e.currentTarget.value))}
                />
            </div>
        </div>
    );
}