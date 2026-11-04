
/* BARRIERSHIFT - CAMPUS DATA */

// 1. Campus locations
export const LOCATIONS = {
  H: "Hostel",
  J: "Central Junction",
  K: "Academic Junction",
  A: "Academic Classroom Entrance",
  L: "Library Entrance",
  C: "Cafeteria Entrance",
  M: "Medical Centre Entrance"
};

// 2. Campus pathways
// repairId: null means already usable

export const PATHS = [
  { id: "E1", from: "H", to: "J", distance: 100, repairId: null },
  { id: "E2", from: "J", to: "C", distance: 80, repairId: null },
  { id: "E3", from: "A", to: "L", distance: 60, repairId: null },
  { id: "E4", from: "J", to: "K", distance: 50, repairId: "R1" },
  { id: "E5", from: "K", to: "A", distance: 70, repairId: "R2" },
  { id: "E6", from: "J", to: "M", distance: 120, repairId: "R3" },
  { id: "E7", from: "C", to: "L", distance: 150, repairId: "R4" },
  { id: "E8", from: "H", to: "C", distance: 140, repairId: "R5" }
];

// 3. Repair costs (simulated units)
export const REPAIR_COSTS = {
  R1: 3,
  R2: 3,
  R3: 4,
  R4: 7,
  R5: 1
};

// 4. Priority journeys
export const JOURNEYS = [
  { from: "H", to: "A", weight: 10 },
  { from: "H", to: "L", weight: 6 },
  { from: "H", to: "M", weight: 5 },
  { from: "H", to: "C", weight: 2 },
  { from: "C", to: "A", weight: 4 }
];
