import { useCallback, useEffect, useState } from 'react';

import { LikeBuffer } from './likes_buffer/buffer';

interface UseLikeParams {
  entryId: string;
  initialCounts?: number;
}

interface UseLikeReturn {
  counts: number;
  handleLikes: () => void;
}

const likeBufferInstance = new LikeBuffer();

export function useLikes({ initialCounts, entryId }: UseLikeParams): UseLikeReturn {
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
    likeBufferInstance.add(entryId);
  }, [entryId]);

  return {
    counts,
    handleLikes,
  };
}
