import { config } from "dotenv";
config({ path: ".env" });

async function main() {
  const { db } = await import("../src/lib/db");
  const { people } = await import("../src/lib/schema");
  const all = await db.select({ id: people.id, name: people.name, category: people.category, subcategory: people.subcategory }).from(people);
  console.log(JSON.stringify(all, null, 2));
  process.exit(0);
}
main();
