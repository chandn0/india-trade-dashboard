// Computes tooltip horizontal position and flip direction for SVG hover charts.
// Returns tipLeft (0–100 % from left) and flip (true when tooltip should open leftward).
// Used by every chart that renders a floating tooltip alongside a hover crosshair.
export function tipPosition(p, geo) {
  if (!p) return { tipLeft: 0, flip: false };
  const tipLeft = (p.x / geo.width) * 100;
  return { tipLeft, flip: tipLeft > 60 };
}
