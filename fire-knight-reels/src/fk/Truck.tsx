import React from "react";
import { C, REAL, noise1 } from "./theme";

/**
 * Modern Indian cab-over cargo truck (10-wheeler, 6x2/6x4 class), side view, facing right.
 * Same viewBox and ground line as Dumper (0 0 1000 560, ground y = 540) so the World camera
 * framings work unchanged. ~11 m long, ~4 m to the deflector top, ~1.05 m tyres.
 * Real colours: white cab, navy container, black tyres, silver rims, red/white reflective tape,
 * amber roof marker lamps. Engine sits under the cab; heat shows through the side access vent.
 */
export const TRUCK_BAY = { x: 826, y: 442 };

type Props = {
  t: number;
  wheelAngle?: number;
  headlights?: number;
  rim?: number;
  rimColor?: string;
  heat?: number;
  thermal?: number;
  accent?: number;
  bob?: number;
  overlay?: React.ReactNode;
  beams?: boolean;
  layer?: "all" | "body" | "heat";
};

const Wheel: React.FC<{ cx: number; angle: number; id: string }> = ({ cx, angle, id }) => {
  const cy = 490;
  const bolts = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);
  const treads = Array.from({ length: 22 }, (_, i) => (i / 22) * 360);
  return (
    <g>
      <circle cx={cx} cy={cy} r={50} fill={`url(#ttyre-${id})`} />
      <g transform={`rotate(${angle} ${cx} ${cy})`}>
        {treads.map((a) => (
          <rect key={a} x={cx - 3.5} y={cy - 50.5} width={7} height={6} rx={1} fill="#08090A" transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={43} fill="none" stroke="#1E2023" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={29} fill="url(#trimG)" />
      <circle cx={cx} cy={cy} r={29} fill="none" stroke="#C8CCD6" strokeWidth={1.5} opacity={0.7} />
      <g transform={`rotate(${angle} ${cx} ${cy})`}>
        {bolts.map((a, i) => (
          <circle key={i} cx={cx + Math.cos(a) * 17} cy={cy + Math.sin(a) * 17} r={2.4} fill="#2A2E33" />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={9} fill="#5A616A" stroke="#22262A" strokeWidth={2} />
      <ellipse cx={cx} cy={cy + 47} rx={38} ry={5} fill="#000" opacity={0.6} />
    </g>
  );
};

const blob = (cx: number, cy: number, r: number, t: number, seed: number, sx = 1.3) => {
  let d = "";
  for (let i = 0; i <= 56; i++) {
    const a = (i / 56) * Math.PI * 2;
    const k = 1 + 0.09 * noise1(a * 1.3 + t * 0.09 + seed * 7, seed) + 0.05 * Math.sin(a * 3 + t * 0.15 + seed);
    d += (i ? "L" : "M") + (cx + Math.cos(a) * r * k * sx).toFixed(1) + " " + (cy + Math.sin(a) * r * k * 0.75).toFixed(1);
  }
  return d + "Z";
};

export const Truck: React.FC<Props> = ({
  t,
  wheelAngle = 0,
  headlights = 0,
  rim = 0.6,
  rimColor = "#FFFFFF",
  heat = 0,
  thermal = 0,
  accent = 0,
  bob = 0,
  overlay,
  beams = true,
  layer = "all",
}) => {
  const flick = 0.92 + 0.08 * noise1(t * 0.7, 3);
  const h = heat;
  const B = TRUCK_BAY;

  const defs = (
    <defs>
      {/* white cab graded for a night key light from above */}
      <linearGradient id="cabG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E6E8EB" />
        <stop offset="0.45" stopColor="#B4B9C0" />
        <stop offset="1" stopColor="#4A5058" />
      </linearGradient>
      <linearGradient id="cabSide" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.25" />
        <stop offset="0.3" stopColor="#000" stopOpacity="0" />
      </linearGradient>
      {/* navy steel container */}
      <linearGradient id="boxG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3A4C6B" />
        <stop offset="0.4" stopColor="#24324A" />
        <stop offset="1" stopColor="#111827" />
      </linearGradient>
      <linearGradient id="tglassG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3B4652" />
        <stop offset="0.5" stopColor="#141A20" />
        <stop offset="1" stopColor="#0A0D10" />
      </linearGradient>
      <linearGradient id="tankG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#D9DDE2" />
        <stop offset="0.5" stopColor="#8E949C" />
        <stop offset="1" stopColor="#3E444B" />
      </linearGradient>
      <radialGradient id="trimG" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#C8CCD6" />
        <stop offset="1" stopColor="#5A616A" />
      </radialGradient>
      {["f", "r1", "r2"].map((id) => (
        <radialGradient key={id} id={`ttyre-${id}`} cx="0.45" cy="0.4" r="0.6">
          <stop offset="0.6" stopColor="#1A1B1D" />
          <stop offset="1" stopColor="#0C0C0D" />
        </radialGradient>
      ))}
      <radialGradient id="tlampG">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
        <stop offset="0.25" stopColor="#FFF4E2" stopOpacity="0.55" />
        <stop offset="1" stopColor="#FFF4E2" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="tbeamG" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FFF4E2" stopOpacity="0.34" />
        <stop offset="1" stopColor="#FFF4E2" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="theatOuter">
        <stop offset="0" stopColor={REAL.fireOrange} stopOpacity="0.9" />
        <stop offset="0.6" stopColor={REAL.fireRed} stopOpacity="0.35" />
        <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
      </radialGradient>
      <radialGradient id="theatCore">
        <stop offset="0" stopColor={REAL.fireCore} stopOpacity="1" />
        <stop offset="0.35" stopColor={REAL.fireYellow} stopOpacity="0.95" />
        <stop offset="1" stopColor={REAL.fireOrange} stopOpacity="0" />
      </radialGradient>
      <linearGradient id="taccentG" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={C.gold} stopOpacity="0" />
        <stop offset="0.25" stopColor={C.gold} stopOpacity="1" />
        <stop offset="0.8" stopColor={C.goldL} stopOpacity="1" />
        <stop offset="1" stopColor={C.gold} stopOpacity="0" />
      </linearGradient>
      <filter id="tsoft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
      <filter id="tsofter" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
    </defs>
  );

  const heatG = h > 0 && (
    <g transform={`translate(0 ${bob})`}>
      <ellipse
        cx={B.x}
        cy={B.y}
        rx={120 * (0.45 + h)}
        ry={80 * (0.45 + h)}
        fill="url(#theatOuter)"
        opacity={(0.32 + 0.5 * thermal) * h * flick}
        filter="url(#tsofter)"
        style={{ mixBlendMode: "screen" }}
      />
      {/* glow through the vent slits */}
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={800} y={398 + i * 9} width={64} height={3.5} rx={1.5} fill={REAL.fireYellow} opacity={Math.min(1, h * 1.2) * (0.5 + 0.5 * flick)} />
      ))}
      {thermal > 0 && (
        <g opacity={thermal}>
          <ellipse cx={B.x} cy={B.y} rx={56 * (0.3 + h)} ry={38 * (0.3 + h)} fill="url(#theatCore)" opacity={h} filter="url(#tsoft)" />
          {[1, 0.74, 0.5, 0.3].map((k, i) => (
            <path
              key={i}
              d={blob(B.x, B.y, 105 * k * (0.35 + h * 0.9), t, i)}
              fill="none"
              stroke={i < 1 ? REAL.fireRed : i < 2 ? REAL.fireOrange : REAL.fireYellow}
              strokeWidth={i < 2 ? 1.5 : 2}
              opacity={(0.35 + i * 0.15) * Math.min(1, h * 1.6)}
            />
          ))}
        </g>
      )}
    </g>
  );

  if (layer === "heat") {
    return (
      <svg viewBox="0 0 1000 560" width="100%" height="100%" style={{ overflow: "visible", display: "block" }}>
        {defs}
        {heatG}
        {overlay}
      </svg>
    );
  }

  const ribs = Array.from({ length: 20 }, (_, i) => 52 + i * 36);

  return (
    <svg viewBox="0 0 1000 560" width="100%" height="100%" style={{ overflow: "visible", display: "block" }}>
      {defs}
      <ellipse cx={500} cy={542} rx={500} ry={14} fill="#000" opacity={0.75} filter="url(#tsoft)" />

      {beams && headlights > 0 && (
        <g opacity={headlights * flick} style={{ mixBlendMode: "screen" }}>
          <polygon points="998,420 1900,330 1900,620" fill="url(#tbeamG)" />
        </g>
      )}

      <g transform={`translate(0 ${bob})`}>
        {/* chassis + running gear */}
        <rect x={30} y={430} width={940} height={22} fill="#141619" />
        <rect x={30} y={436} width={940} height={4} fill="#22262B" />
        {/* air tanks, fuel tank, battery box, exhaust */}
        <rect x={486} y={458} width={74} height={30} rx={14} fill="#3A4047" />
        <rect x={580} y={454} width={122} height={44} rx={20} fill="url(#tankG)" />
        <rect x={580} y={470} width={122} height={3} fill="#3E444B" opacity={0.7} />
        <rect x={712} y={458} width={50} height={36} rx={3} fill="#15171A" stroke="#2C3136" strokeWidth={1.5} />
        <rect x={700} y={500} width={80} height={6} rx={3} fill="#9AA0A8" />
        {/* side underrun guard */}
        <g stroke="#6A7078" strokeWidth={3}>
          <line x1={482} y1={470} x2={482} y2={500} />
          <line x1={482} y1={500} x2={578} y2={500} />
        </g>

        {/* ---------- container ---------- */}
        <rect x={20} y={150} width={750} height={278} rx={4} fill="url(#boxG)" stroke="#0A0F18" strokeWidth={2} />
        {ribs.map((x) => (
          <g key={x}>
            <rect x={x} y={164} width={10} height={250} fill="#2E3D59" />
            <rect x={x} y={164} width={2} height={250} fill="#4A5D80" />
            <rect x={x + 10} y={164} width={2.5} height={250} fill="#0C121C" opacity={0.8} />
          </g>
        ))}
        <rect x={20} y={150} width={750} height={14} fill="#46597B" />
        <rect x={20} y={414} width={750} height={14} fill="#161F2F" />
        {/* red/white reflective tape */}
        {Array.from({ length: 30 }, (_, i) => (
          <rect key={i} x={26 + i * 25} y={418} width={22} height={6} fill={i % 2 ? "#E8E8E8" : "#C8221A"} opacity={0.85} />
        ))}
        {/* rear doors + lights */}
        <line x1={34} y1={164} x2={34} y2={414} stroke="#0C121C" strokeWidth={3} />
        <rect x={22} y={386} width={8} height={20} rx={2} fill={REAL.tailRed} opacity={0.9} />

        {/* rear mudguards */}
        <path d="M268 448 A 64 64 0 0 1 502 448" stroke="#0E0F11" strokeWidth={10} fill="none" />

        {/* ---------- cab-over cab ---------- */}
        {/* roof deflector */}
        <path d="M800 228 L816 182 Q820 172 832 171 L948 166 Q962 166 962 180 L960 226 Z" fill="url(#cabG)" stroke="#2A2E33" strokeWidth={1.5} />
        {[842, 878, 914].map((x) => (
          <rect key={x} x={x} y={174} width={16} height={6} rx={2} fill="#F3A21E" opacity={0.9} />
        ))}
        {/* cab body */}
        <path d="M782 456 L782 246 Q782 228 800 226 L958 222 Q978 222 984 240 L994 300 L996 456 Z" fill="url(#cabG)" stroke="#2A2E33" strokeWidth={2} />
        <path d="M782 456 L782 246 Q782 228 800 226 L958 222 Q978 222 984 240 L994 300 L996 456 Z" fill="url(#cabSide)" />
        {/* side window */}
        <path d="M830 250 L938 246 Q952 246 954 258 L958 320 L830 324 Z" fill="url(#tglassG)" stroke="#5A616A" strokeWidth={2} />
        <path d="M846 254 L872 253 L840 304 L834 304 Z" fill="#FFFFFF" opacity={0.08} />
        {/* door */}
        <path d="M818 238 L966 234 L972 448 L818 448 Z" fill="none" stroke="#5E646C" strokeWidth={2} />
        <rect x={930} y={344} width={20} height={5} rx={2} fill="#3A4047" />
        {/* engine access vent (heat shows through here) */}
        <rect x={796} y={392} width={72} height={50} rx={4} fill="#22262A" stroke="#4A5058" strokeWidth={1.5} />
        {Array.from({ length: 5 }, (_, i) => (
          <rect key={i} x={800} y={398 + i * 9} width={64} height={3.5} rx={1.5} fill="#0A0B0C" />
        ))}
        {/* front grille strip + lamps */}
        <rect x={984} y={300} width={12} height={110} rx={2} fill="#2A2E33" />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={986} y={306 + i * 14} width={8} height={6} fill="#111315" />
        ))}
        <rect x={986} y={412} width={12} height={16} rx={2} fill={headlights > 0.05 ? "#FFF6E6" : "#3A4047"} />
        {/* bumper + steps */}
        <rect x={956} y={432} width={44} height={30} rx={3} fill="#3A4047" />
        <rect x={900} y={452} width={56} height={6} rx={2} fill="#B4B9C0" />
        <rect x={904} y={470} width={50} height={6} rx={2} fill="#B4B9C0" />
        {/* mirror */}
        <line x1={992} y1={250} x2={1010} y2={262} stroke="#2A2E33" strokeWidth={4} />
        <rect x={1004} y={252} width={12} height={52} rx={3} fill="#22262A" stroke="#4A5058" strokeWidth={1.5} />
        {/* front mudguard */}
        <path d="M812 452 A 60 60 0 0 1 930 452" stroke="#0E0F11" strokeWidth={10} fill="none" />
        {/* engine / gearbox under the cab, seen between container and front wheel */}
        <rect x={772} y={454} width={46} height={40} rx={4} fill="#1D2024" stroke="#2C3136" strokeWidth={1.5} />
        <circle cx={790} cy={474} r={9} fill="#15181B" stroke="#3A4047" strokeWidth={2} />
      </g>

      <Wheel cx={330} angle={wheelAngle} id="r1" />
      <Wheel cx={440} angle={wheelAngle} id="r2" />
      <Wheel cx={870} angle={wheelAngle} id="f" />

      {layer === "all" && heatG}

      {accent > 0 && (
        <g opacity={accent}>
          <rect x={796} y={444} width={72} height={3} fill="url(#taccentG)" />
          <rect x={796} y={440} width={72} height={10} fill="url(#taccentG)" filter="url(#tsoft)" opacity={0.7} />
        </g>
      )}

      {rim > 0 && (
        <g stroke={rimColor} strokeWidth={2} fill="none" strokeLinecap="round" opacity={rim} transform={`translate(0 ${bob})`}>
          <path d="M20 150 L770 150" opacity={0.45} />
          <path d="M816 182 Q820 172 832 171 L948 166 Q962 166 962 180" />
          <path d="M958 222 Q978 222 984 240 L994 300 L996 456" opacity={0.85} />
          <path d="M956 432 L1000 432" opacity={0.6} />
        </g>
      )}
      {rim > 0 && (
        <g stroke={rimColor} strokeWidth={1.6} fill="none" opacity={rim * 0.4}>
          <path d="M893 445 A 50 50 0 0 1 918 490" />
          <path d="M463 445 A 50 50 0 0 1 488 490" />
        </g>
      )}

      {headlights > 0 && (
        <g opacity={headlights * flick} style={{ mixBlendMode: "screen" }}>
          <circle cx={994} cy={420} r={40} fill="url(#tlampG)" />
        </g>
      )}

      {overlay}
    </svg>
  );
};
