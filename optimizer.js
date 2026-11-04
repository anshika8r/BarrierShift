
import { REPAIR_COSTS } from "./data.js";

/* ========================================
   REPAIR COMBINATION GENERATOR
======================================== */

export function generateRepairSets() {

  // Get all repair IDs
  const repairIds = Object.keys(REPAIR_COSTS);

  // Start with the empty repair combination
  const combinations = [[]];

  // Process each repair
  for (const repairId of repairIds) {

    const currentCount = combinations.length;

    // Create new combinations containing this repair
    for (let i = 0; i < currentCount; i++) {

      const newCombination = [
        ...combinations[i],
        repairId
      ];

      combinations.push(newCombination);
    }
  }

  return combinations;
}


/* ========================================
   REPAIR COST CALCULATOR
======================================== */

export function getRepairCost(selectedRepairs) {
  let totalCost = 0;

  for (const repairId of selectedRepairs) {
    if (!Object.hasOwn(REPAIR_COSTS, repairId)) {
      throw new Error(`Unknown repair: ${repairId}`);
    }

    totalCost += REPAIR_COSTS[repairId];
  }

  return totalCost;
}


/* ========================================
   BUDGET CONSTRAINT FILTER
======================================== */

export function getAffordableRepairSets(budget) {

  // Validate budget
  if (!Number.isFinite(budget) || budget < 0) {
    throw new Error("Invalid budget");
  }

  const combinations = generateRepairSets();
  const affordableSets = [];

  for (const repairs of combinations) {

    const cost = getRepairCost(repairs);

    // Reject combinations exceeding budget
    if (cost > budget) {
      continue;
    }

    affordableSets.push({
      repairs,
      cost
    });
  }

  return affordableSets;
}
