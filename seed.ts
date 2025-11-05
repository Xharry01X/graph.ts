import { db } from "./surrealdb.js";

export async function seedData() {
  await db.query(`
    CREATE person:harry SET name = "Harry";
    CREATE person:raj SET name = "Raj";
    CREATE person:alice SET name = "Alice";
    CREATE person:bob SET name = "Bob";
    CREATE person:sara SET name = "Sara";
    CREATE person:tom SET name = "Tom";

    RELATE person:harry->connect->person:raj;
    RELATE person:raj->connect->person:harry;

    RELATE person:raj->connect->person:alice;
    RELATE person:alice->connect->person:raj;

    RELATE person:alice->connect->person:bob;
    RELATE person:bob->connect->person:alice;

    RELATE person:bob->connect->person:sara;
    RELATE person:sara->connect->person:bob;

    RELATE person:sara->connect->person:tom;
    RELATE person:tom->connect->person:sara;
  `);

  console.log("✅ Seeded LinkedIn-style sample data");
}
