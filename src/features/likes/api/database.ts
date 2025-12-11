import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export function createDatabaseClient(databaseUrl: string | null | undefined): PostgresJsDatabase {
  if (databaseUrl == null || databaseUrl === '') {
    throw new Error('DATABASE_URL is not defined');
  }

  const client = postgres(databaseUrl);
  return drizzle(client);
}
