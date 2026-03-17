vi.mock('@sentry/astro', () => ({
  captureException: vi.fn(),
  addBreadcrumb: vi.fn(),
}));

vi.mock('./storage', () => ({
  saveToRetryQueue: vi.fn(),
}));

import * as Sentry from '@sentry/astro';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

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
    it('should add breadcrumb when the request is successful', async () => {
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
      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        message: 'like_sent_success',
        category: 'likes',
        data: { entryId: 'test-entry', increment: 3 },
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

  it('should call Sentry.captureException when the request fails', async () => {
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
    expect(Sentry.captureException).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
