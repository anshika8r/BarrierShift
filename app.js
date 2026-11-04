
import { buildGraph } from "./graph.js";
import { scoreGraph } from "./scoring.js";

// Define test scenarios
const tests = [
  { repairs: [], expected: 2 },
  { repairs: ["R3"], expected: 7 },
  { repairs: ["R1", "R2"], expected: 22 },
  { repairs: ["R4"], expected: 22 },
  { repairs: ["R5"], expected: 2 },
  { repairs: ["R1", "R2", "R3"], expected: 27 }
];

// Test weighted accessibility scores
for (const test of tests) {

  const graph = buildGraph(test.repairs);
  const result = scoreGraph(graph);

  console.log(
    `Repairs: ${test.repairs.join(", ") || "None"}`,
    `Score: ${result.score}/27`
  );

  if (result.score !== test.expected) {
    throw new Error(
      `Score mismatch for ${test.repairs.join(", ") || "None"}`
    );
  }
}

console.log("All 6 scoring tests passed!");

// Inspect detailed journey results
const graph = buildGraph(["R1", "R2"]);

console.table(scoreGraph(graph).journeyResults);
