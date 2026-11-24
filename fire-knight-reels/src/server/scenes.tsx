import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, E, FONT, SAFE, TYPE, ip, noise1, prog } from "../fk/theme";
import { Display, Label, Reticle, Stack, TypeOn } from "../fk/ui";
import { Cam, CamView, toScreen } from "../shop/fx";
import { TopFade } from "../shop/scenes1";
import { CHAIR, Corridor } from "./Corridor";
import { COMODO, DET, HOT, RACK, RACKS, Room } from "./Room";
import { at } from "./timing";

const lerpCam = (a: Cam, b: Cam, p: number): Cam => ({
  z: ip(p, [0, 1], [a.z, b.z]),
  cx: ip(p, [0, 1], [a.cx, b.cx]),
  cy: ip(p, [0, 1], [a.cy, b.cy]),
  ax: ip(p, [0, 1], [a.ax ?? 540, b.ax ?? 540]),
  ay: ip(p, [0, 1], [a.ay ?? 960, b.ay ?? 960]),
});

const ROOM: Cam = { z: 0.95, cx: 540, cy: 1160, ay: 1310 };

const Concept: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <div style={{ position: "absolute", left: SAFE.x0, top: 1400, opacity: 0.85 * o, background: "rgba(0,0,0,0.62)", borderRadius: 8, padding: "8px 14px" }}>
    <Label style={{ fontSize: 20 }}>Conceptual illustration</Label>
  </div>
);

/** Sound rings around the detector (a UI graphic, so it is white, not coloured). */
const Rings: React.FC<{ t: number; o: number }> = ({ t, o }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const ph = (t * 0.035 + i / 3) % 1;
      const r = 70 + ph * 150;
      return (
        <g key={i} opacity={o * (1 - ph) * 0.8}>
          <path d={`M${DET.x - r} ${DET.y + 40} A ${r} ${r * 0.5} 0 0 0 ${DET.x - r * 0.72} ${DET.y + 40 + r * 0.36}`} stroke={C.fa} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          <path d={`M${DET.x + r} ${DET.y + 40} A ${r} ${r * 0.5} 0 0 1 ${DET.x + r * 0.72} ${DET.y + 40 + r * 0.36}`} stroke={C.fa} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </g>
      );
    })}
  </g>
);

/* ------------------------------------------------------------------ */
/* 1 HOOK - the alarm is doing its job. Then what?                      */
/* "Smoke alarm baj raha hai. Warning mil chuki hai. Par fire ko rokne ke liye ab kya?" */
/* ------------------------------------------------------------------ */
export const V1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const wa = at("hook", "warning");
  const par = at("hook", "par");
  const ak = at("hook", "abKya");
  const DETCAM: Cam = { z: 3.0, cx: DET.x, cy: DET.y + 26, ay: 1150 };
  const FIRE: Cam = { z: 1.25, cx: 600, cy: 1130, ay: 1320 };
  const cam = lerpCam(DETCAM, FIRE, prog(f, par - 8, ak + 24, E.cam));
  cam.z += prog(f, 0, par) * 0.12;
  cam.sx = noise1(f * 0.05, 3) * 2.5;
  const t = f + 40;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Room t={t} alarm={1} heat={ip(f, [0, ak], [0.7, 1])} flame={ip(f, [0, par, ak + 30], [0.12, 0.18, 0.34], E.inOut)} smoke={ip(f, [0, ak + 30], [0.3, 0.5])} />
        <Rings t={t} o={1 - prog(f, par - 6, par + 14)} />
      </CamView>
      <TopFade to={880} />
      <Stack top={380}>
        <TypeOn words={["Smoke", "alarm"]} at={-40} out={par - 6} color={C.fa} />
        <Display words={[{ w: "BAJ", c: C.gold }, "RAHA", "HAI."]} at={-40} out={par - 6} />
        <TypeOn words={["Warning", "mil", "chuki", "hai."]} at={wa} out={par - 6} weight={500} color={C.fa} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Par", "fire", "ko", "rokne", "ke", "liye"]} at={par} perLetter={0.8} color={C.fa} />
        <Display words={["AB", { w: "KYA?", c: C.gold }]} at={ak} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2 NIGHT - the office is shut and the room is alone.                  */
/* "Raat ke 2 baje hain. Office band hai. Server room mein koi nahi."   */
/* ------------------------------------------------------------------ */
export const V2Night: React.FC = () => {
  const f = useCurrentFrame();
  const ra = at("night", "raat");
  const of = at("night", "office");
  const ko = at("night", "koi");
  const WIDE: Cam = { z: 0.92, cx: 500, cy: 1190, ay: 1310 };
  const DOORC: Cam = { z: 1.3, cx: 600, cy: 1190, ay: 1300 };
  const cam = lerpCam(WIDE, DOORC, prog(f, ko - 14, ko + 60, E.cam));
  // the shot never sits still: a slow walk-up to the door with a little handheld drift
  cam.z += prog(f, 0, ko) * 0.11;
  cam.cx -= (1 - prog(f, 0, ko, E.out)) * 46;
  cam.sx = noise1(f * 0.045, 5) * 5;
  cam.sy = noise1(f * 0.04, 8) * 3;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Corridor t={f + 300} glow={1} />
      </CamView>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["Raat", "ke"]} at={ra} out={ko - 6} color={C.fa} />
        <Display words={[{ w: "2", c: C.gold }, "BAJE."]} at={ra + 8} out={ko - 6} />
        <TypeOn words={["Office", "band", "hai."]} at={of} out={ko - 6} color={C.fa} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Server", "room", "mein"]} at={ko} color={C.fa} />
        <Display words={["KOI", { w: "NAHI.", c: C.gold }]} at={ko + 18} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3 ALARM - it rings, and nobody is there to hear it.                  */
/* "Achanak smoke alarm bajta hai. Lekin alarm sunne wala wahan koi nahi." */
/* ------------------------------------------------------------------ */
export const V3Alarm: React.FC = () => {
  const f = useCurrentFrame();
  const ac = at("alarm", "achanak");
  const ba = at("alarm", "bajta");
  const le = at("alarm", "lekin");
  const kn = at("alarm", "koiNahi");
  const on = f >= ac + 4 ? 1 : 0;
  const roomCam: Cam = { ...ROOM, z: 0.95 + prog(f, 0, le) * 0.07, sx: on ? noise1(f * 0.8, 2) * 1.4 : 0 };
  const sw = prog(f, le - 8, le + 6, E.inOut);
  const CH: Cam = { z: 1.42, cx: CHAIR.x - 20, cy: 1300, ay: 1340 };
  const CH2: Cam = { z: 1.58, cx: CHAIR.x - 10, cy: 1300, ay: 1340 };
  const chairCam = lerpCam(CH, CH2, prog(f, le, le + 100, E.cam));
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ opacity: 1 - sw }}>
        <CamView cam={roomCam}>
          <Room t={f + 600} alarm={on} heat={ip(f, [0, le], [0.6, 0.95])} flame={ip(f, [0, le], [0.1, 0.26])} smoke={ip(f, [0, le], [0.2, 0.45])} />
          <Rings t={f} o={on * (1 - sw)} />
        </CamView>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: sw }}>
        <CamView cam={chairCam}>
          <Corridor t={f + 900} glow={0.9} alarm={1} leak={0.3} desk={1} />
        </CamView>
      </AbsoluteFill>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["Achanak", "smoke", "alarm"]} at={ac} out={le - 6} color={C.fa} />
        <Display words={[{ w: "BAJTA", c: C.gold }, "HAI."]} at={ba} out={le - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Lekin", "alarm", "sunne", "wala"]} at={le} perLetter={0.8} color={C.fa} />
        <Display words={["WAHAN", "KOI", { w: "NAHI.", c: C.gold }]} at={kn} size={112} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 4 DAMAGE - what the fire reaches before a person does.               */
/* "Aur jab tak koi response dene pahunche, aag critical servers, networking equipment aur poore IT */
/*  infrastructure ko damage kar sakti hai. Ek chhoti si incident... aur business operations ruk sakte hain." */
/* ------------------------------------------------------------------ */
export const V4Damage: React.FC = () => {
  const f = useCurrentFrame();
  const jt = at("damage", "jabTak");
  const se = at("damage", "servers");
  const ne = at("damage", "network");
  const inf = at("damage", "infra");
  const da = at("damage", "damage");
  const ch = at("damage", "chhoti");
  const bu = at("damage", "business");
  const ru = at("damage", "ruk");

  const SRV: Cam = { z: 1.85, cx: RACKS[0].x + RACK.w / 2 + 20, cy: 1200, ay: 1300 };
  const NET: Cam = { z: 2.2, cx: RACKS[1].x + RACK.w / 2, cy: 1080, ay: 1290 };
  const ALL: Cam = { z: 0.98, cx: 540, cy: 1160, ay: 1310 };
  const FIRE: Cam = { z: 1.45, cx: 740, cy: 1150, ay: 1310 };
  const END: Cam = { z: 0.9, cx: 540, cy: 1160, ay: 1310 };
  let cam = ROOM;
  cam = lerpCam(cam, SRV, prog(f, se - 10, se + 16, E.cam));
  cam = lerpCam(cam, NET, prog(f, ne - 8, ne + 16, E.cam));
  cam = lerpCam(cam, ALL, prog(f, inf - 8, inf + 22, E.cam));
  cam = lerpCam(cam, FIRE, prog(f, da - 10, da + 26, E.cam));
  cam = lerpCam(cam, END, prog(f, ch - 6, ru + 40, E.cam));
  cam = { ...cam, sx: noise1(f * 0.6, 4) * 1.2 };

  const flame = ip(f, [0, se, da, ch], [0.26, 0.45, 0.85, 1], E.inOut);
  const smoke = ip(f, [0, da, ru], [0.45, 0.8, 1]);
  const ok: [number, number, number] = [
    ip(f, [ch, bu, ru + 14, ru + 30], [1, 0.5, 0.2, 0]),
    ip(f, [da, ch, ru, ru + 18], [1, 0.5, 0.2, 0]),
    ip(f, [se, da, bu, ru + 6], [1, 0.5, 0.2, 0]),
  ];
  const which = f < ne - 6 ? 0 : 1;
  const hl = ip(f, [se - 8, se + 8, inf - 10, inf + 4], [0, 0.8, 0.8, 0]);
  const spot = { x: RACKS[which].x + RACK.w / 2, y: which === 0 ? 1200 : 1090, r: 230 };

  const chip = (n: string, a: string, b: string, t0: number, out: number) => (
    <Stack top={380}>
      <TypeOn words={[{ w: n, c: C.gold }]} at={t0} out={out} size={40} />
      <TypeOn words={a.split(" ")} at={t0 + 2} out={out} color={C.fa} />
      <Display words={[b]} at={t0 + 6} out={out} />
    </Stack>
  );
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Room t={f + 1200} alarm={1} heat={1} flame={flame} smoke={smoke} ok={ok} spot={spot} hl={hl} />
      </CamView>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["Aur", "jab", "tak", "koi", "response", "dene"]} at={jt} out={se - 6} perLetter={0.7} color={C.fa} />
        <Display words={["PAHUNCHE..."]} at={jt + 40} out={se - 6} />
      </Stack>
      {chip("01", "Critical", "SERVERS.", se, ne - 5)}
      {chip("02", "Networking", "EQUIPMENT.", ne, inf - 5)}
      {chip("03", "Poora IT", "INFRASTRUCTURE.", inf, da - 6)}
      <Stack top={380}>
        <TypeOn words={["Aag", "inhe"]} at={da - 2} out={ch - 6} color={C.fa} />
        <Display words={[{ w: "DAMAGE", c: C.gold }]} at={da} out={ch - 6} />
        <TypeOn words={["kar", "sakti", "hai."]} at={da + 14} out={ch - 6} color={C.fa} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Ek", "chhoti", "si", "incident..."]} at={ch} perLetter={0.8} color={C.fa} />
        <TypeOn words={["aur", "business", "operations"]} at={bu} perLetter={0.8} color={C.fa} />
        <Display words={[{ w: "RUK", c: C.gold }, "SAKTE", "HAIN."]} at={ru} size={112} />
      </Stack>
      <Concept o={prog(f, jt, jt + 14)} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 5 TURN - an alarm is not enough.                                    */
/* "Isiliye sirf alarm nahi, active fire protection bhi zaroori hai."   */
/* ------------------------------------------------------------------ */
export const V5Turn: React.FC = () => {
  const f = useCurrentFrame();
  const is = at("turn", "isiliye");
  const ac = at("turn", "active");
  const za = at("turn", "zaroori");
  const DETC: Cam = { z: 2.2, cx: DET.x + 40, cy: DET.y + 30, ay: 1180 };
  const WALL: Cam = { z: 1.75, cx: COMODO.x - 40, cy: COMODO.y + 110, ay: 1290 };
  const cam = lerpCam(DETC, WALL, prog(f, ac - 16, ac + 22, E.cam));
  cam.z += prog(f, 0, 150) * 0.05;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Room t={f + 2000} outline={prog(f, ac + 6, ac + 20, E.out)} />
      </CamView>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["Isiliye", "sirf"]} at={is} out={ac - 6} color={C.fa} />
        <Display words={["ALARM", { w: "NAHI.", c: C.gold }]} at={is + 16} out={ac - 6} />
      </Stack>
      <Stack top={380}>
        <Display words={[{ w: "ACTIVE", c: C.gold }]} at={ac} />
        <Display words={["FIRE", "PROTECTION"]} at={ac + 8} />
        <TypeOn words={["bhi", "zaroori", "hai."]} at={za} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 6 PRODUCT - the real Comodo render from thefireknight.in.            */
/* "Introducing The Comodo."                                            */
/* ------------------------------------------------------------------ */
export const V6Product: React.FC = () => {
  const f = useCurrentFrame();
  const it = at("product", "intro");
  const co = at("product", "comodo");
  const p = prog(f, 0, 20, E.out);
  const sweep = ip(f, [co - 2, co + 32], [-30, 130], E.inOut);
  const CW = 840;
  const CH = 600;
  const CT = 830;
  const W = 800;
  const Hh = (W * 1122) / 1402;
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
        <Img
          src={staticFile("product/comodo.webp")}
          style={{ position: "absolute", left: (CW - W) / 2, top: (CH - Hh) / 2 - 6, width: W, height: Hh, scale: `${1 + prog(f, 0, 100) * 0.035}` }}
        />
        {/* the render sits on white: grade the card to a studio light grey */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #e2e2e2 0%, #d2d2d2 60%, #bcbcbc 100%)", mixBlendMode: "multiply" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(110deg, rgba(255,255,255,0) ${sweep - 10}%, rgba(255,255,255,0.3) ${sweep}%, rgba(255,255,255,0) ${sweep + 10}%)`,
            mixBlendMode: "screen",
          }}
        />
      </div>
      <div style={{ position: "absolute", left: 120, top: CT + CH + 34, opacity: prog(f, co + 10, co + 22) }}>
        <Label style={{ color: C.silver }}>
          The Comodo <span style={{ color: C.gold }}>·</span> fire suppression aid
        </Label>
      </div>
      <Stack top={380}>
        <TypeOn words={["Introducing"]} at={it} color={C.fa} />
        <Display words={["THE", { w: "COMODO.", c: C.gold }]} at={co} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 7 SYSTEM - it detects and acts, with nobody in the building.         */
/* "Yeh flame aur heat detect karta hai aur automatically activate hokar fire protection provide karta hai. */
/*  Taaki server room mein danger detect hone ke baad protection ke liye sirf kisi ke pahunchne ka intezaar na karna pade." */
/* ------------------------------------------------------------------ */
const Chips: React.FC<{ names: string[]; on: number[]; f: number; out: number }> = ({ names, on, f, out }) => {
  const o = prog(f, out, out + 7, E.in);
  if (f < on[0] - 1 || o >= 1) return null;
  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 18, opacity: 1 - o, translate: `0 ${-o * 20}px` }}>
      {names.map((n, i) => {
        const p = prog(f, on[i], on[i] + 8, E.out);
        return (
          <div
            key={n}
            style={{
              padding: "10px 24px",
              borderRadius: 999,
              border: `1.5px solid ${p > 0.5 ? C.gold : "rgba(250,250,250,0.2)"}`,
              background: `rgba(240,178,66,${0.12 * p})`,
              fontFamily: FONT.sans,
              fontWeight: 600,
              fontSize: 34,
              color: C.fa,
              opacity: p,
              translate: `0 ${(1 - p) * 20}px`,
              filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
            }}
          >
            <span style={{ color: C.gold, marginRight: 10 }}>0{i + 1}</span>
            {n}
          </div>
        );
      })}
    </div>
  );
};

export const V7System: React.FC = () => {
  const f = useCurrentFrame();
  const fl = at("system", "flame");
  const he = at("system", "heat");
  const de = at("system", "detect");
  const au = at("system", "auto");
  const ac = at("system", "activate");
  const pr = at("system", "protection");
  const ta = at("system", "taaki");
  const pa = at("system", "pahunchne");
  const iz = at("system", "intezaar");

  const UNIT: Cam = { z: 1.7, cx: 770, cy: 1060, ay: 1320 };
  const UNIT2: Cam = { z: 1.9, cx: 780, cy: 1060, ay: 1320 };
  const WIDE: Cam = { z: 1.0, cx: 540, cy: 1160, ay: 1310 };
  let cam = lerpCam(UNIT, UNIT2, prog(f, 0, pr, E.cam));
  cam = lerpCam(cam, WIDE, prog(f, ta - 24, ta + 30, E.cam));
  cam = { ...cam, sx: f >= ac && f < pr + 40 ? noise1(f * 0.8, 2) * 1.0 : 0 };

  const flame = ip(f, [0, de, ac + 6, pr + 46], [0.12, 0.42, 0.46, 0], E.inOut);
  const mist = prog(f, ac, ac + 24, E.out) * (1 - prog(f, ta - 14, ta + 10));
  const sense = ip(f, [fl - 8, fl + 4, ac - 4, ac + 8], [0, 1, 1, 0]);
  const heat = ip(f, [0, ac, pr + 60, ta + 20], [0.8, 1, 0.5, 0.2]);
  const sw = prog(f, pa - 12, pa + 6, E.inOut);
  const CO: Cam = { z: 1.02, cx: 470, cy: 1220, ay: 1330 };
  const CO2: Cam = { z: 1.14, cx: 500, cy: 1220, ay: 1330 };
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ opacity: 1 - sw }}>
        <CamView cam={cam}>
          <Room t={f + 2600} heat={heat} flame={flame} comodo={1} sense={sense} mist={mist} smoke={ip(f, [0, ac, ta], [0.22, 0.3, 0.08])} />
        </CamView>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: sw }}>
        <CamView cam={lerpCam(CO, CO2, prog(f, pa - 12, pa + 110, E.cam))}>
          <Corridor t={f + 3000} glow={1} haze={0.6} desk={0.7} />
        </CamView>
      </AbsoluteFill>
      <TopFade to={860} />
      <Stack top={380}>
        <Chips names={["Flame", "Heat"]} on={[fl, he]} f={f} out={au - 6} />
        <Display words={[{ w: "DETECT", c: C.gold }]} at={de} out={au - 6} />
        <TypeOn words={["karta", "hai."]} at={de + 12} out={au - 6} color={C.fa} />
      </Stack>
      <Stack top={380}>
        <Display words={[{ w: "AUTOMATICALLY", c: C.gold }]} at={au} out={ta - 6} />
        <Display words={["ACTIVATE."]} at={ac} out={ta - 6} />
        <TypeOn words={["Fire", "protection", "provide", "karta", "hai."]} at={pr} out={ta - 6} perLetter={0.7} weight={500} color={C.fa} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Taaki", "danger", "detect", "hone", "ke", "baad"]} at={ta} out={pa - 6} perLetter={0.7} color={C.fa} />
        <TypeOn words={["protection", "ke", "liye..."]} at={ta + 44} out={pa - 6} perLetter={0.8} color={C.fa} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["kisi", "ke", "pahunchne", "ka"]} at={pa} perLetter={0.8} color={C.fa} />
        <Display words={["INTEZAAR", { w: "NAHI.", c: C.gold }]} at={iz} size={112} />
      </Stack>
      <Concept o={1 - sw} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 8 CTA - monitored, or protected too?                                */
/* "Aapke office ka server room sirf monitored hai, ya protected bhi?"  */
/* ------------------------------------------------------------------ */
const Callout: React.FC<{ x: number; y: number; w: number; h: number; p: number; color: string; text: string; lx: number; ly: number }> = ({ x, y, w, h, p, color, text, lx, ly }) => (
  <>
    <Reticle x={x} y={y} w={w} h={h} p={p} color={color} len={30} thick={3} />
    <div style={{ position: "absolute", left: lx, top: ly, opacity: ip(p, [0.4, 1], [0, 1]), translate: `${(1 - p) * 14}px 0` }}>
      <Label style={{ color, fontSize: 26 }}>{text}</Label>
    </div>
  </>
);

export const V8Cta: React.FC = () => {
  const f = useCurrentFrame();
  const aa = at("cta", "aapke");
  const mo = at("cta", "monitored");
  const pt = at("cta", "protected");
  const cam: Cam = { z: 1.0 + prog(f, 0, 153) * 0.04, cx: 560, cy: 1130, ay: 1330 };
  const d = toScreen(cam, DET.x, DET.y + 14);
  const c = toScreen(cam, COMODO.x, COMODO.y);
  const z = cam.z;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Room t={f + 3400} comodo={1} />
      </CamView>
      <TopFade to={780} />
      <Callout x={d.x - 78 * z} y={d.y - 40 * z} w={156 * z} h={86 * z} p={prog(f, mo, mo + 12, E.out)} color="rgba(250,250,250,0.85)" text="Monitored" lx={d.x + 94 * z} ly={d.y - 14} />
      <Callout x={c.x - 124 * z} y={c.y - 100 * z} w={248 * z} h={186 * z} p={prog(f, pt, pt + 12, E.out)} color={C.gold} text="Protected" lx={c.x - 124 * z} ly={c.y - 146 * z} />
      <Stack top={380}>
        <TypeOn words={["Aapke", "office", "ka", "server", "room"]} at={aa} perLetter={0.7} color={C.fa} />
        <Display words={["SIRF", "MONITORED?"]} at={mo} size={104} />
        <Display words={["YA", { w: "PROTECTED", c: C.gold }, "BHI?"]} at={pt} size={104} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 9 HERO - the unit, the logo, the way to reach the team.              */
/* "Discover The Comodo."  + DM us                                      */
/* ------------------------------------------------------------------ */
const EMBLEM_H = 300;
const EMBLEM_W = Math.round((EMBLEM_H * 762) / 909);
const WORD_W = 450;
const WORD_H = Math.round((WORD_W * 104) / 1077);
const WHATSAPP = "+91 79080 54311";

export const V9Hero: React.FC = () => {
  const f = useCurrentFrame();
  const di = at("hero", "discover");
  const fk = at("hero", "fk");
  const dm = at("hero", "dm");
  const pull = prog(f, fk - 14, fk + 30, E.cam);
  const CLOSE: Cam = { z: 2.5 + prog(f, 0, fk) * 0.12, cx: COMODO.x - 6, cy: COMODO.y + 4, ay: 1230 };
  const WIDE: Cam = { z: 0.8, cx: 540, cy: 1160, ay: 1400 };
  const cam = lerpCam(CLOSE, WIDE, pull);
  const em = prog(f, fk, fk + 16, E.out);
  const sheen = ip(f, [fk + 12, fk + 40], [-30, 130], E.inOut);
  const wm = prog(f, fk + 12, fk + 26, E.out);
  const tag = prog(f, fk + 22, fk + 34, E.out);
  const cta = prog(f, dm, dm + 14, E.out);
  const pulse = f > dm + 14 ? 0.5 + 0.5 * Math.sin((f - dm) * 0.12) : 0;
  const emblemSrc = staticFile("brand/emblem.png");
  const top = 400;
  const tagTop = top + EMBLEM_H + 40 + WORD_H + 40;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Room t={f + 3800} comodo={1} />
      </CamView>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.97) 0px, rgba(0,0,0,0.92) 1000px, rgba(0,0,0,0.35) 1400px)", opacity: prog(f, fk - 6, fk + 20) }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.95) 0px, rgba(0,0,0,0.85) 640px, rgba(0,0,0,0) 880px)", opacity: 1 - pull }} />
      <Stack top={380}>
        <TypeOn words={["Discover"]} at={di} out={fk - 8} color={C.fa} />
        <Display words={["THE", { w: "COMODO.", c: C.gold }]} at={di + 10} out={fk - 8} />
      </Stack>

      <div
        style={{
          position: "absolute",
          left: 540 - EMBLEM_W / 2,
          top,
          width: EMBLEM_W,
          height: EMBLEM_H,
          opacity: em,
          translate: `0 ${(1 - em) * 40}px`,
          scale: `${0.94 + 0.06 * em}`,
          filter: em < 1 ? `blur(${(1 - em) * 12}px)` : undefined,
        }}
      >
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
      <div
        style={{
          position: "absolute",
          left: SAFE.x0,
          width: SAFE.x1 - SAFE.x0,
          top: tagTop,
          textAlign: "center",
          fontFamily: FONT.sans,
          fontWeight: 500,
          fontSize: TYPE.support,
          letterSpacing: "-0.01em",
          color: C.fa,
          opacity: tag,
          translate: `0 ${(1 - tag) * 14}px`,
          filter: tag < 1 ? `blur(${(1 - tag) * 8}px)` : undefined,
        }}
      >
        Because every <span style={{ color: C.gold }}>second</span> matters.
      </div>
      <div
        style={{
          position: "absolute",
          left: SAFE.x0,
          width: SAFE.x1 - SAFE.x0,
          top: tagTop + 84,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          opacity: cta,
          translate: `0 ${(1 - cta) * 24}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 34px",
            borderRadius: 999,
            border: `2px solid ${C.gold}`,
            background: `rgba(240,178,66,${0.1 + 0.08 * pulse})`,
            boxShadow: `0 0 ${18 * pulse}px rgba(240,178,66,0.35)`,
            fontFamily: FONT.sans,
            whiteSpace: "nowrap",
          }}
        >
          <svg width={32} height={32} viewBox="0 0 24 24">
            <path d="M3 11.5 21 3l-8.5 18-2.2-7.3L3 11.5z" fill="none" stroke={C.gold} strokeWidth={2} strokeLinejoin="round" />
            <path d="M10.3 13.7 21 3" stroke={C.gold} strokeWidth={2} />
          </svg>
          <span style={{ fontWeight: 600, fontSize: 34, color: C.fa }}>
            <span style={{ color: C.gold }}>DM us</span> for a free consultation
          </span>
        </div>
        <Label style={{ fontSize: 22 }}>WhatsApp {WHATSAPP}</Label>
        <Label style={{ fontSize: 20, marginTop: -6 }}>thefireknight.in</Label>
      </div>
    </AbsoluteFill>
  );
};

/** Hot spot of the panel in world coordinates, for overlays. */
export const PANEL_HOT = HOT;
