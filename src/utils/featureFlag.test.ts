import type { AstroCookies } from 'astro';
import { describe, expect, it } from 'vitest';

import { featureFlags } from '../../constants/featureFlags.js';
import { isFeatureEnabled } from './featureFlag.js';

describe('isFeatureEnabled', () => {
  it('should return default value when cookies is null', () => {
    // Arrange
    const flagName = 'likeFeature';

    // Act
    const result = isFeatureEnabled(flagName);

    // Assert
    expect(result).toBe(featureFlags[flagName]);
  });

  it('should return true when cookie value is "true"', () => {
    // Arrange
    const flagName = 'likeFeature';
    const cookies = { get: () => ({ value: 'true' }) } as unknown as AstroCookies;

    // Act
    const result = isFeatureEnabled(flagName, cookies);

    // Assert
    expect(result).toBe(true);
  });

  it('should return false when cookie value is "false"', () => {
    // Arrange
    const flagName = 'likeFeature';
    const cookies = { get: () => ({ value: 'false' }) } as unknown as AstroCookies;

    // Act
    const result = isFeatureEnabled(flagName, cookies);

    // Assert
    expect(result).toBe(false);
  });
});
