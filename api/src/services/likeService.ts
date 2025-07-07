import { neon } from '@neondatabase/serverless';
import { eq, sum } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';

import { likes } from '../db/schema';

export interface LikeServiceInterface {
  getLikeCount(entryId: string): Promise<number>;
  addLikes(entryId: string, count: number): Promise<number>;
}

export class LikeService implements LikeServiceInterface {
  private db;

  constructor(databaseUrl: string) {
    const sql = neon(databaseUrl);
    this.db = drizzle(sql);
  }

  async getLikeCount(entryId: string): Promise<number> {
    const result = await this.db
      .select({ total: sum(likes.counts) })
      .from(likes)
      .where(eq(likes.entryId, entryId));

    const total = result[0]?.total;
    return typeof total === 'number' ? total : 0;
  }

  async addLikes(entryId: string, count: number): Promise<number> {
    await this.db.insert(likes).values({
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
