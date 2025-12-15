import type { APIContext } from 'astro';
import { eq, sum } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { getDatabaseUrl } from '../utils/getDatabaseUrl';
import { createDatabaseClient } from './database';
import { likes } from './likesTable';

type Context = APIContext['locals'];

type GetLikeCountsParams = {
  entryId: string | null | undefined;
  context?: Context;
};

type UpsertLikeCountsParams = {
  counts: number;
  entryId: string;
  context?: Context;
};

function getDb(context?: Context): PostgresJsDatabase {
  const databaseUrl = getDatabaseUrl(context);
  return createDatabaseClient(databaseUrl);
}

export async function getLikeCounts({ context, entryId }: GetLikeCountsParams): Promise<number> {
  if (entryId == null) {
    return 0;
  }

  const db = getDb(context);
  const result = await db
    .select({
      total: sum(likes.counts),
    })
    .from(likes)
    .where(eq(likes.entryId, entryId));

  const total = Number(result[0]?.total ?? 0);

  return total;
}

export async function upsertLikeCounts({ context, entryId, counts }: UpsertLikeCountsParams): Promise<void> {
  const db = getDb(context);
  await db
    .insert(likes)
    .values({
      counts,
      entryId,
    })
    .onConflictDoUpdate({
      target: [likes.entryId],
      set: { counts, updatedAt: new Date() },
    });
}
