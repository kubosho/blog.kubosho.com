import type { ErrorEvent, ErrorGroup, ErrorTracker } from '../types';
import { generateFingerprint, generateUniqueId } from '../errorIdentityFactory';

export class ApiErrorTracker implements ErrorTracker {
  private errors: Map<string, ErrorGroup> = new Map();
  private threshold = 10;

  captureException(error: Error | unknown): ErrorEvent {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    const fingerprint = generateFingerprint(message, stack);

    const errorEvent: ErrorEvent = {
      id: generateUniqueId(),
      fingerprint,
      timestamp: Date.now(),
      error: {
        message,
        stack,
        type: error instanceof Error ? error.name : typeof error,
      },
    };

    this.updateErrorGroup(errorEvent);

    return errorEvent;
  }

  onThresholdExceeded?(errors: ErrorGroup[]): void;

  setThreshold(threshold: number): void {
    this.threshold = threshold;
  }

  getErrorGroups(): ErrorGroup[] {
    return Array.from(this.errors.values());
  }

  private updateErrorGroup(event: ErrorEvent): void {
    const group = this.errors.get(event.fingerprint);

    if (group != null) {
      group.count++;
      group.lastSeen = event.timestamp;

      if (group.count === this.threshold && this.onThresholdExceeded != null) {
        this.onThresholdExceeded([group]);
      }

      return;
    }

    this.errors.set(event.fingerprint, {
      fingerprint: event.fingerprint,
      count: 1,
      firstSeen: event.timestamp,
      lastSeen: event.timestamp,
      sample: event,
    });

    if (this.threshold === 1 && this.onThresholdExceeded != null) {
      this.onThresholdExceeded([this.errors.get(event.fingerprint)!]);
    }
  }
}
