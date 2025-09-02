interface LikeIncrementDetail {
  entryId: string;
  increment: number;
}
interface LikeCountsUpdateDetail {
  entryId: string;
  counts: number;
}

export interface LikeEventDetailMap {
  likeIncrement: LikeIncrementDetail;
  likeCountsUpdate: LikeCountsUpdateDetail;
  likeRateLimit: null;
}

export interface RetryQueueItem {
  entryId: string;
  counts: number;
  timestamp: number;
}

export type LikeEventName = 'likeIncrement' | 'likeCountsUpdate' | 'likeRateLimit';

export const FLUSH_INTERVAL = 3000; // Flush after 3 seconds
export const RETRY_QUEUE_KEY = 'likeRetryQueue';
