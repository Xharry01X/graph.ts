import { initDB } from "./surrealdb.js";
import { seedData } from "./seed.js";
import { getDirectConnections, getLinkedInDegrees } from "./linkdinBFS.js";

await initDB();
await seedData();

const result = await getLinkedInDegrees("person:harry");

const getConnections = await getDirectConnections("person:sara");
console.log("\nConnections:", getConnections);

console.log("\n1st-degree:", result.first);
console.log("2nd-degree:", result.second);
console.log("3rd-degree:", result.third);
console.log("4th-degree:", result.fourth);
console.log("5th-degree:", result.fifth);
console.log("6th-degree:", result.sixth);
