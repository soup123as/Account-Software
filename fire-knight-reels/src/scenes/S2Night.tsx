import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BAY_W, World } from "../fk/World";
import { C, E, ip, prog } from "../fk/theme";
import { Display, Reticle, Stack, TypeOn } from "../fk/ui";

/** Thermal viewfinder (screen space) - sits below the text zone. */
const RX = { x: 190, y: 1040, w: 700, h: 400 };

/** Engine bay framed low so the machine never runs into the text zone. */
export const ZOOM_BAY = { z: 2.2, cx: BAY_W.x, cy: BAY_W.y, ay: 1280 };

export const s2Camera = (f: number) => {
  // VO: "Raat ke do baje" 2.80-3.85 (local 3-35) | "Engine bay mein heat badh rahi hai" 4.38-6.55 (local 50-116)
  const p = prog(f, 44, 100, E.cam);
  const late = prog(f, 100, 127);
  return {
    z: ip(p, [0, 1], [1, ZOOM_BAY.z]) + late * 0.03,
    cx: ip(p, [0, 1], [540 + prog(f, 0, 44) * 14, ZOOM_BAY.cx]),
    cy: ip(p, [0, 1], [960, ZOOM_BAY.cy]),
    ax: 540,
    ay: ip(p, [0, 1], [960, ZOOM_BAY.ay]),
  };
};

/** Scene 2 | 4-8.5 s - night haul, slow push into the engine bay, thermal scan. */
export const S2Night: React.FC = () => {
  const f = useCurrentFrame();
  const cam = s2Camera(f);
  const scroll = f * 13 - Math.max(0, f - 46) * 4;
  const wheelAngle = scroll * 0.48;
  const bob = Math.sin(f * 0.6) * 1.6;
  const heat = ip(f, [20, 96, 127], [0.1, 0.6, 0.95], E.inOut);

  const ret = prog(f, 84, 96, E.out);
  const scanY = ip(f, [88, 110], [RX.y, RX.y + RX.h], E.inOut);
  const thermalOn = f >= 88;

  return (
    <AbsoluteFill>
      <World t={f + 81} cam={cam} scroll={scroll} wheelAngle={wheelAngle} bob={bob} rim={ip(f, [50, 110], [0.9, 0.6])} heat={heat} />

      {thermalOn && (
        <AbsoluteFill style={{ clipPath: `inset(${RX.y}px ${1080 - RX.x - RX.w}px ${1920 - scanY}px ${RX.x}px round 18px)` }}>
          <World
            t={f + 81}
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
        <Display words={["RAAT", "KE", { w: "2", c: C.gold }, "BAJE."]} at={3} out={40} />
      </Stack>

      <Stack top={380}>
        <TypeOn words={["Engine", "bay", "mein"]} at={50} out={114} color={C.fa} />
        <Display words={[{ w: "HEAT", c: C.gold }, "BADH"]} at={74} out={115} />
        <TypeOn words={["rahi", "hai."]} at={88} out={116} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};
