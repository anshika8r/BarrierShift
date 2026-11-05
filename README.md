# BarrierShift

### From Barriers to Better Access

**A graph-based campus accessibility decision-support prototype that identifies which pathway barriers to repair first when infrastructure budgets are limited.**

**Project:** Beyond Hack 2.0 — Campus Innovation & Student Life  
**Team:** Team KOYA  
**Institution:** SRM Institute of Science and Technology  
**Repository:** https://github.com/anshika8r/BarrierShift  
**Live Demo:** https://barriershift.vercel.app 
**Status:** Functional, browser-based proof of concept with an illustrative dataset

> **Important scope note:** BarrierShift models *potential connectivity improvements* in a fictional campus network. It is not an audited accessibility map, a route-navigation service, or a substitute for on-site accessibility and safety assessments.

## 1. The Problem

Campus accessibility cannot always be improved by repairing the largest number of broken pathways. A single repaired segment may connect two places locally but still leave a complete journey—such as hostel to classroom—unusable. Conversely, a carefully selected pair of repairs can restore access to several essential destinations.

When budgets are limited, campus planners must decide **which combination of repairs restores the greatest practical access**, not simply which individual repairs are cheapest.

## 2. The Solution

BarrierShift represents campus locations as graph **vertices** and pathways as **undirected edges**. Some edges are already usable; others become usable only when an associated repair is selected. Each priority origin–destination journey has an importance weight.

Given a repair budget, the application:

1. Builds the currently usable campus graph.
2. Checks priority-journey reachability with breadth-first search (BFS).
3. Enumerates candidate repair combinations and filters out those above budget.
4. Scores each affordable repair combination by the total weight of reachable journeys.
5. Recommends the highest-scoring solution, using lower cost and deterministic repair-ID order as tie-breakers.
6. Visualizes the selected repairs, campus connectivity, journey outcomes, and before/after improvements.

Users can also manually select repairs to explore alternative scenarios without running the optimizer.

## 3. Implemented Features

- **Automatic repair optimization:** budget-constrained evaluation of affordable repair subsets.
- **Manual simulation:** select any of R1–R5 to evaluate its impact and cost.
- **BFS reachability:** identifies whether each priority origin–destination pair is connected by usable pathways.
- **Weighted accessibility scoring:** gives more importance to predefined high-priority journeys.
- **Interactive SVG campus network:** illustrates usable, blocked, and repaired edges.
- **Budget controls:** synchronized budget slider and numeric field.
- **Impact dashboard:** baseline score, scenario score, improvement, and repair cost.
- **Journey analysis:** reachable/blocked statuses and before/after comparison.
- **Explanations:** reports selected repairs, restored journeys, evaluated affordable combinations, and selection criteria.
- **Browser test runner:** verifies model integrity, graph behavior, scoring, optimization, and selected invalid inputs.

## 4. Technology Stack

| Layer | Technology / approach |
|---|---|
| Interface | HTML5, CSS3 |
| Application controller | Vanilla JavaScript (ES modules), DOM APIs |
| Network visualization | SVG |
| Graph representation | Adjacency lists |
| Connectivity | Breadth-first search (BFS) |
| Scoring | Weighted sum of reachable priority journeys |
| Optimization | Exhaustive repair-subset enumeration |
| Validation | JavaScript test suite displayed in `tests.html` |

**Architecture:** Client-side only. The current prototype has **no backend API, database, login, live campus-data feed, or AI model**. All data and calculations are contained in the shipped JavaScript modules.

## 5. System Architecture

```text
                    index.html + styles.css
                             |
                    app.js (UI controller)
                    /       |         \
                   /        |          \
             optimizer.js  map.js     DOM updates
                |             |
        graph.js + scoring.js  SVG network
                \      /
                 data.js

               tests.html + tests.js
            (independent browser test page)
```

### Module responsibilities

| File | Responsibility |
|---|---|
| `index.html` | Dashboard structure, inputs, scorecards, tables, and SVG container |
| `styles.css` | Dashboard styling and layout |
| `data.js` | Campus nodes, pathways, repair costs, and weighted journeys |
| `graph.js` | Build adjacency lists and check journey reachability using BFS |
| `scoring.js` | Calculate weighted journey score and per-journey status |
| `optimizer.js` | Generate repair subsets, enforce budget, and find the best solution |
| `map.js` | Render the graph visually in SVG |
| `app.js` | Connect user input, algorithm results, map, explanations, and tables |
| `tests.html` | Test-runner page |
| `tests.js` | Automated checks of dataset, algorithms, and selected edge cases |
| `README.md` | Project explanation and setup |
| `DEMO.md` | Reproducible demonstration and presentation guide |

### Execution flow

```text
Set budget and mode
       |
       +-- Auto Optimize --> generate subsets --> filter by cost
       |                       --> build graph --> BFS --> score
       |                       --> select best feasible result
       |
       +-- Manual Simulation --> read selected repair checkboxes
                                --> build graph --> BFS --> score
       |
       v
Render scorecards, network, repairs, journey tables and explanations
```

## 6. Illustrative Dataset

The model uses **7 campus locations, 8 bidirectional pathways, 5 candidate repairs, and 5 weighted priority journeys**. The locations, distances, repair costs, and weights are illustrative rather than measurements from SRM IST.

### Locations

| Code | Location |
|---|---|
| H | Hostel |
| J | Central Junction |
| K | Academic Junction |
| A | Academic Classroom Entrance |
| L | Library Entrance |
| C | Cafeteria Entrance |
| M | Medical Centre Entrance |

### Pathways and required repairs

| Edge | From → To | Distance (illustrative) | Required repair | Cost (simulated units) |
|---|---|---:|---|---:|
| E1 | H ↔ J | 100 | None; already usable | — |
| E2 | J ↔ C | 80 | None; already usable | — |
| E3 | A ↔ L | 60 | None; already usable | — |
| E4 | J ↔ K | 50 | R1 | 3 |
| E5 | K ↔ A | 70 | R2 | 3 |
| E6 | J ↔ M | 120 | R3 | 4 |
| E7 | C ↔ L | 150 | R4 | 7 |
| E8 | H ↔ C | 140 | R5 | 1 |

Distances are stored for illustrative context but are **not used by the current optimization objective**. Costs are dimensionless simulation units, not currency amounts or engineering estimates.

### Priority journeys

| Journey | Priority weight |
|---|---:|
| Hostel → Classroom | 10 |
| Hostel → Library | 6 |
| Hostel → Medical Centre | 5 |
| Hostel → Cafeteria | 2 |
| Cafeteria → Classroom | 4 |
| **Total possible** | **27** |

Initially only Hostel → Cafeteria is reachable among these priority journeys, so **baseline score = 2**.

## 7. Mathematical Model

Let `R` be the five candidate repairs, `c(r)` the cost of repair `r`, `B` the available budget, and `J` the predefined priority journeys. Every journey `j` has weight `w(j)`.

For a selected repair subset `S ⊆ R`, the usable graph `G(S)` contains all originally usable edges and the blocked edges restored by repairs in `S`.

The objective is:

```text
maximize  Score(S) = Σ [w(j) × reachable(j, G(S))]
           j ∈ J

subject to Σ c(r) ≤ B
           r ∈ S

reachable(j, G(S)) = 1 if BFS finds a path, otherwise 0
```

The selection order is:

1. **Higher weighted accessibility score** wins.
2. At equal score, **lower repair cost** wins.
3. At equal score and cost, **lexicographically smaller joined repair IDs** win for deterministic output.

The optimizer evaluates the **empty repair set too**, so it can recommend no repairs when additional spending would not improve the objective.

### Why exhaustive search?

Five repairs produce `2^5 = 32` possible subsets, including the empty set, making exhaustive evaluation straightforward and easy to validate. For `r` candidate repairs, enumeration grows as `O(2^r)`; repeated graph construction and BFS also add work. This is appropriate for the small prototype but not necessarily for hundreds of real repair candidates. Larger versions could use integer programming, branch-and-bound, or heuristic approaches after validating the decision model.

## 8. Reference Results

These values are defined by the current illustrative dataset and checked in `tests.js`.

| Budget | Recommended repairs | Repair cost | Accessibility score / 27 | Gain over baseline |
|---:|---|---:|---:|---:|
| 0 | None | 0 | 2 | +0 |
| 4 | R3 | 4 | 7 | +5 |
| 5 | R3 | 4 | 7 | +5 |
| 6 | R1 + R2 | 6 | 22 | +20 |
| 7 | R1 + R2 | 6 | 22 | +20 |
| 10 | R1 + R2 + R3 | 10 | 27 | +25 |

**Why not R4 at budget 7?** R4 alone restores journeys worth 22 points and costs 7 units. R1 + R2 achieve the same 22-point score at a lower cost of 6, so the optimizer selects R1 + R2.

**Important distinction:** The score measures *weighted reachability of five chosen journeys*, not the percentage of campus infrastructure that is accessible.

## 9. Run Locally

### Prerequisites

- A modern desktop browser supporting JavaScript ES modules.
- A local HTTP server, such as the **Live Server** extension for VS Code or Python's built-in web server.

### Option A — VS Code Live Server

```bash
git clone https://github.com/anshika8r/BarrierShift.git
cd BarrierShift
```

Open the folder in VS Code, right-click `index.html`, and choose **Open with Live Server**.

### Option B — Python local server

From the project directory:

```bash
python -m http.server 8000
```

Visit `http://localhost:8000/index.html`.

> Do not rely on double-clicking `index.html` using a `file://` URL: browser security restrictions may prevent ES module imports from loading. Use HTTP localhost.

### Try the app

1. Choose **Auto Optimize**.
2. Enter budget **6** and click **Find Optimal Repairs**.
3. Inspect the recommended repairs, scorecards, network, and before/after journey table.
4. Change the budget to **4** and compare the recommended solution.
5. Switch to **Manual Simulation** to test any repair combination.

See [DEMO.md](DEMO.md) for a full walkthrough and expected outcomes.

## 10. Run Tests

Open `tests.html` using the same local server (for example, `http://localhost:8000/tests.html`). The test suite displays each result and a pass/fail summary.

Test coverage includes:

- Counts and mappings in the illustrative campus data.
- Baseline connectivity and repair-dependent BFS reachability.
- Generation of all 32 repair subsets.
- Budget filtering and repair cost calculations.
- Individual-repair outcomes and deterministic optimal recommendations.
- Negative-budget and unknown-location rejection.

The suite contains **24 defined checks** in the current repository. Confirm the displayed pass count locally; a test file existing in the repository is not itself evidence that every test passed in a particular browser run.

## 11. Design Decisions and Trade-offs

**Reachability over shortest path:** The first prototype asks whether a journey is possible, not how short or comfortable it is. An eventual deployment should consider gradients, surface quality, step-free continuity, temporary closures, trip distance, and user-specific requirements.

**Weighted journeys:** A reachability score can reflect institutional priorities, but its weights are policy choices. They should eventually be reviewed with disabled students, accessibility experts, and campus operations teams.

**Client-side execution:** Keeping all computation in the browser makes the MVP easy to inspect and demonstrate, without server infrastructure. It does not support centrally maintained maps, accounts, audit trails, or multi-user workflows.

**Fictional data:** The model demonstrates the algorithm and interaction flow without implying that actual SRM IST routes or costs have been inspected.

## 12. Limitations

- Fictional, small graph rather than surveyed campus infrastructure.
- Binary `usable/blocked` pathways; real accessibility is more nuanced.
- Illustrative repair costs and fixed, subjective journey priorities.
- No shortest-path, gradient, surface, wheelchair-turning, weather, or crowding model.
- No dependency management for repairs beyond their effect on graph connectivity.
- No backend, database, live integration, authentication, or persistent scenario storage.
- Exhaustive combinatorial optimization will require redesign at larger scale.
- Results are planning illustrations, **not safety guarantees or accessibility certifications**.

## 13. Future Development

Potential next phases, not current functionality:

1. Build a verified campus map through accessibility surveys and stakeholder validation.
2. Represent richer accessibility constraints and user-specific journey requirements.
3. Add repair metadata, real estimated costs, dependencies, and auditability.
4. Add scenario persistence and a backend only when collaboration or data governance requires it.
5. Introduce scalable optimization techniques for larger repair sets.
6. Evaluate recommendations against expert review and measurable real-world accessibility outcomes.

## 14. Team and Event

**Team KOYA**  
**SRM Institute of Science and Technology**  
**Beyond Hack 2.0 — Campus Innovation & Student Life**

BarrierShift is a **decision-support prototype**: it demonstrates how graph algorithms and explainable budget-constrained optimization can help prioritize improvements to meaningful campus journeys.

---

*From barriers to better access — one evidence-informed repair decision at a time.*
