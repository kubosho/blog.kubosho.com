import { parse } from 'valibot';

import { captureError, trackInteraction } from '../../../../../utils/sentryBrowserClient';
import { likesResponseSchema } from '../../../api/likesApiValidationSchema';
import { saveToRetryQueue } from './storage';

/**
 * Sends likes to the server with Sentry.
 */
export async function sendLikes(entryId: string, increment: number): Promise<{ message: string } | null> {
  try {
    const response = await fetch(`/api/likes/${entryId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ increment }),
    });

    if (response.status === 429) {
      console.warn('Rate limit exceeded');
      trackInteraction('rate_limit_hit', 'likes', { entryId });
      return null;
    }

    if (response.ok) {
      const data = await response.json();
      const validatedData = parse(likesResponseSchema, data);
      trackInteraction('like_sent_success', 'likes', { entryId, increment });
      return validatedData;
    }

    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.error('Failed to send like:', error);

    captureError(error, {
      tags: {
        component: 'likeBuffer',
        action: 'sendLike',
      },
      extra: {
        entryId,
        increment,
      },
    });

    // Save to local storage and retry later.
    saveToRetryQueue(entryId, increment);

    return null;
  }
}
