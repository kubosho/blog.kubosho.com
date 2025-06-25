import { atom, useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';

import { likeBuffer } from '../utils/likeBuffer';
import { captureError } from '../utils/sentry';

// Like counts state for each entry
const likesAtom = atom<Map<string, number>>(new Map());

// Rate limit state
const rateLimitAtom = atom<boolean>(false);

interface UseLikesReturn {
  likeCount: number;
  handleLike: () => void;
  isRateLimited: boolean;
  pendingCount: number;
}

/**
 * Custom hook to manage like functionality
 */
export function useLikes(entryId: string, initialCount = 0): UseLikesReturn {
  const [likes, setLikes] = useAtom(likesAtom);
  const [isRateLimited, setIsRateLimited] = useAtom(rateLimitAtom);
  const [pendingCount, setPendingCount] = useState(0);

  // Get current like count
  const likeCount = likes.get(entryId) || initialCount;

  /**
   * Handler for like button click
   */
  const handleLike = useCallback(() => {
    if (isRateLimited) return;

    // Add to LikeBuffer (optimistic update is handled inside LikeBuffer)
    likeBuffer.add(entryId);

    // Update pending count
    setPendingCount(likeBuffer.getPendingCount());
  }, [entryId, isRateLimited]);

  /**
   * Set up custom event listeners
   */
  useEffect(() => {
    // Optimistic update event
    const handleLikeIncrement = (event: CustomEvent): void => {
      const { entryId: eventEntryId, increment } = event.detail;
      if (eventEntryId === entryId) {
        setLikes((prevLikes) => {
          const newLikes = new Map(prevLikes);
          const current = newLikes.get(entryId) || initialCount;
          newLikes.set(entryId, current + increment);
          return newLikes;
        });
      }
    };

    // Total count update event from server
    const handleLikeTotalUpdate = (event: CustomEvent): void => {
      const { entryId: eventEntryId, total } = event.detail;
      if (eventEntryId === entryId) {
        setLikes((prevLikes) => {
          const newLikes = new Map(prevLikes);
          newLikes.set(entryId, total);
          return newLikes;
        });
        setPendingCount(likeBuffer.getPendingCount());
      }
    };

    // Rate limit event
    const handleRateLimit = (): void => {
      setIsRateLimited(true);
      // Remove rate limit after 30 seconds
      setTimeout(() => {
        setIsRateLimited(false);
      }, 30000);
    };

    // Add event listeners
    window.addEventListener('likeIncrement', handleLikeIncrement as EventListener);
    window.addEventListener('likeTotalUpdate', handleLikeTotalUpdate as EventListener);
    window.addEventListener('likeRateLimit', handleRateLimit);

    // Cleanup
    return () => {
      window.removeEventListener('likeIncrement', handleLikeIncrement as EventListener);
      window.removeEventListener('likeTotalUpdate', handleLikeTotalUpdate as EventListener);
      window.removeEventListener('likeRateLimit', handleRateLimit);
    };
  }, [entryId, initialCount, setLikes, setIsRateLimited]);

  /**
   * Set initial count in atom
   */
  useEffect(() => {
    setLikes((prevLikes) => {
      if (!prevLikes.has(entryId)) {
        const newLikes = new Map(prevLikes);
        newLikes.set(entryId, initialCount);
        return newLikes;
      }
      return prevLikes;
    });
  }, [entryId, initialCount, setLikes]);

  /**
   * Fetch initial data from server
   */
  useEffect(() => {
    const fetchInitialCount = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/likes/${entryId}`);
        if (response.ok) {
          const data = (await response.json()) as { counts: number };
          setLikes((prevLikes) => {
            const newLikes = new Map(prevLikes);
            newLikes.set(entryId, data.counts);
            return newLikes;
          });
        }
      } catch (error) {
        console.error('Failed to fetch initial like count:', error);

        // Capture error to Sentry
        captureError(error, {
          tags: {
            component: 'useLikes',
            action: 'fetchInitialCount',
          },
          extra: {
            entryId,
          },
        });
      }
    };

    // Only fetch if initial data is not set
    if (!likes.has(entryId)) {
      fetchInitialCount();
    }
  }, [entryId, likes, setLikes]);

  return {
    likeCount,
    handleLike,
    isRateLimited,
    pendingCount,
  };
}

/**
 * Hook to get overall like statistics
 */
export function useLikeStats(): {
  totalLikes: number;
  entriesWithLikes: number;
  likesByEntry: Map<string, number>;
} {
  const [likes] = useAtom(likesAtom);

  const totalLikes = Array.from(likes.values()).reduce((sum, count) => sum + count, 0);
  const entriesWithLikes = likes.size;

  return {
    totalLikes,
    entriesWithLikes,
    likesByEntry: likes,
  };
}
