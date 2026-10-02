import type { EnvyEngine } from './EnvyEngine';

let loadedEngine: EnvyEngine | null = null;
let loading: Promise<EnvyEngine> | null = null;

export const getLoadedEngine = () => loadedEngine;

export function loadEngine(): Promise<EnvyEngine> {
  if (!loading) {
    loading = import('./EnvyEngine').then(({ EnvyEngine }) => {
      loadedEngine = EnvyEngine.getInstance();
      return loadedEngine;
    }).catch(error => {
      loading = null;
      throw error;
    });
  }
  return loading;
}
