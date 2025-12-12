import { describe, expect, it } from 'vitest';

import { createDatabaseClient } from './database';

describe('createDatabaseClient', () => {
  it('throws when DATABASE_URL is not defined', () => {
    // Arrange
    const url = undefined;

    // Act
    const act = (): ReturnType<typeof createDatabaseClient> => createDatabaseClient(url);

    // Assert
    expect(act).toThrow('DATABASE_URL is not defined');
  });

  it('returns the same database instance for the same URL', () => {
    // Arrange
    const url = 'postgres://user:pass@localhost:5432/db';

    // Act
    const first = createDatabaseClient(url);
    const second = createDatabaseClient(url);

    // Assert
    expect(first).toBe(second);
  });
});
