import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, E, FONT, REAL, SAFE, noise1, prog } from "../fk/theme";
import { TRUCK, World } from "../fk/World";
import { Display, Stack, TypeOn } from "../fk/ui";
import { ShotAttempt, ShotExt, ShotGauges, ShotStop } from "../scenes/S3Operator";

/**
 * Driver | 8.33-15.63 s.
 * VO P3: "Aur driver ke paas chaar kaam hain:" 8.50-10.20 (local 5-56) |
 *        "khatra dekhna" 10.50 | "truck rokna" 11.70 | "extinguisher lana" 12.90 | "aur aag se ladna" 14.20-15.30
 */
const GRID = { x: SAFE.x0, y: 690, tw: 400, th: 300, gap: 20 };
const TILE_AT = [69, 101, 131, 168]; // 11.96 / 13.02 / 14.03 / 15.26 s
const TILE_LIFE = 60;
const TASKS = ["Khatra dekhna", "Truck rokna", "Extinguisher lana", "Aag se ladna"];
/** Truck cab in world coordinates (truck coords ~ (890, 300)). */
const CAB = { x: TRUCK.x + 890, y: TRUCK.y + 300 };

export const T3Driver: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > 175 ? noise1(f * 2, 9) * 1.5 : 0;
  const dive = prog(f, 194, 207, E.in);
  const cabOut = prog(f, 54, 70, E.inOut);
  const cabCam = { z: 1.8 + prog(f, 0, 70) * 0.08, cx: CAB.x, cy: CAB.y, ax: 540, ay: 1180 };

  const tiles = [0, 1, 2, 3].map((i) => {
    const a = TILE_AT[i];
    const inP = prog(f, a, a + 12, E.out);
    if (inP <= 0) return null;
    const p = Math.min(1, Math.max(0, (f - a) / TILE_LIFE));
    const x = GRID.x + (i % 2) * (GRID.tw + GRID.gap);
    const y = GRID.y + Math.floor(i / 2) * (GRID.th + GRID.gap);
    const active = i === 3 ? f >= a : f < TILE_AT[i + 1];
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
        <div style={{ position: "absolute", left: 18, bottom: 14, display: "flex", gap: 10, alignItems: "baseline", fontFamily: FONT.sans, whiteSpace: "nowrap" }}>
          <span style={{ fontWeight: 600, fontSize: 30, color: C.gold }}>0{i + 1}</span>
          <span style={{ fontWeight: 600, fontSize: 30, color: C.fa }}>{TASKS[i]}</span>
        </div>
      </div>
    );
  });

  return (
    <AbsoluteFill style={{ background: C.black }}>
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

      {/* the driver's cab at night - one light on, nobody else around */}
      <AbsoluteFill style={{ opacity: 1 - cabOut * 0.85, filter: cabOut > 0 ? `blur(${cabOut * 10}px)` : undefined }}>
        <World t={f + 290} cam={cabCam} machine="truck" setting="highway" headlights={0.8} rim={0.8} heat={0.6} towers={0.7} />
        <div
          style={{
            position: "absolute",
            left: 540 - 80,
            top: 1180 - 70,
            width: 170,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(255,190,106,0.32) 0%, rgba(255,190,106,0) 70%)",
            opacity: 0.6 + 0.4 * Math.sin(f * 0.08),
          }}
        />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.92) 0px, rgba(0,0,0,0.6) 620px, rgba(0,0,0,0) 860px)" }} />
      </AbsoluteFill>

      <Stack top={380}>
        <TypeOn words={["Aur", "driver", "ke", "paas"]} at={6} out={194} color={C.fa} />
        <Display words={[{ w: "CHAAR", c: C.gold }, "KAAM."]} at={30} out={194} />
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
