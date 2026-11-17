import React from "react";
import { C, noise1 } from "./theme";

/**
 * Side view of a ~100-tonne rigid haul truck, facing right.
 * viewBox 0 0 1000 560 - ground line at y=540, 1 unit ~ 1.05 cm.
 * Real proportions: ~10.2 m long, ~4.8 m to canopy, 2.7 m tyres, 4.3 m wheelbase.
 *
 * Engine bay (the story's hot zone) is centred on BAY = (880, 348).
 */
export const BAY = { x: 880, y: 348 };
export const TRUCK_VB = { w: 1000, h: 560 };

type Props = {
  t: number; // frame, for flicker
  wheelAngle?: number;
  headlights?: number; // 0..1
  rim?: number; // 0..1 rim-light strength
  rimColor?: string;
  heat?: number; // 0..1 heat signature
  thermal?: number; // 0..1 thermal rendering of heat (contours, ramp)
  accent?: number; // 0..1 ember accent along engine bay (hero)
  bob?: number;
  overlay?: React.ReactNode; // drawn in truck coordinates, on top
  beams?: boolean;
  /** 'heat' draws only the heat signature (so a filtered body can't desaturate it). */
  layer?: "all" | "body" | "heat";
};

const Wheel: React.FC<{ cx: number; cy: number; angle: number; id: string }> = ({
  cx,
  cy,
  angle,
  id,
}) => {
  const bolts = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2);
  const treads = Array.from({ length: 30 }, (_, i) => (i / 30) * 360);
  return (
    <g transform={`translate(${cx} ${cy}) scale(0.9375) translate(${-cx} ${-cy})`}>
      {/* tyre */}
      <circle cx={cx} cy={cy} r={128} fill={`url(#tyre-${id})`} />
      <g transform={`rotate(${angle} ${cx} ${cy})`}>
        {treads.map((a) => (
          <rect
            key={a}
            x={cx - 7}
            y={cy - 129}
            width={14}
            height={13}
            rx={2}
            fill="#08090A"
            transform={`rotate(${a} ${cx} ${cy}) skewX(-14)`}
          />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={116} fill="none" stroke="#202326" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={98} fill="none" stroke="#17191B" strokeWidth={10} />
      {/* rim */}
      <circle cx={cx} cy={cy} r={74} fill="url(#rimG)" />
      <circle cx={cx} cy={cy} r={74} fill="none" stroke="#4A5058" strokeWidth={3} />
      <circle cx={cx} cy={cy} r={58} fill="none" stroke="#1A1D20" strokeWidth={6} />
      <g transform={`rotate(${angle} ${cx} ${cy})`}>
        {bolts.map((a, i) => (
          <circle
            key={i}
            cx={cx + Math.cos(a) * 44}
            cy={cy + Math.sin(a) * 44}
            r={4.2}
            fill="#5A616A"
            stroke="#0E1012"
            strokeWidth={1.5}
          />
        ))}
        <rect x={cx - 3} y={cy - 70} width={6} height={14} rx={2} fill="#2A2E33" />
      </g>
      <circle cx={cx} cy={cy} r={28} fill="#2E3338" stroke="#131518" strokeWidth={3} />
      <circle cx={cx} cy={cy} r={12} fill="#1A1D20" />
      {/* contact shadow on tyre bottom */}
      <ellipse cx={cx} cy={cy + 118} rx={90} ry={10} fill="#000" opacity={0.6} />
    </g>
  );
};

/** Wobbly closed blob path for heat contours. */
const blob = (cx: number, cy: number, r: number, t: number, seed: number, sx = 1.25) => {
  const n = 56;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + 0.09 * noise1(a * 1.3 + t * 0.09 + seed * 7, seed) + 0.05 * Math.sin(a * 3 + t * 0.15 + seed);
    const x = cx + Math.cos(a) * r * k * sx;
    const y = cy + Math.sin(a) * r * k * 0.8;
    d += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
  }
  return d + "Z";
};

export const Dumper: React.FC<Props> = ({
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
  const ribXs = Array.from({ length: 9 }, (_, i) => 108 + i * 66);
  const bodyBottomY = (x: number) => 280 - ((x - 150) * 24) / 540;

  const defs = (
      <defs>
        <linearGradient id="bodyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#424951" />
          <stop offset="0.35" stopColor="#2C3137" />
          <stop offset="1" stopColor="#14171A" />
        </linearGradient>
        <linearGradient id="panelG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#363C43" />
          <stop offset="1" stopColor="#181B1E" />
        </linearGradient>
        <linearGradient id="deckG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A4047" />
          <stop offset="1" stopColor="#1B1E22" />
        </linearGradient>
        <linearGradient id="glassG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#39424B" />
          <stop offset="0.45" stopColor="#151A1F" />
          <stop offset="1" stopColor="#0B0D10" />
        </linearGradient>
        <radialGradient id="rimG" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#4B525A" />
          <stop offset="1" stopColor="#1E2226" />
        </radialGradient>
        {["r", "f"].map((id) => (
          <radialGradient key={id} id={`tyre-${id}`} cx="0.45" cy="0.4" r="0.6">
            <stop offset="0.6" stopColor="#1A1B1D" />
            <stop offset="1" stopColor="#0C0C0D" />
          </radialGradient>
        ))}
        <radialGradient id="lampG">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="0.25" stopColor="#FFF4E2" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFF4E2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="beamG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFF4E2" stopOpacity="0.32" />
          <stop offset="1" stopColor="#FFF4E2" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="heatOuter">
          <stop offset="0" stopColor={C.ember} stopOpacity="0.85" />
          <stop offset="1" stopColor={C.ember} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heatCore">
          <stop offset="0" stopColor="#FFF6E0" stopOpacity="1" />
          <stop offset="0.35" stopColor={C.heat} stopOpacity="0.95" />
          <stop offset="1" stopColor={C.ember} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="accentG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C.ember} stopOpacity="0" />
          <stop offset="0.25" stopColor={C.ember} stopOpacity="1" />
          <stop offset="0.8" stopColor={C.heat} stopOpacity="1" />
          <stop offset="1" stopColor={C.ember} stopOpacity="0" />
        </linearGradient>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="softer" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <pattern id="plate" width="14" height="8" patternUnits="userSpaceOnUse">
          <rect width="14" height="8" fill="#22262A" />
          <path d="M2 6 L6 2 M9 6 L13 2" stroke="#30353B" strokeWidth="1.4" />
        </pattern>
      </defs>
  );
  const heatG = (
    <>
      {h > 0 && (
        <g transform={`translate(0 ${bob})`}>
          <ellipse
            cx={BAY.x}
            cy={BAY.y}
            rx={150 * (0.45 + h)}
            ry={110 * (0.45 + h)}
            fill="url(#heatOuter)"
            opacity={(0.28 + 0.5 * thermal) * h * flick}
            filter="url(#softer)"
            style={{ mixBlendMode: "screen" }}
          />
          {thermal > 0 && (
            <g opacity={thermal}>
              <ellipse
                cx={BAY.x}
                cy={BAY.y}
                rx={70 * (0.3 + h)}
                ry={50 * (0.3 + h)}
                fill="url(#heatCore)"
                opacity={h}
                filter="url(#soft)"
              />
              {[1, 0.74, 0.5, 0.3].map((k, i) => (
                <path
                  key={i}
                  d={blob(BAY.x, BAY.y, 130 * k * (0.35 + h * 0.9), t, i)}
                  fill="none"
                  stroke={i < 2 ? C.ember : C.heat}
                  strokeWidth={i < 2 ? 1.6 : 2.2}
                  opacity={(0.35 + i * 0.15) * Math.min(1, h * 1.6)}
                />
              ))}
            </g>
          )}
        </g>
      )}

    </>
  );
  if (layer === "heat") {
    return (
      <svg viewBox="0 0 1000 560" width="100%" height="100%" style={{ overflow: "visible", display: "block" }}>
        {defs}
        {heatG}
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 1000 560"
      width="100%"
      height="100%"
      style={{ overflow: "visible", display: "block" }}
    >
      {defs}

      {/* ground contact shadow */}
      <ellipse cx={500} cy={542} rx={500} ry={16} fill="#000" opacity={0.75} filter="url(#soft)" />

      {/* headlight beams (behind truck so they emerge from the lamps) */}
      {beams && headlights > 0 && (
        <g opacity={headlights * flick} style={{ mixBlendMode: "screen" }}>
          <polygon points="992,408 1900,300 1900,620" fill="url(#beamG)" />
          <polygon points="986,288 1900,160 1900,470" fill="url(#beamG)" opacity={0.6} />
        </g>
      )}

      <g transform={`translate(0 ${bob})`}>
        {/* ---------- chassis ---------- */}
        <path d="M150 300 L960 318 L960 362 L210 360 Z" fill="#141619" />
        <rect x={200} y={322} width={760} height={10} fill="#22262B" />
        {/* hoist cylinder */}
        <g>
          <line x1={566} y1={352} x2={612} y2={262} stroke="#1A1D21" strokeWidth={22} strokeLinecap="round" />
          <line x1={572} y1={340} x2={604} y2={276} stroke="#59616A" strokeWidth={8} strokeLinecap="round" />
        </g>
        {/* fuel tank */}
        <rect x={418} y={330} width={140} height={78} rx={14} fill="url(#panelG)" stroke="#2D3237" strokeWidth={2} />
        <rect x={418} y={352} width={140} height={5} fill="#101214" />
        <rect x={418} y={384} width={140} height={5} fill="#101214" />
        <circle cx={540} cy={340} r={5} fill="#3A4047" />

        {/* ---------- dump body ---------- */}
        <path
          d="M18 128 L692 96 L692 258 L150 280 L72 258 L32 196 Z"
          fill="url(#bodyG)"
          stroke="#0D0F11"
          strokeWidth={2}
        />
        {/* top rail */}
        <path d="M18 128 L692 96 L692 122 L24 152 Z" fill="#3B4249" />
        <path d="M24 152 L692 122" stroke="#121417" strokeWidth={3} />
        {/* ribs */}
        {ribXs.map((x) => {
          const yTop = 152 - ((x - 24) * 30) / 668 + 1;
          const yBot = bodyBottomY(x) - 2;
          return (
            <g key={x}>
              <rect x={x} y={yTop} width={11} height={yBot - yTop} fill="#30353B" />
              <rect x={x} y={yTop} width={2.5} height={yBot - yTop} fill="#56606A" />
              <rect x={x + 11} y={yTop} width={3} height={yBot - yTop} fill="#0F1113" opacity={0.8} />
            </g>
          );
        })}
        {/* lower beam */}
        <path d="M72 258 L150 280 L692 258 L692 244 L150 266 L84 246 Z" fill="#15181B" />
        {/* tail light */}
        <rect x={34} y={226} width={10} height={16} rx={2} fill={C.ember} opacity={0.55} />

        {/* ---------- canopy over cab ---------- */}
        <path d="M692 96 L986 84 L996 90 L996 108 L986 112 L700 124 Z" fill="#2B3036" stroke="#0D0F11" strokeWidth={2} />
        <path d="M700 124 L986 112" stroke="#14171A" strokeWidth={4} />
        {/* canopy underside shadow */}
        <path d="M692 124 L986 112 L986 130 L692 150 Z" fill="#000" opacity={0.45} />

        {/* ---------- cab ---------- */}
        <rect x={706} y={134} width={128} height={160} rx={6} fill="url(#panelG)" stroke="#0D0F11" strokeWidth={2} />
        <path d="M718 146 L824 146 L824 226 L718 232 Z" fill="url(#glassG)" stroke="#3A4047" strokeWidth={3} />
        <path d="M736 150 L764 150 L726 214 L720 214 Z" fill="#FFFFFF" opacity={0.08} />
        <line x1={770} y1={240} x2={770} y2={290} stroke="#101214" strokeWidth={3} />
        <rect x={780} y={258} width={22} height={5} rx={2} fill="#4A5058" />
        {/* mirror */}
        <line x1={986} y1={112} x2={1000} y2={150} stroke="#2A2E33" strokeWidth={4} />
        <rect x={994} y={148} width={12} height={34} rx={3} fill="#22262A" stroke="#3A4047" strokeWidth={1.5} />

        {/* ---------- hood + radiator ---------- */}
        <rect x={842} y={206} width={118} height={88} rx={4} fill="url(#panelG)" stroke="#0D0F11" strokeWidth={2} />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={852 + i * 14} y={222} width={7} height={52} rx={2} fill="#121417" />
        ))}
        <rect x={958} y={188} width={32} height={212} rx={3} fill="#1C1F23" stroke="#0D0F11" strokeWidth={2} />
        {Array.from({ length: 13 }, (_, i) => (
          <rect key={i} x={962} y={196 + i * 15} width={24} height={6} fill="#0E1012" />
        ))}

        {/* ---------- engine bay (below deck, in front of front tyre) ---------- */}
        <rect x={790} y={302} width={170} height={98} fill="#0A0B0C" />
        <g>
          {/* block */}
          <rect x={806} y={322} width={104} height={64} rx={6} fill="#1D2024" stroke="#2C3136" strokeWidth={2} />
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x={810 + i * 16.5} y={312} width={13} height={12} rx={2} fill="#2A2E33" />
          ))}
          {/* manifold to turbo */}
          <path d="M818 330 C 850 326, 890 326, 922 338" stroke="#3B3F44" strokeWidth={7} fill="none" />
          <circle cx={930} cy={350} r={18} fill="#24282C" stroke="#3D434A" strokeWidth={3} />
          <path d="M930 340 a10 10 0 1 1 -8 14" stroke="#4E555D" strokeWidth={2} fill="none" />
          {/* pulleys + belt */}
          <circle cx={812} cy={372} r={12} fill="#15181B" stroke="#3A4047" strokeWidth={3} />
          <circle cx={826} cy={344} r={7} fill="#15181B" stroke="#3A4047" strokeWidth={2.5} />
          <path d="M803 368 L820 340 M821 378 L832 348" stroke="#2A2E33" strokeWidth={3} />
          {/* hoses */}
          <path d="M904 380 C 930 392, 948 380, 952 366" stroke="#272B30" strokeWidth={6} fill="none" />
          <path d="M860 388 L860 400" stroke="#272B30" strokeWidth={8} />
        </g>
        {/* bay frame lip */}
        <rect x={790} y={300} width={170} height={4} fill="#2E3339" />
      </g>

      {/* ---------- wheels (no bob: suspension) ---------- */}
      <Wheel cx={270} cy={420} angle={wheelAngle} id="r" />
      <Wheel cx={700} cy={420} angle={wheelAngle} id="f" />

      <g transform={`translate(0 ${bob})`}>

        {/* ---------- deck + handrails ---------- */}
        <rect x={690} y={292} width={300} height={12} fill="url(#plate)" stroke="#0D0F11" strokeWidth={1.5} />
        <g stroke="#4A5058" strokeWidth={4} strokeLinecap="round">
          <line x1={842} y1={246} x2={988} y2={246} />
          <line x1={842} y1={268} x2={988} y2={268} strokeWidth={2.5} />
          {[848, 896, 944, 986].map((x) => (
            <line key={x} x1={x} y1={246} x2={x} y2={292} />
          ))}
        </g>

        {/* ---------- front access ladder ---------- */}
        <g stroke="#3A4047" strokeWidth={4}>
          <line x1={898} y1={536} x2={946} y2={404} />
          <line x1={924} y1={536} x2={972} y2={404} />
          {Array.from({ length: 5 }, (_, i) => {
            const k = (i + 0.5) / 5;
            return (
              <line
                key={i}
                x1={898 + 48 * k}
                y1={536 - 132 * k}
                x2={924 + 48 * k}
                y2={536 - 132 * k}
                strokeWidth={3}
              />
            );
          })}
        </g>

        {/* ---------- fender over front tyre ---------- */}
        <path d="M576 375 A 132 132 0 0 1 824 375" stroke="#22262A" strokeWidth={16} fill="none" />
        <path d="M576 375 A 132 132 0 0 1 824 375" stroke="#3E444B" strokeWidth={2.5} fill="none" transform="translate(0 -7)" />

        {/* ---------- bumper ---------- */}
        <rect x={904} y={398} width={92} height={36} rx={4} fill="url(#panelG)" stroke="#0D0F11" strokeWidth={2} />
        <rect x={904} y={398} width={92} height={4} fill="#3A4047" />
        {/* lamps */}
        <rect x={986} y={404} width={10} height={14} rx={2} fill={headlights > 0.05 ? "#FFF6E6" : "#3A4047"} />
        <rect x={980} y={282} width={10} height={10} rx={2} fill={headlights > 0.05 ? "#FFF6E6" : "#3A4047"} />
      </g>


      {layer === "all" && heatG}
      {/* ---------- hero accent: restrained ember line along the engine bay ---------- */}
      {accent > 0 && (
        <g opacity={accent}>
          <rect x={790} y={300} width={170} height={4} fill="url(#accentG)" />
          <rect x={790} y={296} width={170} height={12} fill="url(#accentG)" filter="url(#soft)" opacity={0.7} />
        </g>
      )}

      {/* ---------- rim light (key light from front-top) ---------- */}
      {rim > 0 && (
        <g
          stroke={rimColor}
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
          opacity={rim}
          transform={`translate(0 ${bob})`}
        >
          <path d="M18 128 L692 96" opacity={0.55} />
          <path d="M692 96 L986 84 L996 90" />
          <path d="M706 136 L834 136" opacity={0.5} />
          <path d="M842 207 L960 207" opacity={0.7} />
          <path d="M958 189 L990 189 L990 398" opacity={0.85} />
          <path d="M904 399 L996 399" opacity={0.7} />
          <path d="M824 375 A 132 132 0 0 0 760 297" opacity={0.35} transform="translate(0 -7)" />
        </g>
      )}
      {rim > 0 && (
        <g stroke={rimColor} strokeWidth={2} fill="none" opacity={rim * 0.45}>
          <path d="M760 316 A120 120 0 0 1 820 420" />
          <path d="M330 316 A120 120 0 0 1 390 420" />
        </g>
      )}

      {/* lamp glows */}
      {headlights > 0 && (
        <g opacity={headlights * flick} style={{ mixBlendMode: "screen" }}>
          <circle cx={994} cy={411} r={46} fill="url(#lampG)" />
          <circle cx={988} cy={287} r={34} fill="url(#lampG)" />
        </g>
      )}

      {overlay}
    </svg>
  );
};
