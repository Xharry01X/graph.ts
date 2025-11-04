import { db } from "./surrealdb.js";

export async function createNode() {
    const person = await db.create("person", { id: "harry", name: "Harry" })
    const product = await db.create("product", { id: "phone", name: "iPhone", price: 100 })
    console.log(person)
    console.log(product)
}

export async function createRelationship() {
    const relateQueries =`
    RELATE person:Harry -> wishlist:ulid() -> product:iPhone
    SET created_at = time::now(), note = "I want this phone"
    `
    const result = await db.query(relateQueries)
    console.log("Relationship created:",result)
}

export async function queryGraph() {
    const query = `
    SELECT ->wishlist->product AS wishlistItems FROM person:Harry
    `
    const result = await db.query(query)
    console.log("Graph query result:",result)
}