function setStatus(msg, isError = false) {
  statusEl.textContent = msg || "";
  statusEl.classList.toggle("error", Boolean(isError));
}

function meshIndices() {
  const set = new Set();
  for (let i = 0; i < 468; i += 2) set.add(i);
  for (const i of FACE_OVAL) set.add(i);
  for (const i of INTERIOR) set.add(i);
  return [...set].sort((a, b) => a - b);
}

function circumcircle(points, a, b, c) {
  const A = points[a];
  const B = points[b];
  const C = points[c];
  const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
  if (Math.abs(d) < 1e-8) return null;
  const a2 = A.x * A.x + A.y * A.y;
  const b2 = B.x * B.x + B.y * B.y;
  const c2 = C.x * C.x + C.y * C.y;
  const ux = (a2 * (B.y - C.y) + b2 * (C.y - A.y) + c2 * (A.y - B.y)) / d;
  const uy = (a2 * (C.x - B.x) + b2 * (A.x - C.x) + c2 * (B.x - A.x)) / d;
  const dx = ux - A.x;
  const dy = uy - A.y;
  return { a, b, c, cx: ux, cy: uy, r2: dx * dx + dy * dy };
}

function delaunay(points) {
  const n = points.length;
  if (n < 3) return new Uint16Array();
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  const span = Math.max(maxX - minX, maxY - minY, 1) * 10;
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const ext = points.concat([
    { x: midX - 2 * span, y: midY - span },
    { x: midX + 2 * span, y: midY - span },
    { x: midX, y: midY + 2 * span },
