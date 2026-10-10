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
