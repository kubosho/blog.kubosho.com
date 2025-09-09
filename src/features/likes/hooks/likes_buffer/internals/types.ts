export interface RetryQueueItem {
  entryId: string;
  counts: number;
  timestamp: number;
}

export const FLUSH_INTERVAL = 3000; // Flush after 3 seconds
export const RETRY_QUEUE_KEY = 'likeRetryQueue';
