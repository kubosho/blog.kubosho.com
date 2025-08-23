import { captureError, trackInteraction } from '../../../../utils/sentry';
import { dispatchRateLimitEvent } from './events';
import { saveToRetryQueue } from './storage';

const getApiEndPoint = (entryId: string): string => `/api/likes/${entryId}`;

/**
 * Sends likes to the server.
 * Returns the total count on success, null on failure.
 */
export async function sendLikes(entryId: string, counts: number): Promise<{ total: number } | null> {
  try {
    const response = await fetch(getApiEndPoint(entryId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ counts }),
    });

    if (response.status === 429) {
      console.warn('Rate limit exceeded');
      dispatchRateLimitEvent();
      trackInteraction('rate_limit_hit', 'likes', { entryId });
      return null;
    }

    if (response.ok) {
      const data = (await response.json()) as { total: number };
      trackInteraction('like_sent_success', 'likes', { entryId, counts });
      return data;
    }

    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.error('Failed to send like:', error);

    // Capture error to Sentry
    captureError(error, {
      tags: {
        component: 'likeBuffer',
        action: 'sendLike',
      },
      extra: {
        entryId,
        counts,
      },
    });

    // If an error occurs, save to local storage and retry later.
    saveToRetryQueue(entryId, counts);
    return null;
  }
}

/**
 * Sends likes using sendBeacon API (for page unload).
 * This is a fire-and-forget operation.
 */
export function sendLikesBeacon(entryId: string, counts: number): void {
  const formData = new FormData();
  formData.append('counts', counts.toString());
  navigator.sendBeacon(getApiEndPoint(entryId), formData);
}
