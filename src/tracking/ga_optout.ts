import { getDOMStorage } from '../global_object/storage';

export interface GAOptout {
  enable: () => void;
  disable: () => void;
  enabled: () => boolean;
}

interface GAOptoutStorage {
  getId: () => string | null;
  saveId: (id: string) => void;
  deleteId: () => void;
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
    if (this._storage.getId() === null) {
      this._storage.saveId(this._gaId);
    }
  }

  disable(): void {
    if (this._storage.getId() !== null) {
      this._storage.deleteId();
    }
  }

  enabled(): boolean {
    const isEnabledOptout = this._storage.getId() !== null;
    return isEnabledOptout;
  }
}

export function createGAOptout(id: string, storage = createGAOptoutStorage()): GAOptout {
  return new GAOptoutImpl(id, storage);
}

export function createGAOptoutStorage(): GAOptoutStorage {
  const key = 'ga:optoutId';
  const storage = getDOMStorage().local;

  function getId(): string | null {
    return storage.getItem(key);
  }

  function saveId(id: string): void {
    storage.setItem(key, id);
  }

  function deleteId(): void {
    storage.removeItem(key);
  }

  return {
    getId,
    saveId,
    deleteId,
  };
}
