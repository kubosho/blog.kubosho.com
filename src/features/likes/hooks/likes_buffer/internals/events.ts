import type { LikeEventDetailMap, LikeEventName } from './types';

function dispatchLikeEvent<T extends LikeEventName>(type: T, detail: LikeEventDetailMap[T]): void {
  const event = new CustomEvent(type, { detail });
  window.dispatchEvent(event);
}

/**
 * Dispatches a rate limit event.
 */
export function dispatchRateLimitEvent(): void {
  dispatchLikeEvent('likeRateLimit', null);
}

/**
 * Dispatches a like increment event.
 */
export function dispatchLikeIncrement(entryId: string, increment: number): void {
  dispatchLikeEvent('likeIncrement', { entryId, increment });
}

/**
 * Dispatches a like counts update event.
 */
export function dispatchLikeCountsUpdate(entryId: string, counts: number): void {
  dispatchLikeEvent('likeCountsUpdate', { entryId, counts });
}
