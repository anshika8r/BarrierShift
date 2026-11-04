import { buildGraph } from "./graph.js";
import { scoreGraph } from "./scoring.js";
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

/* ========================================
   COMPARE OPTIMIZATION RESULTS
======================================== */

function isBetter(candidate, best) {

  // First valid candidate wins
  if (best === null) {
    return true;
  }

  // Rule 1: Higher accessibility score wins
  if (candidate.score !== best.score) {
    return candidate.score > best.score;
  }

  // Rule 2: If scores tie, lower cost wins
  if (candidate.cost !== best.cost) {
    return candidate.cost < best.cost;
  }

  // Rule 3: Deterministic repair ID ordering
  return (
    candidate.repairs.join(",") <
    best.repairs.join(",")
  );
}


/* ========================================
   COMPLETE OPTIMIZATION ENGINE
======================================== */

export function optimizeRepairs(budget) {

  // Calculate original campus score
  const baselineScore = scoreGraph(
    buildGraph([])
  ).score;

  // Generate all affordable combinations
  const affordableSets = getAffordableRepairSets(budget);

  let best = null;

  // Evaluate every affordable combination
  for (const item of affordableSets) {

    // Build graph with selected repairs
    const graph = buildGraph(item.repairs);

    // Calculate weighted accessibility score
    const result = scoreGraph(graph);

    // Store candidate result
    const candidate = {
      repairs: item.repairs,
      cost: item.cost,
      score: result.score,
      gain: result.score - baselineScore,
      journeyResults: result.journeyResults
    };

    // Select better combination
    if (isBetter(candidate, best)) {
      best = candidate;
    }
  }

  // Return optimal solution
  return {
    budget,
    baselineScore,
    feasibleCount: affordableSets.length,
    ...best
  };
}
