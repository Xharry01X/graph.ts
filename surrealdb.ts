import { Surreal } from "surrealdb";
import "dotenv/config";

export const db = new Surreal();

export async function initDB() {
  if (!process.env.SURREALDB_URL) throw new Error("Missing SurrealDB URL");

  await db.connect(process.env.SURREALDB_URL);

  await db.signin({
    namespace: process.env.SURREALDB_NAMESPACE!,
    database: process.env.SURREALDB_DATABASE!,
    username: process.env.SURREALDB_USERNAME!,
    password: process.env.SURREALDB_PASSWORD!,
  });

  await db.use({
    namespace: process.env.SURREALDB_NAMESPACE!,
    database: process.env.SURREALDB_DATABASE!,
  });

  console.log("✅ SurrealDB initialized");
}
