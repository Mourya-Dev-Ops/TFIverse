require('dotenv').config();
const postgres = require('postgres');

async function testConnection() {
  console.log('Testing connection to:', process.env.DATABASE_URL);
  try {
    const sql = postgres(process.env.DATABASE_URL, { max: 1, idle_timeout: 1 });
    const result = await sql`SELECT 1 as connected`;
    console.log('✅ Connection successful:', result);
    await sql.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
