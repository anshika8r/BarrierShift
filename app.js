
import { buildGraph, isReachable } from "./graph.js";

// Original campus network
const baselineGraph = buildGraph([]);

// Simulate R1 + R2 repairs
const repairedGraph = buildGraph(["R1", "R2"]);

// Baseline tests
console.log("=== BASELINE TESTS ===");

console.log("H → C:", isReachable(baselineGraph, "H", "C"));
console.log("H → A:", isReachable(baselineGraph, "H", "A"));
console.log("H → M:", isReachable(baselineGraph, "H", "M"));

// Repaired graph tests
console.log("=== AFTER R1 + R2 ===");

console.log("H → A:", isReachable(repairedGraph, "H", "A"));
console.log("H → L:", isReachable(repairedGraph, "H", "L"));
console.log("H → M:", isReachable(repairedGraph, "H", "M"));

// Automated checks
const tests = [
  [baselineGraph, "H", "C", true],
  [baselineGraph, "H", "A", false],
  [baselineGraph, "H", "M", false],
  [repairedGraph, "H", "A", true],
  [repairedGraph, "H", "L", true],
  [repairedGraph, "H", "M", false]
];

for (const [graph, start, end, expected] of tests) {
  const actual = isReachable(graph, start, end);

  if (actual !== expected) {
    throw new Error(`BFS test failed: ${start} → ${end}`);
  }
}

console.log("All 6 BFS tests passed!");
