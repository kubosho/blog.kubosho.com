import * as Sentry from '@sentry/astro';

import { getDOMStorage } from '../../../utils/global_object/storage';
import type { RetryQueueItem } from './constants';
import { LIKE_SEND_RETRY_QUEUE_KEY } from './constants';

const storage = getDOMStorage().session;

export function saveToRetryQueue(entryId: string, increment: number): void {
  try {
    const queue = JSON.parse(storage.getItem(LIKE_SEND_RETRY_QUEUE_KEY) || '[]') as RetryQueueItem[];
    queue.push({ entryId, increment, timestamp: Date.now() });
    storage.setItem(LIKE_SEND_RETRY_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to save to retry queue:', error);

    Sentry.captureException(error, {
      tags: { component: 'likeBuffer', action: 'saveToRetryQueue' },
      extra: { entryId, increment },
    });
  }
}

/**
 * Loads the retry queue from sessionStorage.
 * No filtering needed as sessionStorage auto-clears on tab close.
 */
export function loadRetryQueue(): RetryQueueItem[] {
  try {
    const queue = JSON.parse(storage.getItem(LIKE_SEND_RETRY_QUEUE_KEY) || '[]') as RetryQueueItem[];
    return queue;
  } catch (error) {
    console.error('Failed to load retry queue:', error);
    return [];
  }
}

/**
 * Clears the retry queue in sessionStorage.
 */
export function clearRetryQueue(): void {
  try {
    storage.setItem(LIKE_SEND_RETRY_QUEUE_KEY, '[]');
  } catch (error) {
    console.error('Failed to clear retry queue:', error);
  }
}
