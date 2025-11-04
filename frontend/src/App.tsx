import type { Component } from 'solid-js';
import { createResource, Switch, Show, Match, For } from 'solid-js';
import SearchBar from './CreaturePicker/SearchBar';
import CreatureList from './CreaturePicker/CreatureList';

import "./App.scss";

const fetchCreatures = async () => {
  const response = await fetch('http://localhost:8000/creatures/');
  const data = await response.json();
  return data;
}

const App: Component = () => {
  const [creatures] = createResource(fetchCreatures);
  return (
    <div class="row">
    <div class="column">
      <h1>Starfinder 2e Encounter tracker</h1>
      <CreatureList creatures={creatures} loading={creatures.loading} />
    </div>
    <div class="column">
      <h1>Another section</h1>
    </div>
    </div>
  );
};

export default App;
