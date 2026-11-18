import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { TBAY_W, World } from "../fk/World";
import { C, FONT } from "../fk/theme";
import { Grain, Vignette } from "../fk/ui";

/**
 * Cover / thumbnail for the Truck Owners reel (1080 x 1920 still).
 * Everything that matters sits inside Instagram's 3:4 grid crop (y 240-1680).
 */
export const TruckThumbnail: React.FC = () => {
  const cam = { z: 1.32, cx: TBAY_W.x - 150, cy: TBAY_W.y - 60, ax: 540, ay: 1210 };
  const gx = 540 + (TBAY_W.x - cam.cx) * cam.z;
  const gy = cam.ay + (TBAY_W.y - cam.cy) * cam.z;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <World t={40} cam={cam} machine="truck" setting="highway" headlights={1} rim={0.95} heat={0.9} thermal={0.35} towers={1} dust={1} />
      {/* fire-orange heat bloom at the engine intake */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 360px 260px at ${gx}px ${gy}px, rgba(255,106,26,0.38) 0%, rgba(226,54,26,0) 100%)`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.95) 0px, rgba(0,0,0,0.85) 700px, rgba(0,0,0,0) 900px)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.92) 0px, rgba(0,0,0,0.6) 300px, rgba(0,0,0,0) 470px)" }} />

      <div style={{ position: "absolute", left: 120, top: 330, width: 840 }}>
        <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 64, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.fa }}>
          Truck owners,
          <br />
          aapka sabse bada
        </div>
        <div style={{ fontFamily: FONT.display, fontSize: 200, lineHeight: 1.0, letterSpacing: "0.01em", color: C.gold, marginTop: 6 }}>
          NUKSAAN
        </div>
        <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 64, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.white, marginTop: 6 }}>
          accident nahi…
        </div>
      </div>

      {/* small brand lockup, inside the 3:4 grid crop */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1500, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
        <Img src={staticFile("brand/emblem.png")} style={{ height: 84 }} />
        <Img src={staticFile("brand/wordmark-light.png")} style={{ height: 34 }} />
      </div>
      <Vignette strength={0.6} />
      <Grain opacity={0.04} />
    </AbsoluteFill>
  );
};
