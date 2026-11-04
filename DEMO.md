
# BarrierShift — Hackathon Demo Guide

## Project

BarrierShift — From Barriers to Better Access

Team KOYA | Beyond Hack 2.0

## Problem

Repairing isolated accessibility barriers does
not always restore complete campus journeys.

Administrators need to prioritize repairs
under limited infrastructure budgets.

## Our Solution

BarrierShift uses graph algorithms to identify
the repair combination that maximizes weighted
journey reachability under a given budget.

## Technology

- HTML, CSS and JavaScript
- SVG network visualization
- Adjacency List
- Breadth First Search (BFS)
- Weighted journey scoring
- Exhaustive subset optimization

## Demonstration Scenarios

### 1. Original Campus

Budget: 0
Repairs: None
Score: 2/27

### 2. Optimal Repairs

Budget: 6
Repairs: R1 + R2
Cost: 6
Score: 22/27
Improvement: +20

### 3. Cost Comparison

Budget: 7

R4:
Cost = 7, Score = 22

R1 + R2:
Cost = 6, Score = 22

The optimizer chooses R1 + R2
because it achieves the same score
at a lower cost.

### 4. Manual Simulation

Select R5.

Cost: 1
Score: 2

R5 creates a direct Hostel-Cafeteria
connection, but that journey is already
reachable via the Central Junction.

### 5. Maximum Reachability

Budget: 10
Repairs: R1 + R2 + R3
Score: 27/27

All five priority journeys are reachable.

## Key Engineering Decisions

### Why BFS?

The current objective requires reachability,
not shortest-path distances.

### Why Exhaustive Search?

Five repairs give only 32 combinations.
Evaluating every subset guarantees an
optimal solution under our defined model.

### Why not AI/ML?

The objective and constraints are explicit.
A deterministic algorithm is sufficient.

## Testing

Open tests.html to verify algorithm results.

## Limitations

- Fictional campus network
- Simulated costs and distances
- Binary accessibility status
- Fixed priority weights
- Limited scalability of exhaustive search

## Future Improvements

- Real campus accessibility surveys
- Mobility-specific accessibility constraints
- Verified repair costs
- Scalable optimization algorithms
