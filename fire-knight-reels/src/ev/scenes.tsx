import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, E, FONT, REAL, SAFE, TYPE, ip, noise1, prog } from "../fk/theme";
import { Display, Label, Reticle, Stack, TypeOn } from "../fk/ui";
import { Cam, CamView, toScreen } from "../shop/fx";
import { TopFade } from "../shop/scenes1";
import { Corridor, CHAIR } from "../server/Corridor";
import { Chips, lerpCam } from "../server/scenes";
import { Car, HOT, PACK, ZONES } from "./Car";
import { Dash } from "./Dash";
import { CCTV, Parking, Place } from "./Parking";
import { E_LEN, at } from "./timing";

const WIDE: Cam = { z: 0.95, cx: 540, cy: 1130, ay: 1300 };

/* ------------------------------------------------------------------ */
/* 1 HOOK - "EV owner ho? Toh yeh 30 seconds shayad aapke liye zyada important hain than you think." */
/* ------------------------------------------------------------------ */
export const E1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const ye = at("hook", "yeh");
  const zy = at("hook", "zyada");
  const th = at("hook", "than");
  const UNDER: Cam = { z: 1.5, cx: 560, cy: 1190, ay: 1290 };
  const cam = lerpCam(WIDE, UNDER, prog(f, ye, E_LEN.hook, E.cam));
  cam.sx = noise1(f * 0.05, 3) * 2.5;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Parking place="basement" t={f + 30}>
          <Car t={f + 30} charging={1} lights={0.25} glow={ip(f, [0, E_LEN.hook], [0.55, 1])} />
        </Parking>
      </CamView>
      <TopFade to={880} />
      <Stack top={380}>
        <Display words={[{ w: "EV", c: C.gold }, "OWNER", "HO?"]} at={-40} out={ye - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Toh", "yeh", "30", "seconds", "shayad"]} at={ye} perLetter={0.8} color={C.fa} />
        <Display words={[{ w: "ZYADA", c: C.gold }, "IMPORTANT"]} at={zy + 10} size={112} />
        <TypeOn words={["hain...", "than", "you", "think."]} at={th} weight={500} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2 DASH - "Aap battery percentage check karte ho. Range dekhte ho. Charging status dekhte ho. */
/*           Basically, gaadi kaafi kuch bata deti hai."                 */
/* ------------------------------------------------------------------ */
export const E2Dash: React.FC = () => {
  const f = useCurrentFrame();
  const ba = at("dash", "battery");
  const ra = at("dash", "range");
  const ch = at("dash", "charging");
  const bt = E_LEN.dash + 10;
  const hl = f < ba - 2 ? -1 : f < ra - 3 ? 0 : f < ch - 3 ? 1 : f < bt - 4 ? 2 : -1;
  const cam: Cam = { z: 1.0 + prog(f, 0, E_LEN.dash) * 0.06, cx: 540, cy: 1040, ay: 1240 };
  const chip = (n: string, a: string, b: string, t0: number, out: number) => (
    <Stack top={380}>
      <TypeOn words={[{ w: n, c: C.gold }]} at={t0} out={out} size={40} />
      <TypeOn words={a.split(" ")} at={t0 + 2} out={out} color={C.fa} />
      <Display words={[b]} at={t0 + 8} out={out} />
    </Stack>
  );
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Dash t={f} hl={hl} on={prog(f, 0, 14, E.out)} />
      </CamView>
      <TopFade to={860} />
      {chip("01", "Battery", "PERCENTAGE.", ba, ra - 5)}
      {chip("02", "Range", "DEKHTE HO.", ra, ch - 5)}
      {chip("03", "Charging", "STATUS.", ch, bt - 6)}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3 HEAT - "But ek cheez usually screen par nahi dikhti - battery area ya electrical system mein */
/*           unusual heat build-up ho raha ho toh?"                      */
/* ------------------------------------------------------------------ */
export const E3Heat: React.FC = () => {
  const f = useCurrentFrame();
  const bu = at("heat", "but");
  const nd = at("heat", "nahiD");
  const ar = at("heat", "batArea");
  const un = at("heat", "unusual");
  const UNDER: Cam = { z: 1.75, cx: HOT.x - 60, cy: 1190, ay: 1300 };
  const cam = lerpCam(WIDE, UNDER, prog(f, nd, ar + 30, E.cam));
  cam.z += prog(f, ar, E_LEN.heat) * 0.1;
  const xray = prog(f, nd - 6, nd + 18, E.out);
  const heat = ip(f, [ar, un, E_LEN.heat], [0, 0.45, 1], E.inOut);
  const h = toScreen(cam, HOT.x, HOT.y);
  const rp = prog(f, un + 6, un + 20, E.out);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Parking place="basement" t={f + 300}>
          <Car t={f + 300} xray={xray} heat={heat} lights={0.2} charging={1 - xray} />
        </Parking>
      </CamView>
      <TopFade to={860} />
      <Reticle x={h.x - 130} y={h.y - 90} w={260} h={180} p={rp} color={C.gold} len={34} thick={3} />
      <Stack top={380}>
        <TypeOn words={["But", "ek", "cheez", "screen", "par"]} at={bu} out={ar - 6} perLetter={0.8} color={C.fa} />
        <Display words={["NAHI", { w: "DIKHTI.", c: C.gold }]} at={nd} out={ar - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Battery", "ya", "electrical", "system", "mein"]} at={ar} perLetter={0.7} color={C.fa} />
        <Display words={[{ w: "UNUSUAL", c: C.gold }, "HEAT?"]} at={un} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 4 PLACES - "Aur daily use mein car kahan-kahan hoti hai? Office parking. Mall basement. */
/*             Charging station. Society parking. Mostly, aapki direct nazar se bahar." */
/* ------------------------------------------------------------------ */
export const E4Places: React.FC = () => {
  const f = useCurrentFrame();
  const ka = at("places", "kahan");
  const cues = [at("places", "office"), at("places", "mall"), at("places", "charger"), at("places", "society")];
  const nz = at("places", "nazar");
  const bw = at("places", "baharW");
  const places: Place[] = ["office", "basement", "charger", "society"];
  const names: [string, string][] = [
    ["Office", "PARKING."],
    ["Mall", "BASEMENT."],
    ["Charging", "STATION."],
    ["Society", "PARKING."],
  ];
  return (
    <AbsoluteFill style={{ background: C.black }}>
      {places.map((p, i) => {
        const a = i === 0 ? -100 : cues[i] - 3;
        const b = i < 3 ? cues[i + 1] - 3 : 1e6;
        if (f < a - 4 || f > b + 6) return null;
        const o = Math.min(prog(f, a - 3, a + 3), 1 - prog(f, b, b + 6));
        const local = f - Math.max(0, a);
        const cam: Cam = { z: 0.92 + Math.min(1, local / 90) * 0.07, cx: 540, cy: 1120, ay: 1300, sx: noise1(f * 0.05, i) * 2 };
        return (
          <AbsoluteFill key={p} style={{ opacity: o }}>
            <CamView cam={cam}>
              <Parking place={p} t={f + i * 200}>
                <Car t={f + i * 200} lights={0.25} charging={p === "charger" ? 1 : 0} />
              </Parking>
            </CamView>
          </AbsoluteFill>
        );
      })}
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["Aur", "daily", "use", "mein", "car"]} at={ka} out={cues[0] - 5} perLetter={0.8} color={C.fa} />
        <Display words={[{ w: "KAHAN-KAHAN?", c: C.gold }]} at={ka + 26} out={cues[0] - 5} />
      </Stack>
      {names.map(([a, b], i) => {
        const out = i < 3 ? cues[i + 1] - 4 : nz - 4;
        return (
          <Stack key={b + i} top={380}>
            <TypeOn words={[{ w: `0${i + 1}`, c: C.gold }]} at={cues[i]} out={out} size={40} />
            <TypeOn words={[a]} at={cues[i] + 1} out={out} perLetter={0.6} color={C.fa} />
            <Display words={[b]} at={cues[i] + 4} out={out} />
          </Stack>
        );
      })}
      <Stack top={380}>
        <TypeOn words={["Mostly,", "aapki", "direct"]} at={nz} color={C.fa} />
        <Display words={["NAZAR", "SE", { w: "BAHAR.", c: C.gold }]} at={bw} size={112} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 5 GAP - "Toh agar kuch unusual start ho... aapko pehle kaise pata chalega? CCTV? Security? */
/*          Ya tab, jab problem visible ho?"                             */
/* ------------------------------------------------------------------ */
export const E5Gap: React.FC = () => {
  const f = useCurrentFrame();
  const ks = at("gap", "kaise");
  const cc = at("gap", "cctv");
  const se = at("gap", "security");
  const vi = at("gap", "visible");
  const vw = at("gap", "visW");
  const LEN = E_LEN.gap;
  const CAMC: Cam = { z: 2.3, cx: CCTV.x - 20, cy: CCTV.y + 40, ay: 1180 };
  let cam = lerpCam({ ...WIDE, z: 1.0 }, { ...WIDE, z: 1.1 }, prog(f, 0, cc, E.cam));
  cam = lerpCam(cam, CAMC, prog(f, cc - 8, cc + 8, E.cam));
  const sw1 = prog(f, se - 5, se + 3);
  const sw2 = prog(f, vi - 5, vi + 3);
  const SMOKE: Cam = { z: 1.05 + prog(f, vi, LEN) * 0.08, cx: 560, cy: 1140, ay: 1300 };
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ opacity: 1 - sw1 }}>
        <CamView cam={cam}>
          <Parking place="basement" t={f + 700} cctv={prog(f, cc - 4, cc + 8)}>
            <Car t={f + 700} lights={0.2} glow={0.5} />
          </Parking>
        </CamView>
      </AbsoluteFill>
      {/* the security desk: nobody at it */}
      <AbsoluteFill style={{ opacity: sw1 * (1 - sw2) }}>
        <CamView cam={{ z: 1.45 + prog(f, se, vi) * 0.08, cx: CHAIR.x - 30, cy: 1300, ay: 1340 }}>
          <Corridor t={f + 900} glow={0.3} desk={1} />
        </CamView>
      </AbsoluteFill>
      {/* by the time it shows, it is already smoke */}
      <AbsoluteFill style={{ opacity: sw2 }}>
        <CamView cam={SMOKE}>
          <Parking place="basement" t={f + 1100}>
            <Car t={f + 1100} lights={0.2} glow={1} smoke={ip(f, [vi, LEN], [0.3, 0.95])} />
          </Parking>
        </CamView>
      </AbsoluteFill>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["aapko", "pehle"]} at={ks} out={cc - 5} color={C.fa} />
        <Display words={[{ w: "KAISE", c: C.gold }, "PATA", "CHALEGA?"]} at={ks + 10} out={cc - 5} size={104} />
      </Stack>
      <Stack top={380}>
        <Display words={["CCTV?"]} at={cc} out={se - 4} />
      </Stack>
      <Stack top={380}>
        <Display words={["SECURITY?"]} at={se} out={vi - 5} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Ya", "tab,", "jab", "problem"]} at={vi} color={C.fa} />
        <Display words={[{ w: "VISIBLE", c: C.gold }, "HO?"]} at={vw - 6} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 6 REAL GAP - "The real gap is simple: risk pehle start hota hai, visibility baad mein aati hai." */
/* ------------------------------------------------------------------ */
export const E6Real: React.FC = () => {
  const f = useCurrentFrame();
  const ri = at("real", "risk");
  const vs = at("real", "vis");
  const cam: Cam = { z: 1.12 + prog(f, 0, E_LEN.real) * 0.08, cx: 560, cy: 1130, ay: 1210 };
  const heat = ip(f, [ri - 10, vs, E_LEN.real], [0.1, 0.7, 1]);
  const line = prog(f, ri + 6, vs, E.inOut);
  const X0 = 220;
  const X1 = 740;
  const Y = 1392;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Parking place="basement" t={f + 1400}>
          <Car t={f + 1400} xray={0.85} heat={heat} lights={0.15} smoke={ip(f, [vs - 4, E_LEN.real], [0, 0.8])} />
        </Parking>
      </CamView>
      <TopFade to={860} />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.95) 0px, rgba(0,0,0,0.9) 500px, rgba(0,0,0,0) 640px)" }} />
      {/* the gap, drawn as a line: where risk starts, and where it becomes visible */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={X0} y1={Y} x2={X0 + (X1 - X0) * line} y2={Y} stroke={C.gold} strokeWidth={4} strokeDasharray="14 10" opacity={f >= ri ? 1 : 0} />
        {f >= ri && <circle cx={X0} cy={Y} r={11 + 3 * Math.sin(f * 0.2)} fill={C.gold} />}
        {f >= vs && <circle cx={X1} cy={Y} r={11} fill={C.fa} />}
      </svg>
      <div style={{ position: "absolute", left: X0 - 90, top: Y + 26, width: 180, textAlign: "center", opacity: prog(f, ri, ri + 10) }}>
        <Label style={{ color: C.gold, fontSize: 24 }}>Risk</Label>
      </div>
      <div style={{ position: "absolute", left: X1 - 110, top: Y + 26, width: 220, textAlign: "center", opacity: prog(f, vs, vs + 10) }}>
        <Label style={{ color: C.fa, fontSize: 24 }}>Visible</Label>
      </div>
      <div style={{ position: "absolute", left: (X0 + X1) / 2 - 110, top: Y - 56, width: 220, textAlign: "center", opacity: prog(f, vs + 6, vs + 18) }}>
        <Label style={{ color: C.fa, fontSize: 22 }}>The gap</Label>
      </div>
      <Stack top={380}>
        <Display words={[{ w: "RISK", c: C.gold }, "PEHLE."]} at={ri} />
        <Display words={["VISIBILITY", "BAAD", "MEIN."]} at={vs} size={104} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 7 PRODUCT - "Yahin The Sentinel ka role start hota hai."              */
/* ------------------------------------------------------------------ */
export const E7Product: React.FC = () => {
  const f = useCurrentFrame();
  const ya = at("product", "yahin");
  const sn = at("product", "sentinel");
  const p = prog(f, 0, 20, E.out);
  const sweep = ip(f, [sn - 2, sn + 32], [-30, 130], E.inOut);
  const CW = 840;
  const CH = 540;
  const CT = 800;
  const W = 760;
  const Hh = (W * 568) / 800;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <div
        style={{
          position: "absolute",
          left: 540 - CW / 2,
          top: CT,
          width: CW,
          height: CH,
          borderRadius: 28,
          overflow: "hidden",
          background: "#ffffff",
          boxShadow: "0 40px 120px rgba(0,0,0,0.75), 0 0 0 1px rgba(250,250,250,0.08)",
          opacity: p,
          translate: `0 ${(1 - p) * 60}px`,
          scale: `${0.96 + 0.04 * p}`,
          filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined,
        }}
      >
        <Img src={staticFile("product/sentinel-system.png")} style={{ position: "absolute", left: (CW - W) / 2, top: (CH - Hh) / 2, width: W, height: Hh, scale: `${1 + prog(f, 0, E_LEN.product) * 0.04}` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #e2e2e2 0%, #d2d2d2 60%, #bcbcbc 100%)", mixBlendMode: "multiply" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, rgba(255,255,255,0) ${sweep - 10}%, rgba(255,255,255,0.3) ${sweep}%, rgba(255,255,255,0) ${sweep + 10}%)`, mixBlendMode: "screen" }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: CT + CH + 34, opacity: prog(f, sn + 10, sn + 22) }}>
        <Label style={{ color: C.silver }}>
          The Sentinel <span style={{ color: C.gold }}>·</span> fire suppression aid
        </Label>
      </div>
      <Stack top={380}>
        <TypeOn words={["Yahin"]} at={ya} color={C.fa} />
        <Display words={["THE", { w: "SENTINEL.", c: C.gold }]} at={sn} />
        <TypeOn words={["ka", "role", "start", "hota", "hai."]} at={sn + 26} weight={500} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 8 SYSTEM - "Yeh vehicle ke critical zones ko continuously monitor karta hai - flame aur rapidly rising */
/*  heat detect karne ke liye. Aur threat detect hote hi, system targeted suppression response */
/*  automatically trigger kar sakta hai."                                */
/* ------------------------------------------------------------------ */
export const E8System: React.FC = () => {
  const f = useCurrentFrame();
  const zo = at("system", "zones");
  const mo = at("system", "monitorW");
  const fl = at("system", "flame");
  const he = at("system", "heat2");
  const de = at("system", "detect");
  const th = at("system", "threat");
  const ta = at("system", "targeted");
  const au = at("system", "auto");
  const ALL: Cam = { z: 1.1, cx: 540, cy: 1130, ay: 1290 };
  const BAT: Cam = { z: 1.8, cx: 560, cy: 1185, ay: 1300 };
  let cam = lerpCam(ALL, { ...ALL, z: 1.18 }, prog(f, 0, th, E.cam));
  cam = lerpCam(cam, BAT, prog(f, th - 6, th + 30, E.cam));
  cam = { ...cam, sx: f >= ta && f < au + 30 ? noise1(f * 0.8, 2) * 1.0 : 0 };
  const heat = ip(f, [fl - 10, th, ta + 6, au + 40], [0, 0.9, 1, 0.1], E.inOut);
  const mist = prog(f, ta + 4, ta + 24, E.out);
  const lab = prog(f, mo, mo + 12, E.out) * (1 - prog(f, th - 12, th - 4));
  const zl = (k: keyof typeof ZONES, text: string, dx: number, dy: number) => {
    const s = toScreen(cam, ZONES[k].x, ZONES[k].y);
    return (
      <div key={k} style={{ position: "absolute", left: s.x + dx, top: s.y + dy, opacity: lab, background: "rgba(0,0,0,0.6)", borderRadius: 6, padding: "4px 10px" }}>
        <Label style={{ color: C.fa, fontSize: 20 }}>{text}</Label>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Parking place="basement" t={f + 1800}>
          <Car t={f + 1800} xray={0.9} heat={heat} lights={0.15} sentinel={prog(f, 0, 16, E.out)} sense={ip(f, [zo, zo + 12, ta, ta + 10], [0, 1, 1, 0])} mist={mist} />
        </Parking>
      </CamView>
      <TopFade to={860} />
      {zl("motor", "Motor bay", -60, -120)}
      {zl("cabin", "Cabin", -40, -84)}
      {zl("battery", "Battery", 120, 70)}
      <Stack top={380}>
        <TypeOn words={["Critical", "zones", "ko", "continuously"]} at={zo} out={fl - 6} perLetter={0.8} color={C.fa} />
        <Display words={[{ w: "MONITOR.", c: C.gold }]} at={mo} out={fl - 6} />
      </Stack>
      <Stack top={380}>
        <Chips names={["Flame", "Rising heat"]} on={[fl, he]} f={f} out={th - 6} />
        <Display words={[{ w: "DETECT", c: C.gold }]} at={de} out={th - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Threat", "detect", "hote", "hi,"]} at={th} color={C.fa} />
        <Display words={[{ w: "TARGETED", c: C.gold }]} at={ta} />
        <Display words={["SUPPRESSION"]} at={ta + 8} />
        <TypeOn words={["automatically", "trigger", "kar", "sakta", "hai."]} at={au} perLetter={0.7} weight={500} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 10 ENDING - "Aap insurance lete ho. Regular servicing karvate ho. Dashcam lagvate ho. Because the car */
/*   matters. Toh fire protection ko optional kyun treat karein? The Sentinel." */
/* ------------------------------------------------------------------ */
const Tile: React.FC<{ x: number; y: number; n: string; label: string; p: number; tick?: number; gold?: boolean; children: React.ReactNode }> = ({ x, y, n, label, p, tick = 0, gold, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 398,
      height: 300,
      borderRadius: 26,
      overflow: "hidden",
      background: "linear-gradient(180deg, #17191c 0%, #0c0d0f 100%)",
      border: `1.5px solid ${gold ? C.gold : "rgba(250,250,250,0.12)"}`,
      boxShadow: gold ? "0 0 36px rgba(240,178,66,0.2)" : "0 24px 60px rgba(0,0,0,0.6)",
      opacity: p,
      translate: `0 ${(1 - p) * 40}px`,
      scale: `${0.94 + 0.06 * p}`,
      filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
    }}
  >
    <svg width={398} height={220} viewBox="0 0 398 220" style={{ position: "absolute", left: 0, top: 0 }}>
      {children}
    </svg>
    <div style={{ position: "absolute", left: 22, bottom: 20, fontFamily: FONT.sans, fontWeight: 600, fontSize: 30, color: C.fa, letterSpacing: "-0.01em" }}>
      <span style={{ color: C.gold, marginRight: 10 }}>{n}</span>
      {label}
    </div>
    {tick > 0 && (
      <svg width={44} height={44} viewBox="0 0 24 24" style={{ position: "absolute", right: 18, bottom: 16, scale: `${1.4 - 0.4 * tick}`, opacity: tick }}>
        <circle cx={12} cy={12} r={11} fill="#fafafa" />
        <path d="M6.5 12.5 10.5 16.5 17.5 8" fill="none" stroke="#0b0b0b" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </div>
);

const EMBLEM_H = 300;
const EMBLEM_W = Math.round((EMBLEM_H * 762) / 909);
const WORD_W = 450;
const WORD_H = Math.round((WORD_W * 104) / 1077);
const WHATSAPP = "+91 79080 54311";

export const E10Ending: React.FC = () => {
  const f = useCurrentFrame();
  const ins = at("ending", "insurance");
  const srv = at("ending", "servicing");
  const dc = at("ending", "dashcam");
  const be = at("ending", "because");
  const op = at("ending", "optional");
  const ow = at("ending", "optW");
  const fk = at("ending", "fk");
  const lg = at("ending", "logo");
  const cs = at("ending", "consult");
  const dm = at("ending", "dm");
  const gone = prog(f, fk - 8, fk);
  const out2 = prog(f, lg - 8, lg);
  const em = prog(f, lg, lg + 16, E.out);
  const sheen = ip(f, [lg + 12, lg + 40], [-30, 130], E.inOut);
  const wm = prog(f, lg + 8, lg + 22, E.out);
  const tag = prog(f, lg + 22, lg + 34, E.out);
  const cta = prog(f, cs, cs + 14, E.out);
  const hit = prog(f, dm, dm + 8, E.out);
  const num = prog(f, dm + 6, dm + 18, E.out);
  const emblemSrc = staticFile("brand/emblem.png");
  const top = 400;
  const tagTop = top + EMBLEM_H + 40 + WORD_H + 40;
  const X = SAFE.x0;
  const Y = 730;
  const tp = (a: number) => prog(f, a, a + 12, E.out);
  const ps = prog(f, fk, fk + 18, E.out) * (1 - out2);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ opacity: 1 - gone, filter: gone > 0 ? `blur(${gone * 12}px)` : undefined }}>
        <Tile x={X} y={Y} n="01" label="Insurance" p={tp(ins)} tick={prog(f, ins + 16, ins + 24, E.out)}>
          {/* the policy paper */}
          <g transform="rotate(-5 200 110)">
            <rect x={120} y={22} width={160} height={186} rx={6} fill="#f4f2ec" />
            <rect x={120} y={22} width={160} height={34} rx={6} fill="#1d4f9c" />
            <rect x={134} y={34} width={90} height={8} rx={4} fill="#fff" opacity={0.9} />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={134} y={72 + i * 20} width={i % 2 ? 96 : 130} height={7} rx={3.5} fill="#bdb8ac" />
            ))}
            <path d="M150 176 q10 -16 28 -16 h28 q14 0 22 16 h10 v10 h-96 v-10 z" fill="#3a3f45" />
            <circle cx={170} cy={188} r={8} fill="#14161a" />
            <circle cx={222} cy={188} r={8} fill="#14161a" />
            <rect x={206} y={118} width={62} height={26} rx={4} fill="none" stroke="#1F9D55" strokeWidth={3} transform="rotate(-10 236 130)" />
            <text x={237} y={137} textAnchor="middle" fontFamily="FK DM Sans" fontWeight={700} fontSize={15} fill="#1F9D55" transform="rotate(-10 236 130)">
              ACTIVE
            </text>
          </g>
        </Tile>
        <Tile x={X + 422} y={Y} n="02" label="Servicing" p={tp(srv)} tick={prog(f, srv + 16, srv + 24, E.out)}>
          {/* the car on a lift, a spanner */}
          <rect x={60} y={176} width={278} height={8} rx={4} fill="#8d949a" />
          <path d="M120 176 L170 120 M278 176 L228 120 M120 120 L170 176 M278 120 L228 176" stroke="#aab1b8" strokeWidth={6} strokeLinecap="round" />
          <rect x={92} y={112} width={214} height={8} rx={4} fill="#c9ced3" />
          <path d="M96 110 q4 -22 26 -26 l30 -4 l28 -30 q46 -8 86 0 l30 30 q14 4 14 30 z" fill="#e9ecef" />
          <path d="M160 78 l22 -24 q40 -6 74 0 l22 24 z" fill="#1c2733" />
          <circle cx={132} cy={108} r={18} fill="#14161a" />
          <circle cx={270} cy={108} r={18} fill="#14161a" />
          <g transform="rotate(38 330 70)">
            <rect x={322} y={40} width={16} height={84} rx={6} fill="#c9ced3" />
            <path d="M312 26 a18 18 0 1 1 36 0 l-10 0 l0 -10 l-16 0 l0 10 z" fill="#c9ced3" />
          </g>
        </Tile>
        <Tile x={X} y={Y + 324} n="03" label="Dashcam" p={tp(dc)} tick={prog(f, dc + 16, dc + 24, E.out)}>
          {/* windscreen top edge, mirror, the camera with its red light */}
          <path d="M0 0 H398 V40 Q200 70 0 40 Z" fill="#101317" />
          <path d="M0 40 Q200 70 398 40" stroke="#3a3f45" strokeWidth={3} fill="none" />
          <rect x={150} y={52} width={98} height={30} rx={12} fill="#1b1e22" stroke="#5a6068" strokeWidth={2} />
          <rect x={196} y={34} width={8} height={22} fill="#3a3f45" />
          <rect x={258} y={60} width={92} height={62} rx={12} fill="#0c0d0f" stroke="#6b727a" strokeWidth={2} />
          <circle cx={292} cy={91} r={20} fill="#15181c" stroke="#8d949a" strokeWidth={3} />
          <circle cx={292} cy={91} r={9} fill="#05070a" />
          <circle cx={287} cy={86} r={3} fill="#fff" opacity={0.6} />
          <circle cx={334} cy={74} r={5} fill={REAL.lampRed} opacity={0.5 + 0.5 * Math.sin(f * 0.25)} />
          <polygon points="270,122 320,122 398,220 150,220" fill="#EAF4FF" opacity={0.06} />
        </Tile>
        <Tile x={X + 422} y={Y + 324} n="04" label="Fire protection" p={tp(op)} gold={f >= ow}>
          <rect x={110} y={40} width={178} height={150} rx={16} fill="rgba(240,178,66,0.06)" stroke={C.gold} strokeWidth={3} strokeDasharray="12 9" strokeDashoffset={-f * 0.5} />
          <text x={199} y={150} textAnchor="middle" fontFamily="FK Anton" fontSize={120} fill={C.gold}>
            ?
          </text>
        </Tile>
        {f >= ow && (
          <div style={{ position: "absolute", left: X + 440, top: Y + 324 + 16, rotate: "-6deg", scale: `${1.9 - 0.9 * prog(f, ow, ow + 5, E.out)}`, opacity: prog(f, ow, ow + 3) }}>
            <div style={{ padding: "6px 16px 2px", border: `4px solid ${C.gold}`, borderRadius: 8, background: "rgba(0,0,0,0.8)", color: C.gold, fontFamily: FONT.display, fontSize: 40, letterSpacing: "0.04em", lineHeight: 1.05 }}>OPTIONAL?</div>
          </div>
        )}
        <Stack top={380}>
          <TypeOn words={["Insurance", "lete", "ho."]} at={ins} out={be - 6} color={C.fa} />
          <TypeOn words={["Servicing", "karvate", "ho."]} at={srv} out={be - 6} color={C.fa} />
          <TypeOn words={["Dashcam", "lagvate", "ho."]} at={dc} out={be - 6} color={C.fa} />
        </Stack>
        <Stack top={380}>
          <TypeOn words={["Because"]} at={be} out={op - 6} color={C.fa} />
          <Display words={["THE", "CAR", { w: "MATTERS.", c: C.gold }]} at={be + 8} out={op - 6} size={112} />
        </Stack>
        <Stack top={380}>
          <TypeOn words={["Toh", "fire", "protection", "ko"]} at={op} color={C.fa} />
          <Display words={[{ w: "OPTIONAL", c: C.gold }, "KYUN?"]} at={ow} />
        </Stack>
      </AbsoluteFill>

      {/* "The Sentinel." - the product once more, then the logo */}
      <div style={{ position: "absolute", left: 540 - 380, top: 800, width: 760, height: 540, opacity: ps, translate: `0 ${(1 - prog(f, fk, fk + 18, E.out)) * 50}px` }}>
        <Img src={staticFile("product/sentinel-system-cut.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <AbsoluteFill style={{ opacity: 1 - out2 }}>
        <Stack top={380}>
          <Display words={["THE", { w: "SENTINEL.", c: C.gold }]} at={fk} />
        </Stack>
      </AbsoluteFill>

      <div style={{ position: "absolute", left: 540 - EMBLEM_W / 2, top, width: EMBLEM_W, height: EMBLEM_H, opacity: em, translate: `0 ${(1 - em) * 40}px`, scale: `${0.94 + 0.06 * em}`, filter: em < 1 ? `blur(${(1 - em) * 12}px)` : undefined }}>
        <Img src={emblemSrc} style={{ width: "100%", height: "100%", display: "block" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(115deg, rgba(255,255,255,0) ${sheen - 14}%, rgba(255,255,255,0.55) ${sheen}%, rgba(255,255,255,0) ${sheen + 14}%)`,
            WebkitMaskImage: `url(${emblemSrc})`,
            WebkitMaskSize: "100% 100%",
            mixBlendMode: "screen",
          }}
        />
      </div>
      <div style={{ position: "absolute", left: 540 - WORD_W / 2, top: top + EMBLEM_H + 40, width: WORD_W, height: WORD_H, clipPath: `inset(0 ${(1 - wm) * 100}% 0 0)`, opacity: wm > 0 ? 1 : 0 }}>
        <Img src={staticFile("brand/wordmark-light.png")} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>
      <div style={{ position: "absolute", left: SAFE.x0, width: SAFE.x1 - SAFE.x0, top: tagTop, textAlign: "center", fontFamily: FONT.sans, fontWeight: 500, fontSize: TYPE.support, letterSpacing: "-0.01em", color: C.fa, opacity: tag, translate: `0 ${(1 - tag) * 14}px` }}>
        Because every <span style={{ color: C.gold }}>second</span> matters.
      </div>
      <div style={{ position: "absolute", left: SAFE.x0, width: SAFE.x1 - SAFE.x0, top: tagTop + 84, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: cta, translate: `0 ${(1 - cta) * 24}px` }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 34px",
            borderRadius: 999,
            border: `2px solid ${C.gold}`,
            background: `rgba(240,178,66,${0.12 + 0.16 * hit})`,
            boxShadow: `0 0 ${34 * hit}px rgba(240,178,66,0.4)`,
            scale: `${1 + 0.06 * Math.sin(Math.min(1, prog(f, dm, dm + 12)) * Math.PI)}`,
            fontFamily: FONT.sans,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 34, color: C.fa }}>
            <span style={{ color: C.gold }}>DM us</span> for a free consultation
          </span>
        </div>
        <div style={{ opacity: num, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Label style={{ fontSize: 22 }}>WhatsApp {WHATSAPP}</Label>
          <Label style={{ fontSize: 20 }}>thefireknight.in</Label>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Battery pack bounds, for overlays. */
export const PACK_BOX = PACK;
