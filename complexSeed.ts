import { db } from "./surrealdb.js";

export async function seedData() {
  await db.query(`
    -- Create people
    CREATE person:harry SET name = "Harry";
    CREATE person:raj SET name = "Raj";
    CREATE person:alice SET name = "Alice";
    CREATE person:bob SET name = "Bob";
    CREATE person:sara SET name = "Sara";
    CREATE person:tom SET name = "Tom";
    CREATE person:lisa SET name = "Lisa";
    CREATE person:mike SET name = "Mike";
    CREATE person:emma SET name = "Emma";
    CREATE person:ryan SET name = "Ryan";

    -- Core linear chain
    RELATE person:harry->connect->person:raj;
    RELATE person:raj->connect->person:alice;
    RELATE person:alice->connect->person:bob;
    RELATE person:bob->connect->person:sara;
    RELATE person:sara->connect->person:tom;

    -- Make connections bidirectional
    RELATE person:raj->connect->person:harry;
    RELATE person:alice->connect->person:raj;
    RELATE person:bob->connect->person:alice;
    RELATE person:sara->connect->person:bob;
    RELATE person:tom->connect->person:sara;

    -- Add branching connections (cross-links)
    RELATE person:harry->connect->person:alice;  -- Harry also knows Alice
    RELATE person:alice->connect->person:sara;   -- Alice jumps to Sara
    RELATE person:bob->connect->person:ryan;     -- Bob connects to Ryan
    RELATE person:raj->connect->person:lisa;     -- Raj connects to Lisa
    RELATE person:lisa->connect->person:mike;    -- Lisa connects to Mike

    -- Add LIKE relationships (unidirectional)
    RELATE person:harry->likes->person:emma;
    RELATE person:raj->likes->person:sara;
    RELATE person:alice->likes->person:harry;
    RELATE person:bob->likes->person:lisa;
    RELATE person:sara->likes->person:raj;
    RELATE person:tom->likes->person:emma;
    RELATE person:lisa->likes->person:harry;
    RELATE person:mike->likes->person:sara;
    RELATE person:emma->likes->person:raj;
    RELATE person:ryan->likes->person:alice;
  `);

  console.log("✅ Seeded complex LinkedIn-style social graph with connections + likes");
}
