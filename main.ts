import { initDB } from "./surrealdb.js";
import { createNode, createRelationship, queryGraph } from "./graphNode.js";


async function main() {
    try {
        await initDB();
        console.log("✅ Connected to SurrealDB Cloud");
        await createNode();
        await createRelationship();
        await queryGraph();
    } catch (error) {
        console.error(error);
    }
}


main().catch(console.error);