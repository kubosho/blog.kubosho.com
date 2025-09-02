import { useCallback, useEffect, useState } from 'react';

import { LikeBuffer } from './likes_buffer/buffer';

interface UseLikeParams {
  entryId: string;
  apiBaseUrl: string;
  initialCounts?: number;
}

interface UseLikeReturn {
  counts: number;
  handleLikes: () => void;
}

const likeBufferInstances = new Map<string, LikeBuffer>();

function getLikeBufferInstance(apiBaseUrl: string): LikeBuffer {
  if (!likeBufferInstances.has(apiBaseUrl)) {
    likeBufferInstances.set(apiBaseUrl, new LikeBuffer(apiBaseUrl));
  }
  return likeBufferInstances.get(apiBaseUrl)!;
}

export function useLikes({ apiBaseUrl, initialCounts, entryId }: UseLikeParams): UseLikeReturn {
  const [counts, setCounts] = useState(initialCounts ?? 0);

  const handleLikeIncrement = useCallback(
    (event: CustomEvent): void => {
      if (event.detail.entryId === entryId) {
        setCounts((prev) => prev + event.detail.increment);
      }
    },
    [entryId],
  );

  const handleLikeCounts = useCallback(
    (event: CustomEvent): void => {
      if (event.detail.entryId === entryId) {
        setCounts(event.detail.counts);
      }
    },
    [entryId],
  );

  const handleRateLimit = useCallback((): void => {
    console.warn('Rate limit reached for likes');
  }, []);

  useEffect(() => {
    window.addEventListener('likeIncrement', handleLikeIncrement as EventListener);
    window.addEventListener('likeCountsUpdate', handleLikeCounts as EventListener);
    window.addEventListener('likeRatelimit', handleRateLimit);

    return () => {
      window.removeEventListener('likeIncrement', handleLikeIncrement as EventListener);
      window.removeEventListener('likeCountsUpdate', handleLikeCounts as EventListener);
      window.removeEventListener('likeRatelimit', handleRateLimit);
    };
  }, [entryId]);

  const handleLikes = useCallback(() => {
    const buffer = getLikeBufferInstance(apiBaseUrl);
    buffer.add(entryId);
  }, [entryId, apiBaseUrl]);

  return {
    counts,
    handleLikes,
  };
}
