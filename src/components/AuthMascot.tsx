import { useEffect, useRef, useState } from "react";

/**
 * Cute blob characters whose eyes follow the cursor.
 * When `passwordFocused` is true, they cover/close their eyes (peek-a-boo).
 */
export function AuthMascot({ passwordFocused = false }: { passwordFocused?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

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

  // Compute pupil offset for an eye centered at (cx,cy) within the SVG viewBox 0..1.
  const pupil = (cx: number, cy: number, max = 1.6) => {
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    const dist = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, dist * 2.5);
    return { x: (dx / dist) * max * k, y: (dy / dist) * max * k };
  };

  const closed = passwordFocused;

  // Each character: position, color, eye coords (relative to wrap, normalized)
  const Eye = ({ ex, ey, r = 3 }: { ex: number; ey: number; r?: number }) => {
    const p = pupil(ex, ey);
    return (
      <g>
        <ellipse cx="0" cy="0" rx={r + 1.5} ry={r + 1.5} fill="#ffffff" />
        {closed ? (
          <path d={`M ${-r} 0 Q 0 ${r * 0.8} ${r} 0`} stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        ) : (
          <circle cx={p.x} cy={p.y} r={r * 0.55} fill="#1a1a1a" />
        )}
      </g>
    );
  };

  return (
    <div ref={wrapRef} className="relative w-full h-full flex items-end justify-center overflow-hidden">
      {/* Floor shadow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 h-3 rounded-full bg-black/15 blur-md" />

      <svg viewBox="0 0 320 320" className="w-[88%] max-w-md mascot-pop" xmlns="http://www.w3.org/2000/svg">
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

        {/* Purple tall back block */}
        <g className="bob-a" transform="translate(70 60)">
          <path d="M10 30 Q10 0 50 0 Q90 0 90 30 L90 200 Q90 210 80 210 L20 210 Q10 210 10 200 Z" fill="url(#gPurple)" />
          <g transform="translate(40 70)"><Eye ex={0.36} ey={0.42} r={4} /></g>
          <g transform="translate(60 70)"><Eye ex={0.42} ey={0.42} r={4} /></g>
        </g>

        {/* Pink middle block */}
        <g className="bob-b" transform="translate(135 120)">
          <path d="M8 20 Q8 0 35 0 Q62 0 62 20 L62 150 Q62 158 54 158 L16 158 Q8 158 8 150 Z" fill="url(#gPink)" />
          <g transform="translate(28 50)"><Eye ex={0.55} ey={0.45} r={3.5} /></g>
          <g transform="translate(44 50)"><Eye ex={0.6} ey={0.45} r={3.5} /></g>
          {/* tiny smile */}
          <path d="M30 70 Q35 74 40 70" stroke="#3a0820" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </g>

        {/* Yellow right block */}
        <g className="bob-c" transform="translate(200 150)">
          <path d="M8 25 Q8 0 40 0 Q72 0 72 25 L72 130 Q72 140 62 140 L18 140 Q8 140 8 130 Z" fill="url(#gYellow)" />
          <g transform="translate(30 50)"><Eye ex={0.78} ey={0.5} r={3.8} /></g>
          <g transform="translate(50 50)"><Eye ex={0.82} ey={0.5} r={3.8} /></g>
          <path d="M32 72 Q40 76 48 72" stroke="#5a3a00" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </g>

        {/* Orange dome front */}
        <g className="bob-d" transform="translate(40 170)">
          <path d="M0 120 Q0 0 100 0 Q200 0 200 120 L200 130 L0 130 Z" fill="url(#gOrange)" />
          <g transform="translate(78 70)"><Eye ex={0.32} ey={0.7} r={5} /></g>
          <g transform="translate(112 70)"><Eye ex={0.42} ey={0.7} r={5} /></g>
          {/* smile */}
          <path d="M82 95 Q95 105 108 95" stroke="#5a1a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      </svg>

      <style>{`
        .mascot-pop { animation: pop .7s cubic-bezier(.2,1.4,.4,1) both; }
        @keyframes pop {
          0% { transform: translateY(20px) scale(.92); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .bob-a { animation: bob 4.2s ease-in-out infinite; transform-origin: center; }
        .bob-b { animation: bob 3.6s ease-in-out infinite .3s; }
        .bob-c { animation: bob 4.8s ease-in-out infinite .6s; }
        .bob-d { animation: bob 5.2s ease-in-out infinite .15s; }
        @keyframes bob {
          0%,100% { transform: translate(var(--tx,0), var(--ty,0)); }
          50%     { transform: translate(var(--tx,0), calc(var(--ty,0px) - 4px)); }
        }
        .bob-a { --tx: 70px; --ty: 60px; }
        .bob-b { --tx: 135px; --ty: 120px; }
        .bob-c { --tx: 200px; --ty: 150px; }
        .bob-d { --tx: 40px; --ty: 170px; }

        @media (prefers-reduced-motion: reduce) {
          .mascot-pop, .bob-a, .bob-b, .bob-c, .bob-d { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
