const { postgres } = require('postgres');
const fs = require('fs');
async function main() {
    try {
        const sql = require('postgres')('postgresql://tfiverse:newpassword123@localhost:5432/tfiverse');
        const result = await sql`SELECT metadata FROM movies WHERE slug = 'bhubali-2-the-conclusion-350312' LIMIT 1`;
        fs.writeFileSync('metadata_dump.json', JSON.stringify(result[0]?.metadata, null, 2));
        console.log("Dumped to metadata_dump.json");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
main();
