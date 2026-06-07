// lib/db.ts

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/lib/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL environment variable is not set!');
}

let client: postgres.Sql;

try {
  client = postgres(process.env.DATABASE_URL, {
    max: 20,
    idle_timeout: 30,
    connect_timeout: 10,
  });
  
  console.log('✅ Database client initialized');
} catch (error) {
  console.error('❌ Failed to initialize database client:', error);
  throw new Error('Database connection failed during initialization');
}

export const db = drizzle(client, { schema });

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    console.log('🔌 Closing database connection...');
    await client.end();
    process.exit(0);
  });
}
