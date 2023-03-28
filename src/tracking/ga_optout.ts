import { createGAOptoutStorage, GAOptoutStorage } from './ga_optout_storage';

export interface GAOptout {
  enable: () => void;
  disable: () => void;
  enabled: () => boolean;
}

declare global {
  interface Window {
    [key: string]: boolean;
  }
}

class GAOptoutImpl implements GAOptout {
  private _gaId: string;
  private _storage: GAOptoutStorage;

  constructor(id: string, storage: GAOptoutStorage) {
    this._gaId = id;
    this._storage = storage;
  }

  enable(): void {
    this._storage.saveId(this._gaId);
  }

  disable(): void {
    this._storage.deleteId();
  }

  enabled(): boolean {
    return this._storage.getId() !== null;
  }
}

export function createGAOptout(id: string, storage?: GAOptoutStorage): GAOptout {
  const s = storage ?? createGAOptoutStorage();
  return new GAOptoutImpl(id, s);
}
