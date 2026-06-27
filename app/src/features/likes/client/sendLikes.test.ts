vi.mock('../../../utils/sentry/browser', () => ({
  captureSentryException: vi.fn(),
  addSentryBreadcrumb: vi.fn(),
}));

vi.mock('./retryQueue', () => ({
  saveToRetryQueue: vi.fn(),
}));

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { addSentryBreadcrumb, captureSentryException } from '../../../utils/sentry/browser';
import { saveToRetryQueue } from './retryQueue';
import { sendLikes } from './sendLikes';

const server = setupServer();

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  server.close();
});

describe('api', () => {
  describe('sendLikes', () => {
    it('returns the validated response when the request succeeds', async () => {
      // Arrange
      server.use(
        http.post('/api/likes/:entryId', async ({ request, params }) => {
          const { entryId } = params;
          const body = (await request.json()) as { increment: number };

          expect(entryId).toBe('test-entry');
          expect(body).toEqual({ increment: 3 });

          return HttpResponse.json({
            message: 'OK',
          });
        }),
      );

      // Act
      const result = await sendLikes('test-entry', 3);

      // Assert
      expect(result).toEqual({ message: 'OK' });
      expect(addSentryBreadcrumb).toHaveBeenCalledWith({
        message: 'like_sent_success',
        category: 'likes',
        data: { entryId: 'test-entry', increment: 3 },
      });
      expect(saveToRetryQueue).not.toHaveBeenCalled();
    });

    it('queues the increment and returns null when the request fails', async () => {
      // Arrange
      server.use(
        http.post('/api/likes/:entryId', () => {
          return HttpResponse.json(
            {
              message: 'Internal server error',
            },
            { status: 500 },
          );
        }),
      );

      // Act
      const result = await sendLikes('test-entry', 1);

      // Assert
      expect(captureSentryException).toHaveBeenCalled();
      expect(saveToRetryQueue).toHaveBeenCalledWith('test-entry', 1);
      expect(result).toBeNull();
    });

    it('returns null without queueing when the request is rate-limited', async () => {
      // Arrange
      server.use(
        http.post('/api/likes/:entryId', () => {
          return HttpResponse.json(
            {
              message: 'Rate limit exceeded',
            },
            { status: 429 },
          );
        }),
      );

      // Act
      const result = await sendLikes('test-entry', 1);

      // Assert
      expect(addSentryBreadcrumb).toHaveBeenCalledWith({
        message: 'rate_limit_hit',
        category: 'likes',
        data: { entryId: 'test-entry' },
      });
      expect(saveToRetryQueue).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
