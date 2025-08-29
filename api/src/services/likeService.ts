import { eq, sum } from 'drizzle-orm';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { likes } from '../db/schema';

export interface LikeServiceInterface {
  getLikeCount(entryId: string): Promise<number>;
  addLikes(entryId: string, count: number): Promise<number>;
}

export class LikeService implements LikeServiceInterface {
  private _db: PostgresJsDatabase;

  constructor(databaseUrl: string) {
    const client = postgres(databaseUrl);
    this._db = drizzle(client);
  }

  async getLikeCount(entryId: string): Promise<number> {
    const result = await this._db
      .select({ total: sum(likes.counts) })
      .from(likes)
      .where(eq(likes.entryId, entryId));

    const total = Number(result[0]?.total ?? 0);

    return total;
  }

  async addLikes(entryId: string, count: number): Promise<number> {
    await this._db.insert(likes).values({
      entryId,
      counts: count,
    });

    return this.getLikeCount(entryId);
  }
}

export class MockLikeService implements LikeServiceInterface {
  private mockData = new Map<string, number>();

  async getLikeCount(entryId: string): Promise<number> {
    return this.mockData.get(entryId) || Math.floor(Math.random() * 100);
  }

  async addLikes(entryId: string, count: number): Promise<number> {
    const current = this.mockData.get(entryId) || 0;
    const newTotal = current + count;
    this.mockData.set(entryId, newTotal);
    return newTotal;
  }
}
