import { eq, sum } from 'drizzle-orm';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { likes } from './likesTableSchema';

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
