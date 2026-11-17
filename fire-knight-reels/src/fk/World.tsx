import React from "react";
import { AbsoluteFill } from "remotion";
import { Dumper, BAY } from "./Dumper";
import { C, rand } from "./theme";

/** Truck placement in world space (1080 x 1920 frame at camera zoom 1). */
export const TRUCK = { x: 40, y: 790, w: 1000, h: 560 };
export const GROUND_Y = TRUCK.y + 540; // 1330
/** Engine bay in world coordinates. */
export const BAY_W = { x: TRUCK.x + BAY.x, y: TRUCK.y + BAY.y };

export type Camera = {
  z: number; // zoom
  cx: number; // world point placed at the anchor
  cy: number;
  ax?: number; // screen anchor
  ay?: number;
  sx?: number; // shake px
  sy?: number;
};

export const CAM_WIDE: Camera = { z: 1, cx: 540, cy: 960 };

const layerTransform = (cam: Camera, d: number) => {
  const ax = cam.ax ?? 540;
  const ay = cam.ay ?? 960;
  const z = 1 + (cam.z - 1) * d;
  const cx = 540 + (cam.cx - 540) * d;
  const cy = 960 + (cam.cy - 960) * d;
  const tx = ax - cx * z + (cam.sx ?? 0) * d;
  const ty = ay - cy * z + (cam.sy ?? 0) * d;
  return `translate(${tx}px, ${ty}px) scale(${z})`;
};

const Layer: React.FC<{ cam: Camera; d: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  cam,
  d,
  children,
  style,
}) => (
  <AbsoluteFill style={{ transformOrigin: "0 0", transform: layerTransform(cam, d), ...style }}>
    {children}
  </AbsoluteFill>
);

/** Terraced pit wall, tiled horizontally so it can scroll forever. */
const Benches: React.FC<{
  seed: number;
  y: number;
  steps: number;
  stepH: number;
  fill: string;
  edge: string;
  scroll: number;
  period?: number;
}> = ({ seed, y, steps, stepH, fill, edge, scroll, period = 1400 }) => {
  const off = -(((scroll % period) + period) % period);
  const tiles = [-1, 0, 1, 2];
  const tile = (k: number) => {
    // a gently undulating stepped profile, same for each tile so it loops seamlessly
    const pts: string[] = [];
    const edges: string[] = [];
    for (let s = 0; s < steps; s++) {
      const yy = y + s * stepH;
      const segs = 7;
      let line = "";
      for (let i = 0; i <= segs; i++) {
        const x = (i / segs) * period;
        const j = i === segs ? 0 : i;
        const dy = (rand(seed * 31 + s * 7 + j) - 0.5) * stepH * 0.5;
        line += `${i ? "L" : "M"}${(x + k * period).toFixed(0)} ${(yy + dy).toFixed(0)} `;
      }
      edges.push(line);
      if (s === 0) pts.push(line);
    }
    return { top: pts[0], edges };
  };
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
      <g transform={`translate(${off} 0)`}>
        {tiles.map((k) => {
          const { top, edges } = tile(k);
          return (
            <g key={k}>
              <path d={`${top} L${(k + 1) * period} 2400 L${k * period} 2400 Z`} fill={fill} />
              {edges.map((e, i) => (
                <path key={i} d={e} stroke={edge} strokeWidth={i === 0 ? 2.5 : 1.5} fill="none" opacity={1 - i * 0.18} />
              ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

const Tower: React.FC<{ x: number; y: number; s: number; on: number; t: number; seed: number }> = ({
  x,
  y,
  s,
  on,
  t,
  seed,
}) => {
  const fl = 0.85 + 0.15 * Math.sin(t * 0.37 + seed);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-6 0 L-2 -150 L2 -150 L6 0" stroke="#22262A" strokeWidth={2} fill="none" />
      <path d="M-5 -30 L4 -60 M-4 -60 L3 -90 M-3 -90 L2 -120" stroke="#1D2024" strokeWidth={1.5} />
      <rect x={-16} y={-162} width={32} height={12} fill="#1A1D20" />
      {[-11, -3, 5].map((dx) => (
        <rect key={dx} x={dx} y={-160} width={6} height={7} fill={C.heat} opacity={on * fl} />
      ))}
      <circle cx={0} cy={-156} r={60} fill="url(#towerGlow)" opacity={on * 0.55 * fl} />
      <polygon points="-14,-150 14,-150 70,0 -70,0" fill="url(#towerCone)" opacity={on * 0.18 * fl} />
    </g>
  );
};

export type WorldProps = {
  t: number;
  cam: Camera;
  scroll?: number; // px of travel (world scrolls left)
  wheelAngle?: number;
  headlights?: number;
  rim?: number;
  rimColor?: string;
  heat?: number;
  thermal?: number;
  accent?: number;
  bob?: number;
  towers?: number;
  dust?: number;
  overlay?: React.ReactNode;
  /** 0..1 how much the background is crushed to black (thermal / schematic looks). */
  crush?: number;
  truckFilter?: string;
};

export const World: React.FC<WorldProps> = ({
  t,
  cam,
  scroll = 0,
  wheelAngle = 0,
  headlights = 1,
  rim = 0.6,
  rimColor,
  heat = 0,
  thermal = 0,
  accent = 0,
  bob = 0,
  towers = 1,
  dust = 1,
  overlay,
  crush = 0,
  truckFilter,
}) => {
  // dust motes drifting in the headlight beams (seeded, deterministic)
  const motes = Array.from({ length: 34 }, (_, i) => {
    const bx = 1030 + rand(i * 3.1) * 700;
    const by = TRUCK.y + 300 + (rand(i * 7.7) - 0.5) * 220;
    const x = ((bx - scroll * 1.0 - t * (0.6 + rand(i) * 0.8) - 900 + 100000) % 900) + 900;
    const y = by + Math.sin(t * 0.05 + i) * 10 - t * 0.15 * rand(i * 2);
    const r = 1 + rand(i * 5) * 2.2;
    const a = (0.25 + rand(i * 9) * 0.5) * Math.max(0, 1 - Math.abs(y - (TRUCK.y + 330)) / 200);
    return { x: x - 100, y, r, a };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="towerGlow">
            <stop offset="0" stopColor={C.heat} stopOpacity="0.9" />
            <stop offset="1" stopColor={C.heat} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="towerCone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE9C9" stopOpacity="1" />
            <stop offset="1" stopColor="#FFE9C9" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* sky + steel glow behind the hero */}
      <Layer cam={cam} d={0.05}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 900px 700px at 560px 1000px, #23272C 0%, #15181B 45%, ${C.black} 80%)`,
          }}
        />
      </Layer>

      {/* far pit wall */}
      <Layer cam={cam} d={0.15} style={{ opacity: 1 - crush }}>
        <Benches seed={1} y={800} steps={6} stepH={46} fill="#131619" edge="#262B30" scroll={scroll * 0.15} />
        <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
          <g transform={`translate(${-((scroll * 0.15) % 1400)} 0)`}>
            {[0, 1400].map((k) => (
              <g key={k}>
                <Tower x={k + 180} y={812} s={0.8} on={towers} t={t} seed={1} />
                <Tower x={k + 930} y={800} s={0.6} on={towers} t={t} seed={2} />
              </g>
            ))}
          </g>
        </svg>
      </Layer>

      {/* haze band */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(11,11,12,0) 0%, rgba(11,11,12,0) 38%, rgba(48,53,59,0.28) 47%, rgba(11,11,12,0) 60%)",
          opacity: 1 - crush,
        }}
      />

      {/* mid pit wall */}
      <Layer cam={cam} d={0.4} style={{ opacity: 1 - crush }}>
        <Benches seed={2} y={1000} steps={5} stepH={56} fill="#0F1113" edge="#1E2226" scroll={scroll * 0.4} period={1200} />
        <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
          <g transform={`translate(${-((scroll * 0.4) % 1200)} 0)`}>
            {[0, 1200, 2400].map((k) => (
              <Tower key={k} x={k + 80} y={1004} s={1.05} on={towers} t={t} seed={3} />
            ))}
          </g>
        </svg>
      </Layer>

      {/* road + berm */}
      <Layer cam={cam} d={1}>
        <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
          <defs>
            <linearGradient id="roadG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1A1C1F" />
              <stop offset="0.4" stopColor="#111214" />
              <stop offset="1" stopColor="#0B0B0C" />
            </linearGradient>
          </defs>
          {/* safety berm on far side */}
          <path
            d={`M-2000 ${GROUND_Y - 14} ${Array.from({ length: 40 }, (_, i) => {
              const x = -2000 + i * 160 - (scroll % 160);
              return `Q ${x + 80} ${GROUND_Y - 34} ${x + 160} ${GROUND_Y - 14}`;
            }).join(" ")} L 4400 ${GROUND_Y} L -2000 ${GROUND_Y} Z`}
            fill="#141619"
            opacity={1 - crush}
          />
          <rect x={-2000} y={GROUND_Y - 4} width={6400} height={1200} fill="url(#roadG)" />
          <line x1={-2000} y1={GROUND_Y - 3} x2={4400} y2={GROUND_Y - 3} stroke="#2A2E33" strokeWidth={2} />
          <ellipse cx={1180} cy={GROUND_Y + 30} rx={300} ry={40} fill="#FFF1DE" opacity={0.06 * headlights} />
          {/* tyre tracks and gravel */}
          {Array.from({ length: 70 }, (_, i) => {
            const x = ((i * 97 - scroll) % 2200 + 2200) % 2200 - 600;
            const y = GROUND_Y + 14 + rand(i * 3) * 160;
            const w = 18 + rand(i * 5) * 60;
            return <rect key={i} x={x} y={y} width={w} height={2} fill="#22252A" opacity={0.5 + rand(i) * 0.4} />;
          })}
        </svg>
      </Layer>

      {/* the dumper */}
      <Layer cam={cam} d={1}>
        <div
          style={{
            position: "absolute",
            left: TRUCK.x,
            top: TRUCK.y,
            width: TRUCK.w,
            height: TRUCK.h,
            filter: truckFilter,
          }}
        >
          <Dumper
            t={t}
            wheelAngle={wheelAngle}
            headlights={headlights}
            rim={rim}
            rimColor={rimColor}
            heat={heat}
            thermal={thermal}
            accent={accent}
            bob={bob}
            overlay={overlay}
          />
        </div>
        {/* dust in the beams */}
        <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible", opacity: dust * headlights }}>
          {motes.map((m, i) => (
            <circle key={i} cx={m.x} cy={m.y} r={m.r} fill="#FFF1DE" opacity={m.a} />
          ))}
        </svg>
      </Layer>

      {/* foreground rocks (fast parallax, defocused) */}
      <Layer cam={cam} d={1.6} style={{ filter: "blur(7px)", opacity: 1 - crush }}>
        <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
          {Array.from({ length: 5 }, (_, i) => {
            const period = 2800;
            const x = ((i * 610 - scroll * 1.6) % period + period) % period - 500;
            const y = 1800 + rand(i * 11) * 60;
            const s = 0.7 + rand(i * 13) * 0.6;
            const pts = [
              [0, 200], [20, 70], [90, 24], [170, 0], [250, 38], [300, 20], [360, 90], [390, 200],
            ].map(([px, py]) => `${(x + px * s).toFixed(0)},${(y + py * s * 0.8).toFixed(0)}`).join(" ");
            return (
              <g key={i}>
                <polygon points={pts} fill="#08090A" />
                <polyline points={pts.split(" ").slice(1, 6).join(" ")} fill="none" stroke="#2A2E33" strokeWidth={4} />
              </g>
            );
          })}
        </svg>
      </Layer>

      {/* floodlight shaft from a tower, high left: industrial key light */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(118deg, rgba(255,236,210,0) 18%, rgba(255,236,210,0.07) 30%, rgba(255,236,210,0.0) 46%)",
          opacity: towers * (1 - crush),
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

export { BAY };
