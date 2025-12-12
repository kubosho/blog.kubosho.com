import { useCallback, useEffect, useState } from 'react';

import { useLikesBuffer } from './likes_buffer/useLikesBuffer';

interface UseLikeParams {
  entryId: string;
  initialCounts?: number;
}

interface UseLikeReturn {
  counts: number;
  handleLikes: () => void;
}

/**
 * Syncs like counts increments via buffer.
 *
 * @param params - Config with entry ID and optional initial count.
 * @returns Current count and handler to increment likes.
 */
export function useLikes({ initialCounts, entryId }: UseLikeParams): UseLikeReturn {
  const ic = initialCounts ?? 0;
  const [counts, setCounts] = useState(ic);
  const { updateLikeCounts, subscribe } = useLikesBuffer();

  const handleLikes = useCallback(() => {
    setCounts((prev) => {
      const count = prev + 1;
      updateLikeCounts(entryId, count);
      return prev + 1;
    });
  }, [entryId, updateLikeCounts]);

  useEffect(() => {
    const unsubscribe = subscribe(entryId, (newCounts) => {
      setCounts((prev) => (newCounts > prev ? newCounts : prev));
    });

    return () => {
      unsubscribe();
    };
  }, [entryId, subscribe]);

  return {
    counts,
    handleLikes,
  };
}
