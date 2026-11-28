import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, E, FONT, REAL, SAFE, TYPE, ip, noise1, prog } from "../fk/theme";
import { Display, Label, Reticle, Stack, TypeOn } from "../fk/ui";
import { Cam, CamView, toScreen } from "../shop/fx";
import { Phone } from "../shop/Phone";
import { TopFade } from "../shop/scenes1";
import { Chips, lerpCam } from "../server/scenes";
import { BedRoom } from "./BedRoom";
import { BANK, BedTop, LAPTOP, P_BED, P_TABLE, P_UNDER, mixPos } from "./BedTop";
import { FlatPlan } from "./FlatPlan";
import { HeatSection } from "./HeatSection";
import { P_LEN, at } from "./timing";

const WIDE: Cam = { z: 0.82, cx: 600, cy: 1250, ay: 1250 };

/* ------------------------------------------------------------------ */
/* 1 HOOK - "Aaj raat bhi phone takiye ke paas charging par lagakar soyenge?" */
/* ------------------------------------------------------------------ */
export const P1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const tk = at("hook", "takiye");
  const ch = at("hook", "charging");
  const so = at("hook", "soyenge");
  const TIGHT: Cam = { z: 2.7, cx: P_BED.x - 40, cy: P_BED.y - 10, ay: 1290 };
  const cam = lerpCam(TIGHT, { ...WIDE, z: 0.9 }, prog(f, tk, P_LEN.hook + 10, E.cam));
  cam.sx = noise1(f * 0.05, 3) * 2;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <BedTop t={f} heat={ip(f, [0, P_LEN.hook], [0.3, 0.5])} pct={0.42} moon={0.2} />
      </CamView>
      <TopFade to={880} />
      <Stack top={380}>
        <TypeOn words={["Aaj", "raat", "bhi", "phone"]} at={-50} out={ch - 6} color={C.fa} />
        <Display words={[{ w: "TAKIYE", c: C.gold }, "KE", "PAAS"]} at={-40} out={ch - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["charging", "par", "lagakar"]} at={ch} color={C.fa} />
        <Display words={[{ w: "SOYENGE?", c: C.gold }]} at={so} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2 HABIT - "Hum sab yahi karte hain. Phone, power bank, kabhi laptop bhi. */
/*            Bistar par, chadar ke upar, raat bhar."                    */
/* ------------------------------------------------------------------ */
export const P2Habit: React.FC = () => {
  const f = useCurrentFrame();
  const hu = at("habit", "hum");
  const ph = at("habit", "phone");
  const bk = at("habit", "bank");
  const lp = at("habit", "laptop");
  const bi = at("habit", "bistar");
  const rb = at("habit", "raatBhar");
  const LEN = P_LEN.habit;
  const cam = lerpCam({ ...WIDE, z: 0.9 }, { ...WIDE, z: 0.8, cy: 1280 }, prog(f, 0, lp + 20, E.cam));
  cam.z += prog(f, bi, LEN) * 0.04;
  const night = prog(f, bi, LEN, E.inOut);
  const mark = (x: number, y: number, a: number, w: number, h: number) => {
    const s = toScreen(cam, x, y);
    const p = prog(f, a, a + 10, E.out) * (1 - prog(f, a + 22, a + 30));
    return <Reticle x={s.x - w / 2} y={s.y - h / 2} w={w} h={h} p={p} color={C.gold} len={22} thick={3} />;
  };
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <BedTop t={f + 200} heat={ip(f, [0, bi, LEN], [0.5, 0.55, 0.95])} pct={0.42 + 0.58 * night} bank={prog(f, bk, bk + 12, E.out)} laptop={prog(f, lp, lp + 12, E.out)} moon={0.2 + 0.62 * night} />
      </CamView>
      <TopFade to={880} />
      {mark(P_BED.x, P_BED.y, ph, 96, 124)}
      {mark(BANK.x, BANK.y, bk + 4, 130, 140)}
      {mark(LAPTOP.x, LAPTOP.y - 30, lp + 4, 330, 290)}
      <Stack top={380}>
        <TypeOn words={["Hum", "sab"]} at={hu} out={ph - 6} color={C.fa} />
        <Display words={[{ w: "YAHI", c: C.gold }, "KARTE", "HAIN."]} at={hu + 8} out={ph - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Phone,"]} at={ph} out={bi - 6} color={C.fa} size={64} />
        <TypeOn words={["power", "bank,"]} at={bk} out={bi - 6} color={C.fa} size={64} />
        <TypeOn words={["kabhi", { w: "laptop", c: C.gold }, "bhi."]} at={lp} out={bi - 6} color={C.fa} size={64} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Bistar", "par,", "chadar", "ke", "upar,"]} at={bi} perLetter={0.8} color={C.fa} />
        <Display words={[{ w: "RAAT", c: C.gold }, "BHAR."]} at={rb} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3 HEAT - "Charging mein phone garam hota hai. Table par woh garmi nikal jaati hai. */
/*           Takiye aur gadde mein wahin ruk jaati hai."                 */
/* ------------------------------------------------------------------ */
export const P3Heat: React.FC = () => {
  const f = useCurrentFrame();
  const ga = at("heat", "garam");
  const gw = at("heat", "garamW");
  const tb = at("heat", "table");
  const nk = at("heat", "nikal");
  const tk = at("heat", "takiye2");
  const rk = at("heat", "ruk");
  const LEN = P_LEN.heat;
  const sB = prog(f, tb - 8, tb);
  const sC = prog(f, tk - 8, tk);
  const TOP: Cam = { z: 2.0 + prog(f, 0, tb) * 0.2, cx: P_BED.x - 30, cy: P_BED.y - 6, ay: 1260 };
  const SIDE: Cam = { z: 1.38 + prog(f, tb - 8, tk) * 0.06, cx: 540, cy: 1250, ay: 1290 };
  const SIDE2: Cam = { z: 1.3 + prog(f, tk - 8, LEN) * 0.08, cx: 560, cy: 1262, ay: 1250 };
  return (
    <AbsoluteFill style={{ background: C.black }}>
      {sB < 1 && (
        <AbsoluteFill style={{ opacity: 1 - sB }}>
          <CamView cam={TOP}>
            <BedTop t={f + 500} heat={ip(f, [0, gw, tb], [0.45, 0.7, 1])} pct={0.71} bank={1} laptop={1} moon={0.5} />
          </CamView>
        </AbsoluteFill>
      )}
      {sB > 0 && sC < 1 && (
        <AbsoluteFill style={{ opacity: sB * (1 - sC) }}>
          <CamView cam={SIDE}>
            <HeatSection surface="table" t={f} heat={ip(f, [tb - 8, tb + 14], [0.2, 1])} />
          </CamView>
        </AbsoluteFill>
      )}
      {sC > 0 && (
        <AbsoluteFill style={{ opacity: sC }}>
          <CamView cam={SIDE2}>
            <HeatSection surface="pillow" t={f} heat={ip(f, [tk - 8, rk, LEN], [0.1, 0.55, 1], E.inOut)} />
          </CamView>
        </AbsoluteFill>
      )}
      <TopFade to={880} />
      <Stack top={380}>
        <TypeOn words={["Charging", "mein", "phone"]} at={ga} out={tb - 6} color={C.fa} />
        <Display words={[{ w: "GARAM", c: C.gold }, "HOTA", "HAI."]} at={gw} out={tb - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Table", "par", "woh", "garmi"]} at={tb} out={tk - 6} color={C.fa} />
        <Display words={[{ w: "NIKAL", c: C.gold }, "JAATI", "HAI."]} at={nk} out={tk - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Takiye", "aur", "gadde", "mein"]} at={tk} color={C.fa} />
        <Display words={["WAHIN", { w: "RUK", c: C.gold }, "JAATI", "HAI."]} at={rk} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 4 RULE - "Isiliye fire services kehti hain: bistar par ya takiye ke neeche charging nahi." */
/* ------------------------------------------------------------------ */
export const P4Rule: React.FC = () => {
  const f = useCurrentFrame();
  const is = at("rule", "isiliye");
  const sv = at("rule", "services");
  const bi = at("rule", "bistar2");
  const ne = at("rule", "neeche");
  const na = at("rule", "nahi");
  const cam: Cam = { z: 1.28 + prog(f, 0, P_LEN.rule) * 0.07, cx: 690, cy: 1064, ay: 1240 };
  const sl = prog(f, ne - 2, ne + 14, E.inOut);
  const pos = mixPos(P_BED, P_UNDER, sl);
  const s = toScreen(cam, pos.x, pos.y + sl * 30);
  const ring = prog(f, bi, bi + 12, E.out);
  const hit = f >= na ? 1 + 0.12 * Math.sin(Math.min(1, prog(f, na, na + 10)) * Math.PI) : 1;
  const R = 118;
  const circ = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <BedTop t={f + 900} pos={pos} under={sl > 0.02} heat={0.75} pct={0.86} bank={1} laptop={1} moon={0.6} />
      </CamView>
      <TopFade to={880} />
      {/* the rule, as a sign over the phone (red is the warning colour only) */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${s.x} ${s.y}) scale(${hit})`} opacity={ring > 0 ? 1 : 0}>
          <circle r={R} fill="rgba(227,40,28,0.08)" stroke={REAL.lampRed} strokeWidth={13} strokeDasharray={`${circ * ring} ${circ}`} transform="rotate(-135)" />
          <line x1={-R * 0.7} y1={-R * 0.7} x2={-R * 0.7 + R * 1.4 * prog(f, bi + 8, bi + 16, E.out)} y2={-R * 0.7 + R * 1.4 * prog(f, bi + 8, bi + 16, E.out)} stroke={REAL.lampRed} strokeWidth={13} strokeLinecap="round" opacity={f >= bi + 8 ? 1 : 0} />
        </g>
      </svg>
      <Stack top={380}>
        <TypeOn words={["Isiliye"]} at={is} out={bi - 6} color={C.fa} />
        <Display words={["FIRE", { w: "SERVICES", c: C.gold }]} at={sv} out={bi - 6} />
        <TypeOn words={["kehti", "hain:"]} at={sv + 14} out={bi - 6} weight={500} color={C.fa} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Bistar", "par", "ya", "takiye", "ke", "neeche"]} at={bi} perLetter={0.7} color={C.fa} />
        <Display words={["CHARGING", { w: "NAHI.", c: C.gold }]} at={na} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 5 FIX - "Aaj se phone table par rakhiye. Aadat hai, badal jayegi."   */
/* ------------------------------------------------------------------ */
export const P5Fix: React.FC = () => {
  const f = useCurrentFrame();
  const aj = at("fix", "aajSe");
  const tw = at("fix", "tableW");
  const ad = at("fix", "aadat");
  const bd = at("fix", "badal");
  const cam: Cam = { z: 0.98 + prog(f, 0, P_LEN.fix) * 0.05, cx: 700, cy: 1130, ay: 1250 };
  const mv = prog(f, tw - 4, tw + 18, E.inOut);
  const pos = mixPos(P_BED, P_TABLE, mv);
  const A = toScreen(cam, P_BED.x, P_BED.y);
  const B = toScreen(cam, P_TABLE.x, P_TABLE.y);
  const path = `M${A.x} ${A.y - 50} Q ${(A.x + B.x) / 2} ${Math.min(A.y, B.y) - 190} ${B.x} ${B.y - 60}`;
  const draw = prog(f, aj + 4, tw - 2, E.inOut);
  const gone = prog(f, tw + 14, tw + 24);
  const ok = prog(f, tw + 20, tw + 30, E.out);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <BedTop t={f + 1300} pos={pos} lift={Math.sin(mv * Math.PI)} heat={0.75 * (1 - prog(f, tw - 4, tw + 6))} pct={0.86} bank={1} laptop={1} moon={0.66} lamp={prog(f, tw + 18, tw + 44, E.out) * 0.55} dark={1 - 0.12 * prog(f, tw + 18, tw + 44)} />
      </CamView>
      <TopFade to={880} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d={path} pathLength={1} stroke={C.gold} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - draw} opacity={(draw > 0 ? 0.9 : 0) * (1 - gone)} />
        <g transform={`translate(${B.x} ${B.y - 60})`} opacity={prog(f, tw - 8, tw - 2) * (1 - gone)}>
          <path d="M-13 -16 L0 0 L13 -16" stroke={C.gold} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {/* done */}
        <g transform={`translate(${B.x + 58} ${B.y - 62}) scale(${1.5 - 0.5 * ok})`} opacity={ok}>
          <circle r={24} fill="#fafafa" />
          <path d="M-11 1 L-3 9 L12 -8" fill="none" stroke="#0b0b0b" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      <Stack top={380}>
        <TypeOn words={["Aaj", "se", "phone"]} at={aj} out={ad - 6} color={C.fa} />
        <Display words={[{ w: "TABLE", c: C.gold }, "PAR."]} at={tw} out={ad - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Aadat", "hai,"]} at={ad} color={C.fa} />
        <Display words={["BADAL", { w: "JAYEGI.", c: C.gold }]} at={bd} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 6 TURN - "Lekin ghar mein charger ek nahi hai. Aur raat bhi ek nahi." */
/* ------------------------------------------------------------------ */
export const P6Turn: React.FC = () => {
  const f = useCurrentFrame();
  const lk = at("turn", "lekin");
  const en = at("turn", "ekNahi");
  const rt = at("turn", "raat");
  const e2 = at("turn", "ekNahi2");
  const cam: Cam = { z: 1.0 + prog(f, 0, P_LEN.turn) * 0.04, cx: 540, cy: 1150, ay: 1096 };
  let points = 0;
  for (let i = 0; i < 5; i++) points += prog(f, lk + 8 + i * 8, lk + 16 + i * 8, E.out);
  let nights = 0;
  for (let i = 0; i < 7; i++) nights += prog(f, rt + i * 4, rt + i * 4 + 6, E.out);
  const on = prog(f, 0, 14, E.out);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ opacity: on, scale: `${1.04 - 0.04 * on}` }}>
        <CamView cam={cam}>
          <FlatPlan t={f} points={points} nights={nights} />
        </CamView>
      </AbsoluteFill>
      <Stack top={380}>
        <TypeOn words={["Lekin", "ghar", "mein", "charger"]} at={lk} out={rt - 6} color={C.fa} />
        <Display words={["EK", { w: "NAHI.", c: C.gold }]} at={en} out={rt - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Aur", "raat", "bhi"]} at={rt} color={C.fa} />
        <Display words={["EK", { w: "NAHI.", c: C.gold }]} at={e2} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 7 PRODUCT - "Protector kamre ki ceiling par lagta hai."              */
/* ------------------------------------------------------------------ */
export const P7Product: React.FC = () => {
  const f = useCurrentFrame();
  const pr = at("product", "protector");
  const ce = at("product", "ceiling");
  const p = prog(f, 0, 20, E.out);
  const sweep = ip(f, [pr, pr + 34], [-30, 130], E.inOut);
  const CW = 840;
  const CH = 560;
  const CT = 820;
  const W = 900;
  const Hh = (W * 1920) / 2560;
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
          background: "#d6d6d6",
          boxShadow: "0 40px 120px rgba(0,0,0,0.75), 0 0 0 1px rgba(250,250,250,0.08)",
          opacity: p,
          translate: `0 ${(1 - p) * 60}px`,
          scale: `${0.96 + 0.04 * p}`,
          filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined,
        }}
      >
        <Img src={staticFile("product/protector.webp")} style={{ position: "absolute", left: (CW - W) / 2, top: (CH - Hh) / 2 + 10, width: W, height: Hh, scale: `${1 + prog(f, 0, P_LEN.product) * 0.035}` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.12) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, rgba(255,255,255,0) ${sweep - 10}%, rgba(255,255,255,0.28) ${sweep}%, rgba(255,255,255,0) ${sweep + 10}%)`, mixBlendMode: "screen" }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: CT + CH + 34, opacity: prog(f, pr + 10, pr + 22) }}>
        <Label style={{ color: C.silver }}>
          The Protector <span style={{ color: C.gold }}>·</span> fire suppression aid
        </Label>
      </div>
      <Stack top={380}>
        <Display words={[{ w: "PROTECTOR.", c: C.gold }]} at={pr} />
        <TypeOn words={["Kamre", "ki", "ceiling", "par", "lagta", "hai."]} at={ce} perLetter={0.8} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 8 SYSTEM - "Flame, garmi aur gas sense karta hai, siren bajata hai, aur khud activate hota hai. */
/*             Alert aapke phone par."                                   */
/* ------------------------------------------------------------------ */
export const P8System: React.FC = () => {
  const f = useCurrentFrame();
  const fl = at("system", "flame");
  const gm = at("system", "garmi");
  const gs = at("system", "gas");
  const sn = at("system", "sense");
  const sr = at("system", "siren");
  const kh = at("system", "khud");
  const ac = at("system", "activate");
  const al = at("system", "alert");
  const ap = at("system", "aapke");
  const cam: Cam = { z: 0.84 + prog(f, 0, al) * 0.05, cx: 540, cy: 1250, ay: 1190, sx: f >= sr && f < al - 6 ? noise1(f * 0.8, 2) * 1.1 : 0 };
  const heat = ip(f, [0, fl, sn], [0.25, 0.5, 1]);
  const flame = ip(f, [gm, sr, ac + 8, ac + 44], [0, 0.7, 0.8, 0], E.inOut);
  const smoke = ip(f, [fl, sr, ac + 40, al], [0, 0.45, 0.55, 0.2]);
  const sense = ip(f, [fl - 4, fl + 6, sr - 6, sr + 2], [0, 1, 1, 0]);
  const alarm = f >= sr ? 1 - prog(f, al - 10, al - 2) : 0;
  const mist = prog(f, ac, ac + 24, E.out) * (1 - prog(f, al - 10, al));
  const back = prog(f, al - 8, al + 6, E.inOut);
  const ph = prog(f, al - 4, al + 14, E.out);
  const note = prog(f, al + 8, al + 20, E.out);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ filter: back > 0 ? `blur(${back * 9}px)` : undefined, opacity: 1 - back * 0.45 }}>
        <CamView cam={cam}>
          <BedRoom t={f + 2000} heat={heat * (1 - prog(f, ac + 10, ac + 44))} flame={flame} smoke={smoke} sense={sense} alarm={alarm} mist={mist} phone={back} />
        </CamView>
      </AbsoluteFill>
      <TopFade to={880} />
      {back > 0 && (
        <div style={{ position: "absolute", left: 540 - 190, top: 880, opacity: ph, translate: `0 ${(1 - ph) * 70}px`, filter: note > 0 && note < 1 ? `drop-shadow(0 0 ${note * 30}px rgba(227,40,28,0.5))` : undefined }}>
          <Phone mode="alert" t={f} note={note} time="2:14" app="PROTECTOR" title="Fire alert: Bedroom" body="Protector activated · tap to view" danger />
        </div>
      )}
      <Stack top={380}>
        <Chips names={["Flame", "Garmi", "Gas"]} on={[fl, gm, gs]} f={f} out={sr - 6} />
        <Display words={[{ w: "SENSE", c: C.gold }, "KARTA", "HAI."]} at={sn} out={sr - 6} />
      </Stack>
      <Stack top={380}>
        <Display words={[{ w: "SIREN", c: C.gold }]} at={sr} out={kh - 6} />
        <TypeOn words={["bajata", "hai,"]} at={sr + 10} out={kh - 6} color={C.fa} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["aur"]} at={kh} out={al - 6} color={C.fa} />
        <Display words={[{ w: "KHUD", c: C.gold }, "ACTIVATE."]} at={kh + 5} out={al - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Alert"]} at={al} color={C.fa} />
        <Display words={[{ w: "AAPKE", c: C.gold }, "PHONE", "PAR."]} at={ap} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 9 CTA - "Yeh reel family group mein bhejiye. Aaj raat se pehle."     */
/* ------------------------------------------------------------------ */
const EMBLEM_H = 300;
const EMBLEM_W = Math.round((EMBLEM_H * 762) / 909);
const WORD_W = 450;
const WORD_H = Math.round((WORD_W * 104) / 1077);
const WHATSAPP = "+91 79080 54311";

const Avatar: React.FC<{ x: number; bg: string }> = ({ x, bg }) => (
  <div style={{ position: "absolute", left: x, top: 0, width: 76, height: 76, borderRadius: "50%", background: bg, border: "4px solid #15171b", overflow: "hidden" }}>
    <svg width={68} height={68} viewBox="0 0 68 68">
      <circle cx={34} cy={27} r={12} fill="rgba(255,255,255,0.75)" />
      <path d="M10 70 C 12 50 22 43 34 43 C 46 43 56 50 58 70 Z" fill="rgba(255,255,255,0.75)" />
    </svg>
  </div>
);

export const P9Cta: React.FC = () => {
  const f = useCurrentFrame();
  const re = at("cta", "reel");
  const fa = at("cta", "family");
  const ar = at("cta", "aajRaat");
  const lg = at("cta", "logo");
  const sh = at("cta", "share");
  const card = prog(f, 0, 16, E.out);
  const send = prog(f, fa, fa + 14, E.out);
  const seen = prog(f, fa + 26, fa + 34, E.out);
  const out = prog(f, lg - 10, lg - 2);
  const em = prog(f, lg, lg + 16, E.out);
  const sheen = ip(f, [lg + 12, lg + 40], [-30, 130], E.inOut);
  const wm = prog(f, lg + 8, lg + 22, E.out);
  const tag = prog(f, lg + 22, lg + 34, E.out);
  const cta = prog(f, sh - 6, sh + 8, E.out);
  const num = prog(f, sh + 8, sh + 20, E.out);
  const emblemSrc = staticFile("brand/emblem.png");
  const top = 400;
  const tagTop = top + EMBLEM_H + 40 + WORD_H + 40;
  const CX = 150;
  const CW = 780;
  const CT = 780;
  const CH = 680;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0 ? `blur(${out * 12}px)` : undefined }}>
        {/* the family group chat (illustrative, no real app copied) */}
        <div
          style={{
            position: "absolute",
            left: CX,
            top: CT,
            width: CW,
            height: CH,
            borderRadius: 34,
            overflow: "hidden",
            background: "linear-gradient(180deg, #15171b 0%, #0b0c0e 100%)",
            border: "1.5px solid rgba(250,250,250,0.12)",
            boxShadow: "0 40px 110px rgba(0,0,0,0.7)",
            opacity: card,
            translate: `0 ${(1 - card) * 60}px`,
            scale: `${0.96 + 0.04 * card}`,
            fontFamily: FONT.sans,
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 124, background: "rgba(250,250,250,0.05)", borderBottom: "1px solid rgba(250,250,250,0.08)" }} />
          <div style={{ position: "absolute", left: 30, top: 24, width: 170, height: 76 }}>
            <Avatar x={0} bg="#5b6b8c" />
            <Avatar x={44} bg="#8c6b5b" />
            <Avatar x={88} bg="#5b8c74" />
          </div>
          <div style={{ position: "absolute", left: 214, top: 28, fontWeight: 700, fontSize: 38, color: C.fa, letterSpacing: "-0.01em" }}>Family group</div>
          <div style={{ position: "absolute", left: 214, top: 78, fontWeight: 500, fontSize: 24, color: C.ash }}>Ghar ke sab log</div>

          {/* someone is already replying */}
          <div style={{ position: "absolute", left: 30, top: 540, padding: "20px 26px", borderRadius: "26px 26px 26px 8px", background: "#1c1f24", border: "1px solid rgba(250,250,250,0.1)", display: "flex", gap: 10, opacity: prog(f, fa + 40, fa + 50, E.out) }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: "#c8ccd6", opacity: 0.35 + 0.65 * Math.max(0, Math.sin(f * 0.3 - i * 0.9)) }} />
            ))}
          </div>
          {/* the reel, sent */}
          <div
            style={{
              position: "absolute",
              right: 30,
              top: 156,
              width: 420,
              padding: 12,
              borderRadius: "26px 26px 8px 26px",
              background: "#23272e",
              border: `1.5px solid ${seen > 0.5 ? C.gold : "rgba(250,250,250,0.14)"}`,
              boxShadow: seen > 0 ? `0 0 ${30 * seen}px rgba(240,178,66,0.25)` : undefined,
              opacity: send,
              translate: `0 ${(1 - send) * 120}px`,
              scale: `${0.9 + 0.1 * send}`,
            }}
          >
            <div style={{ position: "relative", width: 396, height: 420, borderRadius: 16, overflow: "hidden", background: "#000" }}>
              <CamView cam={{ z: 1.15, cx: P_BED.x - 50, cy: P_BED.y - 20, ax: 198, ay: 250 }}>
                <BedTop t={f} heat={0.5} pct={0.42} moon={0.25} />
              </CamView>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 45%)" }} />
              <div style={{ position: "absolute", left: 16, top: 14, fontFamily: FONT.display, fontSize: 42, lineHeight: 1.04, color: C.white }}>
                <span style={{ color: C.gold }}>TAKIYE</span> KE PAAS?
              </div>
              <svg width={62} height={62} viewBox="0 0 62 62" style={{ position: "absolute", left: 300, top: 330 }}>
                <circle cx={31} cy={31} r={30} fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.8)" strokeWidth={2} />
                <path d="M25 19 L45 31 L25 43 Z" fill="#fff" />
              </svg>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, padding: "0 6px 2px" }}>
              <span style={{ fontWeight: 600, fontSize: 24, color: C.fa }}>Aaj raat se pehle.</span>
              <svg width={40} height={22} viewBox="0 0 40 22">
                <path d="M2 12 L9 19 L22 4 M14 12 L21 19 L36 3" fill="none" stroke={seen > 0.5 ? C.gold : "#8d939c"} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <Stack top={380}>
          <TypeOn words={["Yeh", "reel"]} at={re} out={ar - 6} color={C.fa} />
          <Display words={[{ w: "FAMILY", c: C.gold }, "GROUP"]} at={fa} out={ar - 6} />
          <TypeOn words={["mein", "bhejiye."]} at={fa + 14} out={ar - 6} color={C.fa} />
        </Stack>
        <Stack top={380}>
          <Display words={["AAJ", { w: "RAAT", c: C.gold }]} at={ar} />
          <Display words={["SE", "PEHLE."]} at={ar + 8} />
        </Stack>
      </AbsoluteFill>

      {/* logo end frame */}
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
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 34px", borderRadius: 999, border: `2px solid ${C.gold}`, background: "rgba(240,178,66,0.14)", fontFamily: FONT.sans, whiteSpace: "nowrap" }}>
          <svg width={34} height={34} viewBox="0 0 24 24">
            <path d="M3 11.5 20.5 4 14 21l-3-7-8-2.5z" fill="none" stroke={C.gold} strokeWidth={2} strokeLinejoin="round" />
          </svg>
          <span style={{ fontWeight: 600, fontSize: 34, color: C.fa }}>
            <span style={{ color: C.gold }}>Family group</span> mein bhejiye
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
