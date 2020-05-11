import { Nullable } from 'option-t/lib/Nullable/Nullable';

export interface DOMStorageLike {
  getItem(key: string): Nullable<string>;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}
