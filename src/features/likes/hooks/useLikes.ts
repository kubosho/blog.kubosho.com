'use client';

import { useCallback, useRef } from 'react';
import useSWR from 'swr';

import { useLikesBuffer } from './likes_buffer/useLikesBuffer';

type LikesResponse = {
  id: string;
  counts: number;
};

type UseLikeParams = {
  entryId: string;
};

type UseLikeReturn = {
  counts: number;
  handleLikes: () => void;
  isLoading: boolean;
};

const fetcher = async (url: string): Promise<LikesResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch likes');
  }
  return response.json();
};

/**
 * Syncs like counts increments via buffer.
 *
 * @param params - Config with entry ID and optional initial count.
 * @returns Current count and handler to increment likes.
 */
export function useLikes({ entryId }: UseLikeParams): UseLikeReturn {
  const { data, isLoading, mutate } = useSWR<LikesResponse | null>(`/api/likes/${entryId}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const { updateLikeCounts } = useLikesBuffer();

  const counts = data?.counts ?? 0;
  const countsRef = useRef(counts);
  countsRef.current = counts;

  const handleLikes = useCallback(() => {
    const newCounts = countsRef.current + 1;
    void mutate({ id: entryId, counts: newCounts }, { revalidate: false });
    updateLikeCounts(entryId, newCounts);
  }, [entryId, mutate, updateLikeCounts]);

  return {
    counts: countsRef.current,
    handleLikes,
    isLoading,
  };
}
