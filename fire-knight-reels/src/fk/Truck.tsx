import React from "react";
import { C, REAL, noise1 } from "./theme";

/**
 * Modern Indian cab-over haulage truck (Signa / Captain-class 6x2 container truck), side view,
 * facing right. Same viewBox and ground line as Dumper (0 0 1000 560, ground y = 540).
 * Real proportions at ~89 units/m: ~11 m long, 2.3 m cab, 4.2 m to the roof, 1.05 m tyres,
 * 32 ft-class container on a ladder chassis.
 * Real colours: white cab, navy corrugated container, black tyres, silver disc wheels with hand
 * holes, red/white reflective tape, amber marker lamps, aluminium fuel tank.
 * The engine sits under the cab; heat shows through the cab's rear-side air intake grille.
 */
export const TRUCK_BAY = { x: 822, y: 398 };
/** Centre of the cab window (for the in-cab alarm). */
export const TRUCK_CABIN = { x: 920, y: 300 };

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
  /** 0..1 - the in-cab alarm / emergency light is going (flashes red and amber). */
  cabAlarm?: number;
};

const Wheel: React.FC<{ cx: number; angle: number; id: string }> = ({ cx, angle, id }) => {
  const cy = 490;
  const holes = Array.from({ length: 8 }, (_, i) => (i / 8) * 360);
  const nuts = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2);
  const treads = Array.from({ length: 26 }, (_, i) => (i / 26) * 360);
  return (
    <g>
      <circle cx={cx} cy={cy} r={50} fill={`url(#ttyre-${id})`} />
      <g transform={`rotate(${angle} ${cx} ${cy})`}>
        {treads.map((a) => (
          <rect key={a} x={cx - 3} y={cy - 50.5} width={6} height={5} rx={1} fill="#060708" transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
      </g>
      {/* sidewall */}
      <circle cx={cx} cy={cy} r={45} fill="none" stroke="#202327" strokeWidth={3} />
      <circle cx={cx} cy={cy} r={38} fill="none" stroke="#111214" strokeWidth={6} />
      {/* steel disc wheel with hand holes */}
      <circle cx={cx} cy={cy} r={33} fill="url(#tdiscG)" />
      <circle cx={cx} cy={cy} r={33} fill="none" stroke="#E2E5EA" strokeWidth={1.2} opacity={0.6} />
      <circle cx={cx} cy={cy} r={27} fill="none" stroke="#6E747C" strokeWidth={1.5} />
      <g transform={`rotate(${angle} ${cx} ${cy})`}>
        {holes.map((a) => (
          <ellipse key={a} cx={cx} cy={cy - 21} rx={4.2} ry={6} fill="#0D0F12" transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
        {nuts.map((a, i) => (
          <circle key={i} cx={cx + Math.cos(a) * 12} cy={cy + Math.sin(a) * 12} r={1.8} fill="#2A2E33" />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={8} fill="url(#tchromeG)" stroke="#3A4047" strokeWidth={1} />
      <ellipse cx={cx - 10} cy={cy - 14} rx={10} ry={4} fill="#FFFFFF" opacity={0.12} transform={`rotate(-30 ${cx - 10} ${cy - 14})`} />
      <ellipse cx={cx} cy={cy + 48} rx={40} ry={5} fill="#000" opacity={0.65} />
    </g>
  );
};

const blob = (cx: number, cy: number, r: number, t: number, seed: number, sx = 1.2) => {
  let d = "";
  for (let i = 0; i <= 56; i++) {
    const a = (i / 56) * Math.PI * 2;
    const k = 1 + 0.09 * noise1(a * 1.3 + t * 0.09 + seed * 7, seed) + 0.05 * Math.sin(a * 3 + t * 0.15 + seed);
    d += (i ? "L" : "M") + (cx + Math.cos(a) * r * k * sx).toFixed(1) + " " + (cy + Math.sin(a) * r * k * 0.85).toFixed(1);
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
  cabAlarm = 0,
}) => {
  const flick = 0.92 + 0.08 * noise1(t * 0.7, 3);
  const h = heat;
  const B = TRUCK_BAY;
  // in-cab emergency light: alternating red / amber strobe
  const strobeRed = Math.floor(t / 4) % 2 === 0;
  const strobe = cabAlarm * (0.55 + 0.45 * Math.abs(Math.sin(t * 0.8)));

  const defs = (
    <defs>
      {/* white cab paint, graded for a night key light from above */}
      <linearGradient id="cabG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F1F2F4" />
        <stop offset="0.35" stopColor="#D3D7DC" />
        <stop offset="0.7" stopColor="#9AA0A8" />
        <stop offset="1" stopColor="#4E545C" />
      </linearGradient>
      <linearGradient id="cabSideShade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.32" />
        <stop offset="0.18" stopColor="#000" stopOpacity="0.05" />
        <stop offset="0.85" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.18" />
      </linearGradient>
      <linearGradient id="tglassG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#44505C" />
        <stop offset="0.4" stopColor="#1A2129" />
        <stop offset="1" stopColor="#090C10" />
      </linearGradient>
      <linearGradient id="tchromeG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F4F6F8" />
        <stop offset="0.5" stopColor="#9AA0A8" />
        <stop offset="1" stopColor="#E0E3E7" />
      </linearGradient>
      {/* navy corrugated container */}
      <linearGradient id="boxG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3E5274" />
        <stop offset="0.45" stopColor="#273752" />
        <stop offset="1" stopColor="#121A29" />
      </linearGradient>
      <linearGradient id="tankG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E9ECEF" />
        <stop offset="0.35" stopColor="#B9BEC5" />
        <stop offset="0.75" stopColor="#6E747C" />
        <stop offset="1" stopColor="#3A3F46" />
      </linearGradient>
      <radialGradient id="tdiscG" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#D4D8DE" />
        <stop offset="0.7" stopColor="#8E949C" />
        <stop offset="1" stopColor="#5A6068" />
      </radialGradient>
      {["f", "r1", "r2"].map((id) => (
        <radialGradient key={id} id={`ttyre-${id}`} cx="0.45" cy="0.4" r="0.6">
          <stop offset="0.6" stopColor="#1B1C1F" />
          <stop offset="1" stopColor="#0B0B0C" />
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
      <linearGradient id="taccentG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.gold} stopOpacity="0" />
        <stop offset="0.25" stopColor={C.gold} stopOpacity="1" />
        <stop offset="0.8" stopColor={C.goldL} stopOpacity="1" />
        <stop offset="1" stopColor={C.gold} stopOpacity="0" />
      </linearGradient>
      <radialGradient id="tcabAlarmG">
        <stop offset="0" stopColor={strobeRed ? "#FF3B2E" : "#FFA41A"} stopOpacity="0.95" />
        <stop offset="1" stopColor={strobeRed ? "#FF3B2E" : "#FFA41A"} stopOpacity="0" />
      </radialGradient>
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
        cy={B.y + 20}
        rx={110 * (0.45 + h)}
        ry={90 * (0.45 + h)}
        fill="url(#theatOuter)"
        opacity={(0.32 + 0.5 * thermal) * h * flick}
        filter="url(#tsofter)"
        style={{ mixBlendMode: "screen" }}
      />
      {/* heat glowing through the intake grille slits and under the cab */}
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={803} y={356 + i * 9.5} width={38} height={3.5} rx={1.5} fill={REAL.fireYellow} opacity={Math.min(1, h * 1.2) * (0.5 + 0.5 * flick)} />
      ))}
      <ellipse cx={812} cy={446} rx={34} ry={8} fill={REAL.fireOrange} opacity={Math.min(1, h) * 0.55 * flick} filter="url(#tsoft)" />
      {thermal > 0 && (
        <g opacity={thermal}>
          <ellipse cx={B.x} cy={B.y + 10} rx={48 * (0.3 + h)} ry={44 * (0.3 + h)} fill="url(#theatCore)" opacity={h} filter="url(#tsoft)" />
          {[1, 0.74, 0.5, 0.3].map((k, i) => (
            <path
              key={i}
              d={blob(B.x, B.y + 10, 100 * k * (0.35 + h * 0.9), t, i)}
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

  const ribs = Array.from({ length: 24 }, (_, i) => 44 + i * 29.5);

  return (
    <svg viewBox="0 0 1000 560" width="100%" height="100%" style={{ overflow: "visible", display: "block" }}>
      {defs}
      <ellipse cx={510} cy={543} rx={510} ry={14} fill="#000" opacity={0.8} filter="url(#tsoft)" />

      {beams && headlights > 0 && (
        <g opacity={headlights * flick} style={{ mixBlendMode: "screen" }}>
          <polygon points="1002,412 1900,320 1900,620" fill="url(#tbeamG)" />
        </g>
      )}

      <g transform={`translate(0 ${bob})`}>
        {/* ---------- ladder chassis + running gear ---------- */}
        <rect x={34} y={426} width={940} height={20} fill="#15171A" />
        <rect x={34} y={426} width={940} height={3} fill="#2C3136" />
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={60 + i * 66} cy={437} r={1.8} fill="#3A4047" />
        ))}
        {/* air tanks */}
        <rect x={500} y={452} width={52} height={28} rx={13} fill="#3E444B" />
        <rect x={500} y={458} width={52} height={3} fill="#5A616A" opacity={0.6} />
        {/* aluminium fuel tank with straps */}
        <rect x={566} y={450} width={128} height={46} rx={21} fill="url(#tankG)" />
        <rect x={588} y={448} width={7} height={50} rx={2} fill="#2A2E33" />
        <rect x={664} y={448} width={7} height={50} rx={2} fill="#2A2E33" />
        <circle cx={680} cy={460} r={4} fill="#5A616A" />
        {/* battery box + silencer */}
        <rect x={704} y={452} width={52} height={38} rx={3} fill="#17191C" stroke="#2C3136" strokeWidth={1.5} />
        <rect x={712} y={460} width={36} height={4} fill="#2C3136" />
        <rect x={640} y={500} width={110} height={10} rx={5} fill="#7A8189" />

        {/* ---------- corrugated container ---------- */}
        <rect x={24} y={160} width={738} height={262} fill="url(#boxG)" stroke="#0A0F18" strokeWidth={2} />
        {ribs.map((x) => (
          <g key={x}>
            <rect x={x} y={174} width={14} height={234} fill="#30425F" />
            <rect x={x} y={174} width={2.2} height={234} fill="#5A6F92" opacity={0.85} />
            <rect x={x + 14} y={174} width={2.5} height={234} fill="#0B111B" opacity={0.85} />
          </g>
        ))}
        {/* top + bottom rails, corner posts and castings */}
        <rect x={24} y={160} width={738} height={14} fill="#4B5F82" />
        <rect x={24} y={160} width={738} height={2.5} fill="#7486A6" />
        <rect x={24} y={406} width={738} height={16} fill="#18202E" />
        {[24, 750].map((x) => (
          <g key={x}>
            <rect x={x} y={160} width={12} height={262} fill="#1C2638" />
            <rect x={x + 2} y={164} width={8} height={10} rx={2} fill="#0A0F18" />
            <rect x={x + 2} y={408} width={8} height={10} rx={2} fill="#0A0F18" />
          </g>
        ))}
        {/* red/white reflective tape + amber side marker lamps */}
        {Array.from({ length: 29 }, (_, i) => (
          <rect key={i} x={40 + i * 24.5} y={410} width={21} height={6} fill={i % 2 ? "#ECECEC" : "#C8221A"} opacity={0.88} />
        ))}
        {[120, 300, 480, 660].map((x) => (
          <rect key={x} x={x} y={398} width={10} height={6} rx={2} fill="#F3A21E" opacity={0.95} />
        ))}
        {/* rear lights */}
        <rect x={26} y={372} width={8} height={22} rx={2} fill={REAL.tailRed} opacity={0.95} />


        {/* ---------- cab-over cab ---------- */}
        {/* cab body: high roof, raked windshield, stepped front */}
        <path
          d="M792 436 L792 238 Q792 208 818 205 L962 199 Q988 198 991 220 L998 330 L1003 404 L1003 436 Z"
          fill="url(#cabG)"
          stroke="#30353B"
          strokeWidth={2}
        />
        <path d="M792 436 L792 238 Q792 208 818 205 L962 199 Q988 198 991 220 L998 330 L1003 404 L1003 436 Z" fill="url(#cabSideShade)" />
        {/* roof cap line + amber roof marker lamps */}
        <path d="M800 222 Q806 214 820 213 L960 208" stroke="#B4B9C0" strokeWidth={2} fill="none" />
        {[900, 922, 944, 966].map((x) => (
          <rect key={x} x={x} y={192} width={12} height={6} rx={2} fill="#F3A21E" opacity={0.95} />
        ))}
        {/* sun visor */}
        <path d="M962 206 L1008 210 L1006 218 L966 216 Z" fill="#1A1D21" />
        {/* windshield edge (raked) */}
        <path d="M988 222 L996 222 L1002 330 L994 330 Z" fill="url(#tglassG)" />
        <path d="M990 226 L993 226 L998 310 L995 310 Z" fill="#FFFFFF" opacity={0.18} />
        {/* door + window */}
        <path d="M852 246 L980 240 L986 336 L990 434 L852 434 Z" fill="none" stroke="#6A7078" strokeWidth={2} />
        <path d="M864 258 L968 252 L974 334 L864 338 Z" fill="url(#tglassG)" stroke="#2A2E33" strokeWidth={2.5} />
        {/* interior hints: headrest + dashboard top (no person) */}
        <rect x={884} y={292} width={22} height={36} rx={8} fill="#07090C" opacity={0.85} />
        <path d="M940 330 L972 326" stroke="#07090C" strokeWidth={6} />
        <path d="M876 262 L900 261 L870 312 L866 312 Z" fill="#FFFFFF" opacity={0.08} />
        <rect x={940} y={356} width={22} height={5} rx={2} fill="url(#tchromeG)" />
        <path d="M852 342 L986 338" stroke="#FFFFFF" strokeWidth={1.2} opacity={0.35} />
        {/* mirrors */}
        <line x1={992} y1={258} x2={1014} y2={250} stroke="url(#tchromeG)" strokeWidth={4} />
        <rect x={1008} y={242} width={13} height={64} rx={4} fill="#1A1D21" stroke="#5A616A" strokeWidth={1.5} />
        <rect x={1008} y={312} width={13} height={26} rx={4} fill="#1A1D21" stroke="#5A616A" strokeWidth={1.5} />
        {/* rear-side air intake grille (engine heat shows here) */}
        <rect x={800} y={350} width={44} height={72} rx={5} fill="#24282D" stroke="#4A5058" strokeWidth={1.5} />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={803} y={356 + i * 9.5} width={38} height={3.5} rx={1.5} fill="#0A0B0C" />
        ))}
        {/* front fascia: grille, headlamp, indicator */}
        <rect x={994} y={338} width={10} height={62} rx={2} fill="#1A1D21" />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={995} y={343 + i * 10} width={8} height={3} fill="url(#tchromeG)" opacity={0.7} />
        ))}
        <rect x={992} y={402} width={14} height={18} rx={3} fill={headlights > 0.05 ? "#FFF6E6" : "#3A4047"} />
        <rect x={998} y={422} width={8} height={6} rx={2} fill="#F3A21E" />
        {/* bumper + steps */}
        <rect x={960} y={432} width={50} height={30} rx={4} fill="#3A3F46" />
        <rect x={960} y={432} width={50} height={3} fill="#6A7078" />
        <circle cx={1000} cy={450} r={4} fill="#C9CCD1" opacity={0.8} />
        <rect x={798} y={444} width={46} height={5} rx={2} fill="url(#tchromeG)" />
        <rect x={800} y={468} width={42} height={5} rx={2} fill="url(#tchromeG)" />
        <line x1={798} y1={440} x2={798} y2={474} stroke="#2C3136" strokeWidth={3} />
      </g>

      <Wheel cx={330} angle={wheelAngle} id="r1" />
      <Wheel cx={445} angle={wheelAngle} id="r2" />
      <Wheel cx={900} angle={wheelAngle} id="f" />

      {layer === "all" && heatG}

      {/* in-cab alarm / emergency light, seen through the window */}
      {cabAlarm > 0 && (
        <g transform={`translate(0 ${bob})`}>
          <clipPath id="tcabWin">
            <path d="M864 258 L968 252 L974 334 L864 338 Z" />
          </clipPath>
          {/* the strobe is a lamp inside the cab: brightest near the dash, falling off to the glass edges */}
          <g clipPath="url(#tcabWin)">
            <ellipse cx={938} cy={318} rx={70} ry={52} fill="url(#tcabAlarmG)" opacity={0.85 * strobe} />
            <ellipse cx={938} cy={318} rx={22} ry={16} fill="#FFF1E0" opacity={0.45 * strobe} />
          </g>
          <ellipse cx={920} cy={296} rx={90} ry={60} fill="url(#tcabAlarmG)" opacity={0.7 * strobe} filter="url(#tsofter)" style={{ mixBlendMode: "screen" }} />
        </g>
      )}

      {accent > 0 && (
        <g opacity={accent}>
          <rect x={799} y={350} width={3} height={72} fill="url(#taccentG)" />
          <rect x={794} y={350} width={12} height={72} fill="url(#taccentG)" filter="url(#tsoft)" opacity={0.6} />
        </g>
      )}

      {rim > 0 && (
        <g stroke={rimColor} strokeWidth={2} fill="none" strokeLinecap="round" opacity={rim} transform={`translate(0 ${bob})`}>
          <path d="M24 160 L762 160" opacity={0.45} />
          <path d="M792 238 Q792 208 818 205 L962 199 Q988 198 991 220" />
          <path d="M991 220 L998 330 L1003 404" opacity={0.85} />
          <path d="M960 432 L1010 432" opacity={0.6} />
          <path d="M566 452 L694 452" opacity={0.5} />
        </g>
      )}
      {rim > 0 && (
        <g stroke={rimColor} strokeWidth={1.6} fill="none" opacity={rim * 0.4}>
          <path d="M923 445 A 50 50 0 0 1 948 490" />
          <path d="M468 445 A 50 50 0 0 1 493 490" />
        </g>
      )}

      {headlights > 0 && (
        <g opacity={headlights * flick} style={{ mixBlendMode: "screen" }}>
          <circle cx={1000} cy={411} r={42} fill="url(#tlampG)" />
        </g>
      )}

      {overlay}
    </svg>
  );
};
