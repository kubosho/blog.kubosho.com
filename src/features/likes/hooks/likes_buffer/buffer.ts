import { trackInteraction } from '../../../../utils/sentry';
import { FLUSH_TIMER } from './internals/types';

export class LikeBuffer {
  private _flushTimer: NodeJS.Timeout | null;
  private _pending = new Map<string, number>();
  private _subscribers = new Map<string, Set<(counts: number) => void>>();

  constructor() {
    this._flushTimer = null;
  }

  /**
   * Adds a like to the in-memory buffer.
   */
  add(entryId: string): void {
    const current = this._pending.get(entryId) || 0;

    this._pending.set(entryId, current + 1);
    this._scheduleFlush();

    trackInteraction('like_added', 'likes', { entryId });
  }

  /**
   * Manually triggers a flush.
   */
  flush(): void {
    this._immediateFlush();
  }

  /**
   * Gets the number of pending items.
   */
  getPendingCount(): number {
    return Array.from(this._pending.values()).reduce((sum, count) => sum + count, 0);
  }

  /**
   * Notify server-confirmed counts to entry subscribers.
   */
  notifyCounts(entryId: string, counts: number): void {
    this._notifySubscribers(entryId, counts);
  }

  /**
   * Subscribe to server-confirmed counts for a specific entry.
   */
  subscribe(entryId: string, callback: (counts: number) => void): () => void {
    const newSubscriber = this._subscribers.get(entryId) ?? new Set<(counts: number) => void>();
    newSubscriber.add(callback);
    this._subscribers.set(entryId, newSubscriber);

    return () => {
      const subscriber = this._subscribers.get(entryId);
      if (subscriber == null) {
        return;
      }

      subscriber.delete(callback);

      if (subscriber.size === 0) {
        this._subscribers.delete(entryId);
      }
    };
  }

  private _immediateFlush(): void {
    this._resetFlushTimer();

    if (this._pending.size > 0) {
      this._pending.clear();
    }
  }

  private _scheduleFlush(): void {
    this._resetFlushTimer();

    this._flushTimer = setTimeout(() => {
      if (this._pending.size > 0) {
        this._pending.clear();
      }

      this._flushTimer = null;
    }, FLUSH_TIMER);
  }

  private _resetFlushTimer(): void {
    if (this._flushTimer != null) {
      clearTimeout(this._flushTimer);
      this._flushTimer = null;
    }
  }

  private _notifySubscribers(entryId: string, counts: number): void {
    const subscriber = this._subscribers.get(entryId);
    if (subscriber == null) {
      return;
    }

    for (const notify of subscriber) {
      try {
        notify(counts);
      } catch {
        // ignore subscriber errors
      }
    }
  }
}
