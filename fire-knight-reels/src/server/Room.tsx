import React from "react";
import { C, REAL, noise1, rand } from "../fk/theme";
import { Flame, Mist, Smoke } from "../shop/fx";

/**
 * An office server room at night (world = frame coordinates at zoom 1, about 255 px = 1 m).
 * Back wall x 80-1000, y 700-1465 (3 m). Three 42U racks (600 x 2000 mm) stand on a raised floor:
 * servers, network (patch panel, switches, patch cords) and storage. A ladder cable tray runs above them.
 * On the right, a wall-mounted electrical distribution panel - the thing that overheats (HOT).
 * A smoke detector hangs from the grid ceiling (DET) and a red sounder-beacon is on the wall (HOOT).
 * The Comodo sits on the wall above the panel (COMODO): black cylinder in a silver cradle, antenna,
 * pressure gauge, two nozzles down, sensor module underneath - drawn after the site render.
 * Colours are the real ones; the night is a darkness pass plus the actual light sources.
 */
export const DET = { x: 430, y: 588 };
export const HOOT = { x: 640, y: 800 };
export const RACKS = [
  { x: 130, kind: "server" as const },
  { x: 290, kind: "network" as const },
  { x: 450, kind: "storage" as const },
];
export const RACK = { w: 156, top: 950, bottom: 1465 };
export const PANEL = { x0: 700, x1: 900, y0: 990, y1: 1262 };
export const HOT = { x: 800, y: 1244 };
export const COMODO = { x: 800, y: 880, nozzles: [742, 858], ny: 916 };

export type RoomProps = {
  t: number;
  alarm?: number; // detector LED + sounder strobe
  heat?: number; // panel overheating glow
  flame?: number;
  smoke?: number;
  ok?: [number, number, number]; // LED health per rack, 1 = normal, 0 = dark
  comodo?: number; // unit installed
  outline?: number; // gold dashed mount outline (where the unit would go)
  sense?: number;
  mist?: number;
  spot?: { x: number; y: number; r: number } | null;
  hl?: number;
};

const U = 12; // one rack unit in px

const LedDot: React.FC<{ x: number; y: number; c: string; o: number; r?: number }> = ({ x, y, c, o, r = 1.9 }) =>
  o <= 0.02 ? null : (
    <g>
      <circle cx={x} cy={y} r={r * 3.2} fill={c} opacity={o * 0.22} />
      <circle cx={x} cy={y} r={r} fill={c} opacity={o} />
    </g>
  );

/** Colour and brightness of one equipment LED for the rack's health. */
const led = (seed: number, t: number, ok: number, base: string) => {
  const blink = Math.sin(t * (0.18 + rand(seed) * 0.5) + rand(seed + 1) * 9) > -0.2 + rand(seed + 2) * 0.9 ? 1 : 0.18;
  if (ok <= 0.02) return { c: base, o: 0 };
  if (ok < 0.34) return rand(seed + 3) < 0.25 ? { c: "#FF3B2F", o: 0.9 * blink } : { c: base, o: 0 };
  if (ok < 0.67) return rand(seed + 4) < 0.6 ? { c: "#FFB020", o: 0.95 * blink } : { c: base, o: 0.5 * blink };
  return { c: base, o: blink };
};

/** The equipment behind the mesh door (no lights; LEDs are drawn after the darkness pass). */
const RackBody: React.FC<{ x: number; kind: "server" | "network" | "storage" }> = ({ x, kind }) => {
  const rows: React.ReactNode[] = [];
  const ix = x + 14;
  const iw = RACK.w - 28;
  let y = RACK.top + 22;
  let k = 0;
  const unit = (h: number, node: React.ReactNode) => {
    rows.push(
      <g key={k++}>
        <rect x={ix} y={y} width={iw} height={h - 2} rx={1.5} fill="#1b1e22" />
        <rect x={ix} y={y} width={iw} height={1.2} fill="#fff" opacity={0.1} />
        {node}
      </g>,
    );
    y += h;
  };
  if (kind === "server") {
    for (let i = 0; i < 17; i++) {
      if (i === 5 || i === 11) {
        unit(U, <rect x={ix + 4} y={y + 4} width={iw - 8} height={2} fill="#0c0d0f" />);
        continue;
      }
      const yy = y;
      unit(
        U * 2,
        <g>
          {[0, 1, 2, 3].map((d) => (
            <rect key={d} x={ix + 6 + d * 19} y={yy + 4} width={16} height={U * 2 - 10} rx={1} fill="#101214" stroke="#2c3036" strokeWidth={0.8} />
          ))}
          <rect x={ix + 86} y={yy + 5} width={22} height={5} rx={1} fill="#0c0d0f" />
        </g>,
      );
    }
  } else if (kind === "network") {
    // patch panel, switches and the patch cords between them, then servers below
    const y0 = y;
    unit(
      U * 2,
      <g>
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={ix + 6 + i * 9.6} y={y0 + 5} width={7} height={6} fill="#0b0c0d" stroke="#3a3f45" strokeWidth={0.6} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={`b${i}`} x={ix + 6 + i * 9.6} y={y0 + 13} width={7} height={6} fill="#0b0c0d" stroke="#3a3f45" strokeWidth={0.6} />
        ))}
      </g>,
    );
    for (let s = 0; s < 3; s++) {
      const ys = y;
      unit(
        U * 1.5,
        <g>
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={ix + 6 + i * 9.6} y={ys + 7} width={7} height={6} fill="#0b0c0d" />
          ))}
        </g>,
      );
      unit(U * 0.5, null);
    }
    for (let i = 0; i < 12; i++) {
      const yy = y;
      unit(
        U * 2,
        <g>
          {[0, 1, 2].map((d) => (
            <rect key={d} x={ix + 6 + d * 19} y={yy + 4} width={16} height={U * 2 - 10} rx={1} fill="#101214" stroke="#2c3036" strokeWidth={0.8} />
          ))}
        </g>,
      );
    }
  } else {
    for (let i = 0; i < 8; i++) {
      const yy = y;
      unit(
        U * 4,
        <g>
          {Array.from({ length: 12 }).map((_, d) => (
            <rect key={d} x={ix + 5 + d * 9.9} y={yy + 4} width={8} height={U * 4 - 10} rx={1} fill="#111316" stroke="#2f343a" strokeWidth={0.7} />
          ))}
        </g>,
      );
      if (i === 3) unit(U, null);
    }
  }
  const cords =
    kind === "network"
      ? ["#2F7BE0", "#E8C22A", "#2F7BE0", "#D94A3A", "#E8C22A", "#2F7BE0", "#39A860"].map((c, i) => {
          const xa = ix + 10 + i * 15.5;
          const xb = ix + 14 + ((i * 5) % 11) * 9.6;
          const yb = RACK.top + 22 + U * 2 + 10 + (i % 3) * U * 2;
          return <path key={i} d={`M${xa} ${RACK.top + 30} C ${xa - 6} ${RACK.top + 62 + i * 3}, ${xb + 8} ${yb - 26}, ${xb} ${yb}`} stroke={c} strokeWidth={2.4} fill="none" opacity={0.95} />;
        })
      : null;
  return (
    <g>
      <rect x={x - 3} y={RACK.top - 4} width={RACK.w + 6} height={RACK.bottom - RACK.top + 4} fill="#000" opacity={0.45} />
      <rect x={x} y={RACK.top} width={RACK.w} height={RACK.bottom - RACK.top} rx={3} fill="url(#rmRack)" />
      <rect x={x + 8} y={RACK.top + 14} width={RACK.w - 16} height={RACK.bottom - RACK.top - 30} fill="#08090a" />
      {rows}
      {cords}
      {/* perforated mesh door, then the frame, handle and top cap */}
      <rect x={x + 8} y={RACK.top + 14} width={RACK.w - 16} height={RACK.bottom - RACK.top - 30} fill="url(#rmMesh)" opacity={0.34} />
      <rect x={x + 8} y={RACK.top + 14} width={RACK.w - 16} height={RACK.bottom - RACK.top - 30} fill="none" stroke="#2a2d31" strokeWidth={2} />
      <rect x={x} y={RACK.top} width={3} height={RACK.bottom - RACK.top} fill="#fff" opacity={0.16} />
      <rect x={x} y={RACK.top} width={RACK.w} height={3} fill="#fff" opacity={0.2} />
      <rect x={x + RACK.w - 13} y={RACK.top + 236} width={5} height={46} rx={2} fill="#3a3e44" />
      <rect x={x + RACK.w - 13} y={RACK.top + 236} width={1.5} height={46} fill="#fff" opacity={0.35} />
      <rect x={x + 2} y={RACK.bottom - 12} width={RACK.w - 4} height={12} fill="#060607" />
    </g>
  );
};

/** The LEDs of one rack, bright on top of the darkness. */
const RackLeds: React.FC<{ x: number; kind: "server" | "network" | "storage"; t: number; ok: number; r: number }> = ({ x, kind, t, ok, r }) => {
  const dots: React.ReactNode[] = [];
  const ix = x + 14;
  const push = (px: number, py: number, base: string, s: number) => {
    const l = led(s + r * 1000, t, ok, base);
    dots.push(<LedDot key={dots.length} x={px} y={py} c={l.c} o={l.o} />);
  };
  let y = RACK.top + 22;
  if (kind === "server") {
    for (let i = 0; i < 17; i++) {
      if (i === 5 || i === 11) {
        y += U;
        continue;
      }
      push(ix + 116, y + 8, "#35E06A", i * 3);
      push(ix + 122, y + 8, "#4FA8FF", i * 3 + 1);
      push(ix + 116, y + 16, "#35E06A", i * 3 + 2);
      y += U * 2;
    }
  } else if (kind === "network") {
    y += U * 2;
    for (let s = 0; s < 3; s++) {
      for (let i = 0; i < 12; i++) push(ix + 9.5 + i * 9.6, y + 4, i % 4 === 3 ? "#FFB020" : "#35E06A", s * 20 + i);
      y += U * 2;
    }
    for (let i = 0; i < 12; i++) {
      push(ix + 116, y + 8, "#35E06A", 80 + i * 2);
      push(ix + 122, y + 8, "#4FA8FF", 81 + i * 2);
      y += U * 2;
    }
  } else {
    for (let i = 0; i < 8; i++) {
      for (let d = 0; d < 12; d++) push(ix + 9 + d * 9.9, y + U * 4 - 9, "#35E06A", i * 13 + d);
      y += U * 4 + (i === 3 ? U : 0);
    }
  }
  return <g>{dots}</g>;
};

/** Wall-mounted distribution panel: grey steel door, lamps, meter, warning label, louvres at the bottom. */
const Panel: React.FC<{ heat: number; t: number }> = ({ heat, t }) => {
  const { x0, x1, y0, y1 } = PANEL;
  const w = x1 - x0;
  return (
    <g>
      <rect x={x0 + 8} y={y0 + 10} width={w} height={y1 - y0} fill="#000" opacity={0.4} />
      {/* conduits down to the floor */}
      {[x0 + 46, x0 + 78, x1 - 52].map((cx) => (
        <g key={cx}>
          <rect x={cx} y={y1} width={16} height={1465 - y1} fill="#7d8388" />
          <rect x={cx} y={y1} width={4} height={1465 - y1} fill="#fff" opacity={0.3} />
          <rect x={cx - 3} y={y1 + 60} width={22} height={8} rx={2} fill="#5b6065" />
        </g>
      ))}
      <rect x={x0} y={y0} width={w} height={y1 - y0} rx={5} fill="#70767b" />
      <rect x={x0 + 7} y={y0 + 7} width={w - 14} height={y1 - y0 - 14} rx={3} fill="url(#rmPanel)" />
      <rect x={x0 + 7} y={y0 + 7} width={w - 14} height={3} fill="#fff" opacity={0.45} />
      {/* hinges, lock */}
      {[y0 + 40, y1 - 54].map((hy) => (
        <rect key={hy} x={x0 + 2} y={hy} width={8} height={22} rx={2} fill="#4c5156" />
      ))}
      <rect x={x1 - 30} y={y0 + 120} width={12} height={34} rx={3} fill="#2a2d30" />
      <circle cx={x1 - 24} cy={y0 + 130} r={3} fill="#b9bec3" />
      {/* indicator lamps R Y B */}
      {["#E3281C", "#F2C230", "#2F7BE0"].map((c, i) => (
        <g key={c}>
          <circle cx={x0 + 46 + i * 34} cy={y0 + 38} r={9} fill="#2b2e31" />
          <circle cx={x0 + 46 + i * 34} cy={y0 + 38} r={6.5} fill={c} opacity={0.9} />
          <circle cx={x0 + 44 + i * 34} cy={y0 + 36} r={2} fill="#fff" opacity={0.6} />
        </g>
      ))}
      {/* meter window */}
      <rect x={x0 + 34} y={y0 + 66} width={92} height={46} rx={3} fill="#15171a" />
      <text x={x0 + 80} y={y0 + 98} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={700} fontSize={22} fill="#FF9A2A" opacity={0.9}>
        415 V
      </text>
      {/* warning label */}
      <g transform={`translate(${x0 + 80} ${y0 + 168})`}>
        <polygon points="0,-26 26,20 -26,20" fill="#F2C230" stroke="#1a1a1a" strokeWidth={3} strokeLinejoin="round" />
        <polygon points="3,-12 -7,6 0,6 -3,16 8,-2 1,-2" fill="#1a1a1a" />
      </g>
      {/* louvres */}
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          <rect x={x0 + 30} y={y1 - 68 + i * 9} width={w - 60} height={4.5} rx={2} fill="#3f4449" />
          <rect x={x0 + 30} y={y1 - 68 + i * 9} width={w - 60} height={1.2} fill="#fff" opacity={0.25} />
        </g>
      ))}
      {/* overheating: the lower door discolours and glows */}
      {heat > 0 && (
        <g>
          <rect x={x0 + 7} y={y1 - 130} width={w - 14} height={123} rx={3} fill="url(#rmScorch)" opacity={Math.min(1, heat * 1.1)} />
          <ellipse cx={HOT.x} cy={y1 - 40} rx={84} ry={48} fill="url(#rmHot)" opacity={heat * (0.75 + 0.25 * noise1(t * 0.4, 9))} style={{ mixBlendMode: "screen" }} />
        </g>
      )}
    </g>
  );
};

/** The Comodo: wall bracket + cradle, black cylinder, saddle clamp, gauge, antenna, two nozzles, sensor module. */
export const ComodoUnit: React.FC<{ t: number; active: number }> = ({ t, active }) => {
  const { x, y } = COMODO;
  const ledC = active > 0 ? REAL.lampRed : "#3BEA6A";
  const ledO = active > 0 ? 1 : 0.55 + 0.45 * Math.sin(t * 0.1);
  return (
    <g>
      <defs>
        <linearGradient id="cmSilver" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2f4f6" />
          <stop offset="0.45" stopColor="#b9bfc5" />
          <stop offset="1" stopColor="#6f757b" />
        </linearGradient>
        <linearGradient id="cmBlack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3d41" />
          <stop offset="0.3" stopColor="#141517" />
          <stop offset="1" stopColor="#050506" />
        </linearGradient>
      </defs>
      <rect x={x - 108} y={y - 30} width={216} height={66} fill="#000" opacity={0.35} transform="translate(6 8)" />
      {/* wall plate and cradle */}
      <rect x={x - 92} y={y - 42} width={200} height={66} rx={4} fill="url(#cmSilver)" />
      <rect x={x - 92} y={y - 42} width={200} height={2.5} fill="#fff" opacity={0.7} />
      {/* antenna */}
      <rect x={x - 108} y={y - 90} width={7} height={70} rx={3.5} fill="#0c0c0d" />
      <rect x={x - 107} y={y - 88} width={1.6} height={60} fill="#fff" opacity={0.25} />
      {/* cylinder */}
      <rect x={x - 116} y={y - 26} width={218} height={44} rx={22} fill="url(#cmBlack)" />
      <rect x={x - 100} y={y - 20} width={180} height={3} rx={1.5} fill="#fff" opacity={0.3} />
      <rect x={x - 46} y={y - 26} width={3} height={44} fill="#000" opacity={0.6} />
      <rect x={x + 44} y={y - 26} width={3} height={44} fill="#000" opacity={0.6} />
      {/* silver saddle clamp */}
      <path d={`M${x - 34} ${y - 26} h56 q10 0 14 10 l4 12 h-18 l-4 -8 h-52 z`} fill="url(#cmSilver)" />
      {[x - 26, x + 20].map((bx) => (
        <g key={bx}>
          <rect x={bx - 4} y={y - 36} width={8} height={10} rx={2} fill="#d9dde1" />
          <rect x={bx - 4} y={y - 36} width={8} height={2} fill="#fff" opacity={0.8} />
        </g>
      ))}
      {/* cradle lip under the cylinder */}
      <path d={`M${x - 96} ${y + 4} q0 16 16 16 h168 q16 0 16 -16 v10 q0 14 -16 14 h-168 q-16 0 -16 -14 z`} fill="url(#cmSilver)" />
      <rect x={x - 80} y={y + 20} width={168} height={2} fill="#fff" opacity={0.6} />
      {/* pressure gauge on the right end */}
      <circle cx={x + 78} cy={y - 4} r={12} fill="#d9dde1" />
      <circle cx={x + 78} cy={y - 4} r={9.5} fill="#f6f6f2" />
      <path d={`M${x + 71} ${y - 1} A 8 8 0 0 1 ${x + 76} ${y - 11.5}`} stroke="#2FA84F" strokeWidth={2} fill="none" />
      <path d={`M${x + 80} ${y - 11.5} A 8 8 0 0 1 ${x + 85} ${y - 1}`} stroke="#E3281C" strokeWidth={2} fill="none" />
      <line x1={x + 78} y1={y - 4} x2={x + 74} y2={y - 10} stroke="#111" strokeWidth={1.4} />
      {/* nozzles */}
      {COMODO.nozzles.map((nx) => (
        <g key={nx}>
          <rect x={nx - 6} y={y + 14} width={12} height={12} fill="#c9ced3" />
          <polygon points={`${nx - 8},${y + 26} ${nx + 8},${y + 26} ${nx + 5},${y + 36} ${nx - 5},${y + 36}`} fill="#aeb4ba" />
          <rect x={nx - 6} y={y + 14} width={3} height={22} fill="#fff" opacity={0.5} />
        </g>
      ))}
      {/* sensor module on its bracket */}
      <rect x={x - 6} y={y + 26} width={34} height={8} fill="#c9ced3" />
      <rect x={x - 22} y={y + 32} width={56} height={34} rx={5} fill="#0e0f10" />
      <rect x={x - 22} y={y + 32} width={56} height={2} fill="#fff" opacity={0.18} />
      <rect x={x + 26} y={y + 30} width={10} height={40} rx={2} fill="url(#cmSilver)" />
      <circle cx={x - 4} cy={y + 50} r={8} fill="#1d1f22" stroke="#3a3d41" strokeWidth={1.5} />
      <circle cx={x - 4} cy={y + 50} r={3.6} fill="#050505" />
      <circle cx={x - 6} cy={y + 48} r={1.2} fill="#fff" opacity={0.6} />
      <circle cx={x + 14} cy={y + 42} r={2.6} fill={ledC} opacity={ledO} />
      <circle cx={x + 14} cy={y + 42} r={9} fill={ledC} opacity={ledO * 0.3} />
    </g>
  );
};

/** Ceiling smoke detector seen from below, with its red LED. */
const Detector: React.FC<{ alarm: number; t: number }> = ({ alarm, t }) => {
  const { x, y } = DET;
  const idle = (t % 96) < 4 ? 1 : 0; // the slow heartbeat blink of a healthy detector
  const fast = Math.sin(t * 0.9) > 0 ? 1 : 0.15;
  const o = alarm > 0 ? fast : idle * 0.9;
  return (
    <g>
      <ellipse cx={x} cy={y} rx={54} ry={17} fill="#8f959b" />
      <ellipse cx={x} cy={y - 2} rx={54} ry={17} fill="#c9ced3" />
      <path d={`M${x - 44} ${y + 3} L${x - 36} ${y + 26} Q ${x} ${y + 42} ${x + 36} ${y + 26} L${x + 44} ${y + 3} Q ${x} ${y + 20} ${x - 44} ${y + 3} Z`} fill="#aab0b6" />
      <ellipse cx={x} cy={y + 26} rx={36} ry={11} fill="#d6dade" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={x - 36 + i * 8.6} y={y + 10} width={3.4} height={12} rx={1.5} fill="#3b3f44" opacity={0.75} transform={`rotate(${(i - 4) * -3} ${x} ${y + 16})`} />
      ))}
      <ellipse cx={x - 14} cy={y + 23} rx={12} ry={3} fill="#fff" opacity={0.35} />
      <circle cx={x + 16} cy={y + 27} r={4.2} fill="#3a1010" />
      <circle cx={x + 16} cy={y + 27} r={3.6} fill="#FF2A1E" opacity={o} />
      <circle cx={x + 16} cy={y + 27} r={alarm > 0 ? 26 : 12} fill="#FF2A1E" opacity={o * 0.35} />
    </g>
  );
};

/** Red sounder-beacon on the wall. */
const Sounder: React.FC<{ on: number; flash: number }> = ({ on, flash }) => {
  const { x, y } = HOOT;
  return (
    <g>
      <rect x={x - 44} y={y - 34} width={88} height={68} rx={8} fill="#000" opacity={0.35} transform="translate(5 6)" />
      <rect x={x - 44} y={y - 34} width={88} height={68} rx={8} fill="#B5201A" />
      <rect x={x - 44} y={y - 34} width={88} height={5} rx={2} fill="#fff" opacity={0.3} />
      <rect x={x - 30} y={y - 22} width={60} height={24} rx={5} fill={on > 0 ? "#FFD9D4" : "#e8c9c6"} opacity={on > 0 ? 0.55 + 0.45 * flash : 0.55} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={x - 26 + i * 15} y={y + 10} width={8} height={14} rx={3} fill="#5d0e0b" />
      ))}
      <text x={x} y={y - 5} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={700} fontSize={15} fill="#8a1410" letterSpacing={2}>
        FIRE
      </text>
    </g>
  );
};

export const Room: React.FC<RoomProps> = ({
  t,
  alarm = 0,
  heat = 0,
  flame = 0,
  smoke = 0,
  ok = [1, 1, 1],
  comodo = 0,
  outline = 0,
  sense = 0,
  mist = 0,
  spot = null,
  hl = 0,
}) => {
  const flash = Math.sin(t * 0.5) > 0 ? 1 : 0.12;
  const st = alarm * flash;
  const fh = flame * (230 + 30 * noise1(t * 0.3, 2));
  const fireLight = Math.max(heat * 0.35, flame) * (0.8 + 0.2 * noise1(t * 0.7, 6));
  const okAvg = (ok[0] + ok[1] + ok[2]) / 3;
  return (
    <g>
      <defs>
        <linearGradient id="rmWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c333a" />
          <stop offset="1" stopColor="#1e242a" />
        </linearGradient>
        <linearGradient id="rmFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3f45" />
          <stop offset="1" stopColor="#15171a" />
        </linearGradient>
        <linearGradient id="rmCeil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#111315" />
          <stop offset="1" stopColor="#24272b" />
        </linearGradient>
        <linearGradient id="rmRack" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1a1c1f" />
          <stop offset="0.5" stopColor="#0d0e10" />
          <stop offset="1" stopColor="#060607" />
        </linearGradient>
        <linearGradient id="rmPanel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d2d6d9" />
          <stop offset="1" stopColor="#9aa0a5" />
        </linearGradient>
        <linearGradient id="rmScorch" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#1a0d06" stopOpacity="0.95" />
          <stop offset="1" stopColor="#1a0d06" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="rmHot">
          <stop offset="0" stopColor={REAL.fireYellow} stopOpacity="0.9" />
          <stop offset="0.5" stopColor={REAL.fireOrange} stopOpacity="0.55" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </radialGradient>
        <pattern id="rmMesh" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#16181b" />
          <circle cx="3" cy="3" r="1.7" fill="#000" opacity="0" />
          <circle cx="3" cy="3" r="1.8" fill="#050506" />
        </pattern>
        <pattern id="rmPerf" width="14" height="10" patternUnits="userSpaceOnUse">
          <ellipse cx="7" cy="5" rx="3" ry="1.6" fill="#000" opacity="0.6" />
        </pattern>
        <radialGradient id="rmDark" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(380 1210) scale(${760 + 200 * okAvg} ${860 + 200 * okAvg})`}>
          <stop offset="0" stopColor="#020304" stopOpacity={0.62 - 0.3 * okAvg} />
          <stop offset="0.5" stopColor="#020304" stopOpacity={0.78 - 0.18 * okAvg} />
          <stop offset="1" stopColor="#020304" stopOpacity="0.94" />
        </radialGradient>
        <radialGradient id="rmCool" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(380 1260) scale(560 600)">
          <stop offset="0" stopColor="#9CC8FF" stopOpacity="0.34" />
          <stop offset="1" stopColor="#9CC8FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rmFire" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${HOT.x} ${HOT.y - 40}) scale(760 680)`}>
          <stop offset="0" stopColor={REAL.fireOrange} stopOpacity="0.8" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rmStrobe" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${HOOT.x} ${HOOT.y}) scale(820 900)`}>
          <stop offset="0" stopColor={REAL.lampRed} stopOpacity="0.5" />
          <stop offset="1" stopColor={REAL.lampRed} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rmDet" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${DET.x} ${DET.y + 30}) scale(420 300)`}>
          <stop offset="0" stopColor="#FF2A1E" stopOpacity="0.38" />
          <stop offset="1" stopColor="#FF2A1E" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rmSpot" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${spot?.x ?? 0} ${spot?.y ?? 0}) scale(${spot?.r ?? 260} ${(spot?.r ?? 260) * 1.25})`}>
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000" stopOpacity="0.74" />
        </radialGradient>
        <linearGradient id="rmRefl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A9D2FF" stopOpacity="0.42" />
          <stop offset="1" stopColor="#A9D2FF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* grid ceiling, walls, raised floor */}
      <polygon points="-400,420 1480,420 1000,700 80,700" fill="url(#rmCeil)" />
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1={80 + i * 115} y1={700} x2={-400 + i * 235} y2={420} stroke="#3b4046" strokeWidth={2} opacity={0.55} />
      ))}
      {[640, 566, 478].map((y) => {
        const k = (700 - y) / 280;
        return <line key={y} x1={80 - 480 * k} y1={y} x2={1000 + 480 * k} y2={y} stroke="#3b4046" strokeWidth={2} opacity={0.55} />;
      })}
      {/* a recessed light panel, off */}
      <polygon points="610,640 760,640 792,566 628,566" fill="#3a3e43" opacity={0.7} />
      <rect x={80} y={700} width={920} height={765} fill="url(#rmWall)" />
      <polygon points="80,700 80,1465 -400,1920 -400,420" fill="#1b2026" />
      <polygon points="1000,700 1000,1465 1480,1920 1480,420" fill="#171c21" />
      <polygon points="80,700 80,1465 -400,1920 -400,420" fill="#000" opacity={0.32} />
      <polygon points="1000,700 1000,1465 1480,1920 1480,420" fill="#000" opacity={0.4} />
      <polygon points="80,1465 1000,1465 1480,1920 -400,1920" fill="url(#rmFloor)" />
      {Array.from({ length: 9 }).map((_, i) => (
        <line key={i} x1={80 + i * 115} y1={1465} x2={-400 + i * 235} y2={1920} stroke="#0a0b0c" strokeWidth={2.4} opacity={0.7} />
      ))}
      {[1512, 1580, 1680, 1820].map((y) => (
        <line key={y} x1={-400} y1={y} x2={1480} y2={y} stroke="#0a0b0c" strokeWidth={2.4} opacity={0.65} />
      ))}
      {/* perforated airflow tiles in front of the racks */}
      <polygon points="195,1465 540,1465 520,1512 150,1512" fill="url(#rmPerf)" opacity={0.8} />
      <rect x={80} y={1445} width={920} height={20} fill="#15181b" />
      <rect x={80} y={1445} width={920} height={2.5} fill="#aab2ba" opacity={0.35} />

      {/* ladder cable tray above the racks, with cable drops */}
      <g>
        <rect x={96} y={778} width={548} height={6} fill="#8a9096" />
        <rect x={96} y={806} width={548} height={6} fill="#6c7278" />
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} x={110 + i * 40} y={784} width={5} height={22} fill="#7b8187" />
        ))}
        {[
          ["#2F7BE0", 0],
          ["#d9dde1", 5],
          ["#E8C22A", 10],
          ["#2F7BE0", 15],
          ["#39424b", 20],
        ].map(([c, o]) => (
          <rect key={o as number} x={100} y={788 + (o as number) * 0.9} width={540} height={3.6} rx={1.8} fill={c as string} opacity={0.85} />
        ))}
        {RACKS.map((r, i) => (
          <g key={r.x}>
            {["#2F7BE0", "#E8C22A", "#d9dde1"].map((c, j) => (
              <path key={c} d={`M${r.x + 60 + j * 14} 806 C ${r.x + 60 + j * 14} 860, ${r.x + 66 + j * 12 + i * 2} 900, ${r.x + 66 + j * 12} ${RACK.top + 2}`} stroke={c} strokeWidth={3.4} fill="none" opacity={0.85} />
            ))}
          </g>
        ))}
        {[150, 400, 630].map((x) => (
          <rect key={x} x={x} y={700} width={5} height={80} fill="#5b6066" />
        ))}
      </g>

      {RACKS.map((r) => (
        <RackBody key={r.x} x={r.x} kind={r.kind} />
      ))}
      {/* rack light on the floor tiles */}
      <polygon points="130,1465 606,1465 690,1800 40,1800" fill="url(#rmRefl)" opacity={0.75 * okAvg} style={{ mixBlendMode: "screen" }} />

      <Sounder on={alarm} flash={flash} />
      <Panel heat={heat} t={t} />

      {outline > 0 && (
        <rect x={COMODO.x - 118} y={COMODO.y - 96} width={236} height={176} rx={10} fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray="14 10" strokeDashoffset={-t * 0.6} opacity={outline} />
      )}
      {comodo > 0 && (
        <g opacity={comodo}>
          <ComodoUnit t={t} active={mist} />
        </g>
      )}

      {/* the night: darkness pass, then the light sources */}
      <rect x={-400} y={420} width={1880} height={1500} fill="url(#rmDark)" />
      <g style={{ mixBlendMode: "screen" }}>
        <rect x={-400} y={420} width={1880} height={1500} fill="url(#rmCool)" opacity={okAvg} />
        <rect x={-400} y={420} width={1880} height={1500} fill="url(#rmFire)" opacity={fireLight} />
        <rect x={-400} y={420} width={1880} height={1500} fill="url(#rmStrobe)" opacity={st} />
        <rect x={-400} y={420} width={1880} height={1500} fill="url(#rmDet)" opacity={alarm * (Math.sin(t * 0.9) > 0 ? 1 : 0.1)} />
      </g>

      {/* things that stay readable in the dark: the detector, the LEDs, the unit's status light */}
      <g opacity={0.9}>
        <Detector alarm={alarm} t={t} />
      </g>
      <rect x={-400} y={420} width={1880} height={300} fill="#020304" opacity={0.42 - 0.3 * Math.max(st, alarm * 0.4)} />
      <g>
        <circle cx={DET.x + 16} cy={DET.y + 27} r={3.6} fill="#FF2A1E" opacity={alarm > 0 ? (Math.sin(t * 0.9) > 0 ? 1 : 0.15) : (t % 96) < 4 ? 0.9 : 0} />
      </g>
      {RACKS.map((r, i) => (
        <RackLeds key={r.x} x={r.x} kind={r.kind} t={t} ok={ok[i]} r={i} />
      ))}
      {comodo > 0 && (
        <g opacity={comodo}>
          <circle cx={COMODO.x + 14} cy={COMODO.y + 42} r={3} fill={mist > 0 ? REAL.lampRed : "#3BEA6A"} opacity={mist > 0 ? 1 : 0.55 + 0.45 * Math.sin(t * 0.1)} />
          <rect x={COMODO.x - 88} y={COMODO.y - 19} width={170} height={2.4} rx={1.2} fill="#fff" opacity={0.2} />
        </g>
      )}

      <Flame id="rmFlame" x={HOT.x} y={HOT.y + 8} h={fh} t={t} w={0.4} />

      {sense > 0 &&
        [0, 1, 2].map((i) => {
          const ph = (t * 0.028 + i / 3) % 1;
          return <ellipse key={i} cx={COMODO.x - 4} cy={COMODO.y + 70 + ph * 300} rx={20 + ph * 130} ry={6 + ph * 34} fill="none" stroke="#E9F3FA" strokeWidth={2.2} opacity={sense * (1 - ph) * 0.75} />;
        })}

      {COMODO.nozzles.map((nx, i) => (
        <Mist key={nx} id={`rmMist${i}`} x={nx} y={COMODO.ny} floor={PANEL.y1 + 30} spread={150} t={t + i * 13} amount={mist} />
      ))}
      <Smoke
        id="rmSmoke"
        t={t}
        amount={smoke}
        emit={[
          { x: HOT.x, y: HOT.y - 20, w: 110 },
          { x: 560, y: 980, w: 860 },
        ]}
        rise={560}
        size={96}
        tone="#38383b"
      />

      {spot && hl > 0 && <rect x={-400} y={420} width={1880} height={1500} fill="url(#rmSpot)" opacity={hl} />}
    </g>
  );
};
