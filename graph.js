
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
