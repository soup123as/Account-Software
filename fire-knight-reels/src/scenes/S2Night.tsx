import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BAY_W, World } from "../fk/World";
import { C, E, ip, prog } from "../fk/theme";
import { Hit, Line, Reticle, ScanReveal, Stack } from "../fk/ui";

/** Thermal viewfinder (screen space) - sits below the text zone. */
const RX = { x: 190, y: 950, w: 700, h: 470 };

/** Engine bay framed low so the machine never runs into the text zone. */
export const ZOOM_BAY = { z: 2.2, cx: BAY_W.x, cy: BAY_W.y, ay: 1190 };

export const s2Camera = (f: number) => {
  const p = prog(f, 62, 120, E.cam);
  const late = prog(f, 120, 135);
  return {
    z: ip(p, [0, 1], [1, ZOOM_BAY.z]) + late * 0.06,
    cx: ip(p, [0, 1], [540 + prog(f, 0, 62) * 18, ZOOM_BAY.cx]),
    cy: ip(p, [0, 1], [960, ZOOM_BAY.cy]),
    ax: 540,
    ay: ip(p, [0, 1], [960, ZOOM_BAY.ay]),
  };
};

/** Scene 2 | 4-8.5 s - night haul, slow push into the engine bay, thermal scan. */
export const S2Night: React.FC = () => {
  const f = useCurrentFrame();
  const cam = s2Camera(f);
  const scroll = f * 13 - Math.max(0, f - 64) * 4;
  const wheelAngle = scroll * 0.48;
  const bob = Math.sin(f * 0.6) * 1.6;
  const heat = ip(f, [24, 110, 135], [0.05, 0.55, 0.9], E.inOut);

  const ret = prog(f, 100, 114, E.out);
  const scanY = ip(f, [106, 130], [RX.y, RX.y + RX.h], E.inOut);
  const thermalOn = f >= 106;

  return (
    <AbsoluteFill>
      <World t={f + 120} cam={cam} scroll={scroll} wheelAngle={wheelAngle} bob={bob} rim={ip(f, [50, 110], [0.9, 0.6])} heat={heat} />

      {thermalOn && (
        <AbsoluteFill style={{ clipPath: `inset(${RX.y}px ${1080 - RX.x - RX.w}px ${1920 - scanY}px ${RX.x}px round 18px)` }}>
          <World
            t={f + 120}
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
        </AbsoluteFill>
      )}
      {thermalOn && scanY < RX.y + RX.h - 2 && (
        <div
          style={{
            position: "absolute",
            left: RX.x,
            width: RX.w,
            top: scanY - 1,
            height: 2,
            background: C.gold,
            boxShadow: "0 0 16px 3px rgba(240,178,66,0.45)",
          }}
        />
      )}
      <Reticle x={RX.x} y={RX.y} w={RX.w} h={RX.h} p={ret} />

      {/* top calm field */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.6) 560px, rgba(0,0,0,0) 760px)" }} />

      <Stack top={380}>
        <ScanReveal at={4} out={56}>
          <Hit w={["RAAT", { w: "2", c: C.gold }, "BAJE."]} />
        </ScanReveal>
      </Stack>

      <Stack top={380}>
        <ScanReveal at={66} out={120} dur={18}>
          <Line w={["Engine", "bay", "mein"]} />
          <Hit w={[{ w: "HEAT", c: C.gold }, "BADH"]} />
          <Line w={["rahi", "hai."]} />
        </ScanReveal>
      </Stack>
    </AbsoluteFill>
  );
};
