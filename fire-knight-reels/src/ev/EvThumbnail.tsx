import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, REAL } from "../fk/theme";
import { Grain, Reticle, Vignette } from "../fk/ui";
import { CamView } from "../shop/fx";
import { Car, HOT, PACK } from "./Car";
import { Parking } from "./Parking";

/** Cover for the EV Owners reel (1080 x 1920 still); everything sits inside Instagram's 3:4 grid crop. */
export const EvThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: C.black }}>
    <CamView cam={{ z: 1.3, cx: 560, cy: 1160, ay: 1300 }}>
      <Parking place="basement" t={40}>
        <Car t={8} xray={0.62} heat={1} lights={0.5} glow={0.9} />
      </Parking>
      {/* the one warm module, drawn on top of the night so it reads at thumbnail size */}
      <defs>
        <radialGradient id="thHot">
          <stop offset="0" stopColor={REAL.fireCore} stopOpacity="1" />
          <stop offset="0.3" stopColor={REAL.fireYellow} stopOpacity="0.9" />
          <stop offset="0.65" stopColor={REAL.fireOrange} stopOpacity="0.55" />
          <stop offset="1" stopColor={REAL.fireRed} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={PACK.x0 + 4 + 4 * 44.6} y={PACK.y0} width={39} height={PACK.y1 - PACK.y0} rx={4} fill={REAL.fireYellow} opacity={0.95} />
      <ellipse cx={HOT.x} cy={HOT.y} rx={120} ry={66} fill="url(#thHot)" style={{ mixBlendMode: "screen" }} />
    </CamView>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.95) 0px, rgba(0,0,0,0.86) 760px, rgba(0,0,0,0) 960px)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.92) 0px, rgba(0,0,0,0.5) 260px, rgba(0,0,0,0) 400px)" }} />
    {/* the viewfinder on the one warm module */}
    <Reticle x={618 - 130} y={1370 - 92} w={260} h={184} color={C.gold} len={40} thick={4} />
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
