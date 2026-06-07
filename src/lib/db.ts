// lib/db.ts

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/lib/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL environment variable is not set!');
}

// Cache the postgres connection in development to prevent hot-reload leaks
declare global {
  // eslint-disable-next-line no-var
  var postgresClient: postgres.Sql | undefined;
}

let client: postgres.Sql;

if (process.env.NODE_ENV === 'production') {
  try {
    client = postgres(process.env.DATABASE_URL, {
      max: 20,
      idle_timeout: 30,
      connect_timeout: 10,
    });
  } catch (error) {
    console.error('❌ Failed to initialize database client:', error);
    throw new Error('Database connection failed during initialization');
  }
} else {
  if (!globalThis.postgresClient) {
    try {
      globalThis.postgresClient = postgres(process.env.DATABASE_URL, {
        max: 5, // Keep connection count lower in dev
        idle_timeout: 30,
        connect_timeout: 10,
      });
    } catch (error) {
      console.error('❌ Failed to initialize database client in dev:', error);
      throw new Error('Database connection failed during initialization');
    }
  }
  client = globalThis.postgresClient;
}

export const db = drizzle(client, { schema });

