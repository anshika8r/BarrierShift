
# BarrierShift

### From Barriers to Better Access

BarrierShift is a graph-based decision-support prototype that
recommends campus accessibility pathway repairs under a
limited infrastructure budget.

## Problem

Campus pathways may contain accessibility barriers.
Repairing individual barriers does not always restore a
complete journey between essential campus facilities.

BarrierShift identifies repair combinations that maximize
weighted connectivity for predefined priority journeys.

## Core Features

- Campus graph modeling
- BFS-based connectivity analysis
- Weighted accessibility scoring
- Budget-constrained exhaustive optimization
- Interactive SVG campus visualization
- Automatic repair recommendations
- Manual R1–R5 repair simulation
- Before/after journey comparison
- Explainable optimization results

## Technology Stack

- HTML5
- CSS3
- JavaScript ES Modules
- SVG
- BFS graph traversal
- Exhaustive subset enumeration

## Dataset

- 7 campus locations
- 8 bidirectional pathways
- 5 candidate repairs
- 5 priority journeys
- 32 possible repair combinations

The dataset is fictional and uses simulated repair costs.

## Optimization Objective

Maximize the sum of weights of reachable priority journeys,
subject to total selected repair cost being within budget.

Tie-breaking:

1. Highest weighted score
2. Lowest repair cost
3. Deterministic repair-ID ordering

## Reference Results

| Budget | Repairs | Score |
|---|---|---|
| 0 | None | 2 |
| 4 | R3 | 7 |
| 6 | R1 + R2 | 22 |
| 10 | R1 + R2 + R3 | 27 |

Maximum possible score: 27.

## How to Run

1. Open the project folder in VS Code.
2. Start Live Server.
3. Open `index.html`.
4. Change the budget or select Manual Simulation.
5. Observe recommended repairs, scores and campus connectivity.

## Testing

Open `tests.html` with Live Server.

The test suite checks dataset integrity, BFS reachability,
scoring, budget constraints, repair combinations,
optimal solutions and selected error conditions.

## Limitations

- Fictional campus dataset
- Simulated repair costs
- Binary pathway accessibility
- Fixed priority-journey weights
- Distances excluded from the optimization objective
- Exhaustive search may not scale to large repair sets

Real deployment would require site surveys, accessibility
assessments, verified costs, safety reviews and stakeholder
participation.

## Team

Team KOYA  
SRM Institute of Science and Technology

## Event

Beyond Hack 2.0  
Campus Innovation & Student Life

---

## Live Demo

[Launch BarrierShift](https://step-7exx.vercel.app)

## GitHub Repository

https://github.com/anshika8r/STEP

## Deployment

- Platform: Vercel
- Frontend: HTML5, CSS3, JavaScript
- Visualization: SVG
- Backend: Not required

## Project Status

Working educational prototype with automated
algorithm tests and manual repair simulation.

The dataset and repair costs are simulated.
