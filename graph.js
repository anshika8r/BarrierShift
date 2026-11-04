
import { LOCATIONS, PATHS } from "./data.js";

// Build an adjacency list using selected repairs
export function buildGraph(selectedRepairs = []) {

  const graph = {};
  const selected = new Set(selectedRepairs);

  // Step 1: Initialize all campus nodes
  for (const node of Object.keys(LOCATIONS)) {
    graph[node] = [];
  }

  // Step 2: Check every pathway
  for (const path of PATHS) {

    // Skip blocked pathways unless repaired
    const isUsable =
      path.repairId === null ||
      selected.has(path.repairId);

    if (!isUsable) {
      continue;
    }

    // Step 3: Add connections in both directions
    graph[path.from].push(path.to);
    graph[path.to].push(path.from);
  }

  return graph;
}


/* ========================================
   BFS REACHABILITY ENGINE
======================================== */

export function isReachable(graph, start, destination) {

  // Validate locations
  if (
    !Object.hasOwn(graph, start) ||
    !Object.hasOwn(graph, destination)
  ) {
    throw new Error("Invalid campus location");
  }

  // Initialize BFS queue
  const queue = [start];

  // Track discovered locations
  const visited = new Set([start]);

  // Continue until queue becomes empty
  while (queue.length > 0) {

    // Remove first location from queue
    const current = queue.shift();

    // Destination found
    if (current === destination) {
      return true;
    }

    // Explore directly connected locations
    for (const neighbor of graph[current]) {

      // Skip previously discovered locations
      if (visited.has(neighbor)) {
        continue;
      }

      // Mark location as discovered
      visited.add(neighbor);

      // Add location to exploration queue
      queue.push(neighbor);
    }
  }

  // No usable path exists
  return false;
}
