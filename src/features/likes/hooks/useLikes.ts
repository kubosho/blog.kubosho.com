import { useCallback, useEffect, useState } from 'react';

import { LikeBuffer } from './likes_buffer/buffer';
import { sendLikes } from './likes_buffer/internals/api';
import { clearRetryQueue, loadRetryQueue } from './likes_buffer/internals/storage';
import { FLUSH_TIMER } from './likes_buffer/internals/types';

interface UseLikeParams {
  entryId: string;
  initialCounts?: number;
}

interface UseLikeReturn {
  counts: number;
  handleLikes: () => void;
}

let likeBufferInstance: LikeBuffer | null = null;
function getLikeBufferInstance(): LikeBuffer {
  if (likeBufferInstance == null) {
    likeBufferInstance = new LikeBuffer();
  }
  return likeBufferInstance;
}

const latestCountsByEntry = new Map<string, number>();
const lockedEntryIds = new Set<string>();
const perEntrySendDebounceTimers = new Map<string, NodeJS.Timeout>();

async function sendLatestCountsForEntry(entryId: string): Promise<void> {
  if (lockedEntryIds.has(entryId)) {
    return;
  }

  const counts = latestCountsByEntry.get(entryId);
  if (counts == null) {
    return;
  }

  lockedEntryIds.add(entryId);

  await sendLikes(entryId, counts)
    .then((result) => {
      if (result != null) {
        getLikeBufferInstance().notifyCounts(entryId, result.counts);
      }
    })
    .finally(() => {
      lockedEntryIds.delete(entryId);
    });
}

function processRetryQueueOnce(): void {
  const queue = loadRetryQueue();
  if (queue.length > 0) {
    clearRetryQueue();

    for (const item of queue) {
      setTimeout(() => {
        const counts = latestCountsByEntry.get(item.entryId) ?? 0;
        const toSendCounts = Math.max(item.counts, counts);

        latestCountsByEntry.set(item.entryId, toSendCounts);

        void sendLatestCountsForEntry(item.entryId);
      }, FLUSH_TIMER);
    }
  }
}

function scheduleSendLikeCountsDebounced(entryId: string): void {
  const sendDebounceTimer = perEntrySendDebounceTimers.get(entryId);
  if (sendDebounceTimer != null) {
    clearTimeout(sendDebounceTimer);
  }

  const timer = setTimeout(() => {
    perEntrySendDebounceTimers.delete(entryId);

    void sendLatestCountsForEntry(entryId);
  }, FLUSH_TIMER);

  perEntrySendDebounceTimers.set(entryId, timer);
}

export function useLikes({ initialCounts, entryId }: UseLikeParams): UseLikeReturn {
  const [counts, setCounts] = useState(initialCounts != null ? initialCounts : 0);

  useEffect(() => {
    processRetryQueueOnce();
  }, []);

  // Keep global latest counts for this entry id
  useEffect(() => {
    latestCountsByEntry.set(entryId, counts);
  }, [entryId, counts]);

  useEffect(() => {
    const unsubscribe = getLikeBufferInstance().subscribe(entryId, (newCounts) => {
      // Prevent UI rollback by ignoring smaller values from server
      setCounts((prev) => (newCounts > prev ? newCounts : prev));
    });

    return () => {
      unsubscribe();
    };
  }, [entryId]);

  const handleLikes = useCallback(() => {
    // Optimistic update and queue for next flush
    setCounts((prev) => prev + 1);
    getLikeBufferInstance().add(entryId);
    scheduleSendLikeCountsDebounced(entryId);
  }, [entryId]);

  return {
    counts,
    handleLikes,
  };
}
