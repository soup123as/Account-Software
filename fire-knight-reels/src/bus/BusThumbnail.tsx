import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT } from "../fk/theme";
import { Grain, Vignette } from "../fk/ui";
import { CamView } from "../shop/fx";
import { BusWorld } from "./BusWorld";

/** Cover for the Bus Owners reel; everything important sits inside the 3:4 grid crop (y 240-1680). */
export const BusThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: C.black }}>
    <CamView cam={{ z: 0.95, cx: 560, cy: 1110, ay: 1250 }}>
      <BusWorld t={40} scroll={300} cabinLight={1} xray={0.55} extGlow={0.8} heatEngine={0.85} poles={0.8} />
    </CamView>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.95) 0px, rgba(0,0,0,0.86) 760px, rgba(0,0,0,0) 980px)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.92) 0px, rgba(0,0,0,0.7) 330px, rgba(0,0,0,0) 440px)" }} />
    <div style={{ position: "absolute", left: 120, top: 330, width: 840 }}>
      <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 62, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.fa }}>
        Passengers ki safety ka
        <br />
        poora khayal…
      </div>
      <div style={{ fontFamily: FONT.display, fontSize: 168, lineHeight: 1.0, color: C.white, marginTop: 10 }}>PAR ENGINE</div>
      <div style={{ fontFamily: FONT.display, fontSize: 168, lineHeight: 1.0, color: C.gold }}>KA KYA?</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1560, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
      <Img src={staticFile("brand/emblem.png")} style={{ height: 84 }} />
      <Img src={staticFile("brand/wordmark-light.png")} style={{ height: 34 }} />
    </div>
    <Vignette strength={0.6} />
    <Grain opacity={0.04} />
  </AbsoluteFill>
);
