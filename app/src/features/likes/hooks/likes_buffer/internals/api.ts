import * as Sentry from '@sentry/astro';
import { parse } from 'valibot';

import { likesOnPostResponseSchema } from '../../../api/likesApiValidationSchema';
import { saveToRetryQueue } from './storage';

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
      Sentry.addBreadcrumb({ message: 'rate_limit_hit', category: 'likes', data: { entryId } });
      return null;
    }

    if (response.ok) {
      const data = await response.json();
      const validatedData = parse(likesOnPostResponseSchema, data);
      Sentry.addBreadcrumb({ message: 'like_sent_success', category: 'likes', data: { entryId, increment } });
      return validatedData;
    }

    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.error('Failed to send like:', error);

    Sentry.captureException(error, {
      tags: { component: 'likeBuffer', action: 'sendLike' },
      extra: { entryId, increment },
    });

    saveToRetryQueue(entryId, increment);

    return null;
  }
}
