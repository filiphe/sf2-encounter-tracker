import { createSignal, onMount, createEffect } from "solid-js";

export default function ThemeToggle() {
  const [isDark, setIsDark] = createSignal(false);

  onMount(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      setIsDark(stored === "dark");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  });

  createEffect(() => {
    const dark = isDark();
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  });

  return (
    <button
      class="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      onClick={() => setIsDark(!isDark())}
      title={isDark() ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark() ? "☀️" : "🌙"}
    </button>
  );
}