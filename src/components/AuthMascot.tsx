import { useEffect, useRef, useState } from "react";

/**
 * Cute blob mascots inspired by the reference video:
 * - Shapes drop in from above with a soft bounce on first paint
 * - Gentle idle bobbing once seated
 * - Eyes track the cursor in real time
 * - On password focus, the tall purple character stretches up and tilts
 *   forward to "cover/peek" while everyone closes their eyes (peek-a-boo)
 */
export function AuthMascot({ passwordFocused = false }: { passwordFocused?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.4 });

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

  const closed = passwordFocused;

  const Eye = ({ ex, ey, r = 3.4 }: { ex: number; ey: number; r?: number }) => {
    const p = pupil(ex, ey);
    return (
      <g>
        {closed ? (
          <path
            d={`M ${-r} 0 Q 0 ${r * 0.9} ${r} 0`}
            stroke="#1a1a1a"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
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
    <div ref={wrapRef} className="relative w-full h-full overflow-hidden">
      {/* Floor shadow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-80 h-3 rounded-full bg-black/15 blur-md" />

      <svg
        viewBox="0 0 320 320"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
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

        {/* Purple: tall back. Wrapped in two groups: outer = drop+peek, inner = bob */}
        <g className={`drop drop-a ${closed ? "peek-purple" : ""}`}>
          <g className="bob bob-a" style={{ transformOrigin: "120px 280px" }}>
            <g transform="translate(95 80)">
              <path
                d="M6 26 Q6 0 38 0 Q70 0 70 26 L70 200 Q70 208 62 208 L14 208 Q6 208 6 200 Z"
                fill="url(#gPurple)"
              />
              <g transform="translate(28 58)">
                <Eye ex={0.42} ey={0.4} />
              </g>
              <g transform="translate(48 58)">
                <Eye ex={0.46} ey={0.4} />
              </g>
            </g>
          </g>
        </g>

        {/* Pink: middle block */}
        <g className="drop drop-b">
          <g className="bob bob-b">
            <g transform="translate(150 140)">
              <path
                d="M6 18 Q6 0 30 0 Q54 0 54 18 L54 148 Q54 156 46 156 L14 156 Q6 156 6 148 Z"
                fill="url(#gPink)"
              />
              <g transform="translate(24 44)">
                <Eye ex={0.58} ey={0.45} r={3} />
              </g>
              <g transform="translate(38 44)">
                <Eye ex={0.62} ey={0.45} r={3} />
              </g>
              <path
                d="M26 62 Q30 65 34 62"
                stroke="#3a0820"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </g>
        </g>

        {/* Yellow: right block */}
        <g className="drop drop-c">
          <g className="bob bob-c">
            <g transform="translate(208 168)">
              <path
                d="M6 22 Q6 0 34 0 Q62 0 62 22 L62 128 Q62 136 54 136 L14 136 Q6 136 6 128 Z"
                fill="url(#gYellow)"
              />
              <g transform="translate(26 46)">
                <Eye ex={0.78} ey={0.5} r={3.2} />
              </g>
              <g transform="translate(42 46)">
                <Eye ex={0.82} ey={0.5} r={3.2} />
              </g>
              <path
                d="M28 66 Q34 70 40 66"
                stroke="#5a3a00"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </g>
        </g>

        {/* Orange: front dome (lands first/biggest) */}
        <g className="drop drop-d">
          <g className="bob bob-d">
            <g transform="translate(50 180)">
              <path
                d="M0 118 Q0 0 95 0 Q190 0 190 118 L190 128 L0 128 Z"
                fill="url(#gOrange)"
              />
              <g transform="translate(74 68)">
                <Eye ex={0.32} ey={0.7} r={4.4} />
              </g>
              <g transform="translate(106 68)">
                <Eye ex={0.42} ey={0.7} r={4.4} />
              </g>
              <path
                d="M78 92 Q95 102 112 92"
                stroke="#5a1a00"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </g>
        </g>
      </svg>

      <style>{`
        /* Drop-in entrance: fall from above with a settle */
        .drop { transform-box: fill-box; transform-origin: center bottom; }
        @keyframes drop-in {
          0%   { transform: translateY(-340px) rotate(-6deg); opacity: 0; }
          55%  { transform: translateY(14px)   rotate(2deg);  opacity: 1; }
          75%  { transform: translateY(-6px)   rotate(-1deg); }
          100% { transform: translateY(0)      rotate(0); }
        }
        .drop-a { animation: drop-in .95s cubic-bezier(.22,1.2,.36,1) .05s both; }
        .drop-b { animation: drop-in .95s cubic-bezier(.22,1.2,.36,1) .22s both; }
        .drop-c { animation: drop-in .95s cubic-bezier(.22,1.2,.36,1) .35s both; }
        .drop-d { animation: drop-in 1.05s cubic-bezier(.22,1.2,.36,1) 0s both; }

        /* Idle bobbing */
        .bob { transform-box: fill-box; transform-origin: center; }
        @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .bob-a { animation: bob 4.2s ease-in-out 1.1s infinite; }
        .bob-b { animation: bob 3.6s ease-in-out 1.3s infinite; }
        .bob-c { animation: bob 4.8s ease-in-out 1.5s infinite; }
        .bob-d { animation: bob 5.2s ease-in-out 1.2s infinite; }

        /* Peek-a-boo: tall purple stretches up and leans forward */
        .peek-purple {
          transform-box: fill-box;
          transform-origin: center bottom;
          animation: peek .5s cubic-bezier(.2,1.2,.3,1) forwards;
        }
        @keyframes peek {
          0%   { transform: scaleY(1) translateY(0) rotate(0); }
          100% { transform: scaleY(1.18) translateY(-10px) rotate(-3deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .drop, .bob, .peek-purple { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
