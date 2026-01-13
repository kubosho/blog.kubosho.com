import { describe, expect, test, vi } from 'vitest';

import { entryExists } from './entryExistence';

describe('entryExists', () => {
  test('should return true when entry exists', async () => {
    // Arrange
    const mockGetEntry = vi.fn().mockResolvedValue({ id: 'existing-entry', collection: 'entries', data: {} });

    // Act
    const result = await entryExists('existing-entry', mockGetEntry);

    // Assert
    expect(result).toBe(true);
    expect(mockGetEntry).toHaveBeenCalledWith('entries', 'existing-entry');
  });

  test('should return false when entry does not exist', async () => {
    // Arrange
    const mockGetEntry = vi.fn().mockResolvedValue(undefined);

    // Act
    const result = await entryExists('non-existing-entry', mockGetEntry);

    // Assert
    expect(result).toBe(false);
    expect(mockGetEntry).toHaveBeenCalledWith('entries', 'non-existing-entry');
  });

  test('should propagate error when getEntry throws', async () => {
    // Arrange
    const error = new Error('Collection lookup failed');
    const mockGetEntry = vi.fn().mockRejectedValue(error);

    // Act & Assert
    await expect(entryExists('some-entry', mockGetEntry)).rejects.toThrow('Collection lookup failed');
  });
});
