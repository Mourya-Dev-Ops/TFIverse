import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  await sql`UPDATE user_profile SET "dateOfBirth" = NULL`;
  console.log("Reset DOB for all users");
  process.exit(0);
}
main();
