import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import Engine from './engine';
import { GetEngines } from './wailsjs/go/app/App';

export const CurrentEngineStore: Writable<Engine | null> = writable(null);
export const EnginesStore: Writable<Engine[]> = writable([]);

export async function updateEngines() {
  const engines = await GetEngines();
  if (engines == null)
    EnginesStore.set([]);
  else
    EnginesStore.set(engines.map((info) => Engine.fromInfo(info)));
}

export default class Editor {
  engine: Engine;
  mode: Writable<EditorMode>;
  constructor(engine: Engine) {
    this.engine = engine;
    this.mode = writable(EditorMode.Normal);
  }
}

export enum EditorMode {
  Normal,
};
