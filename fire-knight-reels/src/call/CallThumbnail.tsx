import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT } from "../fk/theme";
import { Grain, Vignette } from "../fk/ui";
import { CamView } from "../shop/fx";
import { Room } from "../server/Room";
import { Handset } from "./Handset";

/** Cover for the "Raat ka call" reel (1080 x 1920 still); everything sits inside the 3:4 grid crop. */
export const CallThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: C.black }}>
    <AbsoluteFill style={{ filter: "blur(9px)", opacity: 0.55 }}>
      <CamView cam={{ z: 1.15, cx: 560, cy: 1150, ay: 1320 }}>
        <Room t={46} alarm={1} heat={1} flame={0.5} smoke={0.5} />
      </CamView>
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.95) 0px, rgba(0,0,0,0.86) 700px, rgba(0,0,0,0) 900px)" }} />
    <div style={{ position: "absolute", left: 540 - 190, top: 850, scale: "0.86", transformOrigin: "50% 0" }}>
      <Handset screen="incoming" t={20} name="Security Desk" sub="Office · 2:01 AM" />
    </div>
    <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.95) 0px, rgba(0,0,0,0.7) 300px, rgba(0,0,0,0) 470px)" }} />
    <div style={{ position: "absolute", left: 120, top: 320, width: 840 }}>
      <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 64, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.fa }}>
        Raat 2 baje alarm.
        <br />
        Phir aapka phone.
      </div>
      <div style={{ fontFamily: FONT.display, fontSize: 190, lineHeight: 1.0, letterSpacing: "0.01em", color: C.white, marginTop: 8 }}>
        AB <span style={{ color: C.gold }}>KYA?</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1578, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
      <Img src={staticFile("brand/emblem.png")} style={{ height: 84 }} />
      <Img src={staticFile("brand/wordmark-light.png")} style={{ height: 34 }} />
    </div>
    <Vignette strength={0.6} />
    <Grain opacity={0.04} />
  </AbsoluteFill>
);
