export function getDatabaseUrl(connectionString?: string): string | undefined {
  if (connectionString != null && connectionString !== '') {
    return connectionString;
  }

  return process.env.DATABASE_URL;
}
