import { describe, expect, test, vi } from 'vitest';

import { ApiErrorTracker } from './errorTracker';

const cleanupTest = (): void => {
  vi.clearAllMocks();
  vi.useRealTimers();
};

const setupTest = (): {
  tracker: ApiErrorTracker;
  mockCallback: ReturnType<typeof vi.fn>;
} => {
  cleanupTest();

  vi.useFakeTimers();

  return {
    tracker: new ApiErrorTracker(),
    mockCallback: vi.fn(),
  };
};

describe('SimpleErrorTracker', () => {
  describe('captureException', () => {
    test('error event has all required fields', () => {
      // Given
      const { tracker } = setupTest();
      const errorMessage = 'Test error';
      const error = new Error(errorMessage);
      const expected = {
        id: expect.any(String),
        fingerprint: expect.any(String),
        timestamp: expect.any(Number),
        error: {
          message: errorMessage,
          stack: expect.stringContaining(errorMessage),
          type: 'Error',
        },
      };

      // When
      const event = tracker.captureException(error);

      // Then
      expect(event).toMatchObject(expected);
    });

    test('string values are captured as message with no stack trace', () => {
      // Given
      const { tracker } = setupTest();
      const nonErrorObject = 'string error';
      const expected = {
        id: expect.any(String),
        fingerprint: expect.any(String),
        timestamp: expect.any(Number),
        error: {
          message: nonErrorObject,
          stack: undefined,
          type: 'string',
        },
      };

      // When
      const event = tracker.captureException(nonErrorObject);

      // Then
      expect(event).toMatchObject(expected);
    });

    test('same errors have identical fingerprints', () => {
      // Given
      const { tracker } = setupTest();
      const sameErrorMessage = 'Same error message';
      const error1 = new Error(sameErrorMessage);
      const error2 = new Error(sameErrorMessage);

      // When
      const event1 = tracker.captureException(error1);
      const event2 = tracker.captureException(error2);

      // Then
      expect(event1.fingerprint).toBe(event2.fingerprint);
    });

    test('different errors have unique fingerprints', () => {
      // Given
      const { tracker } = setupTest();
      const error1 = new Error('Error message 1');
      const error2 = new Error('Error message 2');

      // When
      const event1 = tracker.captureException(error1);
      const event2 = tracker.captureException(error2);

      // Then
      expect(event1.fingerprint).not.toBe(event2.fingerprint);
    });
  });

  describe('error grouping', () => {
    test('error count increases for repeated errors', () => {
      // Given
      const { tracker } = setupTest();
      const repeatedError = new Error('Repeated error');
      const captureCount = 3;

      // When
      Array.from({ length: captureCount }).forEach(() => tracker.captureException(repeatedError));

      // Then
      const groups = tracker.getErrorGroups();
      expect(groups).toHaveLength(1);
      expect(groups[0].count).toBe(captureCount);
    });

    test('timestamps track first and last occurrence', () => {
      // Given
      const { tracker } = setupTest();
      const trackedError = new Error('Tracked error');
      const timeBetweenErrors = 1000; // 1 second

      // When
      const firstEvent = tracker.captureException(trackedError);
      vi.advanceTimersByTime(timeBetweenErrors);
      const secondEvent = tracker.captureException(trackedError);

      // Then
      const groups = tracker.getErrorGroups();
      expect(groups[0].firstSeen).toBe(firstEvent.timestamp);
      expect(groups[0].lastSeen).toBe(secondEvent.timestamp);
      expect(groups[0].lastSeen).toBeGreaterThan(groups[0].firstSeen);
    });
  });

  describe('threshold alerts', () => {
    test('callback not triggered before threshold', () => {
      // Given
      const { tracker, mockCallback } = setupTest();
      const threshold = 3;
      const error = new Error('Threshold error');
      tracker.onThresholdExceeded = mockCallback;
      tracker.setThreshold(threshold);

      // When
      tracker.captureException(error);
      tracker.captureException(error);

      // Then
      expect(mockCallback).not.toHaveBeenCalled();
    });

    test('callback triggered when threshold reached', () => {
      // Given
      const { tracker, mockCallback } = setupTest();
      const threshold = 3;
      const error = new Error('Threshold error');
      tracker.onThresholdExceeded = mockCallback;
      tracker.setThreshold(threshold);

      // When
      tracker.captureException(error);
      tracker.captureException(error);
      tracker.captureException(error);

      // Then
      expect(mockCallback).toHaveBeenCalledTimes(1);
      const callArgs = mockCallback.mock.calls[0][0];
      expect(callArgs).toHaveLength(1);
      expect(callArgs[0].count).toBe(threshold);
      expect(callArgs[0].sample.error.message).toBe('Threshold error');
    });

    test('missing callback does not throw error', () => {
      // Given
      const { tracker } = setupTest();
      const threshold = 1;
      const noCallbackError = new Error('No callback error');
      tracker.setThreshold(threshold);

      // When & Then
      expect(() => {
        tracker.captureException(noCallbackError);
      }).not.toThrow();
    });

    test('threshold of 1 triggers immediate callback', () => {
      // Given
      const { tracker, mockCallback } = setupTest();
      const threshold = 1;
      const error = new Error('Immediate threshold error');
      tracker.onThresholdExceeded = mockCallback;
      tracker.setThreshold(threshold);

      // When
      tracker.captureException(error);

      // Then
      expect(mockCallback).toHaveBeenCalledTimes(1);
      const errorGroups = mockCallback.mock.calls[0][0];
      expect(errorGroups[0].count).toBe(1);
      expect(errorGroups[0].sample.error.message).toBe('Immediate threshold error');
    });
  });
});
