const graph: Record<string, string[]> = {
  A: ["B", "D"],
  B: ["A", "C"],
  C: ["B", "E"],
  D: ["A"],
  E: ["C"],
};

function bfs(graph: Record<string, string[]>, start: string) {
  const visited = new Set<string>();
  const queue: string[] = [start];

  visited.add(start);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue; // This handles the 'undefined' case safely

    console.log(current);

    const neighbors = graph[current];
    if (!neighbors) continue;

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}

bfs(graph, "A");
