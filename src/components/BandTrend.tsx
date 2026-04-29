interface Point { date: string; band: number }
interface Props { points: Point[]; target?: number; height?: number }

export function BandTrend({ points, target = 7, height = 120 }: Props) {
  if (!points.length) return null;
  const w = 320;
  const h = height;
  const pad = 24;
  const xs = points.map((_, i) => pad + (i * (w - pad * 2)) / Math.max(points.length - 1, 1));
  const yFor = (b: number) => {
    const min = 4, max = 9;
    const t = (Math.max(min, Math.min(max, b)) - min) / (max - min);
    return h - pad - t * (h - pad * 2);
  };
  const ys = points.map((p) => yFor(p.band));
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const area = `${path} L${xs[xs.length - 1].toFixed(1)},${(h - pad).toFixed(1)} L${xs[0].toFixed(1)},${(h - pad).toFixed(1)} Z`;
  const targetY = yFor(target);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
      <defs>
        <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* target line */}
      <line x1={pad} x2={w - pad} y1={targetY} y2={targetY}
        stroke="var(--color-muted-foreground)" strokeDasharray="3 3" strokeOpacity="0.5" />
      <text x={w - pad} y={targetY - 4} textAnchor="end" fontSize="10" fill="var(--color-muted-foreground)">
        Target {target.toFixed(1)}
      </text>
      <path d={area} fill="url(#trendArea)" />
      <path d={path} fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="var(--color-primary)" />
      ))}
    </svg>
  );
}
