import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BAY_W, World } from "../fk/World";
import { C, E, FONT, SAFE, ip, prog } from "../fk/theme";
import { Mono, Reticle, RevealLine, Slam, TopShade } from "../fk/ui";

/** Reticle (thermal viewfinder) in screen space. */
const RX = { x: 170, y: 790, w: 740, h: 520 };

/** Camera for scene 2 at local frame f. Exported so scene 4 / 5 can match it. */
export const ZOOM_BAY = { z: 2.5, cx: BAY_W.x, cy: BAY_W.y, ay: 1050 };

export const s2Camera = (f: number) => {
  const p = prog(f, 54, 100, E.cam);
  const late = prog(f, 100, 120);
  return {
    z: ip(p, [0, 1], [1, ZOOM_BAY.z]) + late * 0.12,
    cx: ip(p, [0, 1], [540 + prog(f, 0, 54) * 18, ZOOM_BAY.cx]),
    cy: ip(p, [0, 1], [960, ZOOM_BAY.cy]),
    ax: 540,
    ay: ip(p, [0, 1], [960, ZOOM_BAY.ay]),
  };
};

/** Scene 2 | 3-7 s - night haul, push into the engine bay, thermal reveals heat. */
export const S2Night: React.FC = () => {
  const f = useCurrentFrame();
  const cam = s2Camera(f);
  const scroll = f * 15 - Math.max(0, f - 60) * 4;
  const wheelAngle = scroll * 0.48;
  const bob = Math.sin(f * 0.6) * 1.6;
  const heat = ip(f, [24, 96, 120], [0.05, 0.55, 0.9], E.inOut);

  const ret = prog(f, 82, 94, E.out);
  const scanY = ip(f, [88, 110], [RX.y, RX.y + RX.h], E.inOut);
  const thermalOn = f >= 88;

  // story clock: 02:00:07 and counting (it's story time, not a spec)
  const secs = 7 + Math.floor(f / 5);
  const clock = `02:${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")} AM`;

  return (
    <AbsoluteFill>
      <World
        t={f + 90}
        cam={cam}
        scroll={scroll}
        wheelAngle={wheelAngle}
        bob={bob}
        headlights={1}
        rim={ip(f, [50, 100], [0.85, 0.55])}
        heat={heat}
      />

      {/* thermal view inside the viewfinder, revealed by a scan line */}
      {thermalOn && (
        <AbsoluteFill
          style={{
            clipPath: `inset(${RX.y}px ${1080 - RX.x - RX.w}px ${1920 - scanY}px ${RX.x}px round 18px)`,
          }}
        >
          <World
            t={f + 90}
            cam={cam}
            scroll={scroll}
            wheelAngle={wheelAngle}
            bob={bob}
            headlights={0}
            rim={0.25}
            heat={heat}
            thermal={1}
            crush={1}
            towers={0}
            dust={0}
            truckFilter="grayscale(1) brightness(0.95) contrast(1.25)"
          />
          {/* scan raster */}
          <AbsoluteFill
            style={{
              background:
                "repeating-linear-gradient(180deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 5px)",
            }}
          />
        </AbsoluteFill>
      )}
      {thermalOn && scanY < RX.y + RX.h - 2 && (
        <div
          style={{
            position: "absolute",
            left: RX.x,
            width: RX.w,
            top: scanY - 2,
            height: 3,
            background: C.heat,
            boxShadow: `0 0 18px 4px rgba(255,177,61,0.55)`,
          }}
        />
      )}
      <Reticle x={RX.x} y={RX.y} w={RX.w} h={RX.h} p={ret} color={C.white} />
      {ret > 0 && (
        <>
          <div style={{ position: "absolute", left: RX.x + 24, top: RX.y + RX.h - 52, opacity: ret }}>
            <Mono style={{ fontSize: 20, color: C.white }}>
              <span style={{ color: C.heat }}>●</span> Thermal · engine bay
            </Mono>
          </div>
          {/* rising heat bars - shape only, no numbers */}
          <div
            style={{
              position: "absolute",
              left: RX.x + RX.w - 190,
              top: RX.y + RX.h - 78,
              display: "flex",
              alignItems: "flex-end",
              gap: 6,
              height: 50,
              opacity: ret,
            }}
          >
            {Array.from({ length: 8 }, (_, i) => {
              const v = prog(f, 92 + i * 3, 104 + i * 3, E.out);
              return (
                <div
                  key={i}
                  style={{
                    width: 12,
                    height: 8 + v * (6 + i * 5.2),
                    borderRadius: 2,
                    background: i > 5 ? C.ember : i > 3 ? C.heat : C.ash,
                  }}
                />
              );
            })}
            <Mono style={{ fontSize: 20, color: C.ember, marginLeft: 8 }}>▲</Mono>
          </div>
        </>
      )}

      <TopShade opacity={0.9} to={800} />

      {/* RAAT 2 BAJE. */}
      <div style={{ position: "absolute", left: SAFE.x0, top: 388 }}>
        <Slam at={3} out={54} size={176}>
          Raat
        </Slam>
        <Slam at={6} out={55} size={176}>
          <span style={{ color: C.heat }}>2</span> baje.
        </Slam>
        <div
          style={{
            marginTop: 18,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            borderRadius: 10,
            border: `1.5px solid ${C.line}`,
            background: "rgba(28,31,34,0.7)",
            opacity: prog(f, 12, 20) * (1 - prog(f, 52, 58)),
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 5, background: C.ember, opacity: f % 20 < 12 ? 1 : 0.3 }} />
          <Mono style={{ fontSize: 30, color: C.white, letterSpacing: "0.08em" }}>{clock}</Mono>
        </div>
      </div>

      {/* Engine bay mein heat badh rahi hai. */}
      <div style={{ position: "absolute", left: SAFE.x0, top: 386 }}>
        <RevealLine
          words={["Engine", "bay", "mein"]}
          start={58}
          end={114}
          exit="blur"
          style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 58, color: "rgba(244,244,242,0.86)", lineHeight: 1.15 }}
        />
        <div style={{ height: 8 }} />
        <RevealLine
          words={[{ w: "HEAT", c: C.ember }, "BADH"]}
          start={62}
          end={114}
          exit="blur"
          style={{ fontFamily: FONT.slam, fontSize: 150, lineHeight: 0.92, color: C.white }}
        />
        <RevealLine
          words={["RAHI", "HAI."]}
          start={67}
          end={115}
          exit="blur"
          style={{ fontFamily: FONT.slam, fontSize: 150, lineHeight: 0.92, color: C.white }}
        />
      </div>
    </AbsoluteFill>
  );
};
