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
 * Dispatches a like total update event.
 */
export function dispatchLikeTotalUpdate(entryId: string, total: number): void {
  dispatchLikeEvent('likeTotalUpdate', { entryId, total });
}
