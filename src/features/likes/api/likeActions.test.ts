import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as database from './database';
import * as likeActions from './likeActions';

const mockCreateDatabaseClient = vi.spyOn(database, 'createDatabaseClient');

const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
};

describe('likeActions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockCreateDatabaseClient.mockReturnValue(mockDb as unknown as PostgresJsDatabase);

    process.env.DATABASE_URL = 'mock';
  });

  describe('getLikeCounts', () => {
    it('returns 0 when result.total is undefined', async () => {
      // Arrange
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ total: undefined }]),
        }),
      });

      // Act
      const result = await likeActions.getLikeCounts({
        entryId: 'entry1',
      });

      // Assert
      expect(result).toBe(0);
    });

    it('returns the total when result.total is returned', async () => {
      // Arrange
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ total: '5' }]),
        }),
      });

      // Act
      const result = await likeActions.getLikeCounts({
        entryId: 'entry1',
      });

      // Assert
      expect(result).toBe(5);
    });
  });

  describe('incrementLikeCounts', () => {
    it('inserts when entryId is not registered in db', async () => {
      // Arrange
      mockDb.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          onConflictDoUpdate: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ counts: 1 }]),
          }),
        }),
      });

      // Act
      const result = await likeActions.incrementLikeCounts({
        entryId: 'entry1',
        increment: 1,
      });

      // Assert
      expect(mockDb.insert).toHaveBeenCalled();
      expect(result).toBe(1);
    });

    it('updates when entryId is registered in db', async () => {
      // Arrange
      mockDb.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          onConflictDoUpdate: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ counts: 5 }]),
          }),
        }),
      });

      // Act
      const result = await likeActions.incrementLikeCounts({
        entryId: 'entry1',
        increment: 3,
      });

      // Assert
      expect(mockDb.insert).toHaveBeenCalled();
      expect(result).toBe(5);
    });
  });
});
