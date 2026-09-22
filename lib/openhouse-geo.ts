/**
 * Real geography for the Open House experience. The river course is the Chao
 * Phraya's centreline between Phra Pinklao Bridge and Memorial Bridge, traced
 * from OpenStreetMap's rendered water at zoom 15 (widest water run per pixel
 * row, sampled every ~0.0015° of latitude; the Bangkok Noi canal mouth, which
 * the trace briefly jumps into, is dropped). It is drawn as an ornament, but it
 * is the river's real shape and position, so the campus dot sits where
 * Thammasat actually is relative to it.
 */
export type LatLng = { lat: number; lng: number };
export type XY = { x: number; y: number };

export const CAMPUS: LatLng = { lat: 13.757, lng: 100.4906 };

export const CAMPUS_COORDS = "13.757° N · 100.491° E";

export const RIVER: LatLng[] = [
  { lat: 13.77557, lng: 100.5002 },
  { lat: 13.77407, lng: 100.49948 },
  { lat: 13.77257, lng: 100.49907 },
  { lat: 13.77107, lng: 100.49825 },
  { lat: 13.76873, lng: 100.4963 },
  { lat: 13.76723, lng: 100.49593 },
  { lat: 13.76573, lng: 100.49443 },
  { lat: 13.76423, lng: 100.49342 },
  { lat: 13.76273, lng: 100.49194 },
  { lat: 13.75973, lng: 100.48894 },
  { lat: 13.75823, lng: 100.48834 },
  { lat: 13.75673, lng: 100.48787 },
  { lat: 13.75498, lng: 100.48752 },
  { lat: 13.75347, lng: 100.48746 },
  { lat: 13.75181, lng: 100.48754 },
  { lat: 13.75022, lng: 100.48782 },
  { lat: 13.74872, lng: 100.48804 },
  { lat: 13.74714, lng: 100.48855 },
  { lat: 13.74522, lng: 100.48971 },
  { lat: 13.74372, lng: 100.49089 },
  { lat: 13.74222, lng: 100.49224 },
  { lat: 13.74072, lng: 100.49394 },
  { lat: 13.73922, lng: 100.50057 },
  { lat: 13.73772, lng: 100.50338 },
];

/**
 * Fit `points` into `box` (equirectangular, longitude scaled by cos(latitude),
 * which is exact enough over a few kilometres) preserving aspect ratio and
 * centring the result. Returns a projector for any coordinate in that frame.
 */
export function projector(
  points: LatLng[],
  box: { x: number; y: number; w: number; h: number }
): (p: LatLng) => XY {
  const lat0 = points.reduce((s, p) => s + p.lat, 0) / points.length;
  const k = Math.cos((lat0 * Math.PI) / 180);
  const xs = points.map((p) => p.lng * k);
  const ys = points.map((p) => -p.lat);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scale = Math.min(box.w / (maxX - minX), box.h / (maxY - minY));
  const offX = box.x + (box.w - (maxX - minX) * scale) / 2;
  const offY = box.y + (box.h - (maxY - minY) * scale) / 2;
  return (p) => ({ x: offX + (p.lng * k - minX) * scale, y: offY + (-p.lat - minY) * scale });
}

/** Smooth a polyline with Catmull-Rom segments expressed as cubic Béziers. */
export function smoothPath(pts: XY[]): string {
  if (pts.length === 0) return "";
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(pts[0]!.x)} ${f(pts[0]!.y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(p2.x)} ${f(p2.y)}`;
  }
  return d;
}
