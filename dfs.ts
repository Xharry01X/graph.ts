/*
    A
   / \
  B   D
   \
    C
     \
      E
*/
// when it reaches to E, backtrack to A, and then next next neighbour is D

const graphs: Record<string, string[]> = {
  A: ["B", "D"],
  B: ["A", "C"],
  C: ["B", "E"],
  D: ["A"],
  E: ["C"],
};

function dfs(
  graph: Record<string, string[]>,
  start: string,
  visited: Set<string> = new Set()
): void {
  visited.add(start);
  console.log(start);

  const neighbors = graph[start];
  if (!neighbors) return; 

  for (const neighbor of neighbors) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}

dfs(graphs, "A");



