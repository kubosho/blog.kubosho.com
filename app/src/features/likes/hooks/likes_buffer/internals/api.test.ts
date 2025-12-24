vi.mock('../../../../../utils/sentryBrowserClient', () => ({
  captureError: vi.fn(),
  trackInteraction: vi.fn(),
}));

vi.mock('./storage', () => ({
  saveToRetryQueue: vi.fn(),
}));

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { captureError, trackInteraction } from '../../../../../utils/sentryBrowserClient';
import { sendLikes } from './api';
import { saveToRetryQueue } from './storage';

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
    it('should call trackInteraction when the request is successful', async () => {
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
      expect(trackInteraction).toHaveBeenCalledWith('like_sent_success', 'likes', {
        entryId: 'test-entry',
        increment: 3,
      });
      expect(result).not.toBeNull();
    });

    it('should call sendToRetryQueue when the request fails', async () => {
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
      expect(saveToRetryQueue).toHaveBeenCalledWith('test-entry', 1);
      expect(result).toBeNull();
    });
  });

  it('should call captureError when the request fails', async () => {
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
    expect(captureError).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
