import { parse } from 'valibot';

import { captureError, trackInteraction } from '../../../../../utils/sentry';
import { likesResponseSchema } from '../../../api/likesApiValidationSchema';
import { dispatchRateLimitEvent } from './events';
import { saveToRetryQueue } from './storage';

/**
 * Sends likes to the server.
 * Returns the total count on success, null on failure.
 */
export async function sendLikes(entryId: string, counts: number): Promise<{ counts: number } | null> {
  try {
    const response = await fetch(`/api/likes/${entryId}`, {
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
      const data = await response.json();
      const validatedData = parse(likesResponseSchema, data);
      trackInteraction('like_sent_success', 'likes', { entryId, counts });
      return validatedData;
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
