
import { generateRepairSets } from "./optimizer.js";

// Generate all repair combinations
const combinations = generateRepairSets();

console.log("=== REPAIR COMBINATIONS ===");

console.log("Total combinations:", combinations.length);

console.table(
  combinations.map((repairs, index) => ({
    number: index + 1,
    repairs: repairs.join(" + ") || "None"
  }))
);

// Automated tests
if (combinations.length !== 32) {
  throw new Error("Expected exactly 32 combinations");
}

const uniqueCombinations = new Set(
  combinations.map(repairs => [...repairs].sort().join(","))
);

if (uniqueCombinations.size !== 32) {
  throw new Error("Duplicate repair combinations detected");
}

if (
  !combinations.some(repairs => repairs.length === 0) ||
  !combinations.some(repairs => repairs.length === 5)
) {
  throw new Error("Missing empty or complete repair set");
}

console.log("All combination generator tests passed!");
