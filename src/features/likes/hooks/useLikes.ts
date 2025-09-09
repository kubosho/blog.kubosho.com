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
  const [counts, setCounts] = useState(initialCounts != null ? initialCounts : 0);

  useEffect(() => {
    // Subscribe to server-confirmed counts updates for this entryId
    const unsubscribe = likeBufferInstance.subscribe(entryId, (newCounts) => {
      setCounts(newCounts);
    });
    return () => {
      unsubscribe();
    };
  }, [entryId]);

  const handleLikes = useCallback(() => {
    // Optimistic update
    setCounts((prev) => prev + 1);
    // Reflect server value when flushed
    likeBufferInstance.add(entryId).then((result) => {
      if (result != null) {
        setCounts(result.counts);
      } else {
        console.warn('Rate limit reached or failed to send likes');
      }
    });
  }, [entryId]);

  return {
    counts,
    handleLikes,
  };
}
