import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT } from "../fk/theme";
import { Grain, Vignette } from "../fk/ui";
import { CamView } from "./fx";
import { Shopfront } from "./Shopfront";

/**
 * Cover / thumbnail for the Shop Owners reel (1080 x 1920 still).
 * Everything that matters sits inside Instagram's 3:4 grid crop (y 240-1680).
 */
export const ShopThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: C.black }}>
    <CamView cam={{ z: 1.2, cx: 540, cy: 1210, ay: 1150 }}>
      <Shopfront t={52} cool={0} green={0} fire={1} smoke={1} heat={0.2} street={0.9} />
    </CamView>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.95) 0px, rgba(0,0,0,0.86) 760px, rgba(0,0,0,0) 960px)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.92) 0px, rgba(0,0,0,0.55) 300px, rgba(0,0,0,0) 470px)" }} />
    <div style={{ position: "absolute", left: 120, top: 320, width: 840 }}>
      <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 64, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.fa }}>
        Shutter gira ke
        <br />
        ghar jaate ho?
      </div>
      <div style={{ fontFamily: FONT.display, fontSize: 190, lineHeight: 1.0, letterSpacing: "0.01em", color: C.white, marginTop: 8 }}>
        ANDAR <span style={{ color: C.gold }}>KYA</span>
      </div>
      <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 64, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.fa, marginTop: 6 }}>
        chal raha hai…
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
