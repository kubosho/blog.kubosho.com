import { useCallback, useEffect, useRef } from 'react';

import { sendLikes } from './internals/api';
import { clearRetryQueue, loadRetryQueue } from './internals/storage';
import { FLUSH_TIMER } from './internals/types';

interface UseLikeBufferReturn {
  updateLikeCounts: (entryId: string, counts: number) => void;
  subscribe: (entryId: string, callback: (counts: number) => void) => () => void;
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
  const subscribersRef = useRef(new Map<string, Set<(counts: number) => void>>());

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

      void sendLikes(entryId, counts).then((result) => {
        if (result != null) {
          _notifyCounts(entryId, result.counts);
        }
      });
    }, FLUSH_TIMER);
  }, []);

  /**
   * Subscribes to count updates for an entry.
   *
   * @param entryId - The entry ID.
   * @param callback - Called with updated count from server.
   * @returns Unsubscribe function.
   */
  const subscribe = useCallback((entryId: string, callback: (counts: number) => void) => {
    const newSubscriber = subscribersRef.current.get(entryId) ?? new Set<(counts: number) => void>();
    newSubscriber.add(callback);
    subscribersRef.current.set(entryId, newSubscriber);

    return () => {
      const subscriber = subscribersRef.current.get(entryId);
      if (subscriber == null) {
        return;
      }

      subscriber.delete(callback);

      if (subscriber.size === 0) {
        subscribersRef.current.delete(entryId);
      }
    };
  }, []);

  const _notifyCounts = useCallback((entryId: string, counts: number) => {
    const subscriber = subscribersRef.current.get(entryId);
    if (subscriber == null) {
      return;
    }

    for (const notify of subscriber) {
      try {
        notify(counts);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    }
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
            void sendLikes(item.entryId, item.counts).then((result) => {
              if (result != null) {
                _notifyCounts(item.entryId, result.counts);
              }
            });
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
    subscribe,
  };
}
