import { trackInteraction } from '../../../../utils/sentry';
import { sendLikes } from './internals/api';
import { dispatchLikeCountsUpdate, dispatchLikeIncrement } from './internals/events';
import { clearRetryQueue, loadRetryQueue } from './internals/storage';
import { FLUSH_INTERVAL } from './internals/types';

export class LikeBuffer {
  private _pending = new Map<string, number>();
  private _flushTimer: NodeJS.Timeout | undefined;
  private _isFlushing: boolean;
  private _lastFlush: number;

  constructor() {
    this._isFlushing = false;
    this._lastFlush = Date.now();

    this._initializeRetryQueue();
  }

  /**
   * Adds a like (optimistic update).
   */
  add(entryId: string): void {
    const current = this._pending.get(entryId) || 0;
    this._pending.set(entryId, current + 1);
    this._scheduleFlush();

    trackInteraction('like_added', 'likes', { entryId });

    dispatchLikeIncrement(entryId, 1);
  }

  /**
   * Manually triggers a flush.
   */
  flush(): Promise<void> {
    if (this._flushTimer != null) {
      clearTimeout(this._flushTimer);
      this._flushTimer = undefined;
    }

    return this._flushAll();
  }

  /**
   * Gets the number of pending items.
   */
  getPendingCount(): number {
    return Array.from(this._pending.values()).reduce((sum, count) => sum + count, 0);
  }

  /**
   * Schedules a flush.
   */
  private _scheduleFlush(): void {
    if (this._flushTimer != null || this._isFlushing) {
      return;
    }

    const now = Date.now();
    const timeSinceLastFlush = now - this._lastFlush;

    if (timeSinceLastFlush >= FLUSH_INTERVAL) {
      this._flushAll();
    } else {
      const delay = FLUSH_INTERVAL - timeSinceLastFlush;
      this._flushTimer = setTimeout(() => {
        this._flushTimer = undefined;
        this._flushAll();
      }, delay);
    }
  }

  /**
   * Flushes all pending likes.
   */
  private async _flushAll(): Promise<void> {
    if (this._pending.size === 0 || this._isFlushing) {
      return;
    }

    this._isFlushing = true;

    const currentPending = new Map(this._pending);
    this._pending.clear();

    try {
      // Send individual POST requests for each entry.
      for (const [entryId, counts] of currentPending) {
        const result = await sendLikes(entryId, counts);
        if (result != null) {
          // Update the UI with the total count returned from the server.
          dispatchLikeCountsUpdate(entryId, result.counts);
        }
      }
    } finally {
      this._lastFlush = Date.now();
      this._isFlushing = false;

      // After a flush, if there are new pending items, schedule a new flush.
      if (this._pending.size > 0) {
        this._scheduleFlush();
      }
    }
  }

  /**
   * Initializes the retry queue and resends failed requests.
   */
  private _initializeRetryQueue(): void {
    const queue = loadRetryQueue();
    if (queue.length === 0) {
      return;
    }

    // Clear the retry queue.
    clearRetryQueue();

    // Resend valid items.
    for (const item of queue) {
      setTimeout(() => {
        sendLikes(item.entryId, item.counts).then((result) => {
          if (result != null) {
            dispatchLikeCountsUpdate(item.entryId, result.counts);
          }
        });
      }, Math.random() * 5000); // Send with a random delay.
    }
  }
}
