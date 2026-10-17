import * as fs from "fs";
import type { Component } from "solid-js";
import {
  createSignal,
  createResource,
  Switch,
  Show,
  Match,
  For,
} from "solid-js";
import FilterableCreatureTable from "./FilterableCreatureTable/FilterableCreatureTable";
import ActiveEncounterTable from "./ActiveEncounterTable/ActiveEncounterTable";
import ThemeToggle from "./components/ThemeToggle";

import "./App.css";

const fetchCreatures = async () => {
  //const response = await fetch('http://localhost:8000/creatures/');
  const response = await fetch("../2e.aonsrd.com-creature-data-extended.json");
  const data = await response.json();
  return data;
};

const App: Component = () => {
  const [creatures] = createResource(fetchCreatures);
  const [selectedCreatures, setSelectedCreatures] = createSignal([]);

  const sortedSelectedCreatures = () =>
    selectedCreatures().sort((a, b) => b.initiative - a.initiative);

  const scrollToEncounter = () => {
    document
      .getElementById("active-encounter")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div class="min-h-screen p-4">
      <header class="bg-white dark:bg-slate-700 rounded-xl shadow-lg p-4 mb-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Starfinder 2e Encounter Tracker
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <div class="flex flex-col lg:flex-row gap-4">
        <div class="lg:w-1/4 min-w-0">
          <div class="bg-white dark:bg-slate-700 rounded-xl shadow-lg p-4">
            <h2 class="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
              🐛 Creature Browser
            </h2>
            <FilterableCreatureTable
              creatures={creatures}
              loading={creatures.loading}
              selectedCreatures={selectedCreatures}
              setSelectedCreatures={setSelectedCreatures}
            />
          </div>
        </div>
        <div class="lg:w-3/4 min-w-0">
          <div
            id="active-encounter"
            class="bg-white dark:bg-slate-700 rounded-xl shadow-lg p-4 lg:sticky lg:top-4 lg:self-start"
          >
            <h2 class="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">
              ⚔️ Active Encounter
            </h2>
            <ActiveEncounterTable
              sortedSelectedCreatures={sortedSelectedCreatures}
              selectedCreatures={selectedCreatures}
              setSelectedCreatures={setSelectedCreatures}
            />
          </div>
        </div>
      </div>

      <button
        class="lg:hidden fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg z-50"
        onClick={scrollToEncounter}
        title="Go to Active Encounter"
      >
        ⚔️
      </button>
    </div>
  );
};

export default App;
