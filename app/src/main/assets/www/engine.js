/**
 * Afterface face engine — landmarks, geometry, paint.
 * Loaded before app.js
 */

const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377,
  152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
];
const INTERIOR = [1, 4, 5, 6, 13, 14, 61, 91, 168, 195, 197, 291, 321, 405];
const MAX_SECONDS = 8;
const MAX_EDGE = 480;

const $ = (id) => document.getElementById(id);

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
  ]);
  const superTri = circumcircle(ext, n, n + 1, n + 2);
  if (!superTri) return new Uint16Array();
  let tris = [superTri];
  for (let p = 0; p < n; p++) {
    const px = ext[p].x, py = ext[p].y;
    const bad = [];
    for (const t of tris) {
      const ddx = px - t.cx, ddy = py - t.cy;
      if (ddx * ddx + ddy * ddy <= t.r2 * 1.0000001 + 1e-7) bad.push(t);
    }
    const edge = new Map();
    const add = (a, b) => {
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      const e = edge.get(key);
      if (e) e.n += 1;
      else edge.set(key, { a, b, n: 1 });
    };
    const badSet = new Set(bad);
    for (const t of bad) {
      add(t.a, t.b); add(t.b, t.c); add(t.c, t.a);
    }
    const next = [];
    for (const t of tris) if (!badSet.has(t)) next.push(t);
    for (const e of edge.values()) {
      if (e.n !== 1) continue;
      const tri = circumcircle(ext, e.a, e.b, p);
      if (tri) next.push(tri);
    }
    tris = next;
  }
  const out = [];
  for (const t of tris) {
    if (t.a < n && t.b < n && t.c < n) out.push(t.a, t.b, t.c);
  }
  return Uint16Array.from(out);
}

function solveAffine(x0, y0, x1, y1, x2, y2, u0, u1, u2) {
  const det = x0 * (y1 - y2) - x1 * (y0 - y2) + x2 * (y0 - y1);
  if (Math.abs(det) < 1e-4) return null;
  return [
    (u0 * (y1 - y2) - u1 * (y0 - y2) + u2 * (y0 - y1)) / det,
    (x0 * (u1 - u2) - x1 * (u0 - u2) + x2 * (u0 - u1)) / det,
    (x0 * (y1 * u2 - y2 * u1) - x1 * (y0 * u2 - y2 * u0) + x2 * (y0 * u1 - y1 * u0)) / det,
  ];
}

function buildMesh(landmarks, pixels, w, h) {
  const indexes = meshIndices();
  const kept = [];
  const pts = [];
  for (const idx of indexes) {
    const lm = landmarks[idx];
    if (!lm) continue;
    const x = lm.x * w, y = lm.y * h;
    if (pts.some((p) => (p.x - x) ** 2 + (p.y - y) ** 2 < 0.36)) continue;
    pts.push({ x, y });
    kept.push(idx);
  }
  if (kept.length < 12) return null;
  const triangles = delaunay(pts);
  if (triangles.length < 12) return null;
  const src = new Float32Array(kept.length * 2);
  for (let i = 0; i < pts.length; i++) {
    src[i * 2] = pts[i].x;
    src[i * 2 + 1] = pts[i].y;
  }
  return {
    indices: Uint16Array.from(kept),
    triangles,
    src,
    srcW: w,
    srcH: h,
    srcPixels: new Uint8ClampedArray(pixels),
  };
}

console.log('[afterface] engine loaded');
