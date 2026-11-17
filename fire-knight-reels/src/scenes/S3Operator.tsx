import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, E, FONT, SAFE, ip, noise1, prog, rand } from "../fk/theme";
import { Mono, RevealLine, Slam } from "../fk/ui";

const PANEL = { x: SAFE.x0, y: 680, w: 820, h: 520 };
const SHOT0 = 12; // first shot starts
const SHOT = 26; // frames per shot

const TASKS = [
  "Khatra notice karna",
  "Dumper safely rokna",
  "Extinguisher tak pahunchna",
  "Akele response ki koshish",
];

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
      {hot && <path d={arc(cx, cy, r * 0.9, a0 + (a1 - a0) * 0.78, a1)} stroke={C.ember} strokeWidth={10} fill="none" />}
      {Array.from({ length: 13 }, (_, i) => {
        const a = a0 + ((a1 - a0) * i) / 12;
        const [x0, y0] = polar(cx, cy, r * 0.74, a);
        const [x1, y1] = polar(cx, cy, r * (i % 3 === 0 ? 0.62 : 0.67), a);
        return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke="#7A8189" strokeWidth={i % 3 === 0 ? 4 : 2} />;
      })}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={hot && v > 0.78 ? C.ember : C.white} strokeWidth={6} strokeLinecap="round" />
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
              <circle r={36} fill={C.ember} opacity={0.25} filter="url(#glow)" />
              <path d="M-6 -26 L6 -26 L6 8 A14 14 0 1 1 -6 8 Z" fill="none" stroke={C.ember} strokeWidth={5} />
              <path d="M-26 22 Q-13 14 0 22 T26 22" fill="none" stroke={C.ember} strokeWidth={4} />
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
        <circle r={70} fill="#111315" stroke={parked ? C.ember : "#2C3136"} strokeWidth={5} />
        {parked && <circle r={84} fill={C.ember} opacity={0.18} filter="url(#glow)" />}
        <text y={30} textAnchor="middle" fontFamily={FONT.slam} fontSize={92} fill={parked ? C.ember : "#3A4047"}>
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
    <rect x={-58} y={92} width={116} height={78} fill="#F1EFEA" opacity={0.9} />
    <rect x={-44} y={108} width={88} height={8} rx={3} fill="#77736C" />
    <rect x={-44} y={126} width={60} height={6} rx={3} fill="#9A958D" />
    <rect x={-44} y={142} width={72} height={6} rx={3} fill="#9A958D" />
    <path d="M-40 14 Q-46 150 -40 286" stroke="#FFFFFF" strokeOpacity={0.28} strokeWidth={8} fill="none" />
    {/* neck + valve */}
    <rect x={-22} y={-22} width={44} height={26} rx={4} fill="#3A4047" />
    <rect x={-34} y={-48} width={68} height={28} rx={6} fill="#5A616A" />
    {/* gauge */}
    <circle cx={-46} cy={-34} r={18} fill="#F1EFEA" stroke="#3A4047" strokeWidth={4} />
    <path d="M-46 -34 L-38 -44" stroke={C.ok} strokeWidth={3} />
    {/* lever + handle */}
    <path d="M-30 -52 L60 -70 L64 -60 L-24 -42 Z" fill="#7A8189" />
    <path d="M-30 -38 L56 -36 L56 -28 L-30 -30 Z" fill="#4A5058" />
    {/* pin */}
    <circle cx={10} cy={-44} r={9} fill="none" stroke={C.heat} strokeWidth={3} />
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
      <ellipse cx={540} cy={250} rx={240} ry={190} fill={C.ember} opacity={0.38 * glow} filter="url(#glowBig)" />
      <ellipse cx={540} cy={250} rx={110} ry={80} fill={C.heat} opacity={0.45 * glow} filter="url(#glowBig)" />
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
  const idx = Math.max(0, Math.min(3, Math.floor((f - SHOT0) / SHOT)));
  const panelIn = prog(f, 4, 14, E.out);
  const zoomOut = prog(f, 108, 120, E.in);

  const shots = [0, 1, 2, 3].map((i) => {
    const a = SHOT0 + i * SHOT;
    const lt = f - a;
    if (lt < -1 || lt > SHOT + 4) return null;
    const p = Math.max(0, Math.min(1, lt / SHOT));
    const inP = prog(lt, 1, 7, E.out);
    const outP = i < 3 ? prog(lt, SHOT - 2, SHOT + 2, E.in) : 0;
    const style: React.CSSProperties = {
      position: "absolute",
      inset: 0,
      translate: `${(1 - inP) * 140 - outP * 160}px 0`,
      filter: inP < 1 || outP > 0 ? `blur(${(1 - inP) * 14 + outP * 18}px)` : undefined,
      opacity: Math.min(inP * 1.5, 1 - outP),
      scale: `${1 + p * 0.06}`,
    };
    return (
      <div key={i} style={style}>
        {i === 0 && <ShotGauges p={p} f={f} />}
        {i === 1 && <ShotStop p={p} f={f} />}
        {i === 2 && <ShotExt p={p} />}
        {i === 3 && <ShotAttempt p={p} f={f} />}
      </div>
    );
  });

  const secs = 21 + Math.floor(f / 4);
  const clock = `02:0${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")} AM`;
  const shake = idx === 3 ? noise1(f * 2, 9) * 2 : 0;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 700px 600px at 540px 940px, #1B1E22 0%, ${C.black} 75%)` }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="dialG" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#1E2226" />
            <stop offset="1" stopColor="#0C0D0F" />
          </radialGradient>
          <linearGradient id="extG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#B83A10" />
            <stop offset="0.35" stopColor={C.ember} />
            <stop offset="1" stopColor="#7A260A" />
          </linearGradient>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="glowBig" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>
      </svg>

      {/* headline */}
      <div style={{ position: "absolute", left: SAFE.x0, top: 388 }}>
        <Slam at={2} size={168}>
          Ek operator.
        </Slam>
        <div style={{ height: 14 }} />
        <RevealLine
          words={[{ w: "Chaar", c: C.ember }, "zimmedariyaan."]}
          start={22}
          stagger={4}
          style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 64, color: C.white }}
        />
      </div>

      {/* macro panel */}
      <div
        style={{
          position: "absolute",
          left: PANEL.x,
          top: PANEL.y,
          width: PANEL.w,
          height: PANEL.h,
          borderRadius: 26,
          overflow: "hidden",
          background: "#0F1113",
          border: `1.5px solid ${C.line}`,
          opacity: panelIn,
          scale: `${(0.94 + 0.06 * panelIn) * (1 + zoomOut * 0.35)}`,
          translate: `${shake}px ${shake * 0.6}px`,
          filter: zoomOut > 0 ? `brightness(${1 + zoomOut * 0.8})` : undefined,
        }}
      >
        {shots}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)",
          }}
        />
        <div style={{ position: "absolute", left: 22, top: 18 }}>
          <Mono style={{ fontSize: 19, color: C.ash }}>
            <span style={{ color: C.ember }}>●</span> {clock}
          </Mono>
        </div>
      </div>

      {/* task label */}
      <div style={{ position: "absolute", left: SAFE.x0, top: 1226, height: 64, width: 820, overflow: "hidden" }}>
        {[0, 1, 2, 3].map((i) => {
          const a = SHOT0 + i * SHOT;
          const inP = prog(f, a + 3, a + 9, E.out);
          const outP = i < 3 ? prog(f, a + SHOT - 1, a + SHOT + 3, E.in) : 0;
          if (inP <= 0 || outP >= 1) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                display: "flex",
                alignItems: "baseline",
                gap: 18,
                translate: `0 ${(1 - inP) * 64 - outP * 64}px`,
              }}
            >
              <Mono style={{ fontSize: 30, color: C.ember, letterSpacing: "0.06em" }}>0{i + 1}</Mono>
              <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 46, color: C.white, whiteSpace: "nowrap" }}>
                {TASKS[i]}
              </div>
            </div>
          );
        })}
      </div>

      {/* tracker */}
      <div style={{ position: "absolute", left: SAFE.x0, top: 1304, width: 820, display: "flex", gap: 12, opacity: panelIn }}>
        {[0, 1, 2, 3].map((i) => {
          const a = SHOT0 + i * SHOT;
          const v = prog(f, a, a + SHOT);
          return (
            <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: C.steel2, overflow: "hidden" }}>
              <div style={{ width: `${v * 100}%`, height: "100%", background: i === 3 ? C.ember : C.white }} />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.x0,
          top: 1336,
          width: 820,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: panelIn,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: 15, background: "#4A5058" }} />
          <Mono style={{ fontSize: 22, color: C.white }}>Operator × 1</Mono>
        </div>
        <Mono style={{ fontSize: 22, color: idx === 3 ? C.ember : C.ash }}>Tasks {Math.min(4, Math.max(0, Math.floor((f - SHOT0) / SHOT) + 1))}/4</Mono>
      </div>
    </AbsoluteFill>
  );
};
