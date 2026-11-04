
import {
  generateRepairSets,
  getRepairCost,
  getAffordableRepairSets
} from "./optimizer.js";

console.log("=== BUDGET OPTIMIZATION TESTS ===");

// Test individual costs
console.log("R1 + R2:", getRepairCost(["R1", "R2"]));
console.log("R4 + R5:", getRepairCost(["R4", "R5"]));

// Generate all combinations
console.log("Total combinations:", generateRepairSets().length);

// Filter combinations under budget 6
const affordable = getAffordableRepairSets(6);

console.log("Affordable combinations:", affordable.length);

console.table(
  affordable.map(item => ({
    repairs: item.repairs.join(" + ") || "None",
    cost: item.cost
  }))
);

// Automated tests
if (getRepairCost(["R1", "R2"]) !== 6) {
  throw new Error("R1 + R2 cost test failed");
}

if (getRepairCost(["R4", "R5"]) !== 8) {
  throw new Error("R4 + R5 cost test failed");
}

if (affordable.length !== 9) {
  throw new Error("Expected 9 affordable repair sets");
}

if (affordable.some(item => item.cost > 6)) {
  throw new Error("Over-budget combination detected");
}

if (getAffordableRepairSets(0).length !== 1) {
  throw new Error("Budget zero test failed");
}

console.log("All budget constraint tests passed!");
