import { db } from "./surrealdb.js";

interface ConnectionNode {
  id: string;
  depth: number;
  path: string[];
}

interface LinkedInConnections {
  first: string[];
  second: string[];
  third: string[];
  fourth: string[];
  fifth: string[];
  sixth: string[];
}

async function getMutualConnections(userId: string): Promise<string[]> {
  try {
    const query = `
      SELECT array::distinct(array::concat(
        ->connect->person.id,
        <-connect<-person.id,
        ->likes->person.id,
        <-likes<-person.id
      )) AS mutuals
      FROM ${userId};
    `;
    console.log("Executing query:", query);

    const [result] = await db.query(query);
    console.log("Query result:", JSON.stringify(result, null, 2));

    if (!Array.isArray(result) || result.length === 0 || !result[0]?.mutuals) {
      return [];
    }

    const mutuals = result[0].mutuals.map((m: any) =>
      typeof m === "object" && m.id ? `person:${m.id}` : String(m)
    );

    return Array.from(new Set(mutuals));
  } catch (error) {
    console.error("❌ Error in getMutualConnections:", error);
    return [];
  }
}

// --- BFS TRAVERSAL ---
export async function getLinkedInDegrees(startUser: string): Promise<LinkedInConnections> {
  console.log(`\n🚀 Starting BFS from user: ${startUser}`);

  const visited = new Set<string>([startUser]);
  const result: LinkedInConnections = {
    first: [],
    second: [],
    third: [],
    fourth: [],
    fifth: [],
    sixth: [],
  };

  const queue: ConnectionNode[] = [{ id: startUser, depth: 0, path: [startUser] }];

  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) break;

    const { id, depth } = node;
    console.log(`\n🔍 Processing node: ${id} at depth ${depth}`);

    if (depth >= 6) continue;

    const connections = await getMutualConnections(id);
    console.log(`Found ${connections.length} connections for ${id}`);

    for (const connId of connections) {
      if (visited.has(connId)) continue;

      visited.add(connId);
      const nextDepth = depth + 1;

      const degreeMap = ["first", "second", "third", "fourth", "fifth", "sixth"] as const;
      const key = degreeMap[nextDepth - 1] as keyof LinkedInConnections;
      result[key].push(connId);

      if (nextDepth < 6) {
        queue.push({ id: connId, depth: nextDepth, path: [...node.path, connId] });
      }

      console.log(`✅ Added ${connId} at degree ${nextDepth}`);
    }
  }

  console.log("\n🎯 BFS Completed. Result:", result);
  return result;
}
