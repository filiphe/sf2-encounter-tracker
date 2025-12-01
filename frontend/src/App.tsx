import * as fs from 'fs';
import type { Component } from 'solid-js';
import { createSignal, createResource, Switch, Show, Match, For } from 'solid-js';
import FilterableCreatureTable from './FilterableCreatureTable/FilterableCreatureTable';
import ActiveEncounterTable from './ActiveEncounterTable/ActiveEncounterTable';

import "./App.css";

const fetchCreatures = async () => {
  //const response = await fetch('http://localhost:8000/creatures/');
  const response = await fetch('../2e.aonsrd.com-creature-data-extended.json');
  const data = await response.json();
  return data;
}

const App: Component = () => {
  const [creatures] = createResource(fetchCreatures);
  const [selectedCreatures, setSelectedCreatures] = createSignal([]);

  const sortedSelectedCreatures = () => selectedCreatures().sort((a, b) => b.initiative - a.initiative);

  return (
    <>
      <h1 class="text-2xl font-bold text-center dark:text-black bg-pink-200 rounded-2xl">Starfinder 2e Encounter Tracker</h1>
      <div class="flex flex-row">
        <div class="basis-1/3 m-4">
          <FilterableCreatureTable creatures={creatures} loading={creatures.loading} selectedCreatures={selectedCreatures} setSelectedCreatures={setSelectedCreatures}/>
        </div>
        <div class="basis-2/3">
          <ActiveEncounterTable sortedSelectedCreatures={sortedSelectedCreatures} selectedCreatures={selectedCreatures} setSelectedCreatures={setSelectedCreatures} />
        </div>
      </div>
    </>
  );
};

export default App;
