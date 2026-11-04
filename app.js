
import { optimizeRepairs } from "./optimizer.js";

console.log("=== BARRIERSHIFT OPTIMIZATION ===");

// Verified reference scenarios
const tests = [
  { budget: 0, repairs: [], score: 2 },
  { budget: 4, repairs: ["R3"], score: 7 },
  { budget: 5, repairs: ["R3"], score: 7 },
  { budget: 6, repairs: ["R1", "R2"], score: 22 },
  { budget: 7, repairs: ["R1", "R2"], score: 22 },
  { budget: 10, repairs: ["R1", "R2", "R3"], score: 27 }
];

for (const test of tests) {

  const result = optimizeRepairs(test.budget);

  console.log(`Budget ${test.budget}:`, result);

  // Verify optimal score
  if (result.score !== test.score) {
    throw new Error(
      `Score mismatch at budget ${test.budget}`
    );
  }

  // Verify selected repairs
  if (
    result.repairs.join(",") !==
    test.repairs.join(",")
  ) {
    throw new Error(
      `Repair mismatch at budget ${test.budget}`
    );
  }
}

// Verify number of affordable combinations
if (optimizeRepairs(6).feasibleCount !== 9) {
  throw new Error("Feasible combination count incorrect");
}

console.log("All optimization tests passed!");

// Display final demonstration result
const finalResult = optimizeRepairs(6);

console.log("=== FINAL RESULT ===");
console.log("Selected Repairs:", finalResult.repairs);
console.log("Total Cost:", finalResult.cost);
console.log("Accessibility Score:", finalResult.score);
console.log("Score Gain:", finalResult.gain);
console.log("Feasible Sets:", finalResult.feasibleCount);

console.table(finalResult.journeyResults);
