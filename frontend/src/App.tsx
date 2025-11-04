import type { Component } from 'solid-js';
import { createSignal, createResource, Switch, Show, Match, For } from 'solid-js';
import FilterableCreatureTable from './FilterableCreatureTable/FilterableCreatureTable';
import ActiveEncounterTable from './ActiveEncounterTable/ActiveEncounterTable';

import "./App.scss";

const fetchCreatures = async () => {
  const response = await fetch('http://localhost:8000/creatures/');
  const data = await response.json();
  return data;
}

const App: Component = () => {
  const [creatures] = createResource(fetchCreatures);
  const [selectedCreatures, setSelectedCreatures] = createSignal([]);

  const sortedSelectedCreatures = () => selectedCreatures().sort((a, b) => b.initiative - a.initiative);

  return (
    <div class="row">
      <h1>Starfinder 2e Encounter tracker</h1>
      <div class="column">
        <FilterableCreatureTable creatures={creatures} loading={creatures.loading} selectedCreatures={selectedCreatures} setSelectedCreatures={setSelectedCreatures}/>
      </div>
      <div class="column-2">
        <ActiveEncounterTable sortedSelectedCreatures={sortedSelectedCreatures} selectedCreatures={selectedCreatures} setSelectedCreatures={setSelectedCreatures} />
      </div>
    </div>
  );
};

export default App;
