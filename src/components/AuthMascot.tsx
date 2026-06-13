import { useEffect, useRef, useState } from "react";

/**
 * Cute blob mascots that match the reference video:
 * - Shapes fall in from above with a soft settle (staggered)
 * - Gentle idle bobbing once seated
 * - Eyes follow the cursor
 * - On password focus the tall purple character bends forward over the
 *   pink to "cover its eyes" (peek-a-boo); everyone else closes their eyes
 * - Yellow has a tiny outstretched arm/finger that points
 */
export function AuthMascot({ passwordFocused = false }: { passwordFocused?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.7, y: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setMouse({
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const pupil = (cx: number, cy: number, max = 1.8) => {
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    const dist = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, dist * 2.4);
    return { x: (dx / dist) * max * k, y: (dy / dist) * max * k };
  };

  const Eye = ({ ex, ey, r = 3.2, forceClosed = false }: { ex: number; ey: number; r?: number; forceClosed?: boolean }) => {
    const closed = forceClosed || passwordFocused;
    const p = pupil(ex, ey);
    return (
      <g>
        {closed ? (
          <path d={`M ${-r} 0 Q 0 ${r * 0.9} ${r} 0`} stroke="#1a1a1a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        ) : (
          <>
            <ellipse cx="0" cy="0" rx={r} ry={r} fill="#ffffff" />
            <circle cx={p.x} cy={p.y} r={r * 0.55} fill="#1a1a1a" />
          </>
        )}
      </g>
    );
  };

  return (
    <div ref={wrapRef} className="relative w-full h-full pointer-events-none select-none">
      {/* Soft floor shadow under the group */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-72 h-3 rounded-full bg-black/15 blur-md" />

      <svg viewBox="0 0 320 320" className="absolute inset-0 w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="gOrange" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#ffb27a" />
            <stop offset="60%" stopColor="#ff7a2a" />
            <stop offset="100%" stopColor="#d94e0a" />
          </radialGradient>
          <radialGradient id="gPurple" cx="35%" cy="20%" r="90%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="60%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4c1d95" />
          </radialGradient>
          <radialGradient id="gPink" cx="35%" cy="20%" r="90%">
            <stop offset="0%" stopColor="#ff7eb3" />
            <stop offset="60%" stopColor="#e11d74" />
            <stop offset="100%" stopColor="#9d174d" />
          </radialGradient>
          <radialGradient id="gYellow" cx="35%" cy="20%" r="90%">
            <stop offset="0%" stopColor="#ffe27a" />
            <stop offset="60%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#a16207" />
          </radialGradient>
        </defs>

        {/* PURPLE: tall back. On password focus, the whole shape bends forward over pink */}
        <g className={`drop drop-a ${passwordFocused ? "peek-purple" : ""}`} style={{ transformOrigin: "120px 295px" }}>
          <g className="bob bob-a">
            <g transform="translate(92 95)">
              <path d="M6 26 Q6 0 38 0 Q70 0 70 26 L70 195 Q70 203 62 203 L14 203 Q6 203 6 195 Z" fill="url(#gPurple)" />
              <g transform="translate(28 60)"><Eye ex={0.42} ey={0.4} /></g>
              <g transform="translate(48 60)"><Eye ex={0.46} ey={0.4} /></g>
            </g>
          </g>
        </g>

        {/* PINK: middle block */}
        <g className="drop drop-b">
          <g className="bob bob-b">
            <g transform="translate(148 148)">
              <path d="M6 18 Q6 0 30 0 Q54 0 54 18 L54 145 Q54 152 46 152 L14 152 Q6 152 6 145 Z" fill="url(#gPink)" />
              <g transform="translate(24 44)"><Eye ex={0.58} ey={0.45} r={2.8} forceClosed={passwordFocused} /></g>
              <g transform="translate(38 44)"><Eye ex={0.62} ey={0.45} r={2.8} forceClosed={passwordFocused} /></g>
              <path d="M26 60 Q30 63 34 60" stroke="#3a0820" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            </g>
          </g>
        </g>

        {/* YELLOW: small right with a tiny pointing arm */}
        <g className="drop drop-c">
          <g className="bob bob-c">
            <g transform="translate(206 172)">
              <path d="M6 22 Q6 0 34 0 Q62 0 62 22 L62 125 Q62 132 54 132 L14 132 Q6 132 6 125 Z" fill="url(#gYellow)" />
              <g transform="translate(26 46)"><Eye ex={0.78} ey={0.5} r={3} /></g>
              <g transform="translate(42 46)"><Eye ex={0.82} ey={0.5} r={3} /></g>
              <path d="M28 66 Q34 70 40 66" stroke="#5a3a00" strokeWidth="1.3" fill="none" strokeLinecap="round" />
              {/* little arm */}
              <path d="M58 78 q 14 0 18 6 q -6 -1 -10 1 q 4 2 4 6 q -8 -4 -16 -6 z" fill="url(#gYellow)" />
            </g>
          </g>
        </g>

        {/* ORANGE: front dome (largest) */}
        <g className="drop drop-d">
          <g className="bob bob-d">
            <g transform="translate(48 184)">
              <path d="M0 116 Q0 0 94 0 Q188 0 188 116 L188 126 L0 126 Z" fill="url(#gOrange)" />
              <g transform="translate(72 70)"><Eye ex={0.32} ey={0.7} r={4.2} /></g>
              <g transform="translate(104 70)"><Eye ex={0.4} ey={0.7} r={4.2} /></g>
              <path d="M76 92 Q94 102 112 92" stroke="#5a1a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </g>
          </g>
        </g>
      </svg>

      <style>{`
        .drop { transform-box: fill-box; transform-origin: center bottom; }
        @keyframes drop-in {
          0%   { transform: translateY(-360px) rotate(-8deg); opacity: 0; }
          55%  { transform: translateY(16px)   rotate(3deg);  opacity: 1; }
          75%  { transform: translateY(-6px)   rotate(-1deg); }
          100% { transform: translateY(0)      rotate(0); }
        }
        .drop-a { animation: drop-in .95s cubic-bezier(.22,1.2,.36,1) .05s both; }
        .drop-b { animation: drop-in .95s cubic-bezier(.22,1.2,.36,1) .22s both; }
        .drop-c { animation: drop-in .95s cubic-bezier(.22,1.2,.36,1) .35s both; }
        .drop-d { animation: drop-in 1.05s cubic-bezier(.22,1.2,.36,1) 0s both; }

        .bob { transform-box: fill-box; transform-origin: center; }
        @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .bob-a { animation: bob 4.2s ease-in-out 1.1s infinite; }
        .bob-b { animation: bob 3.6s ease-in-out 1.3s infinite; }
        .bob-c { animation: bob 4.8s ease-in-out 1.5s infinite; }
        .bob-d { animation: bob 5.2s ease-in-out 1.2s infinite; }

        /* Peek-a-boo: tall purple bends forward over the pink */
        .peek-purple { animation: peek .55s cubic-bezier(.2,1.1,.3,1) forwards; }
        @keyframes peek {
          0%   { transform: rotate(0) translateY(0); }
          100% { transform: rotate(38deg) translateY(-4px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .drop, .bob, .peek-purple { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
