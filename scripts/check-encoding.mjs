import pg from 'pg';
const client = new pg.Client('postgresql://tfiverse:newpassword123@localhost:5432/tfiverse');
await client.connect();
const res = await client.query("SELECT original_title, title FROM movies WHERE slug='bhubali-2-the-conclusion-350312'");
console.log('DB original_title:', JSON.stringify(res.rows[0]?.original_title));
console.log('DB title:', JSON.stringify(res.rows[0]?.title));
// Also check from metadata JSON
const res2 = await client.query("SELECT metadata->'original_title' as ot FROM movies WHERE slug='bhubali-2-the-conclusion-350312'");
console.log('metadata original_title:', JSON.stringify(res2.rows[0]?.ot));
await client.end();
