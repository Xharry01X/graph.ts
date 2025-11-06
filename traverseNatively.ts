import { db } from "./surrealdb.js";

interface ConnectionNode {
  id: string;
  depth: number;
}

interface PersonWithPhone {
  id: string;
  name?: string;
  phone?: string | null;
}

interface SocialConnections {
  [key: string]: PersonWithPhone[];
}

/** Safely unwrap SurrealDB query results */
function extractRows<T = any>(data: any): T[] {
  if (!Array.isArray(data) || !data.length) return [];
  const first = data[0];
  if (Array.isArray(first?.result)) return first.result as T[];
  if (Array.isArray(first)) return first as T[];
  return [];
}

/** Convert RecordId to string */
function recordIdToString(recordId: any): string {
  if (typeof recordId === 'string') return recordId;
  if (recordId?.tb && recordId?.id) return `${recordId.tb}:${recordId.id}`;
  return String(recordId);
}

/** Get all bidirectional friends of a given person */
export async function getKnownPeople(personId: string): Promise<string[]> {
  const query = `
    SELECT ->knows->person.id AS friends 
    FROM ${personId}
  `;

  try {
    const res = await db.query(query);
    const rows = extractRows<{ friends: any[] }>(res);
    const friends = rows[0]?.friends || [];
    
    return friends
      .map(recordIdToString)
      .filter(friendId => friendId !== personId) // Remove self
      .filter(Boolean);
  } catch (error) {
    console.error("Error in getKnownPeople:", error);
    return [];
  }
}

export async function getPersonPhone(personId: string): Promise<string | null> {
  const query = `
    SELECT ->owns->phone.model[0] AS phone 
    FROM ${personId}
  `;

  try {
    const res = await db.query(query);
    const rows = extractRows<{ phone: any[] }>(res);
    const phone = rows[0]?.phone || [];
    
    return phone[0] ?? null;
  } catch (error) {
    console.error("Error in getPersonPhone:", error);
    return null;
  }
}

/** Get person info + their iPhone model - FIXED */
export async function getPeopleWithPhones(ids: string[]): Promise<PersonWithPhone[]> {
  if (!ids.length) return [];

  const query = `
    SELECT 
      id,
      name,
      ->owns->phone.model[0] AS phone
    FROM ${ids.join(', ')};
  `;
  
  try {
    const res = await db.query(query);
    const rows = extractRows(res);

    return rows.map((r: any) => ({
      id: recordIdToString(r.id),
      name: r.name ?? undefined,
      phone: Array.isArray(r.phone) ? r.phone[0] : r.phone ?? null, // Extract string from array
    }));
  } catch (error) {
    console.error("Error in getPeopleWithPhones:", error);
    return [];
  }
}


export async function traverseIPhoneNetworkBFS(
  startId: string,
  maxDepth = 7
): Promise<SocialConnections> {
  if (!startId.startsWith("person:")) {
    throw new Error("startId must be a valid record id like 'person:ishan'");
  }

  const visited = new Set<string>([startId]); 
  const queue: ConnectionNode[] = [{ id: startId, depth: 0 }];
  const layers: Record<number, Set<string>> = {};

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;

    if (depth >= maxDepth) continue;

    const neighbors = await getKnownPeople(id);
    
    for (const neighborId of neighbors) {
      // Only process if not already visited to avoid duplicates
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        
        const nextDepth = depth + 1;
        if (!layers[nextDepth]) layers[nextDepth] = new Set();
        layers[nextDepth].add(neighborId);
        queue.push({ id: neighborId, depth: nextDepth });
      }
    }
  }

  const result: SocialConnections = {};
  const sortedDepths = Object.keys(layers)
    .map(Number)
    .sort((a, b) => a - b);

  for (const depth of sortedDepths) {
    const ids = Array.from(layers[depth]);
    const people = await getPeopleWithPhones(ids);
    result[`depth_${depth}`] = people;
  }

  return result;
}