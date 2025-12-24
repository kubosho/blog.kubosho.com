import { useCallback, useEffect, useRef } from 'react';

import { sendLikes } from './internals/api';
import { clearRetryQueue, loadRetryQueue } from './internals/storage';
import { FLUSH_TIMER } from './internals/types';

interface UseLikeBufferReturn {
  updateLikeCounts: (entryId: string, increment: number) => void;
}

/**
 * Buffers like increments and syncs to server with debounce.
 *
 * @returns Functions to update counts and subscribe to updates.
 */
export function useLikesBuffer(): UseLikeBufferReturn {
  const bufferedIncrementsRef = useRef(new Map<string, number>());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryProcessedRef = useRef(false);

  /**
   * Updates like count in buffer; sends to server after debounce.
   *
   * @param entryId - The entry ID.
   * @param increment - The increment value to add.
   */
  const updateLikeCounts = useCallback((entryId: string, increment: number) => {
    const currentIncrement = bufferedIncrementsRef.current.get(entryId) ?? 0;
    bufferedIncrementsRef.current.set(entryId, currentIncrement + increment);

    if (debounceTimerRef.current != null) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const totalIncrement = bufferedIncrementsRef.current.get(entryId) ?? 0;
      bufferedIncrementsRef.current.delete(entryId);

      void sendLikes(entryId, totalIncrement);
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
            void sendLikes(item.entryId, item.increment);
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
