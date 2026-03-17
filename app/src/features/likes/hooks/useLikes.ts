'use client';

import * as Sentry from '@sentry/astro';
import { useCallback, useRef } from 'react';
import useSWR from 'swr';

import type { LikesOnGetResponse } from '../api/likesApiValidationSchema';
import { useLikesBuffer } from './likes_buffer/useLikesBuffer';

type UseLikeParams = {
  entryId: string;
};

type UseLikeReturn = {
  counts: number;
  handleLikes: () => void;
  isLoading: boolean;
};

const fetcher = async (url: string): Promise<LikesOnGetResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch likes');
  }
  return response.json();
};

export function useLikes({ entryId }: UseLikeParams): UseLikeReturn {
  const { data, isLoading, mutate } = useSWR<LikesOnGetResponse | null>(`/api/likes/${entryId}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryCount: 3,
    onError(error) {
      Sentry.captureException(error, {
        tags: { component: 'useLikes' },
        extra: { entryId },
      });
    },
  });
  const { updateLikeCounts } = useLikesBuffer();

  const counts = data?.counts ?? 0;
  const countsRef = useRef(counts);
  countsRef.current = counts;

  const handleLikes = useCallback(() => {
    void mutate({ id: entryId, counts: countsRef.current + 1 }, { revalidate: false });
    updateLikeCounts(entryId, 1);
  }, [entryId, mutate, updateLikeCounts]);

  return {
    counts: countsRef.current,
    handleLikes,
    isLoading,
  };
}
