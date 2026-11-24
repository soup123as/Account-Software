import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT } from "../fk/theme";
import { Grain, Vignette } from "../fk/ui";
import { CamView } from "../shop/fx";
import { Room } from "./Room";

/**
 * Cover / thumbnail for the Smoke Alarm reel (1080 x 1920 still).
 * Everything that matters sits inside Instagram's 3:4 grid crop (y 240-1680).
 */
export const ServerThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: C.black }}>
    <CamView cam={{ z: 1.15, cx: 600, cy: 1150, ay: 1350 }}>
      <Room t={46} alarm={1} heat={1} flame={0.55} smoke={0.6} ok={[1, 1, 0.5]} />
    </CamView>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.95) 0px, rgba(0,0,0,0.86) 700px, rgba(0,0,0,0) 900px)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.92) 0px, rgba(0,0,0,0.55) 300px, rgba(0,0,0,0) 470px)" }} />
    <div style={{ position: "absolute", left: 120, top: 320, width: 840 }}>
      <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 64, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.fa }}>
        Smoke alarm
        <br />
        baj raha hai.
      </div>
      <div style={{ fontFamily: FONT.display, fontSize: 200, lineHeight: 1.0, letterSpacing: "0.01em", color: C.white, marginTop: 8 }}>
        AB <span style={{ color: C.gold }}>KYA?</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1560, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
      <Img src={staticFile("brand/emblem.png")} style={{ height: 84 }} />
      <Img src={staticFile("brand/wordmark-light.png")} style={{ height: 34 }} />
    </div>
    <Vignette strength={0.6} />
    <Grain opacity={0.04} />
  </AbsoluteFill>
);
