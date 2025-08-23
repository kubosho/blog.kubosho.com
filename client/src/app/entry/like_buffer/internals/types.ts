interface LikeIncrementDetail {
  entryId: string;
  increment: number;
}
interface LikeTotalUpdateDetail {
  entryId: string;
  total: number;
}

export interface LikeEventDetailMap {
  likeIncrement: LikeIncrementDetail;
  likeTotalUpdate: LikeTotalUpdateDetail;
  likeRateLimit: null;
}

export interface RetryQueueItem {
  entryId: string;
  counts: number;
  timestamp: number;
}

export type LikeEventName = 'likeIncrement' | 'likeTotalUpdate' | 'likeRateLimit';

export const FLUSH_INTERVAL = 3000; // Flush after 3 seconds
export const RETRY_QUEUE_KEY = 'likeRetryQueue';
