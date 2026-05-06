import { useEffect, useState } from "react";

/**
 * Animated mascot for the auth page.
 * Sequence:
 *  1) Character walks in from the left (legs swinging).
 *  2) Character stops at center.
 *  3) Bag drops from his hand to the floor.
 *  4) Character does a little idle bob.
 */
export function AuthMascot() {
  const [phase, setPhase] = useState<"walk" | "drop" | "idle">("walk");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("drop"), 2200);
    const t2 = setTimeout(() => setPhase("idle"), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-end justify-center overflow-hidden">
      {/* Floor shadow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-3 rounded-full bg-black/20 blur-md" />

      {/* Character group */}
      <div
        className={
          "absolute bottom-12 " +
          (phase === "walk" ? "mascot-walk-in" : "mascot-settled")
        }
      >
        <div className={phase === "idle" ? "mascot-bob" : ""}>
          <svg
            width="180"
            height="240"
            viewBox="0 0 180 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Head */}
            <circle cx="90" cy="44" r="26" fill="#f4c9a3" />
            {/* Hair */}
            <path d="M64 40 Q70 18 90 18 Q112 18 116 40 Q104 30 90 32 Q76 34 64 40 Z" fill="#3a2a1f" />
            {/* Eyes */}
            <circle cx="82" cy="46" r="2.2" fill="#1a1a1a" />
            <circle cx="98" cy="46" r="2.2" fill="#1a1a1a" />
            {/* Smile */}
            <path d="M84 56 Q90 60 96 56" stroke="#1a1a1a" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            {/* Neck */}
            <rect x="84" y="68" width="12" height="8" fill="#e8b890" />
            {/* Torso (shirt) */}
            <path
              d="M58 78 Q90 70 122 78 L120 142 Q90 150 60 142 Z"
              fill="#ffffff"
            />
            {/* Tie */}
            <path d="M88 78 L92 78 L93 92 L90 102 L87 92 Z" fill="#4f46e5" />
            {/* Right arm (holds the bag in walk phase) */}
            <g
              className={
                phase === "walk"
                  ? "arm-hold"
                  : phase === "drop"
                    ? "arm-drop"
                    : "arm-rest"
              }
              style={{ transformOrigin: "120px 82px" }}
            >
              <rect x="116" y="80" width="12" height="56" rx="6" fill="#ffffff" />
              <circle cx="122" cy="138" r="7" fill="#f4c9a3" />
            </g>
            {/* Left arm */}
            <g className={phase === "walk" ? "arm-swing" : ""} style={{ transformOrigin: "60px 82px" }}>
              <rect x="52" y="80" width="12" height="56" rx="6" fill="#ffffff" />
              <circle cx="58" cy="138" r="7" fill="#f4c9a3" />
            </g>
            {/* Pants */}
            <path d="M60 142 L120 142 L116 200 L96 200 L92 152 L88 152 L84 200 L64 200 Z" fill="#1f2937" />
            {/* Legs (animated while walking) */}
            <g className={phase === "walk" ? "leg-left" : ""} style={{ transformOrigin: "74px 200px" }}>
              <rect x="64" y="198" width="20" height="14" rx="3" fill="#111827" />
            </g>
            <g className={phase === "walk" ? "leg-right" : ""} style={{ transformOrigin: "106px 200px" }}>
              <rect x="96" y="198" width="20" height="14" rx="3" fill="#111827" />
            </g>
          </svg>
        </div>
      </div>

      {/* Bag */}
      <div
        className={
          "absolute " +
          (phase === "walk"
            ? "bag-with-hand"
            : phase === "drop"
              ? "bag-falling"
              : "bag-on-floor")
        }
      >
        <svg width="46" height="40" viewBox="0 0 46 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 14 H40 V36 Q40 38 38 38 H8 Q6 38 6 36 Z" fill="#7c3a1f" />
          <path d="M16 14 V10 Q16 4 23 4 Q30 4 30 10 V14" stroke="#5a2a14" strokeWidth="2.5" fill="none" />
          <rect x="20" y="22" width="6" height="4" rx="1" fill="#3a1d10" />
        </svg>
      </div>

      <style>{`
        /* Walk-in: slide from the left edge to center */
        .mascot-walk-in {
          animation: mascotWalkIn 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .mascot-settled { transform: translateX(0); }
        @keyframes mascotWalkIn {
          0%   { transform: translateX(-260px); }
          100% { transform: translateX(0); }
        }

        /* Idle bob */
        .mascot-bob { animation: bob 2.4s ease-in-out infinite; }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }

        /* Legs alternating swing while walking */
        .leg-left  { animation: legA 0.55s ease-in-out infinite; }
        .leg-right { animation: legB 0.55s ease-in-out infinite; }
        @keyframes legA {
          0%, 100% { transform: rotate(-22deg); }
          50%      { transform: rotate(22deg); }
        }
        @keyframes legB {
          0%, 100% { transform: rotate(22deg); }
          50%      { transform: rotate(-22deg); }
        }

        /* Left arm swings while walking */
        .arm-swing { animation: armSwing 0.55s ease-in-out infinite; }
        @keyframes armSwing {
          0%, 100% { transform: rotate(18deg); }
          50%      { transform: rotate(-18deg); }
        }

        /* Right arm holds the bag steady, then swings down to drop, then rests */
        .arm-hold { transform: rotate(0deg); }
        .arm-drop { animation: armDrop 0.7s ease-in forwards; }
        .arm-rest { transform: rotate(-6deg); }
        @keyframes armDrop {
          0%   { transform: rotate(0deg); }
          60%  { transform: rotate(35deg); }
          100% { transform: rotate(-6deg); }
        }

        /* Bag travels with the character while walking (held in right hand) */
        .bag-with-hand {
          bottom: 70px;
          left: 50%;
          transform: translateX(38px);
          animation: bagWalk 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes bagWalk {
          0%   { transform: translateX(calc(-260px + 38px)); }
          100% { transform: translateX(38px); }
        }

        /* Bag drops to the floor */
        .bag-falling {
          bottom: 70px;
          left: 50%;
          transform: translateX(38px);
          animation: bagFall 0.8s cubic-bezier(0.55, 0, 0.7, 1) forwards;
        }
        @keyframes bagFall {
          0%   { transform: translate(38px, 0) rotate(0deg); }
          70%  { transform: translate(46px, 58px) rotate(8deg); }
          85%  { transform: translate(46px, 50px) rotate(6deg); }
          100% { transform: translate(46px, 58px) rotate(6deg); }
        }

        /* Final resting position */
        .bag-on-floor {
          bottom: 12px;
          left: 50%;
          transform: translateX(46px) rotate(6deg);
        }

        @media (prefers-reduced-motion: reduce) {
          .mascot-walk-in, .mascot-bob, .leg-left, .leg-right,
          .arm-swing, .arm-drop, .bag-with-hand, .bag-falling {
            animation: none !important;
          }
          .bag-with-hand, .bag-falling { transform: translateX(46px) rotate(6deg); bottom: 12px; }
        }
      `}</style>
    </div>
  );
}
