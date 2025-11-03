import { db } from "./surrealdb.js";

export async function createTodo(title: string, description: string) {
    return db.create("todo", {
        title,
        description,
    })
}

export async function getTodos(limit: number = 10) {
    const [result] = await db.query(`
        SELECT *, id
        FROM todo
        ORDER BY created_at DESC
        LIMIT $limit
        `,
        { limit }
    );

    return result;

}

export async function getTodoById(id: string) {
    const [result] = await db.query(`
        SELECT *, id
        FROM todo
        WHERE $id
        `,
        { id }
    );

    return result;
}

export async function updateTodo(id: string, data: Partial< { title: string; description: string; completed: boolean; }>) {
    return db.merge(`todo:${id}`, {...data, updated_at: new Date().toISOString() })
}

export async function deleteTodo(id: string) {
    return db.delete(`todo:${id}`)
}