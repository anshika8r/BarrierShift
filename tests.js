
import { LOCATIONS, PATHS, REPAIR_COSTS, JOURNEYS }
  from "./data.js";

import { buildGraph, isReachable }
  from "./graph.js";

import { scoreGraph }
  from "./scoring.js";

import {
  generateRepairSets,
  getRepairCost,
  getAffordableRepairSets,
  optimizeRepairs
} from "./optimizer.js";

// TEST RUNNER

const results = [];
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function test(name, callback) {
  try {
    callback();
    passed++;
    results.push(`PASS: ${name}`);
  } catch (error) {
    failed++;
    results.push(`FAIL: ${name} - ${error.message}`);
  }
}

// DATA VALIDATION

test("7 campus locations", () => {
  assert(Object.keys(LOCATIONS).length === 7, "Invalid nodes");
});

test("8 campus pathways", () => {
  assert(PATHS.length === 8, "Invalid edges");
});

test("5 repair options", () => {
  assert(Object.keys(REPAIR_COSTS).length === 5, "Invalid repairs");
});

test("5 priority journeys", () => {
  assert(JOURNEYS.length === 5, "Invalid journeys");
});

test("Correct R3 and R5 mapping", () => {
  assert(
    PATHS.some(p =>
      p.from === "J" && p.to === "M" && p.repairId === "R3"
    ),
    "R3 mapping incorrect"
  );

  assert(
    PATHS.some(p =>
      p.from === "H" && p.to === "C" && p.repairId === "R5"
    ),
    "R5 mapping incorrect"
  );
});

// GRAPH & BFS TESTS

test("Baseline score equals 2", () => {
  assert(scoreGraph(buildGraph([])).score === 2, "Wrong baseline");
});

test("Hostel to Cafeteria reachable", () => {
  assert(isReachable(buildGraph([]), "H", "C"), "Expected true");
});

test("Hostel to Medical blocked initially", () => {
  assert(!isReachable(buildGraph([]), "H", "M"), "Expected false");
});

test("R3 activates Medical access", () => {
  assert(isReachable(buildGraph(["R3"]), "H", "M"), "Expected true");
});

test("R1 + R2 unlock Classroom", () => {
  assert(
    isReachable(buildGraph(["R1", "R2"]), "H", "A"),
    "Expected true"
  );
});

// COMBINATION & COST TESTS

test("32 repair combinations", () => {
  assert(generateRepairSets().length === 32, "Wrong count");
});

test("Budget 6 has 9 affordable subsets", () => {
  assert(getAffordableRepairSets(6).length === 9, "Wrong count");
});

test("Repair R4 costs 7", () => {
  assert(getRepairCost(["R4"]) === 7, "Wrong cost");
});

// INDIVIDUAL REPAIR TESTS

test("R4 alone scores 22", () => {
  assert(scoreGraph(buildGraph(["R4"])).score === 22, "Wrong score");
});

test("R5 alone scores 2", () => {
  assert(scoreGraph(buildGraph(["R5"])).score === 2, "Wrong score");
});

test("R4 + R5 scores 22", () => {
  assert(
    scoreGraph(buildGraph(["R4", "R5"])).score === 22,
    "Wrong score"
  );
});

// OPTIMIZATION REFERENCE TESTS

const scenarios = [
  [0, [], 2],
  [4, ["R3"], 7],
  [5, ["R3"], 7],
  [6, ["R1", "R2"], 22],
  [7, ["R1", "R2"], 22],
  [10, ["R1", "R2", "R3"], 27]
];

for (const [budget, repairs, score] of scenarios) {
  test(`Optimal result at budget ${budget}`, () => {
    const result = optimizeRepairs(budget);

    assert(result.score === score, "Wrong score");
    assert(
      result.repairs.join(",") === repairs.join(","),
      "Wrong repair selection"
    );
  });
}

// ERROR HANDLING

test("Negative budget rejected", () => {
  let rejected = false;

  try {
    optimizeRepairs(-1);
  } catch {
    rejected = true;
  }

  assert(rejected, "Negative budget accepted");
});

test("Invalid graph node rejected", () => {
  let rejected = false;

  try {
    isReachable(buildGraph([]), "H", "INVALID");
  } catch {
    rejected = true;
  }

  assert(rejected, "Unknown node accepted");
});

// DISPLAY TEST RESULTS

const output = document.getElementById("results");

output.replaceChildren();

for (const result of results) {
  const line = document.createElement("div");
  line.textContent = result;
  line.className = result.startsWith("PASS") ? "passed" : "failed";
  output.append(line);
}

const summary = document.createElement("h2");
summary.textContent = `${passed} Passed | ${failed} Failed`;
summary.className = failed === 0 ? "passed" : "failed";

output.prepend(summary);

console.log(summary.textContent);
console.table(results);

if (failed > 0) {
  console.error("BarrierShift tests failed.");
}
