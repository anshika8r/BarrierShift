
import {
  LOCATIONS,
  PATHS,
  REPAIR_COSTS,
  JOURNEYS
} from "./data.js";

console.log("BarrierShift initialized successfully!");

console.log("Locations:", Object.keys(LOCATIONS).length);
console.log("Pathways:", PATHS.length);
console.log("Repairs:", Object.keys(REPAIR_COSTS).length);
console.log("Priority Journeys:", JOURNEYS.length);

console.log("Campus dataset loaded:", {
  LOCATIONS,
  PATHS,
  REPAIR_COSTS,
  JOURNEYS
});
