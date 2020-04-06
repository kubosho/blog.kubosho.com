import { Maybe, isNullOrUndefined } from 'option-t/lib/Maybe/Maybe';
import { Nullable } from 'option-t/lib/Nullable/Nullable';
import { unwrapOrFromUndefinable } from 'option-t/lib/Undefinable/unwrapOr';

import { DOMStorageLike } from './dom_storage_like';

/**
 *  This should behave like DOM storage.
 */
export class InMemoryStorage implements DOMStorageLike {
  private _map: Map<string, string>;
  constructor() {
    this._map = new Map();
  }

  getItem(key: string): Nullable<string> {
    const raw: string | undefined = this._map.get(key);
    return unwrapOrFromUndefinable<Nullable<string>>(raw, null);
  }

  setItem(key: string, value: Maybe<string>): void {
    const v: string = isNullOrUndefined(value) ? String(value) : value;
    this._map.set(key, v);
  }

  removeItem(key: string): void {
    this._map.delete(key);
  }

  clear(): void {
    this._map.clear();
  }
}
