vi.mock('./internals/api', () => ({ sendLikes: vi.fn() }));

import { act, renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sendLikes } from './internals/api';
import { FLUSH_TIMER } from './internals/types';
import { useLikesBuffer } from './useLikesBuffer';

describe('useLikesBuffer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should add counts with counts is 1', async () => {
    // Arrange
    const server = setupServer(
      http.post('/api/likes/:id', ({ params }) => {
        const { id } = params;
        return HttpResponse.json({ id, counts: 1 });
      }),
    );
    server.listen();
    const { result } = renderHook(() => useLikesBuffer());

    // Act
    act(() => {
      result.current.updateLikeCounts('test', 1);
    });
    await vi.advanceTimersByTimeAsync(FLUSH_TIMER);

    // Assert
    expect(sendLikes).toHaveBeenCalledWith('test', 1);

    // Cleanup
    server.close();
  });

  it('should add counts with counts is 3', async () => {
    // Arrange
    const server = setupServer(
      http.post('/api/likes/:id', ({ params }) => {
        const { id } = params;
        return HttpResponse.json({ id, counts: 3 });
      }),
    );
    server.listen();
    const { result } = renderHook(() => useLikesBuffer());

    // Act
    act(() => {
      result.current.updateLikeCounts('test', 3);
    });
    await vi.advanceTimersByTimeAsync(FLUSH_TIMER);

    // Assert
    expect(sendLikes).toHaveBeenCalledWith('test', 3);

    // Cleanup
    server.close();
  });
});
