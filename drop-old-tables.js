const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

async function dropOldTables() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('No DATABASE_URL found');
    process.exit(1);
  }
  
  const client = postgres(connectionString);
  const db = drizzle(client);

  try {
    console.log('Dropping old tables...');
    await client`DROP TABLE IF EXISTS "daily_collections" CASCADE;`;
    await client`DROP TABLE IF EXISTS "district_collections" CASCADE;`;
    await client`DROP TABLE IF EXISTS "bms_interests" CASCADE;`;
    await client`DROP TABLE IF EXISTS "re_releases" CASCADE;`;
    console.log('Dropped old tables successfully.');
  } catch (error) {
    console.error('Error dropping tables:', error);
  } finally {
    client.end();
  }
}

dropOldTables();
