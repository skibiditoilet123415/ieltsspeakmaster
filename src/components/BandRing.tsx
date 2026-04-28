interface Props {
  band: number;
  size?: number;
  label?: string;
}
export function BandRing({ band, size = 96, label }: Props) {
  const pct = Math.max(0, Math.min(1, band / 9));
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--color-muted)" strokeWidth="6" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#bandGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
        <defs>
          <linearGradient id="bandGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-primary-glow)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center rotate-0">
        <div className="text-center">
          <div className="text-2xl font-bold">{band.toFixed(1)}</div>
          {label && <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>}
        </div>
      </div>
    </div>
  );
}
