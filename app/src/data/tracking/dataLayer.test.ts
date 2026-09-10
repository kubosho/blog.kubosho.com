import { beforeEach, describe, expect, test } from 'vitest';

import { initialDatalayer } from './dataLayer';

describe('initialDatalayer()', () => {
  beforeEach(() => {
    delete window.dataLayer;
  });

  test('an event pushed before GTM loads is still first in dataLayer', () => {
    // Arrange
    window.dataLayer = [{ event: 'scroll_depth', scroll_percentage: 25 }];

    // Act
    initialDatalayer();

    // Assert
    expect(window.dataLayer?.[0]).toEqual({ event: 'scroll_depth', scroll_percentage: 25 });
  });

  test('gtm.js is appended when dataLayer does not exist yet', () => {
    // Act
    initialDatalayer();

    // Assert
    expect(window.dataLayer?.at(-1)).toMatchObject({ event: 'gtm.js' });
  });
});
