export interface RetryQueueItem {
  entryId: string;
  increment: number;
  timestamp: number;
}

export const FLUSH_TIMER = 1000 as const;
export const LIKE_SEND_RETRY_QUEUE_KEY = 'likeRetryQueue' as const;
