import type { DOMStorageLike } from './dom_storage_like';
import { getBrowsingContextWindowProxy } from './window';
import { InMemoryStorage } from './in_memory_storage';

function isAvailableLocalStorage(): boolean {
  const w = getBrowsingContextWindowProxy();

  return !!w && 'localStorage' in w && !!w.localStorage;
}

export function getDOMStorage(): {
  local: DOMStorageLike;
  session: DOMStorageLike;
} {
  let local: DOMStorageLike;
  let session: DOMStorageLike;

  const ok = isAvailableLocalStorage();
  if (ok) {
    local = window.localStorage;
    session = window.sessionStorage;
  } else {
    local = new InMemoryStorage();
    session = new InMemoryStorage();
  }

  return {
    local,
    session,
  };
}
