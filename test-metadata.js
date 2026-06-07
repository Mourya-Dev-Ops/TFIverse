const { postgres } = require('postgres');

async function main() {
    const sql = require('postgres')('postgresql://tfiverse:newpassword123@localhost:5432/tfiverse');
    const result = await sql`SELECT metadata FROM movies WHERE slug LIKE '%bahubali%' OR slug LIKE '%bhubali%' LIMIT 1`;
    console.log(JSON.stringify(result[0]?.metadata, null, 2));
    process.exit(0);
}

main().catch(console.error);
