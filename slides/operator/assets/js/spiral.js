// biome-ignore-all lint/correctness/noUnusedVariables: scripts

const SPIRAL_W = 1280;
const SPIRAL_H = 780;
const SPIRAL_END = 0.75;
const TAIL_LENGTH = 24;
const TAIL_WIDTH = 32;
const TAIL_OVERLAP = 8;

let spiralInitialized = false;

/**
 * Calculates the point on the spiral for a given fraction.
 * @param {number} f - The fraction of the spiral.
 * @returns {Object} The point on the spiral.
 */
function spiralPoint(f) {
  const cx = 640;
  const cy = 398;
  const theta0 = 3.9;
  const theta1 = Math.PI * 4;
  const r0 = 290;
  const r1 = 78;

  const theta = theta0 + (theta1 - theta0) * f;
  const r = r0 + (r1 - r0) * f;

  return {
    x: cx + 1.05 * r * Math.cos(theta),
    y: cy + 0.72 * r * Math.sin(theta),
  };
}

/**
 * Builds the points for the spiral.
 * @param {number} count - The number of points to build.
 * @returns {Array} The points for the spiral.
 */
function buildSpiralPoints(count = 96) {
  return Array.from({ length: count }, (_, i) => spiralPoint((i / (count - 1)) * SPIRAL_END));
}

/**
 * Builds the smooth SVG path for the spiral.
 * @param {Array} points - The points for the spiral.
 * @returns {string} The SVG path data.
 */
function buildSmoothPathD(points) {
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const c1 = {
      x: p1.x + (p2.x - p0.x) / 6,
      y: p1.y + (p2.y - p0.y) / 6,
    };

    const c2 = {
      x: p2.x - (p3.x - p1.x) / 6,
      y: p2.y - (p3.y - p1.y) / 6,
    };

    d += ` C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
  }

  return d;
}

/**
 * Builds the SVG path for the spiral arrow.
 * @param {Array} points - The points for the spiral.
 * @returns {string} The SVG path data.
 */
function buildArrowPathD(points) {
  const end = points[points.length - 1];
  const prev = points[points.length - 5];
  const angle = Math.atan2(end.y - prev.y, end.x - prev.x);
  const len = 34;
  const spread = Math.PI / 7;

  const a = {
    x: end.x - len * Math.cos(angle - spread),
    y: end.y - len * Math.sin(angle - spread),
  };

  const b = {
    x: end.x - len * Math.cos(angle + spread),
    y: end.y - len * Math.sin(angle + spread),
  };

  return `M ${a.x} ${a.y} L ${end.x} ${end.y} L ${b.x} ${b.y}`;
}

const SPIRAL_POINTS = buildSpiralPoints();
const SPIRAL_TRACK_D = buildSmoothPathD(SPIRAL_POINTS);
const SPIRAL_ARROW_D = buildArrowPathD(SPIRAL_POINTS);

/**
 * Maps card layout size to spiral SVG coordinates.
 * @param {Element} card - The card element.
 * @param {Element} root - The spiral container.
 * @returns {Object} Card width and height in SVG units.
 */
function cardSizeInSvg(card, root) {
  const rootW = root.offsetWidth;
  const rootH = root.offsetHeight;

  return {
    w: (card.offsetWidth / rootW) * SPIRAL_W,
    h: (card.offsetHeight / rootH) * SPIRAL_H,
  };
}

/**
 * Finds where a ray from the card center toward the node exits the card box.
 * @param {number} cx - Card center X in SVG units.
 * @param {number} cy - Card center Y in SVG units.
 * @param {number} hw - Card half-width in SVG units.
 * @param {number} hh - Card half-height in SVG units.
 * @param {number} dirX - Direction X toward the node.
 * @param {number} dirY - Direction Y toward the node.
 * @returns {Object|null} Edge point and unit direction.
 */
function edgeTowardNode(cx, cy, hw, hh, dirX, dirY) {
  const len = Math.hypot(dirX, dirY);
  if (len === 0) return null;

  const nx = dirX / len;
  const ny = dirY / len;
  const scaleX = nx !== 0 ? hw / Math.abs(nx) : Number.POSITIVE_INFINITY;
  const scaleY = ny !== 0 ? hh / Math.abs(ny) : Number.POSITIVE_INFINITY;
  const dist = Math.min(scaleX, scaleY);

  return {
    x: cx + nx * dist,
    y: cy + ny * dist,
    nx,
    ny,
  };
}

/**
 * Builds triangle points for a card bubble tail in SVG coordinates.
 * @param {Object} p - Spiral anchor point.
 * @param {number} dx - Horizontal card offset (% of container width).
 * @param {number} dy - Vertical card offset (% of container height).
 * @param {number} cardW - Card width in SVG units.
 * @param {number} cardH - Card height in SVG units.
 * @returns {string|null} SVG polygon points attribute.
 */
function buildCardTailPoints(p, dx, dy, cardW, cardH) {
  const centerX = p.x + (dx / 100) * SPIRAL_W;
  const centerY = p.y + (dy / 100) * SPIRAL_H;
  const edge = edgeTowardNode(centerX, centerY, cardW / 2, cardH / 2, p.x - centerX, p.y - centerY);
  if (!edge) return null;

  const baseX = edge.x - edge.nx * TAIL_OVERLAP;
  const baseY = edge.y - edge.ny * TAIL_OVERLAP;
  const tipX = edge.x + edge.nx * TAIL_LENGTH;
  const tipY = edge.y + edge.ny * TAIL_LENGTH;
  const perpX = -edge.ny;
  const perpY = edge.nx;

  return [
    `${tipX},${tipY}`,
    `${baseX + (perpX * TAIL_WIDTH) / 2},${baseY + (perpY * TAIL_WIDTH) / 2}`,
    `${baseX - (perpX * TAIL_WIDTH) / 2},${baseY - (perpY * TAIL_WIDTH) / 2}`,
  ].join(' ');
}

/**
 * Ensures the spiral SVG paths are populated.
 * @param {Element} root - The root element.
 */
function ensureSpiralSvg(root) {
  const svg = root.querySelector('.spiral__svg');
  const track = root.querySelector('.spiral__track');
  const arrow = root.querySelector('.spiral__arrow');
  if (!svg || !track || !arrow) return;

  svg.setAttribute('preserveAspectRatio', 'none');

  if (!track.getAttribute('d')) track.setAttribute('d', SPIRAL_TRACK_D);
  if (!arrow.getAttribute('d')) arrow.setAttribute('d', SPIRAL_ARROW_D);

  if (!svg.querySelector('.spiral__tails')) {
    const tails = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tails.setAttribute('class', 'spiral__tails');
    svg.appendChild(tails);
  }
}

/**
 * Positions the spiral items.
 * @param {Element} root - The root element.
 */
function positionSpiralItems(root) {
  root.querySelectorAll('.spiral__node[data-f]').forEach((el) => {
    const p = spiralPoint(Number.parseFloat(el.dataset.f, 10));
    el.style.left = `${(p.x / SPIRAL_W) * 100}%`;
    el.style.top = `${(p.y / SPIRAL_H) * 100}%`;
  });

  root.querySelectorAll('.spiral__card[data-f]').forEach((el) => {
    const p = spiralPoint(Number.parseFloat(el.dataset.f, 10));
    const dx = Number.parseFloat(el.dataset.dx ?? 0);
    const dy = Number.parseFloat(el.dataset.dy ?? 0);
    el.style.left = `${(p.x / SPIRAL_W) * 100 + dx}%`;
    el.style.top = `${(p.y / SPIRAL_H) * 100 + dy}%`;
  });
}

/**
 * Draws card bubble tails in the shared spiral SVG coordinate space.
 * @param {Element} root - The root element.
 */
function updateCardTails(root) {
  const tailsGroup = root.querySelector('.spiral__tails');
  if (!tailsGroup || root.offsetWidth === 0 || root.offsetHeight === 0) return;

  tailsGroup.replaceChildren();

  root.querySelectorAll('.spiral__card[data-f]').forEach((card) => {
    const p = spiralPoint(Number.parseFloat(card.dataset.f, 10));
    const dx = Number.parseFloat(card.dataset.dx ?? 0);
    const dy = Number.parseFloat(card.dataset.dy ?? 0);
    const { w, h } = cardSizeInSvg(card, root);
    const points = buildCardTailPoints(p, dx, dy, w, h);
    if (!points) return;

    const tail = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    tail.setAttribute('class', 'spiral__tail');
    tail.setAttribute('points', points);
    tailsGroup.appendChild(tail);
  });
}

/**
 * Renders the spiral.
 * @param {Element} root - The root element.
 */
function renderSpiral(root) {
  if (root.offsetWidth === 0 || root.offsetHeight === 0) return;

  ensureSpiralSvg(root);
  positionSpiralItems(root);

  requestAnimationFrame(() => {
    updateCardTails(root);
  });
}

/**
 * Renders all the spirals.
 */
function renderAllSpirals() {
  document.querySelectorAll('.spiral').forEach(renderSpiral);
}

/**
 * Initializes the spiral slides.
 */
function initSpiralSlides() {
  renderAllSpirals();

  if (spiralInitialized) return;
  spiralInitialized = true;

  if (typeof Reveal === 'undefined') {
    window.addEventListener('resize', renderAllSpirals);
    return;
  }

  Reveal.on('slidechanged', renderAllSpirals);
  Reveal.on('resize', renderAllSpirals);
  Reveal.on('overviewshown', renderAllSpirals);
  Reveal.on('overviewhidden', renderAllSpirals);
}

if (typeof Reveal !== 'undefined' && Reveal.isReady && Reveal.isReady()) {
  initSpiralSlides();
} else if (typeof Reveal !== 'undefined') {
  Reveal.on('ready', initSpiralSlides);
} else {
  window.addEventListener('DOMContentLoaded', initSpiralSlides);
}
