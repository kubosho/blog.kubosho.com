import { useCallback, useEffect, useRef } from 'react';

import { sendLikes } from './internals/api';
import { clearRetryQueue, loadRetryQueue } from './internals/storage';
import { FLUSH_TIMER } from './internals/types';

interface UseLikeBufferReturn {
  updateLikeCounts: (entryId: string, counts: number) => void;
}

/**
 * Buffers like increments and syncs to server with debounce.
 *
 * @returns Functions to update counts and subscribe to updates.
 */
export function useLikesBuffer(): UseLikeBufferReturn {
  const bufferedCountsRef = useRef(new Map<string, number>());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryProcessedRef = useRef(false);

  /**
   * Updates like count in buffer; sends to server after debounce.
   *
   * @param entryId - The entry ID.
   * @param counts - The new like count.
   */
  const updateLikeCounts = useCallback((entryId: string, counts: number) => {
    bufferedCountsRef.current.set(entryId, counts);

    if (debounceTimerRef.current != null) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const counts = bufferedCountsRef.current.get(entryId) ?? 0;

      void sendLikes(entryId, counts);
    }, FLUSH_TIMER);
  }, []);

  // Process retry queue only once on initial mount
  useEffect(() => {
    if (!retryProcessedRef.current) {
      retryProcessedRef.current = true;

      const queue = loadRetryQueue();

      if (queue.length > 0) {
        clearRetryQueue();

        for (const item of queue) {
          setTimeout(() => {
            void sendLikes(item.entryId, item.counts);
          }, FLUSH_TIMER);
        }
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current != null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    updateLikeCounts,
  };
}
