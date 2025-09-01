import { useCallback, useEffect, useState } from 'react';

import { LikeBuffer } from '../like_buffer/buffer';

interface UseLikeParams {
  entryId: string;
  apiBaseUrl: string;
  initialCounts?: number;
}

interface UseLikeReturn {
  counts: number;
  handleLike: () => void;
}

const likeBufferInstances = new Map<string, LikeBuffer>();

function getLikeBuffer(apiBaseUrl: string): LikeBuffer {
  if (!likeBufferInstances.has(apiBaseUrl)) {
    likeBufferInstances.set(apiBaseUrl, new LikeBuffer(apiBaseUrl));
  }
  return likeBufferInstances.get(apiBaseUrl)!;
}

export function useLike({ apiBaseUrl, initialCounts, entryId }: UseLikeParams): UseLikeReturn {
  const [counts, setCounts] = useState(initialCounts ?? 0);

  useEffect(() => {
    const handleLikeIncrement = (event: CustomEvent): void => {
      if (event.detail.entryId === entryId) {
        setCounts((prev) => prev + event.detail.increment);
      }
    };

    const handleLikeCounts = (event: CustomEvent): void => {
      if (event.detail.entryId === entryId) {
        setCounts(event.detail.counts);
      }
    };

    const handleRateLimit = (): void => {
      console.warn('Rate limit reached for likes');
    };

    window.addEventListener('likeIncrement', handleLikeIncrement as EventListener);
    window.addEventListener('likeCountsUpdate', handleLikeCounts as EventListener);
    window.addEventListener('likeRatelimit', handleRateLimit);

    return () => {
      window.removeEventListener('likeIncrement', handleLikeIncrement as EventListener);
      window.removeEventListener('likeCountsUpdate', handleLikeCounts as EventListener);
      window.removeEventListener('likeRatelimit', handleRateLimit);
    };
  }, [entryId]);

  const handleLike = useCallback(() => {
    const buffer = getLikeBuffer(apiBaseUrl);
    buffer.add(entryId);
  }, [entryId, apiBaseUrl]);

  return {
    counts,
    handleLike,
  };
}
