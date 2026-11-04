
import { LOCATIONS, PATHS } from "./data.js";

/* ========================================
   BARRIERSHIFT - SVG CAMPUS MAP
======================================== */

const SVG_NS = "http://www.w3.org/2000/svg";

// Fixed node positions on the SVG canvas
const POSITIONS = {
  H: { x: 100, y: 110, labelY: 155 },
  J: { x: 300, y: 110, labelY: 72 },
  K: { x: 490, y: 110, labelY: 155 },
  A: { x: 690, y: 110, labelY: 72 },
  C: { x: 300, y: 320, labelY: 368 },
  L: { x: 690, y: 320, labelY: 368 },
  M: { x: 475, y: 230, labelY: 278 }
};

// Positions for repair labels
const LABEL_POSITIONS = {
  R1: { x: 395, y: 92 },
  R2: { x: 590, y: 92 },
  R3: { x: 395, y: 165 },
  R4: { x: 500, y: 302 },
  R5: { x: 185, y: 229 }
};

// SVG element helper
function svgElement(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tag);

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  return element;
}

/* ========================================
   DRAW COMPLETE CAMPUS GRAPH
======================================== */

export function drawCampusGraph(selectedRepairs = []) {

  const pathLayer = document.getElementById("pathLayer");
  const nodeLayer = document.getElementById("nodeLayer");

  // Clear previous graph
  pathLayer.replaceChildren();
  nodeLayer.replaceChildren();

  const selected = new Set(selectedRepairs);

  // STEP 1: Draw all 8 pathways
  for (const path of PATHS) {

    const from = POSITIONS[path.from];
    const to = POSITIONS[path.to];

    const isRepaired =
      path.repairId !== null &&
      selected.has(path.repairId);

    const isUsable = path.repairId === null;

    const color = isRepaired
      ? "#42dfb5"
      : isUsable
        ? "#60a5fa"
        : "#fb7185";

    const line = svgElement("line", {
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
      stroke: color,
      "stroke-width": 4,
      "stroke-linecap": "round",
      "stroke-dasharray": (!isUsable && !isRepaired)
        ? "8 7"
        : "none"
    });

    // Browser tooltip
    const tooltip = svgElement("title");
    tooltip.textContent =
      `${path.id}: ${path.from}–${path.to}, ` +
      `${path.distance}m, ` +
      (isRepaired ? "Repaired" :
        isUsable ? "Usable" : "Blocked");

    line.append(tooltip);
    pathLayer.append(line);

    // Show repair labels R1-R5
    if (path.repairId) {
      const pos = LABEL_POSITIONS[path.repairId];

      const background = svgElement("rect", {
        x: pos.x - 20,
        y: pos.y - 17,
        width: 40,
        height: 23,
        rx: 6,
        fill: "#091827",
        stroke: color
      });

      const label = svgElement("text", {
        x: pos.x,
        y: pos.y,
        "text-anchor": "middle",
        fill: color,
        "font-size": 13,
        "font-weight": "bold"
      });

      label.textContent = path.repairId;

      pathLayer.append(background, label);
    }
  }

  // STEP 2: Draw all 7 campus nodes
  for (const [id, name] of Object.entries(LOCATIONS)) {

    const pos = POSITIONS[id];

    const circle = svgElement("circle", {
      cx: pos.x,
      cy: pos.y,
      r: 23,
      fill: "#143e46",
      stroke: "#42dfb5",
      "stroke-width": 2.5
    });

    const idLabel = svgElement("text", {
      x: pos.x,
      y: pos.y + 5,
      "text-anchor": "middle",
      fill: "#ffffff",
      "font-size": 16,
      "font-weight": "bold"
    });

    idLabel.textContent = id;

    const nameLabel = svgElement("text", {
      x: pos.x,
      y: pos.labelY,
      "text-anchor": "middle",
      fill: "#d5e5f0",
      "font-size": 12
    });

    nameLabel.textContent = name;

    const nodeGroup = svgElement("g");

    const title = svgElement("title");
    title.textContent = name;

    nodeGroup.append(title, circle, idLabel, nameLabel);
    nodeLayer.append(nodeGroup);
  }
}
