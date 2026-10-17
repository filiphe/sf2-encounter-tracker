import { createSignal, onMount, onCleanup } from "solid-js";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = createSignal(false);

  onMount(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener("change", handler);

    onCleanup(() => mediaQuery.removeEventListener("change", handler));
  });

  return matches;
}
