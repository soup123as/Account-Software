import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, E, FONT, REAL, SAFE, ip, noise1, prog, rand } from "../fk/theme";
import { Hit, Line, ScanReveal, Stack } from "../fk/ui";

/** 2x2 grid of tasks that builds up - the load on one person becomes visible. */
const GRID = { x: SAFE.x0, y: 680, tw: 400, th: 300, gap: 20 };
const TILE0 = 22; // first tile
const TILE = 22; // frames between tiles
const TILE_LIFE = 60; // each tile animates for this long, then holds its end state

const TASKS = ["Khatra dekhna", "Dumper rokna", "Extinguisher lana", "Aag se ladna"];

/* ---------------- shot illustrations (viewBox 820 x 520) ---------------- */

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
};
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};

const Gauge: React.FC<{ cx: number; cy: number; r: number; v: number; hot?: boolean; label: string }> = ({
  cx,
  cy,
  r,
  v,
  hot = true,
  label,
}) => {
  const a0 = 150;
  const a1 = 390;
  const ang = a0 + (a1 - a0) * v;
  const [nx, ny] = polar(cx, cy, r * 0.82, ang);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 18} fill="#0E1012" stroke="#2C3136" strokeWidth={3} />
      <circle cx={cx} cy={cy} r={r + 6} fill="url(#dialG)" />
      <path d={arc(cx, cy, r * 0.9, a0, a1)} stroke="#2E3338" strokeWidth={10} fill="none" />
      {hot && <path d={arc(cx, cy, r * 0.9, a0 + (a1 - a0) * 0.78, a1)} stroke={REAL.lampRed} strokeWidth={10} fill="none" />}
      {Array.from({ length: 13 }, (_, i) => {
        const a = a0 + ((a1 - a0) * i) / 12;
        const [x0, y0] = polar(cx, cy, r * 0.74, a);
        const [x1, y1] = polar(cx, cy, r * (i % 3 === 0 ? 0.62 : 0.67), a);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#7A8189" strokeWidth={i % 3 === 0 ? 4 : 2} />;
      })}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={hot && v > 0.78 ? REAL.lampRed : C.white} strokeWidth={6} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={16} fill="#2A2E33" stroke="#4A5058" strokeWidth={3} />
      <text x={cx} y={cy + r * 0.48} textAnchor="middle" fill={C.ash} fontFamily={FONT.mono} fontWeight={700} fontSize={20} letterSpacing="3">
        {label}
      </text>
    </g>
  );
};

const ShotGauges: React.FC<{ p: number; f: number }> = ({ p, f }) => {
  const v = ip(p, [0, 1], [0.42, 0.93], E.inOut) + noise1(f * 0.8, 4) * 0.01;
  const blink = v > 0.74 && f % 10 < 6;
  return (
    <svg viewBox="0 0 820 520" width="100%" height="100%">
      <Gauge cx={300} cy={280} r={170} v={v} label="ENGINE TEMP" />
      {/* warning lamps */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${590} ${150 + i * 112})`}>
          <rect x={-56} y={-44} width={112} height={88} rx={14} fill="#111315" stroke="#2C3136" strokeWidth={2} />
          {i === 0 ? (
            <g opacity={blink ? 1 : 0.25}>
              <circle r={36} fill={REAL.lampRed} opacity={0.3} filter="url(#glow)" />
              <path d="M-6 -26 L6 -26 L6 8 A14 14 0 1 1 -6 8 Z" fill="none" stroke={REAL.lampRed} strokeWidth={5} />
              <path d="M-26 22 Q-13 14 0 22 T26 22" fill="none" stroke={REAL.lampRed} strokeWidth={4} />
            </g>
          ) : i === 1 ? (
            <path d="M-28 10 L-6 -6 L20 -6 L26 -14 L32 -4 L22 4 L22 16 L-28 16 Z" fill="none" stroke="#3A4047" strokeWidth={4} />
          ) : (
            <g stroke="#3A4047" strokeWidth={4} fill="none">
              <rect x={-26} y={-16} width={52} height={34} rx={4} />
              <path d="M-14 -16 v-8 M14 -16 v-8 M-16 2 h10 M8 2 h12 M14 -4 v12" />
            </g>
          )}
        </g>
      ))}
    </svg>
  );
};

const ShotStop: React.FC<{ p: number; f: number }> = ({ p, f }) => {
  const v = ip(p, [0, 0.8], [0.55, 0], E.inOut);
  const parked = p > 0.72;
  return (
    <svg viewBox="0 0 820 520" width="100%" height="100%">
      <Gauge cx={330} cy={280} r={190} v={v} hot={false} label="SPEED" />
      {/* road streaks slowing */}
      {Array.from({ length: 6 }, (_, i) => {
        const sp = ip(p, [0, 0.8], [40, 0], E.inOut);
        const x = ((i * 160 - f * sp) % 960 + 960) % 960 - 80;
        return <rect key={i} x={x} y={500} width={80} height={6} rx={3} fill="#2A2E33" />;
      })}
      <g transform="translate(650 200)">
        <circle r={70} fill="#111315" stroke={parked ? REAL.lampRed : "#2C3136"} strokeWidth={5} />
        {parked && <circle r={84} fill={REAL.lampRed} opacity={0.22} filter="url(#glow)" />}
        <text y={30} textAnchor="middle" fontFamily={FONT.slam} fontSize={92} fill={parked ? REAL.lampRed : "#3A4047"}>
          P
        </text>
      </g>
      <text x={650} y={330} textAnchor="middle" fill={parked ? C.white : C.ash} fontFamily={FONT.mono} fontWeight={700} fontSize={22} letterSpacing="3">
        PARK BRAKE
      </text>
    </svg>
  );
};

const Extinguisher: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* hose */}
    <path d="M38 -10 C 110 0, 120 120, 92 220" stroke="#111214" strokeWidth={13} fill="none" strokeLinecap="round" />
    <rect x={80} y={212} width={26} height={40} rx={5} fill="#1A1C1E" transform="rotate(-8 92 220)" />
    {/* body */}
    <rect x={-58} y={0} width={116} height={300} rx={46} fill="url(#extG)" />
    <rect x={-58} y={92} width={116} height={78} fill="#F4F2EE" opacity={0.95} />
    <rect x={-44} y={108} width={88} height={8} rx={3} fill="#3A3A3A" />
    <rect x={-44} y={126} width={60} height={6} rx={3} fill="#8A8A8A" />
    <rect x={-44} y={142} width={72} height={6} rx={3} fill="#8A8A8A" />
    <path d="M-40 14 Q-46 150 -40 286" stroke="#FFFFFF" strokeOpacity={0.28} strokeWidth={8} fill="none" />
    {/* neck + valve */}
    <rect x={-22} y={-22} width={44} height={26} rx={4} fill="#3A4047" />
    <rect x={-34} y={-48} width={68} height={28} rx={6} fill="#5A616A" />
    {/* gauge */}
    <circle cx={-46} cy={-34} r={18} fill="#FAFAFA" stroke="#3A4047" strokeWidth={4} />
    <path d="M-46 -34 L-38 -44" stroke={REAL.gaugeGreen} strokeWidth={3} />
    {/* lever + handle */}
    <path d="M-30 -52 L60 -70 L64 -60 L-24 -42 Z" fill="#7A8189" />
    <path d="M-30 -38 L56 -36 L56 -28 L-30 -30 Z" fill="#4A5058" />
    {/* pin */}
    <circle cx={10} cy={-44} r={9} fill="none" stroke="#E8C547" strokeWidth={3} />
  </g>
);

const ShotExt: React.FC<{ p: number }> = ({ p }) => {
  const strap = prog(p, 0.15, 0.35, E.out);
  const lift = prog(p, 0.35, 0.95, E.out);
  return (
    <svg viewBox="0 0 820 520" width="100%" height="100%">
      {/* ladder rungs behind (we are on the dumper's access ladder) */}
      <g stroke="#23272B" strokeWidth={10} strokeLinecap="round">
        <line x1={600} y1={-20} x2={760} y2={560} />
        <line x1={700} y1={-20} x2={860} y2={560} />
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={600 + 22 * i + 10} y1={i * 80 + 20} x2={700 + 22 * i + 10} y2={i * 80 + 20} strokeWidth={8} />
        ))}
      </g>
      {/* mounting plate + bracket */}
      <rect x={220} y={60} width={260} height={420} rx={14} fill="#15181B" stroke="#2C3136" strokeWidth={3} />
      {[90, 450].map((y) => (
        <g key={y}>
          <circle cx={244} cy={y} r={6} fill="#3A4047" />
          <circle cx={456} cy={y} r={6} fill="#3A4047" />
        </g>
      ))}
      <g transform={`translate(${lift * 34} ${-lift * 70}) rotate(${-lift * 7} 350 300)`}>
        <Extinguisher x={350} y={130} s={0.95} />
      </g>
      {/* strap swinging open */}
      <g transform={`rotate(${strap * 70} 250 290)`}>
        <rect x={250} y={282} width={200} height={18} rx={6} fill="#2A2E33" stroke="#4A5058" strokeWidth={2} />
        <rect x={430} y={276} width={28} height={30} rx={5} fill="#5A616A" />
      </g>
    </svg>
  );
};

const ShotAttempt: React.FC<{ p: number; f: number }> = ({ p, f }) => {
  const glow = 0.75 + 0.25 * Math.sin(f * 0.6) + noise1(f * 0.9, 8) * 0.1;
  const spray = prog(p, 0.15, 0.35);
  return (
    <svg viewBox="0 0 820 520" width="100%" height="100%">
      {/* engine bay grille with heat behind */}
      <rect x={260} y={40} width={520} height={440} rx={10} fill="#0B0C0D" />
      <ellipse cx={540} cy={250} rx={240} ry={190} fill={REAL.fireOrange} opacity={0.42 * glow} filter="url(#glowBig)" />
      <ellipse cx={540} cy={250} rx={110} ry={80} fill={REAL.fireYellow} opacity={0.45 * glow} filter="url(#glowBig)" />
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} x={272} y={56 + i * 38} width={496} height={18} rx={4} fill="#1C1F22" stroke="#2C3136" strokeWidth={2} />
      ))}
      <rect x={260} y={40} width={520} height={440} rx={10} fill="none" stroke="#3A4047" strokeWidth={4} />
      {/* spray cone */}
      {Array.from({ length: 70 }, (_, i) => {
        const life = ((f * 0.07 + rand(i * 3.3)) % 1) * spray;
        const ang = -0.62 + (rand(i * 1.7) - 0.5) * 0.5;
        const d = 60 + life * 420;
        const x = 120 + Math.cos(ang) * d;
        const y = 430 + Math.sin(ang) * d;
        return <circle key={i} cx={x} cy={y} r={2 + life * 5} fill="#F4F4F2" opacity={(1 - life) * 0.55 * spray} />;
      })}
      {/* nozzle in hand-held position */}
      <g transform="rotate(-36 110 440)">
        <rect x={40} y={426} width={110} height={28} rx={8} fill="#1A1C1E" />
        <rect x={140} y={430} width={26} height={20} rx={4} fill="#3A4047" />
      </g>
      <path d="M-20 520 C 30 480, 60 470, 80 466" stroke="#111214" strokeWidth={13} fill="none" />
    </svg>
  );
};

/* ---------------- scene ---------------- */

export const S3Operator: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > 100 ? noise1(f * 2, 9) * 1.5 : 0;
  const dive = prog(f, 122, 135, E.in); // dive into tile 4 (engine bay) for the next scene

  const tiles = [0, 1, 2, 3].map((i) => {
    const a = TILE0 + i * TILE;
    const inP = prog(f, a, a + 12, E.out);
    if (inP <= 0) return null;
    const p = Math.min(1, Math.max(0, (f - a) / TILE_LIFE));
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = GRID.x + col * (GRID.tw + GRID.gap);
    const y = GRID.y + row * (GRID.th + GRID.gap);
    const active = f < a + TILE + 6 || i === 3;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: GRID.tw,
          height: GRID.th,
          borderRadius: 22,
          overflow: "hidden",
          background: "#0A0B0C",
          border: `1.5px solid ${active ? "rgba(240,178,66,0.55)" : "rgba(250,250,250,0.08)"}`,
          opacity: inP,
          translate: `0 ${(1 - inP) * 40}px`,
          scale: `${0.94 + 0.06 * inP}`,
          filter: inP < 1 ? `blur(${(1 - inP) * 10}px)` : undefined,
        }}
      >
        <div style={{ position: "absolute", inset: "0 0 46px 0" }}>
          {i === 0 && <ShotGauges p={p} f={f} />}
          {i === 1 && <ShotStop p={p} f={f} />}
          {i === 2 && <ShotExt p={p} />}
          {i === 3 && <ShotAttempt p={p} f={f} />}
        </div>
        <div
          style={{
            position: "absolute",
            left: 18,
            bottom: 14,
            display: "flex",
            gap: 10,
            alignItems: "baseline",
            fontFamily: FONT.sans,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 30, color: C.gold }}>0{i + 1}</span>
          <span style={{ fontWeight: 600, fontSize: 30, color: C.fa }}>{TASKS[i]}</span>
        </div>
      </div>
    );
  });

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 700px 600px at 540px 980px, #15171A 0%, ${C.black} 72%)` }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="dialG" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#1E2226" />
            <stop offset="1" stopColor="#0C0D0F" />
          </radialGradient>
          <linearGradient id="extG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={REAL.extRedLo} />
            <stop offset="0.3" stopColor={REAL.extRedHi} />
            <stop offset="0.55" stopColor={REAL.extRed} />
            <stop offset="1" stopColor={REAL.extRedLo} />
          </linearGradient>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="glowBig" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>
      </svg>

      <Stack top={380}>
        <ScanReveal at={2} out={122}>
          <Hit w={["EK", "OPERATOR."]} />
          <Line w={[{ w: "Chaar", c: C.gold }, "zimmedariyaan."]} />
        </ScanReveal>
      </Stack>

      <AbsoluteFill
        style={{
          translate: `${shake}px ${shake * 0.5}px`,
          transformOrigin: `${GRID.x + GRID.tw * 1.5 + GRID.gap}px ${GRID.y + GRID.th * 1.5 + GRID.gap}px`,
          scale: `${1 + dive * 0.5}`,
          opacity: 1 - dive * 0.6,
        }}
      >
        {tiles}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
