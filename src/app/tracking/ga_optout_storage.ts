import { getDOMStorage } from '../global_object/storage';

export interface GAOptoutStorage {
  getId: () => string | null;
  saveId: (id: string) => void;
  deleteId: () => void;
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
