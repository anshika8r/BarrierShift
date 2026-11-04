
import { buildGraph } from "./graph.js";

// Test 1: Original campus graph
const baselineGraph = buildGraph([]);

console.log("=== BASELINE GRAPH ===");
console.log(baselineGraph);

// Test 2: Activate R1 and R3
const repairedGraph = buildGraph(["R1", "R3"]);

console.log("=== REPAIRED GRAPH ===");
console.log(repairedGraph);

// Check specific connections
console.log("Baseline J:", baselineGraph.J);
console.log("Repaired J:", repairedGraph.J);

// Automatic verification
if (
  baselineGraph.J.join(",") !== "H,C" ||
  repairedGraph.J.join(",") !== "H,C,K,M"
) {
  throw new Error("Graph builder test failed");
}

console.log("Graph builder tests passed!");
