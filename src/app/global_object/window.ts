export function getBrowsingContextWindowProxy(): Window | null {
  return typeof window !== 'undefined' ? window : null;
}
