import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BAY_W, World } from "../fk/World";
import { C, E, FONT, SAFE, ip, prog, rand } from "../fk/theme";
import { Mono, Reticle, RevealLine, TopShade } from "../fk/ui";

export const S4_CAM = { z: 2.3, cx: BAY_W.x, cy: BAY_W.y, ax: 540, ay: 940 };

const T_DETECT = 14;
const T_ALERT = 44;
const T_RESP = 72;
const T_LINE = 88;

/** Sensing loop around the engine bay, in truck coordinates. */
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

const Overlay: React.FC<{ f: number }> = ({ f }) => {
  const draw = prog(f, 2, T_DETECT + 6, E.inOut);
  const pulseU = prog(f, T_DETECT, T_DETECT + 14, E.inOut);
  const [px, py] = pointOnLoop(0.12 + pulseU * 0.3);
  const alert = f >= T_ALERT;
  const beat = alert ? 0.5 + 0.5 * Math.sin((f - T_ALERT) * 0.7) : 0;
  const spray = prog(f, T_RESP, T_RESP + 10);
  const d = LOOP.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  return (
    <g>
      {/* sensing loop */}
      <path d={d} fill="none" stroke={C.heat} strokeOpacity={0.25} strokeWidth={2} strokeDasharray="5 5" />
      <path d={d} fill="none" stroke={C.heat} strokeWidth={2.2} pathLength={100} strokeDasharray="100" strokeDashoffset={100 * (1 - draw)} />
      {f >= T_DETECT && f < T_DETECT + 18 && (
        <g>
          <circle cx={px} cy={py} r={9} fill={C.heat} opacity={0.35} />
          <circle cx={px} cy={py} r={3.5} fill="#FFF6E0" />
        </g>
      )}
      {/* nozzles */}
      {NOZZLES.map((x) => (
        <g key={x} opacity={prog(f, 6, 14)}>
          <rect x={x - 6} y={304} width={12} height={9} rx={2} fill="#7A8189" />
          <path d={`M${x - 4} 313 L${x + 4} 313 L${x + 2} 319 L${x - 2} 319 Z`} fill="#A8AEB4" />
        </g>
      ))}
      {/* discharge mist (conceptual) */}
      {spray > 0 &&
        NOZZLES.map((x, n) =>
          Array.from({ length: 34 }, (_, i) => {
            const life = (((f - T_RESP) * 0.045 + rand(i * 2.1 + n * 50)) % 1) * spray;
            const a = Math.PI / 2 + (rand(i * 4.3 + n) - 0.5) * 1.2;
            const dist = 4 + life * 78;
            return (
              <circle
                key={`${n}-${i}`}
                cx={x + Math.cos(a) * dist}
                cy={318 + Math.sin(a) * dist}
                r={0.8 + life * 2.4}
                fill="#F4F4F2"
                opacity={(1 - life) * 0.75 * spray}
              />
            );
          }),
        )}
      {/* alarm beacon on the handrail */}
      <g>
        <rect x={BEACON.x - 6} y={BEACON.y + 4} width={12} height={8} fill="#3A4047" />
        <path d={`M${BEACON.x - 7} ${BEACON.y + 4} A7 7 0 0 1 ${BEACON.x + 7} ${BEACON.y + 4} Z`} fill={alert ? C.ember : "#4A5058"} />
        {alert && <circle cx={BEACON.x} cy={BEACON.y} r={16 + beat * 6} fill={C.ember} opacity={0.25 + beat * 0.3} filter="url(#soft)" />}
      </g>
    </g>
  );
};

const STAGES = ["Detection", "Alert", "Suppression response"];

export const S4System: React.FC = () => {
  const f = useCurrentFrame();
  const stage = f >= T_RESP ? 2 : f >= T_ALERT ? 1 : f >= T_DETECT ? 0 : -1;
  const cam = {
    ...S4_CAM,
    z: S4_CAM.z + prog(f, 0, 150) * 0.12,
    cx: S4_CAM.cx - prog(f, 0, 150) * 10,
  };
  const heat = ip(f, [0, T_RESP, T_RESP + 40], [0.7, 0.85, 0.3], E.inOut);

  // reticle lock on the hotspot
  const lock = prog(f, T_DETECT + 8, T_DETECT + 18, E.out);
  const rw = ip(lock, [0, 1], [640, 330]);
  const rh = ip(lock, [0, 1], [440, 230]);
  const hs = { x: 540 + 0, y: 940 + 0 };

  const status =
    f >= T_RESP
      ? { t: "Suppression active", c: C.ok }
      : f >= T_ALERT
        ? { t: "Alert · alarm on", c: C.ember }
        : f >= T_DETECT + 14
          ? { t: "Heat detected · engine bay", c: C.heat }
          : { t: "Monitoring · engine bay", c: C.ok };

  // beacon position on screen (for ring waves)
  const bz = cam.z;
  const bx = 540 + (40 + BEACON.x - cam.cx) * bz;
  const by = 940 + (790 + BEACON.y - cam.cy) * bz;

  return (
    <AbsoluteFill>
      <World
        t={f + 330}
        cam={cam}
        headlights={0.5}
        rim={0.45}
        heat={heat}
        thermal={0.7}
        crush={0.55}
        towers={0.4}
        truckFilter="grayscale(0.7) brightness(0.9) contrast(1.12)"
        overlay={<Overlay f={f} />}
      />
      {/* technical grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(244,244,242,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(244,244,242,0.035) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(180deg, transparent 520px, black 640px, black 1180px, transparent 1260px)",
        }}
      />

      {/* alarm ring waves */}
      {f >= T_ALERT &&
        [0, 1, 2].map((i) => {
          const q = (((f - T_ALERT) / 22 + i / 3) % 1);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: bx - 20 - q * 90,
                top: by - 20 - q * 90,
                width: 40 + q * 180,
                height: 40 + q * 180,
                borderRadius: "50%",
                border: `3px solid ${C.ember}`,
                opacity: (1 - q) * 0.7 * (1 - prog(f, T_RESP + 30, T_RESP + 50)),
              }}
            />
          );
        })}

      {f >= T_DETECT + 6 && (
        <Reticle x={hs.x - rw / 2} y={hs.y - rh / 2} w={rw} h={rh} p={prog(f, T_DETECT + 6, T_DETECT + 14, E.out)} color={stage >= 2 ? C.ok : C.heat} len={36} />
      )}

      <TopShade opacity={0.95} to={700} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,11,12,0) 1120px, rgba(11,11,12,0.92) 1260px)" }} />

      {/* conceptual tag */}
      <div style={{ position: "absolute", right: 1080 - SAFE.x1, top: 610 }}>
        <Mono style={{ fontSize: 19, color: C.ash, letterSpacing: "0.12em" }}>Conceptual illustration</Mono>
      </div>

      {/* stepper: DETECTION -> ALERT -> SUPPRESSION RESPONSE */}
      <div style={{ position: "absolute", left: SAFE.x0, top: 392, width: 820 }}>
        <div style={{ position: "relative", height: 34 }}>
          {[0, 1].map((i) => {
            const fill = prog(f, [T_DETECT, T_ALERT, T_RESP][i + 1] - 10, [T_DETECT, T_ALERT, T_RESP][i + 1], E.out);
            const x0 = [17, 410][i];
            const x1 = [410, 803][i];
            return (
              <div key={i} style={{ position: "absolute", left: x0, top: 15, width: x1 - x0, height: 4, background: C.steel2 }}>
                <div style={{ width: `${fill * 100}%`, height: "100%", background: C.white }} />
              </div>
            );
          })}
          {[17, 410, 803].map((x, i) => {
            const on = stage >= i;
            const active = stage === i;
            const col = i === 2 ? C.ok : i === 1 ? C.ember : C.heat;
            const pop = prog(f, [T_DETECT, T_ALERT, T_RESP][i], [T_DETECT, T_ALERT, T_RESP][i] + 8, E.out);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x - 17,
                  top: 0,
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  border: `3px solid ${on ? col : C.line}`,
                  background: on ? col : C.black,
                  scale: `${1 + (active ? (1 - pop) * 0.5 : 0)}`,
                  boxShadow: active ? `0 0 0 ${8 * (1 - pop)}px rgba(255,255,255,0.15)` : undefined,
                }}
              />
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          {STAGES.map((s, i) => (
            <div
              key={s}
              style={{
                fontFamily: FONT.mono,
                fontWeight: 700,
                fontSize: 27,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                lineHeight: 1.2,
                width: i === 2 ? 260 : 240,
                textAlign: i === 0 ? "left" : i === 1 ? "center" : "right",
                color: stage >= i ? C.white : "#4A5058",
              }}
            >
              {i === 2 ? (
                <>
                  Suppression
                  <br />
                  response
                </>
              ) : (
                s
              )}
            </div>
          ))}
        </div>
      </div>

      {/* status bar */}
      <div
        style={{
          position: "absolute",
          left: SAFE.x0,
          top: 1146,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 18px",
          borderRadius: 12,
          background: "rgba(28,31,34,0.85)",
          border: `1.5px solid ${C.line}`,
          opacity: prog(f, 4, 12) * (1 - prog(f, T_LINE - 4, T_LINE + 4)),
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 6, background: status.c }} />
        <Mono style={{ fontSize: 24, color: C.white, letterSpacing: "0.1em" }}>{status.t}</Mono>
      </div>

      {/* the line */}
      <div style={{ position: "absolute", left: SAFE.x0, top: 1210 }}>
        <RevealLine
          words={["Fire", "response", "shouldn't"]}
          start={T_LINE}
          stagger={3}
          style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 64, color: C.white, lineHeight: 1.12 }}
        />
        <RevealLine
          words={["depend", "on", { w: "one", c: C.ember }, { w: "person.", c: C.ember }]}
          start={T_LINE + 8}
          stagger={3}
          style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 64, color: C.white, lineHeight: 1.12 }}
        />
      </div>
    </AbsoluteFill>
  );
};
