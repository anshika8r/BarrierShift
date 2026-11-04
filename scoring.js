
import { JOURNEYS } from "./data.js";
import { isReachable } from "./graph.js";

/* ========================================
   WEIGHTED ACCESSIBILITY SCORING
======================================== */

export function scoreGraph(graph) {

  let score = 0;
  const journeyResults = [];

  // Check every predefined priority journey
  for (const journey of JOURNEYS) {

    // Check connectivity using BFS
    const reachable = isReachable(
      graph,
      journey.from,
      journey.to
    );

    // Add weight only if reachable
    if (reachable) {
      score += journey.weight;
    }

    // Save results for the dashboard
    journeyResults.push({
      from: journey.from,
      to: journey.to,
      weight: journey.weight,
      reachable
    });
  }

  return {
    score,
    journeyResults
  };
}
