import { drawCampusGraph } from "./map.js";
import {
  optimizeRepairs,
  getRepairCost,
  getAffordableRepairSets
} from "./optimizer.js";

import { buildGraph } from "./graph.js";
import { scoreGraph } from "./scoring.js";
import {
  LOCATIONS,
  REPAIR_COSTS,
  PATHS
} from "./data.js";

/* ========================================
   BARRIERSHIFT - DASHBOARD CONTROLLER
======================================== */

// 1. Get HTML elements

const budgetRange = document.getElementById("budgetRange");
const budgetNumber = document.getElementById("budgetNumber");
const budgetOutput = document.getElementById("budgetOutput");
const optimizationForm = document.getElementById("optimizationForm");

const baselineScore = document.getElementById("baselineScore");
const optimizedScore = document.getElementById("optimizedScore");
const scoreGain = document.getElementById("scoreGain");
const repairCost = document.getElementById("repairCost");

const selectedRepairs = document.getElementById("selectedRepairs");
const feasibleCount = document.getElementById("feasibleCount");
const journeyResults = document.getElementById("journeyResults");
const whyThisWins = document.getElementById("whyThisWins");
const appStatus = document.getElementById("appStatus");

const simulationMode =
  document.getElementById("simulationMode");

const manualRepairControls =
  document.getElementById("manualRepairControls");

const repairSectionTitle =
  document.getElementById("repairSectionTitle");

const explanationTitle =
  document.getElementById("explanationTitle");

const repairCheckboxes =
  document.querySelectorAll('input[name="manualRepair"]');
const comparisonRows =
  document.getElementById("comparisonRows");

const comparisonSummary =
  document.getElementById("comparisonSummary");


// 2. Create HTML elements safely

function createElement(tag, text, className = "") {
  const element = document.createElement(tag);
  element.textContent = text;

  if (className) {
    element.className = className;
  }

  return element;
}


// 3. Display recommended repairs

function renderRepairs(repairs) {
  selectedRepairs.replaceChildren();

  if (repairs.length === 0) {
    selectedRepairs.append(
      createElement("p", "No repairs required for this budget.")
    );
    return;
  }

  for (const repairId of repairs) {
    const path = PATHS.find(p => p.repairId === repairId);

    const card = createElement("div", "", "repair-card");

    const label = createElement(
      "strong",
      `${repairId}: ${path.from} – ${path.to}`
    );

    const cost = createElement(
      "span",
      `${REPAIR_COSTS[repairId]} units`
    );

    card.append(label, cost);
    selectedRepairs.append(card);
  }
}


// 4. Display priority journey results

function renderJourneys(journeys) {
  journeyResults.replaceChildren();

  for (const journey of journeys) {
    const row = document.createElement("tr");

    const route = createElement(
      "td",
      `${LOCATIONS[journey.from]} → ${LOCATIONS[journey.to]}`
    );

    const weight = createElement("td", journey.weight);

    const statusCell = document.createElement("td");

    const status = createElement(
      "span",
      journey.reachable ? "Reachable" : "Blocked",
      journey.reachable
        ? "status-reachable"
        : "status-blocked"
    );

    statusCell.append(status);
    row.append(route, weight, statusCell);
    journeyResults.append(row);
  }
}


// 5. Explain the optimization result

function renderExplanation(result) {
  whyThisWins.replaceChildren();

  const repairNames = result.repairs.length
    ? result.repairs.join(" + ")
    : "No repairs";

  const summary = createElement(
    "p",
    `${repairNames} was selected after evaluating ${result.feasibleCount} affordable combinations.`
  );

  const improvement = createElement(
    "p",
    `The weighted accessibility score increased from ${result.baselineScore} to ${result.score}, a gain of ${result.gain} points.`
  );

  const cost = createElement(
    "p",
    `Total repair cost: ${result.cost} out of ${result.budget} available units.`
  );

  const details = createElement(
    "p",
    "The optimizer maximizes weighted journey reachability, then prefers lower-cost solutions. Path distances are not included in the current score."
  );

  whyThisWins.append(
    summary,
    improvement,
    cost,
    details
  );
}


/* ========================================
   MANUAL REPAIR SIMULATION ENGINE
======================================== */

function getManualResult(budget) {

  // Read checked repairs
  const repairs = [...repairCheckboxes]
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  // Build graph using manually selected repairs
  const graph = buildGraph(repairs);

  // Calculate accessibility score
  const result = scoreGraph(graph);

  // Calculate original campus score
  const baseline = scoreGraph(buildGraph([])).score;

  // Calculate selected repair cost
  const cost = getRepairCost(repairs);

  return {
    budget,
    repairs,
    cost,
    baselineScore: baseline,
    score: result.score,
    gain: result.score - baseline,
    journeyResults: result.journeyResults,
    feasibleCount: getAffordableRepairSets(budget).length
  };
}


/* ========================================
   EXPLAIN MANUAL SCENARIO
======================================== */

function renderManualExplanation(result) {

  whyThisWins.replaceChildren();

  const repairNames = result.repairs.length
    ? result.repairs.join(" + ")
    : "None";

  const summary = createElement(
    "p",
    `Manually selected repairs: ${repairNames}.`
  );

  const impact = createElement(
    "p",
    `Accessibility score: ${result.baselineScore} → ${result.score}. Gain: +${result.gain}.`
  );

  const cost = createElement(
    "p",
    `Repair cost: ${result.cost} / ${result.budget} units.`
  );

  const explanation = createElement(
    "p",
    "Manual simulation evaluates the selected repairs without running automatic optimization."
  );

  whyThisWins.append(
    summary,
    impact,
    cost,
    explanation
  );
}


/* ========================================
   BEFORE / AFTER JOURNEY COMPARISON
======================================== */

function renderJourneyComparison(result) {

  // Original campus journey results
  const baselineJourneys = scoreGraph(
    buildGraph([])
  ).journeyResults;

  comparisonRows.replaceChildren();

  let beforeCount = 0;
  let afterCount = 0;

  const newlyReachable = [];

  for (const journey of result.journeyResults) {

    // Find matching baseline journey
    const original = baselineJourneys.find(
      item =>
        item.from === journey.from &&
        item.to === journey.to
    );

    const before = original.reachable;
    const after = journey.reachable;

    if (before) beforeCount++;
    if (after) afterCount++;

    const journeyName =
      `${LOCATIONS[journey.from]} → ${LOCATIONS[journey.to]}`;

    // Track newly restored journeys
    if (!before && after) {
      newlyReachable.push(journeyName);
    }

    // Create table row
    const row = document.createElement("tr");

    const routeCell = createElement(
      "td",
      journeyName
    );

    const weightCell = createElement(
      "td",
      journey.weight
    );

    const beforeCell = createElement(
      "td",
      before ? "Reachable" : "Blocked",
      before ? "status-reachable" : "status-blocked"
    );

    const afterCell = createElement(
      "td",
      after
        ? (before ? "Reachable" : "Newly Reachable")
        : "Blocked",
      after
        ? (before ? "status-reachable" : "status-new")
        : "status-blocked"
    );

    row.append(
      routeCell,
      weightCell,
      beforeCell,
      afterCell
    );

    comparisonRows.append(row);
  }

  // Update summary
  comparisonSummary.textContent =
    `${beforeCount}/${result.journeyResults.length} → ` +
    `${afterCount}/${result.journeyResults.length} reachable journeys | ` +
    `${newlyReachable.length} newly reachable | ` +
    `+${result.gain} weighted points`;

  return newlyReachable;
}


/* ========================================
   ADD DETAILED REPAIR EXPLANATION
======================================== */

function renderDetailedExplanation(
  result,
  isManual,
  newlyReachable
) {

  // Explain newly accessible journeys
  const journeyText = newlyReachable.length
    ? newlyReachable.join(", ")
    : "No additional priority journeys";

  whyThisWins.append(
    createElement(
      "p",
      `Newly reachable journeys: ${journeyText}.`
    )
  );

  // Explain automatic optimization
  if (!isManual) {

    whyThisWins.append(
      createElement(
        "p",
        "Selection rules: highest weighted score, " +
        "then lowest repair cost, then repair ID order."
      )
    );

    // Demonstrate cost-based tie-breaking
    if (
      result.budget >= 7 &&
      result.score === 22 &&
      result.repairs.join(",") === "R1,R2"
    ) {

      whyThisWins.append(
        createElement(
          "p",
          "Why not R4? R4 alone scores 22 at cost 7. " +
          "R1 + R2 also scores 22 but costs only 6."
        )
      );
    }
  }
}


/* ========================================
   UPDATE DASHBOARD
======================================== */

function updateDashboard(budget) {
  try {

    // Determine active simulation mode
    const isManual = simulationMode.value === "manual";

    // Run selected simulation
    const result = isManual
      ? getManualResult(budget)
      : optimizeRepairs(budget);

    // Update scorecards
    baselineScore.textContent = result.baselineScore;
    optimizedScore.textContent = result.score;
    scoreGain.textContent = `+${result.gain}`;
    repairCost.textContent = result.cost;
    feasibleCount.textContent = result.feasibleCount;

    // Update headings
    repairSectionTitle.textContent = isManual
      ? "Selected Repairs"
      : "Recommended Repairs";

    explanationTitle.textContent = isManual
      ? "Manual Scenario Analysis"
      : "Why This Solution?";

    // Render result sections
    renderRepairs(result.repairs);
    renderJourneys(result.journeyResults);

    if (isManual) {
      renderManualExplanation(result);
    } else {
      renderExplanation(result);
    }
    // Update before/after comparison
    const newlyReachable =
      renderJourneyComparison(result);

    // Add detailed explanation
    renderDetailedExplanation(
      result,
      isManual,
      newlyReachable
    );

    // Update SVG campus graph
    drawCampusGraph(result.repairs);

    // Check budget feasibility
    const overBudget =
      isManual && result.cost > budget;

    if (overBudget) {
      appStatus.textContent =
        `Over budget by ${result.cost - budget} units.`;
    } else {
      appStatus.textContent = isManual
        ? "Manual simulation updated successfully."
        : "Optimization completed successfully.";
    }

    appStatus.classList.toggle(
      "status-warning",
      overBudget
    );

  } catch (error) {
    appStatus.textContent = `Error: ${error.message}`;
    console.error(error);
  }
}


// 7. Validate budget

function applyBudget(value) {
  if (value === "") {
    appStatus.textContent = "Please enter a budget.";
    return;
  }

  const budget = Number(value);

  if (!Number.isInteger(budget) || budget < 0) {
    appStatus.textContent =
      "Budget must be a non-negative whole number.";
    return;
  }

  budgetOutput.textContent = `${budget} units`;

  // Slider displays values up to its maximum.
  budgetRange.value = Math.min(
    budget,
    Number(budgetRange.max)
  );

  updateDashboard(budget);
}


// 8. Handle slider changes

budgetRange.addEventListener("input", () => {
  budgetNumber.value = budgetRange.value;
  applyBudget(budgetRange.value);
});


// 9. Handle numeric budget changes

budgetNumber.addEventListener("input", () => {
  applyBudget(budgetNumber.value);
});


// 10. Handle Optimize button

optimizationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applyBudget(budgetNumber.value);
});


/* ========================================
   SIMULATION MODE EVENTS
======================================== */

// Switch between Auto and Manual mode
simulationMode.addEventListener("change", () => {

  const isManual = simulationMode.value === "manual";

  manualRepairControls.hidden = !isManual;

  applyBudget(budgetNumber.value);
});


// Recalculate whenever repair checkbox changes
for (const checkbox of repairCheckboxes) {

  checkbox.addEventListener("change", () => {
    applyBudget(budgetNumber.value);
  });
}



// 11. Initialize dashboard

applyBudget(budgetNumber.value);

console.log("BarrierShift dashboard connected!");
