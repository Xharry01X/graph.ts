import { db } from "./surrealdb.js";

export async function createNode() {
    const person = await db.create("person", { id: "harshit", name: "Harshit" });
    const product = await db.create("product", { id: "iphone", name: "iPhone", price: 100 });
    console.log("Person:", person);
    console.log("Product:", product);
}


export async function createRelationship() {    
    const relateQueries = `
    RELATE person:harshit -> wishlist:ulid() -> product:iphone
    SET created_at = time::now(), note = "I want this phone"
    `
    const result = await db.query(relateQueries)
    console.log("Relationship created:", result)
}

export async function queryGraph() {
    const query = `
    SELECT ->wishlist->product AS wishlistItems FROM person:harshit
    `
    const result = await db.query(query)
    console.log("Graph query result:", JSON.stringify(result, null, 2))
}

export async function updateRelationship() {
    const updateQuery = `
    UPDATE wishlist 
    SET note = "Still want this phone", updated_at = time::now()
    WHERE in = person:harshit AND out = product:iphone
    `
    const result = await db.query(updateQuery)
    console.log("Relationship updated:", result)
}

export async function updateNodeProperty() {
    const updateQuery = `
    UPDATE person:harshit 
    SET name = "Harshit", last_updated = time::now()
    `
    const result = await db.query(updateQuery)
    console.log("Person updated:", result)
}

export async function deleteRelationship() {
    const deleteQuery = `
    DELETE wishlist 
    WHERE in = person:harshit AND out = product:iphone
    `
    const result = await db.query(deleteQuery)
    console.log("Relationship deleted:", result)
}

export async function deleteAllRelationships() {
    const deleteQuery = `
    DELETE wishlist 
    WHERE in = person:harshit
    `
    const result = await db.query(deleteQuery)
    console.log("All wishlist relationships deleted:", result)
}

export async function deleteNode() {
    const deleteQuery = `
    DELETE person:harshit
    `
    const result = await db.query(deleteQuery)
    console.log("Person node deleted:", result)
}

export async function deleteNodeAndRelationships() {
    const deleteQuery = `
    DELETE wishlist WHERE in = person:harshit OR out = person:harshit;
    DELETE person:harshit
    `
    const result = await db.query(deleteQuery)
    console.log("Person and all relationships deleted:", result)
}