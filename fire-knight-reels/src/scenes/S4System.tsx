import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BAY_W, World } from "../fk/World";
import { C, E, FONT, REAL, SAFE, ip, prog, rand } from "../fk/theme";
import { Display, Label, Reticle, Stack, TypeOn } from "../fk/ui";

/**
 * Scene 4 | 13-18.2 s - RE-HOOK, then the three-step response as a motion graphic.
 * Top: the engine bay, where each step happens visibly (sensing line, beacon, mist).
 * Bottom: a vertical chain. Each step lights an animated icon node, a gold connector
 * fills to the next node, and the title + one plain line scan in. Steps stay visible,
 * so the viewer ends on the whole chain: Detection -> Alert -> Suppression response.
 */
const REHOOK_CAM = { z: 2.1, cx: BAY_W.x, cy: BAY_W.y, ay: 1180 };
const DIAGRAM_CAM = { z: 1.6, cx: BAY_W.x - 40, cy: BAY_W.y, ay: 720 };
export const S4_CAM = { ...DIAGRAM_CAM, ax: 540 };

const T = [52, 88, 122]; // step starts: detection, alert, suppression

const STEPS = [
  { title: "Detection", line: "Engine bay ki heat sense hoti hai" },
  { title: "Alert", line: "Alarm + emergency light on" },
  { title: "Suppression response", line: "Nozzles se agent automatic discharge" },
];

/* ---------- engine bay overlay (truck coordinates) ---------- */
const LOOP: [number, number][] = [
  [796, 309],
  [954, 309],
  [954, 393],
  [796, 393],
  [796, 309],
];
const loopLen = LOOP.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - LOOP[i][0], p[1] - LOOP[i][1]), 0);
const pointOnLoop = (u: number): [number, number] => {
  let d = u * loopLen;
  for (let i = 1; i < LOOP.length; i++) {
    const [x0, y0] = LOOP[i - 1];
    const [x1, y1] = LOOP[i];
    const l = Math.hypot(x1 - x0, y1 - y0);
    if (d <= l) return [x0 + ((x1 - x0) * d) / l, y0 + ((y1 - y0) * d) / l];
    d -= l;
  }
  return LOOP[0];
};
const NOZZLES = [836, 912];
const BEACON = { x: 944, y: 236 };

const BayOverlay: React.FC<{ f: number }> = ({ f }) => {
  const draw = prog(f, T[0] - 6, T[0] + 10, E.inOut);
  const pulseU = prog(f, T[0] + 4, T[0] + 24, E.inOut);
  const [px, py] = pointOnLoop(0.12 + pulseU * 0.3);
  const alert = f >= T[1];
  const beat = alert ? 0.5 + 0.5 * Math.sin((f - T[1]) * 0.6) : 0;
  const spray = prog(f, T[2], T[2] + 10);
  const d = LOOP.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  return (
    <g>
      <path d={d} fill="none" stroke={C.gold} strokeOpacity={0.25 * draw} strokeWidth={2} strokeDasharray="5 5" />
      <path d={d} fill="none" stroke={C.gold} strokeWidth={2.4} pathLength={100} strokeDasharray="100" strokeDashoffset={100 * (1 - draw)} />
      {f >= T[0] + 4 && f < T[0] + 26 && (
        <g>
          <circle cx={px} cy={py} r={10} fill={C.gold} opacity={0.35} />
          <circle cx={px} cy={py} r={4} fill={C.fa} />
        </g>
      )}
      {NOZZLES.map((x) => (
        <g key={x} opacity={prog(f, T[0], T[0] + 8)}>
          <rect x={x - 6} y={304} width={12} height={9} rx={2} fill="#7A8189" />
          <path d={`M${x - 4} 313 L${x + 4} 313 L${x + 2} 319 L${x - 2} 319 Z`} fill="#A8AEB4" />
        </g>
      ))}
      {spray > 0 &&
        NOZZLES.map((x, n) =>
          Array.from({ length: 36 }, (_, i) => {
            const life = (((f - T[2]) * 0.04 + rand(i * 2.1 + n * 50)) % 1) * spray;
            const a = Math.PI / 2 + (rand(i * 4.3 + n) - 0.5) * 1.2;
            const dist = 4 + life * 80;
            return (
              <circle
                key={`${n}-${i}`}
                cx={x + Math.cos(a) * dist}
                cy={318 + Math.sin(a) * dist}
                r={0.8 + life * 2.4}
                fill="#F4F6F8"
                opacity={(1 - life) * 0.8 * spray}
              />
            );
          }),
        )}
      <g>
        <rect x={BEACON.x - 6} y={BEACON.y + 4} width={12} height={8} fill="#3A4047" />
        <path d={`M${BEACON.x - 7} ${BEACON.y + 4} A7 7 0 0 1 ${BEACON.x + 7} ${BEACON.y + 4} Z`} fill={alert ? REAL.beacon : "#4A5058"} />
        {alert && <circle cx={BEACON.x} cy={BEACON.y} r={16 + beat * 6} fill={REAL.beacon} opacity={0.3 + beat * 0.35} filter="url(#soft)" />}
      </g>
    </g>
  );
};

/* ---------- animated step icons (64 x 64) ---------- */
const IconDetect: React.FC<{ f: number; c: string }> = ({ f, c }) => (
  <svg viewBox="0 0 64 64" width={40} height={40}>
    <rect x={14} y={24} width={14} height={16} rx={3} fill={c} />
    {[0, 1, 2].map((i) => {
      const q = ((f * 0.05 + i / 3) % 1);
      const r = 8 + q * 22;
      return <path key={i} d={`M${28 + r * 0.2} ${32 - r} A${r} ${r} 0 0 1 ${28 + r * 0.2} ${32 + r}`} fill="none" stroke={c} strokeWidth={3.5} strokeLinecap="round" opacity={1 - q} />;
    })}
  </svg>
);
const IconAlert: React.FC<{ f: number; c: string }> = ({ f, c }) => {
  const on = Math.floor(f / 5) % 2 === 0;
  return (
    <svg viewBox="0 0 64 64" width={40} height={40}>
      <path d="M20 44 L20 32 A12 12 0 0 1 44 32 L44 44 Z" fill={c} />
      <rect x={16} y={44} width={32} height={6} rx={2} fill={c} />
      {[-60, -30, 0, 30, 60].map((a) => (
        <line
          key={a}
          x1={32 + Math.sin((a * Math.PI) / 180) * 18}
          y1={30 - Math.cos((a * Math.PI) / 180) * 18}
          x2={32 + Math.sin((a * Math.PI) / 180) * 26}
          y2={30 - Math.cos((a * Math.PI) / 180) * 26}
          stroke={c}
          strokeWidth={3.5}
          strokeLinecap="round"
          opacity={on ? 1 : 0.25}
        />
      ))}
    </svg>
  );
};
const IconSpray: React.FC<{ f: number; c: string }> = ({ f, c }) => (
  <svg viewBox="0 0 64 64" width={40} height={40}>
    <rect x={22} y={6} width={20} height={10} rx={2} fill={c} />
    <path d="M26 16 L38 16 L35 24 L29 24 Z" fill={c} />
    {Array.from({ length: 9 }, (_, i) => {
      const q = ((f * 0.06 + (i % 3) / 3 + rand(i) * 0.2) % 1);
      const a = ((i % 3) - 1) * 0.45 + (rand(i * 3) - 0.5) * 0.2;
      return <circle key={i} cx={32 + Math.sin(a) * (6 + q * 30)} cy={26 + Math.cos(a) * (6 + q * 30)} r={2.6} fill={c} opacity={1 - q} />;
    })}
  </svg>
);
const ICONS = [IconDetect, IconAlert, IconSpray];

const ROW0 = 1076;
const ROWH = 122;
const NODE = 68;

const StepChain: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", left: SAFE.x0, top: ROW0, width: 820 }}>
    {/* connectors */}
    {[0, 1].map((i) => {
      const show = prog(f, T[i] + 6, T[i] + 10);
      const fill = prog(f, T[i + 1] - 14, T[i + 1], E.inOut);
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: NODE / 2 - 1.5,
            top: i * ROWH + NODE + 6,
            width: 3,
            height: ROWH - NODE - 12,
            background: "rgba(250,250,250,0.12)",
            opacity: show,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div style={{ width: "100%", height: `${fill * 100}%`, background: C.gold }} />
        </div>
      );
    })}
    {STEPS.map((s, i) => {
      const a = T[i];
      const inP = prog(f, a - 2, a + 10, E.out);
      if (inP <= 0) return null;
      const active = i === 2 ? f >= a : f >= a && f < T[i + 1];
      const Icon = ICONS[i];
      const ringQ = active ? ((f - a) / 24) % 1 : 0;
      return (
        <div key={s.title} style={{ position: "absolute", left: 0, top: i * ROWH, width: 820, height: ROWH }}>
          {/* node */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: NODE,
              height: NODE,
              borderRadius: NODE / 2,
              background: active ? C.gold : C.black,
              border: `3px solid ${C.gold}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scale: `${0.6 + 0.4 * inP}`,
              opacity: inP,
            }}
          >
            <Icon f={f} c={active ? C.black : C.gold} />
          </div>
          {active && (
            <div
              style={{
                position: "absolute",
                left: NODE / 2 - (NODE / 2) * (1 + ringQ * 0.8),
                top: NODE / 2 - (NODE / 2) * (1 + ringQ * 0.8),
                width: NODE * (1 + ringQ * 0.8),
                height: NODE * (1 + ringQ * 0.8),
                borderRadius: "50%",
                border: `2px solid ${C.gold}`,
                opacity: (1 - ringQ) * 0.7,
              }}
            />
          )}
          {/* title + line */}
          <div style={{ position: "absolute", left: NODE + 28, top: -2, opacity: active ? 1 : 0.62 }}>
            {/* title rises out of a mask, the plain line types on */}
            <div style={{ overflow: "hidden", paddingBottom: 4 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 14,
                  fontFamily: FONT.sans,
                  whiteSpace: "nowrap",
                  translate: `0 ${(1 - prog(f, a, a + 9, E.out)) * 110}%`,
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 26, color: C.gold, letterSpacing: "0.08em" }}>0{i + 1}</span>
                <span style={{ fontWeight: 600, fontSize: 44, color: C.white, letterSpacing: "-0.02em" }}>{s.title}</span>
              </div>
            </div>
            <TypeOn words={s.line.split(" ")} at={a + 6} perLetter={0.6} size={30} weight={500} color="rgba(250,250,250,0.72)" style={{ marginTop: 2 }} />
          </div>
        </div>
      );
    })}
  </div>
);

export const S4System: React.FC = () => {
  const f = useCurrentFrame();
  const m = prog(f, 30, 58, E.cam);
  const cam = {
    z: ip(m, [0, 1], [REHOOK_CAM.z, DIAGRAM_CAM.z]) + prog(f, 58, 156) * 0.05,
    cx: ip(m, [0, 1], [REHOOK_CAM.cx, DIAGRAM_CAM.cx]),
    cy: ip(m, [0, 1], [REHOOK_CAM.cy, DIAGRAM_CAM.cy]),
    ax: 540,
    ay: ip(m, [0, 1], [REHOOK_CAM.ay, DIAGRAM_CAM.ay]),
  };
  const heat = ip(f, [0, T[2], T[2] + 34], [0.85, 0.9, 0.3], E.inOut);

  // screen positions of the bay and the beacon
  const bayX = 540 + (BAY_W.x - cam.cx) * cam.z;
  const bayY = cam.ay + (BAY_W.y - cam.cy) * cam.z;
  const bx = 540 + (40 + BEACON.x - cam.cx) * cam.z;
  const by = cam.ay + (790 + BEACON.y - cam.cy) * cam.z;
  const lock = prog(f, T[0] + 14, T[0] + 26, E.out);
  const rw = ip(lock, [0, 1], [560, 300]);
  const rh = ip(lock, [0, 1], [380, 200]);

  return (
    <AbsoluteFill>
      <World
        t={f + 390}
        cam={cam}
        headlights={0.6}
        rim={0.55}
        heat={heat}
        thermal={0.8}
        crush={0.5}
        towers={0.4}
        truckFilter="brightness(0.85) contrast(1.05)"
        overlay={<BayOverlay f={f} />}
      />
      {f >= T[1] &&
        [0, 1, 2].map((i) => {
          const q = ((f - T[1]) / 26 + i / 3) % 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: bx - 20 - q * 80,
                top: by - 20 - q * 80,
                width: 40 + q * 160,
                height: 40 + q * 160,
                borderRadius: "50%",
                border: `2px solid ${REAL.beacon}`,
                opacity: (1 - q) * 0.6 * (1 - prog(f, T[2] + 10, T[2] + 26)),
              }}
            />
          );
        })}
      {f >= T[0] + 14 && (
        <Reticle x={bayX - rw / 2} y={bayY - rh / 2} w={rw} h={rh} p={lock} color={f >= T[2] ? "rgba(250,250,250,0.85)" : C.gold} />
      )}

      {/* lower field for the step chain */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0) 900px, rgba(0,0,0,0.9) 1040px, rgba(0,0,0,0.96) 1920px)",
          opacity: prog(f, 36, 56),
        }}
      />
      <div style={{ position: "absolute", left: SAFE.x0, top: 1436, opacity: 0.55 * prog(f, 44, 56) }}>
        <Label style={{ fontSize: 20 }}>Conceptual illustration</Label>
      </div>

      {/* RE-HOOK */}
      <Stack top={380}>
        <Display words={["TOH", "PHIR", { w: "KAUN?", c: C.gold }]} at={2} out={34} />
      </Stack>

      <StepChain f={f} />
    </AbsoluteFill>
  );
};

