import { Nullable } from 'option-t/lib/Nullable/Nullable';

export function getBrowsingContextWindowProxy(): Nullable<Window> {
  const w: Nullable<Window> = typeof window !== 'undefined' ? window : null;
  return w;
}
