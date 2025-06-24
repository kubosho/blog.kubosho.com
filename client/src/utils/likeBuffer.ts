// Import Sentry for error tracking
import { captureError, trackInteraction } from './sentry';

interface RetryQueueItem {
  entryId: string;
  counts: number;
  timestamp: number;
}

const FLUSH_INTERVAL = 3000; // Flush after 3 seconds
const RETRY_QUEUE_KEY = 'likeRetryQueue';

export class LikeBufferManager {
  private pending = new Map<string, number>();
  private flushTimer: NodeJS.Timeout | undefined;
  private isFlushing: boolean;
  private lastFlush: number;

  constructor() {
    this.isFlushing = false;
    this.lastFlush = Date.now();
    this.initializeRetryQueue();
    this.setupUnloadHandlers();
  }

  /**
   * Adds a like (optimistic update).
   */
  add(entryId: string): void {
    const current = this.pending.get(entryId) || 0;
    this.pending.set(entryId, current + 1);
    this.scheduleFlush();

    // Track interaction
    trackInteraction('like_added', 'likes', { entryId });

    // Update UI immediately (optimistic update).
    this.updateUI(entryId, 1);
  }

  /**
   * Schedules a flush.
   */
  private scheduleFlush(): void {
    if (this.flushTimer || this.isFlushing) return;

    const now = Date.now();
    const timeSinceLastFlush = now - this.lastFlush;

    if (timeSinceLastFlush >= FLUSH_INTERVAL) {
      this.flushAll();
    } else {
      const delay = FLUSH_INTERVAL - timeSinceLastFlush;
      this.flushTimer = setTimeout(() => {
        this.flushTimer = undefined;
        this.flushAll();
      }, delay);
    }
  }

  /**
   * Flushes all pending likes.
   */
  private async flushAll(): Promise<void> {
    if (this.pending.size === 0 || this.isFlushing) return;

    this.isFlushing = true;

    const currentPending = new Map(this.pending);
    this.pending.clear();

    try {
      // Send individual POST requests for each entry.
      for (const [entryId, counts] of currentPending) {
        await this.sendLike(entryId, counts);
      }
    } finally {
      this.lastFlush = Date.now();
      this.isFlushing = false;

      // After a flush, if there are new pending items, schedule a new flush.
      if (this.pending.size > 0) {
        this.scheduleFlush();
      }
    }
  }

  /**
   * Sends likes to the server.
   */
  private async sendLike(entryId: string, counts: number): Promise<void> {
    try {
      const response = await fetch(`/api/likes/${entryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ counts }),
      });

      if (response.status === 429) {
        console.warn('Rate limit exceeded');
        this.showRateLimitMessage();
        trackInteraction('rate_limit_hit', 'likes', { entryId });
      } else if (response.ok) {
        const data = (await response.json()) as { total: number };
        // Update the UI with the total count returned from the server.
        this.updateTotalCount(entryId, data.total);
        trackInteraction('like_sent_success', 'likes', { entryId, counts });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send like:', error);

      // Capture error to Sentry
      captureError(error, {
        tags: {
          component: 'likeBuffer',
          action: 'sendLike',
        },
        extra: {
          entryId,
          counts,
        },
      });

      // If an error occurs, save to local storage and retry later.
      this.saveToRetryQueue(entryId, counts);
    }
  }

  /**
   * Optimistically updates the UI.
   */
  private updateUI(entryId: string, increment: number): void {
    window.dispatchEvent(
      new CustomEvent('likeIncrement', {
        detail: { entryId, increment },
      }),
    );
  }

  /**
   * Updates the UI with the total count from the server.
   */
  private updateTotalCount(entryId: string, total: number): void {
    window.dispatchEvent(
      new CustomEvent('likeTotalUpdate', {
        detail: { entryId, total },
      }),
    );
  }

  /**
   * Displays a rate limit message.
   */
  private showRateLimitMessage(): void {
    window.dispatchEvent(new CustomEvent('likeRateLimit'));
  }

  /**
   * Saves a failed request to the retry queue.
   */
  private saveToRetryQueue(entryId: string, counts: number): void {
    try {
      const queue: RetryQueueItem[] = JSON.parse(localStorage.getItem(RETRY_QUEUE_KEY) || '[]');
      queue.push({ entryId, counts, timestamp: Date.now() });
      localStorage.setItem(RETRY_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save to retry queue:', error);

      // Capture localStorage error
      captureError(error, {
        tags: {
          component: 'likeBuffer',
          action: 'saveToRetryQueue',
        },
        extra: {
          entryId,
          counts,
        },
      });
    }
  }

  /**
   * Initializes the retry queue and resends failed requests.
   */
  private initializeRetryQueue(): void {
    try {
      const queue: RetryQueueItem[] = JSON.parse(localStorage.getItem(RETRY_QUEUE_KEY) || '[]');

      if (queue.length === 0) return;

      // Remove items that are too old (more than 24 hours).
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const validQueue = queue.filter((item) => item.timestamp > oneDayAgo);

      // Clear the retry queue.
      localStorage.setItem(RETRY_QUEUE_KEY, '[]');

      // Resend valid items.
      for (const item of validQueue) {
        setTimeout(() => {
          this.sendLike(item.entryId, item.counts);
        }, Math.random() * 5000); // Send with a random delay.
      }
    } catch (error) {
      console.error('Failed to initialize retry queue:', error);
    }
  }

  /**
   * Sets up unload handlers.
   */
  private setupUnloadHandlers(): void {
    const flushOnUnload = (): void => {
      if (this.pending.size > 0) {
        // Use sendBeacon to ensure the request is sent.
        this.pending.forEach((counts, entryId) => {
          const formData = new FormData();
          formData.append('counts', counts.toString());
          navigator.sendBeacon(`/api/likes/${entryId}`, formData);
        });
        this.pending.clear();
      }
    };

    window.addEventListener('beforeunload', flushOnUnload);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) flushOnUnload();
    });
  }

  /**
   * Manually triggers a flush.
   */
  public flush(): Promise<void> {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = undefined;
    }
    return this.flushAll();
  }

  /**
   * Gets the number of pending items.
   */
  public getPendingCount(): number {
    return Array.from(this.pending.values()).reduce((sum, count) => sum + count, 0);
  }
}

// Global instance.
export const likeBuffer = new LikeBufferManager();
