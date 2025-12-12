import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const dbMap = new Map<string, PostgresJsDatabase>();

export function createDatabaseClient(databaseUrl: string | null | undefined): PostgresJsDatabase {
  if (databaseUrl == null || databaseUrl === '') {
    throw new Error('DATABASE_URL is not defined');
  }

  const cachedDB = dbMap.get(databaseUrl);
  if (cachedDB != null) {
    return cachedDB;
  }

  const client = postgres(databaseUrl, {
    connect_timeout: 5,
    idle_timeout: 10,
  });
  const db = drizzle(client);

  dbMap.set(databaseUrl, db);

  return db;
}
