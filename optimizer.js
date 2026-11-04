
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
