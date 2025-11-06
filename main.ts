import { initDB } from "./surrealdb.js";
import { phoneNetworkSchema } from "./familySchema.js";
import { getKnownPeople, getPeopleWithPhones, getPersonPhone, traverseIPhoneNetworkBFS } from "./traverseNatively.js";

async function main() {
  await initDB();
  await phoneNetworkSchema();

  const connections = await getKnownPeople("person:karan");
  console.log("Karan's connections:", connections);

  const people = await getPeopleWithPhones(["person:karan", "person:meera", "person:neel"]);
  console.log("People with phones:", people);

 
  const bfsResult = await traverseIPhoneNetworkBFS("person:karan", 3);
  console.log("BFS Result:", JSON.stringify(bfsResult, null, 3));

  const phone = await getPersonPhone("person:karan");
  console.log("Karan's phone:", phone);
}

main().catch(console.error);