import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT } from "../fk/theme";
import { Grain, Vignette } from "../fk/ui";
import { CamView } from "../shop/fx";
import { Car } from "./Car";
import { Parking } from "./Parking";

/** Cover for the EV Owners reel (1080 x 1920 still); everything sits inside Instagram's 3:4 grid crop. */
export const EvThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: C.black }}>
    <CamView cam={{ z: 1.12, cx: 540, cy: 1150, ay: 1390 }}>
      <Parking place="basement" t={40}>
        <Car t={40} xray={0.85} heat={0.9} lights={0.2} />
      </Parking>
    </CamView>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.95) 0px, rgba(0,0,0,0.86) 760px, rgba(0,0,0,0) 960px)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.92) 0px, rgba(0,0,0,0.55) 300px, rgba(0,0,0,0) 470px)" }} />
    <div style={{ position: "absolute", left: 120, top: 320, width: 840 }}>
      <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 64, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.fa }}>EV owner ho?</div>
      <div style={{ fontFamily: FONT.display, fontSize: 132, lineHeight: 1.0, letterSpacing: "0.01em", color: C.white, marginTop: 10, whiteSpace: "nowrap" }}>
        JO SCREEN PAR
        <br />
        <span style={{ color: C.gold }}>NAHI</span> DIKHTA
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1570, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
      <Img src={staticFile("brand/emblem.png")} style={{ height: 84 }} />
      <Img src={staticFile("brand/wordmark-light.png")} style={{ height: 34 }} />
    </div>
    <Vignette strength={0.6} />
    <Grain opacity={0.04} />
  </AbsoluteFill>
);
