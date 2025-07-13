export interface ErrorTracker {
  captureException(error: Error | unknown): ErrorEvent;
  onThresholdExceeded?(errors: ErrorGroup[]): void;
}

export interface ErrorEvent {
  id: string;
  fingerprint: string;
  timestamp: number;
  error: {
    message: string;
    stack?: string;
    type: string;
  };
}

export interface ErrorGroup {
  fingerprint: string;
  count: number;
  firstSeen: number;
  lastSeen: number;
  sample: ErrorEvent;
}
