import { db } from "./surrealdb.js";

export async function phoneNetworkSchema() {
  await db.query(`
    -------------------------------------------------------
    -- PEOPLE
    -------------------------------------------------------
    CREATE person:ishan  SET name = "Ishan";
    CREATE person:riya   SET name = "Riya";
    CREATE person:karan  SET name = "Karan";
    CREATE person:meera  SET name = "Meera";
    CREATE person:neel   SET name = "Neel";
    CREATE person:tara   SET name = "Tara";
    CREATE person:aarav  SET name = "Aarav";
    CREATE person:anita  SET name = "Anita";
    CREATE person:rohit  SET name = "Rohit";
    CREATE person:pooja  SET name = "Pooja";

    -------------------------------------------------------
    -- PHONES
    -------------------------------------------------------
    CREATE phone:iphone12  SET model = "iPhone 12";
    CREATE phone:iphone13  SET model = "iPhone 13";
    CREATE phone:iphone14  SET model = "iPhone 14";
    CREATE phone:iphone15  SET model = "iPhone 15";
    CREATE phone:iphone16  SET model = "iPhone 16";

    -------------------------------------------------------
    -- OWNERSHIP (ONE PER PERSON)
    -------------------------------------------------------
    RELATE person:ishan->owns->phone:iphone16;
    RELATE person:riya->owns->phone:iphone15;
    RELATE person:karan->owns->phone:iphone14;
    RELATE person:meera->owns->phone:iphone13;
    RELATE person:neel->owns->phone:iphone12;
    RELATE person:tara->owns->phone:iphone15;
    RELATE person:aarav->owns->phone:iphone14;
    RELATE person:anita->owns->phone:iphone13;
    RELATE person:rohit->owns->phone:iphone12;
    RELATE person:pooja->owns->phone:iphone15;

    -------------------------------------------------------
    -- FRIENDSHIPS (SINGLE BIDIRECTIONAL RELATIONS)
    -------------------------------------------------------
    -- Create single knows relationships (they're automatically bidirectional in queries)
    RELATE person:ishan->knows->person:riya;
    RELATE person:riya->knows->person:ishan; 
    RELATE person:karan->knows->person:riya;
    RELATE person:riya->knows->person:karan;
    RELATE person:karan->knows->person:meera;
    RELATE person:meera->knows->person:neel;
    RELATE person:neel->knows->person:tara;
    RELATE person:tara->knows->person:aarav;
    RELATE person:aarav->knows->person:anita;
    RELATE person:anita->knows->person:rohit;
    RELATE person:rohit->knows->person:pooja;

    -- Cross links for better branching
    RELATE person:ishan->knows->person:neel;
    RELATE person:karan->knows->person:tara;
    RELATE person:anita->knows->person:pooja;
  `);

  console.log("✅ Fixed iPhone social graph created");
}