import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { BAY_W, World } from "../fk/World";
import { C, E, FONT, SAFE, TYPE, ip, prog, rand } from "../fk/theme";
import { Display, Label, Reticle, Stack, TopShade, TypeOn } from "../fk/ui";

export const S4_CAM = { z: 2.3, cx: BAY_W.x, cy: BAY_W.y, ax: 540, ay: 940 };

const T_REHOOK = 2; // "TOH PHIR KAUN?" - re-opens the loop before the answer
const T_DETECT = 40;
const T_ALERT = 58;
const T_RESP = 74;
const T_PRODUCT = 90; // engine bay hands over to the product
const T_LINE = 96;

/** Linear heat detection loop around the engine bay (truck coordinates). */
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
  const draw = prog(f, T_DETECT - 8, T_DETECT + 6, E.inOut);
  const pulseU = prog(f, T_DETECT, T_DETECT + 14, E.inOut);
  const [px, py] = pointOnLoop(0.12 + pulseU * 0.3);
  const alert = f >= T_ALERT;
  const beat = alert ? 0.5 + 0.5 * Math.sin((f - T_ALERT) * 0.7) : 0;
  const spray = prog(f, T_RESP, T_RESP + 8);
  const d = LOOP.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  return (
    <g>
      <path d={d} fill="none" stroke={C.gold} strokeOpacity={0.25} strokeWidth={2} strokeDasharray="5 5" />
      <path d={d} fill="none" stroke={C.gold} strokeWidth={2.2} pathLength={100} strokeDasharray="100" strokeDashoffset={100 * (1 - draw)} />
      {f >= T_DETECT && f < T_DETECT + 18 && (
        <g>
          <circle cx={px} cy={py} r={9} fill={C.gold} opacity={0.35} />
          <circle cx={px} cy={py} r={3.5} fill={C.fa} />
        </g>
      )}
      {NOZZLES.map((x) => (
        <g key={x} opacity={prog(f, T_DETECT - 6, T_DETECT)}>
          <rect x={x - 6} y={304} width={12} height={9} rx={2} fill="#7A8189" />
          <path d={`M${x - 4} 313 L${x + 4} 313 L${x + 2} 319 L${x - 2} 319 Z`} fill="#A8AEB4" />
        </g>
      ))}
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
                fill={C.fa}
                opacity={(1 - life) * 0.75 * spray}
              />
            );
          }),
        )}
      <g>
        <rect x={BEACON.x - 6} y={BEACON.y + 4} width={12} height={8} fill="#3A4047" />
        <path d={`M${BEACON.x - 7} ${BEACON.y + 4} A7 7 0 0 1 ${BEACON.x + 7} ${BEACON.y + 4} Z`} fill={alert ? C.gold : "#4A5058"} />
        {alert && <circle cx={BEACON.x} cy={BEACON.y} r={16 + beat * 6} fill={C.gold} opacity={0.25 + beat * 0.3} filter="url(#soft)" />}
      </g>
    </g>
  );
};

const STAGES = [
  { at: T_DETECT, n: "01", t: "Detection" },
  { at: T_ALERT, n: "02", t: "Alert" },
  { at: T_RESP, n: "03", t: "Suppression response" },
];

export const S4System: React.FC = () => {
  const f = useCurrentFrame();
  const cam = { ...S4_CAM, z: S4_CAM.z + prog(f, 0, 150) * 0.12, cx: S4_CAM.cx - prog(f, 0, 150) * 10 };
  const heat = ip(f, [0, T_DETECT, T_RESP, T_RESP + 30], [0.8, 0.9, 0.9, 0.3], E.inOut);
  const lock = prog(f, T_DETECT + 8, T_DETECT + 18, E.out);
  const rw = ip(lock, [0, 1], [640, 330]);
  const rh = ip(lock, [0, 1], [440, 230]);
  const handover = prog(f, T_PRODUCT, T_PRODUCT + 14, E.inOut);

  // beacon on screen, for the alarm rings
  const bx = 540 + (40 + BEACON.x - cam.cx) * cam.z;
  const by = 940 + (790 + BEACON.y - cam.cy) * cam.z;

  // product reveal
  const pr = prog(f, T_PRODUCT + 4, T_PRODUCT + 22, E.out);
  const sweep = ip(f, [T_PRODUCT + 20, T_PRODUCT + 50], [-40, 140], E.inOut);

  return (
    <AbsoluteFill>
      {/* engine bay, conceptual */}
      <AbsoluteFill style={{ opacity: 1 - handover * 0.9, filter: handover > 0 ? `blur(${handover * 14}px)` : undefined }}>
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
        {f >= T_ALERT &&
          [0, 1, 2].map((i) => {
            const q = ((f - T_ALERT) / 22 + i / 3) % 1;
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
                  border: `2px solid ${C.gold}`,
                  opacity: (1 - q) * 0.6 * (1 - prog(f, T_RESP + 10, T_RESP + 24)),
                }}
              />
            );
          })}
        {f >= T_DETECT + 6 && (
          <Reticle
            x={540 - rw / 2}
            y={940 - rh / 2}
            w={rw}
            h={rh}
            p={prog(f, T_DETECT + 6, T_DETECT + 14, E.out)}
            color={f >= T_RESP ? "rgba(250,250,250,0.8)" : C.gold}
          />
        )}
        <div style={{ position: "absolute", left: SAFE.x0, top: 1230, opacity: 0.55 }}>
          <Label style={{ fontSize: 20 }}>Conceptual illustration</Label>
        </div>
      </AbsoluteFill>

      <TopShade opacity={0.95} to={700} />

      {/* re-hook: the loop opened in scene 1 is re-asked right before the answer */}
      <Stack top={370}>
        <Display words={["TOH", "PHIR", { w: "KAUN?", c: C.gold }]} at={T_REHOOK} out={T_DETECT - 8} />
      </Stack>

      {/* stage line: one at a time */}
      <Stack top={370} style={{ height: 80, overflow: "hidden" }}>
        {STAGES.map((s, i) => {
          const next = i < 2 ? STAGES[i + 1].at : T_PRODUCT - 4;
          const inP = prog(f, s.at + 1, s.at + 7, E.out);
          const outP = prog(f, next - 5, next, E.in);
          if (inP <= 0 || outP >= 1) return null;
          return (
            <div
              key={s.n}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                display: "flex",
                alignItems: "baseline",
                gap: 18,
                fontFamily: FONT.sans,
                whiteSpace: "nowrap",
                translate: `0 ${(1 - inP) * 70 - outP * 70}px`,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: TYPE.lead, color: C.gold }}>{s.n}</span>
              <span style={{ fontWeight: 600, fontSize: TYPE.lead, color: C.white, letterSpacing: "-0.02em" }}>{s.t}</span>
            </div>
          );
        })}
      </Stack>

      {/* product: the real Ranger cylinder */}
      {pr > 0 && (
        <>
          <div
            style={{
              position: "absolute",
              left: 170,
              top: 1150,
              width: 740,
              height: 60,
              borderRadius: "50%",
              background: "radial-gradient(ellipse at center, rgba(250,250,250,0.10) 0%, rgba(0,0,0,0) 70%)",
              opacity: pr,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: SAFE.x0,
              top: 800,
              width: 820,
              opacity: pr,
              translate: `0 ${(1 - pr) * 70}px`,
              scale: `${0.96 + 0.04 * pr + prog(f, T_PRODUCT, 150) * 0.03}`,
              filter: pr < 1 ? `blur(${(1 - pr) * 12}px)` : undefined,
            }}
          >
            <Img src={staticFile("product/ranger-cylinder.png")} style={{ width: "100%", display: "block" }} />
            {/* light sweep across the steel, masked to the product */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep - 12}%, rgba(255,255,255,0.38) ${sweep}%, rgba(255,255,255,0) ${sweep + 12}%)`,
                WebkitMaskImage: `url(${staticFile("product/ranger-cylinder.png")})`,
                WebkitMaskSize: "100% 100%",
                mixBlendMode: "screen",
              }}
            />
          </div>
          <div style={{ position: "absolute", left: SAFE.x0, top: 1230, opacity: prog(f, T_PRODUCT + 16, T_PRODUCT + 26) }}>
            <Label style={{ color: C.silver }}>
              The Ranger <span style={{ color: C.gold }}>·</span> fire suppression aid
            </Label>
          </div>
        </>
      )}

      {/* the line */}
      <Stack top={360}>
        <TypeOn words={["Fire", "response", "shouldn't"]} at={T_LINE} perLetter={0.7} color={C.fa} />
        <TypeOn words={["depend", "on"]} at={T_LINE + 12} perLetter={0.7} color={C.fa} />
        <Display words={[{ w: "ONE", c: C.gold }, { w: "PERSON.", c: C.gold }]} at={T_LINE + 18} />
      </Stack>
    </AbsoluteFill>
  );
};
