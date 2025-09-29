import { getDOMStorage } from '../../../../../utils/global_object/storage';
import { captureError } from '../../../../../utils/sentry';
import type { RetryQueueItem } from './types';
import { LIKE_SEND_RETRY_QUEUE_KEY } from './types';

const storage = getDOMStorage().session;

/**
 * Saves a failed request to the retry queue.
 */
export function saveToRetryQueue(entryId: string, counts: number): void {
  try {
    const queue = JSON.parse(storage.getItem(LIKE_SEND_RETRY_QUEUE_KEY) || '[]') as RetryQueueItem[];
    queue.push({ entryId, counts, timestamp: Date.now() });
    storage.setItem(LIKE_SEND_RETRY_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to save to retry queue:', error);

    // Capture storage error
    captureError(error, {
      tags: {
        component: 'likeBuffer',
        action: 'saveToRetryQueue',
      },
      extra: {
        entryId,
        counts,
      },
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
