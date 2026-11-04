
import { optimizeRepairs } from "./optimizer.js";
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


// 6. Update dashboard

function updateDashboard(budget) {
  try {
    const result = optimizeRepairs(budget);

    baselineScore.textContent = result.baselineScore;
    optimizedScore.textContent = result.score;
    scoreGain.textContent = `+${result.gain}`;
    repairCost.textContent = result.cost;
    feasibleCount.textContent = result.feasibleCount;

    renderRepairs(result.repairs);
    renderJourneys(result.journeyResults);
    renderExplanation(result);

    appStatus.textContent =
      `Optimization successful for budget ${budget}.`;

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


// 11. Initialize dashboard

applyBudget(budgetNumber.value);

console.log("BarrierShift dashboard connected!");
