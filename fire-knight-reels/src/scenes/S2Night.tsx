import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BAY_W, World } from "../fk/World";
import { C, E, ip, prog } from "../fk/theme";
import { Display, Reticle, Stack, TopShade, TypeOn } from "../fk/ui";

/** Thermal viewfinder (screen space). */
const RX = { x: 170, y: 790, w: 740, h: 520 };

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

  return (
    <AbsoluteFill>
      <World t={f + 90} cam={cam} scroll={scroll} wheelAngle={wheelAngle} bob={bob} rim={ip(f, [50, 100], [0.85, 0.55])} heat={heat} />

      {thermalOn && (
        <AbsoluteFill
          style={{ clipPath: `inset(${RX.y}px ${1080 - RX.x - RX.w}px ${1920 - scanY}px ${RX.x}px round 18px)` }}
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

      <TopShade opacity={0.9} to={800} />

      <Stack top={380}>
        <Display words={["RAAT", { w: "2", c: C.gold }, "BAJE."]} at={3} out={54} />
      </Stack>

      <Stack top={380}>
        <TypeOn words={["Engine", "bay", "mein"]} at={58} out={114} color={C.fa} />
        <Display words={[{ w: "HEAT", c: C.gold }, "BADH"]} at={68} out={115} />
        <TypeOn words={["rahi", "hai."]} at={76} out={116} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};
