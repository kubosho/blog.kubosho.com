import { eq, sql, sum } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { getDatabaseUrl } from '../utils/getDatabaseUrl';
import { createDatabaseClient } from './database';
import { likes } from './likesTable';

type GetLikeCountsParams = {
  entryId: string | null | undefined;
  connectionString?: string;
};

type IncrementLikeCountsParams = {
  increment: number;
  entryId: string;
  connectionString?: string;
};

function getDb(connectionString?: string): PostgresJsDatabase {
  const databaseUrl = getDatabaseUrl(connectionString);
  return createDatabaseClient(databaseUrl);
}

export async function getLikeCounts({ entryId, connectionString }: GetLikeCountsParams): Promise<number> {
  if (entryId == null) {
    return 0;
  }

  const db = getDb(connectionString);
  const result = await db
    .select({
      total: sum(likes.counts),
    })
    .from(likes)
    .where(eq(likes.entryId, entryId));

  const total = Number(result[0]?.total ?? 0);

  return total;
}

export async function incrementLikeCounts({
  entryId,
  increment,
  connectionString,
}: IncrementLikeCountsParams): Promise<number> {
  const db = getDb(connectionString);

  const result = await db
    .insert(likes)
    .values({
      counts: increment,
      entryId,
    })
    .onConflictDoUpdate({
      target: [likes.entryId],
      set: {
        counts: sql`${likes.counts} + ${increment}`,
        updatedAt: new Date(),
      },
    })
    .returning({ counts: likes.counts });

  return result[0]?.counts ?? increment;
}
