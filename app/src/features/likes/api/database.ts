import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const dbMap = new Map<string, PostgresJsDatabase>();

const isCloudflareWorkersRuntime = typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers';

export function createDatabaseClient(databaseUrl: string | null | undefined): PostgresJsDatabase {
  if (databaseUrl == null || databaseUrl === '') {
    throw new Error('DATABASE_URL is not defined');
  }

  if (!isCloudflareWorkersRuntime) {
    const cachedDB = dbMap.get(databaseUrl);
    if (cachedDB != null) {
      return cachedDB;
    }
  }

  const client = postgres(databaseUrl, {
    connect_timeout: 5,
    idle_timeout: 10,
    max: 1,
    prepare: false,
  });
  const db = drizzle(client);

  if (!isCloudflareWorkersRuntime) {
    dbMap.set(databaseUrl, db);
  }

  return db;
}
