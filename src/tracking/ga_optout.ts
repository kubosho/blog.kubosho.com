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
    const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
    const isPreviewEnvironment = env === 'preview' || env === 'development';
    return this._storage.getId() !== null || isPreviewEnvironment;
  }
}

export function createGAOptout(id: string, storage?: GAOptoutStorage): GAOptout {
  const s = storage ?? createGAOptoutStorage();
  return new GAOptoutImpl(id, s);
}
