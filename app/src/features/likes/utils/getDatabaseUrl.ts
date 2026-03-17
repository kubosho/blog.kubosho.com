type Env = {
  DATABASE_URL?: string;
  HYPERDRIVE?: { connectionString: string };
};

export function getDatabaseUrl(env?: Env): string | undefined {
  const connectionString = env?.HYPERDRIVE?.connectionString;
  if (connectionString != null && connectionString !== '') {
    return connectionString;
  }

  if (env?.DATABASE_URL != null && env.DATABASE_URL !== '') {
    return env.DATABASE_URL;
  }

  return process.env.DATABASE_URL;
}
