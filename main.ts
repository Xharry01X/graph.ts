import { initDB } from "./surrealdb.js";


async function main() {
    try {
        await initDB();
        console.log("✅ Connected to SurrealDB Cloud");
    } catch (error) {
        console.error(error);
    }
}


main().catch(console.error);