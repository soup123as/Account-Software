import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, E, FONT, ip, noise1, prog } from "../fk/theme";
import { Display, Stack, TypeOn } from "../fk/ui";
import { Cam, CamView } from "./fx";
import { Caller } from "./Caller";
import { GaliTop } from "./GaliTop";
import { BOARD, FRIDGE, INVERTER, Interior } from "./Interior";
import { Phone } from "./Phone";
import { Shopfront, VISION } from "./Shopfront";
import { at } from "./timing";

/** Darken the caption zone so text never sits on an object. */
export const TopFade: React.FC<{ to?: number; o?: number }> = ({ to = 820, o = 1 }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(0,0,0,0.95) 0px, rgba(0,0,0,0.88) ${to - 220}px, rgba(0,0,0,0) ${to}px)`,
      opacity: o,
    }}
  />
);

const lerpCam = (a: Cam, b: Cam, p: number): Cam => ({
  z: ip(p, [0, 1], [a.z, b.z]),
  cx: ip(p, [0, 1], [a.cx, b.cx]),
  cy: ip(p, [0, 1], [a.cy, b.cy]),
  ax: ip(p, [0, 1], [a.ax ?? 540, b.ax ?? 540]),
  ay: ip(p, [0, 1], [a.ay ?? 960, b.ay ?? 960]),
});

/* ------------------------------------------------------------------ */
/* 1 HOOK - shutter down, padlock on... but something inside is alive. */
/* L1 "Shutter gira ke ghar jaate ho? Andar abhi bhi kya chal raha hai... kabhi socha hai?" */
/* ------------------------------------------------------------------ */
export const SH1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const andar = at("hook", "andar");
  const kabhi = at("hook", "kabhi");
  const WIDE: Cam = { z: 1.55, cx: 540, cy: 1200, ay: 1330 };
  const STRIP: Cam = { z: 2.5, cx: 600, cy: VISION.y0 + 12, ay: 1240 };
  const cam = lerpCam(WIDE, STRIP, prog(f, andar - 10, kabhi + 20, E.cam));
  cam.z += prog(f, 0, andar) * 0.06;
  cam.sx = noise1(f * 0.05, 3) * 3;
  const cool = 0.25 + 0.5 * prog(f, andar, andar + 30);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Shopfront t={f + 30} cool={cool} green={1} street={0.9} />
      </CamView>
      <TopFade to={880} />
      <Stack top={380}>
        <TypeOn words={["Shutter", "gira", "ke"]} at={-40} out={andar - 6} color={C.fa} />
        <Display words={[{ w: "GHAR", c: C.gold }, "JAATE", "HO?"]} at={-40} out={andar - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Andar", "abhi", "bhi"]} at={andar} perLetter={0.8} color={C.fa} />
        <Display words={[{ w: "KYA", c: C.gold }, "CHAL", "RAHA", "HAI?"]} at={andar + 16} size={112} />
        <TypeOn words={["Kabhi", "socha", "hai?"]} at={kabhi} perLetter={0.8} weight={500} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2 INSIDE - the closed shop is not asleep.                            */
/* L2 Dukaan band hai... lekin andar sab kuch band nahi.                 */
/* L3 Fridge. Inverter. Aur ek board par... chaar plug.                  */
/* L4 Aur inmein se ek... raat bhar garam ho raha hai.                   */
/* ------------------------------------------------------------------ */
export const SH2Inside: React.FC = () => {
  const f = useCurrentFrame();
  const band = at("inside", "band");
  const lekin = at("inside", "lekinAndar");
  const fr = at("inside", "fridge");
  const inv = at("inside", "inverter");
  const bd = at("inside", "board");
  const plug = at("inside", "chaarPlug");
  const inm = at("inside", "inmein");
  const garam = at("inside", "garam");

  const ROOM: Cam = { z: 0.95, cx: 540, cy: 1180, ay: 1300 };
  const FR: Cam = { z: 1.5, cx: FRIDGE.x, cy: FRIDGE.y + 20, ay: 1290 };
  const IV: Cam = { z: 2.0, cx: INVERTER.x + 30, cy: INVERTER.y, ay: 1270 };
  const BD: Cam = { z: 1.9, cx: BOARD.x + 10, cy: BOARD.y - 20, ay: 1280 };
  const HOT: Cam = { z: 3.0, cx: BOARD.hot - 6, cy: BOARD.y - 8, ay: 1260 };
  let cam = ROOM;
  cam = lerpCam(cam, FR, prog(f, fr - 8, fr + 16, E.cam));
  cam = lerpCam(cam, IV, prog(f, inv - 6, inv + 16, E.cam));
  cam = lerpCam(cam, BD, prog(f, bd - 6, bd + 20, E.cam));
  cam = lerpCam(cam, HOT, prog(f, inm, garam + 30, E.cam));
  cam.z += prog(f, 0, fr) * 0.05;
  const hl = f < fr - 6 ? 0 : ip(f, [fr - 6, fr + 10, inm, inm + 12], [0, 0.85, 0.85, 0.4]);
  const which = f < inv - 4 ? "fridge" : f < bd - 4 ? "inverter" : "board";
  const heat = ip(f, [plug, inm, garam + 20], [0.1, 0.35, 1], E.inOut);
  const xray = prog(f, 0, 18, E.out);

  const chip = (n: string, w: string, a: number, o: number) => (
    <Stack top={380}>
      <TypeOn words={[{ w: n, c: C.gold }]} at={a} out={o} size={40} />
      <Display words={[w]} at={a + 2} out={o} />
    </Stack>
  );

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ opacity: xray, filter: xray < 1 ? `blur(${(1 - xray) * 16}px)` : undefined }}>
        <CamView cam={cam}>
          <Interior t={f + 200} boardHeat={heat} highlight={which} hl={hl} />
        </CamView>
      </AbsoluteFill>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["Dukaan", "band", "hai..."]} at={band} out={fr - 8} color={C.fa} />
        <TypeOn words={["lekin", "andar", "sab", "kuch"]} at={lekin} out={fr - 8} perLetter={0.8} color={C.fa} />
        <Display words={["BAND", { w: "NAHI.", c: C.gold }]} at={lekin + 26} out={fr - 8} />
      </Stack>
      {chip("01", "FRIDGE.", fr, inv - 4)}
      {chip("02", "INVERTER.", inv, bd - 4)}
      <Stack top={380}>
        <TypeOn words={[{ w: "03", c: C.gold }]} at={bd} out={inm - 6} size={40} />
        <TypeOn words={["Aur", "ek", "board", "par..."]} at={bd + 2} out={inm - 6} color={C.fa} />
        <Display words={["CHAAR", { w: "PLUG.", c: C.gold }]} at={plug} out={inm - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Aur", "inmein", "se", "ek..."]} at={inm} perLetter={0.9} color={C.fa} />
        <TypeOn words={["raat", "bhar"]} at={garam} color={C.fa} />
        <Display words={[{ w: "GARAM", c: C.gold }, "HO", "RAHA", "HAI."]} at={garam + 10} size={112} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3 CALL - 2 a.m., a stranger calls from outside the shop.             */
/* L5 Raat ke do baje... kisi unknown number se call aata hai: "Bhai, aapki dukaan mein aag lagi hai!" */
/* ------------------------------------------------------------------ */
export const SH3Call: React.FC = () => {
  const f = useCurrentFrame();
  const raat = at("call", "raat");
  const unk = at("call", "unknown");
  const bhai = at("call", "bhai");
  const aag = at("call", "aag");
  const ph = prog(f, raat - 4, raat + 14, E.out);
  const swap = prog(f, unk + 14, unk + 34, E.inOut);
  const push = prog(f, unk + 14, 182, E.cam);
  const smoke = ip(f, [unk, aag, aag + 30], [0.5, 0.8, 1]);
  const fire = ip(f, [unk, aag, aag + 10], [0.45, 0.7, 1]);
  const point = prog(f, bhai + 4, bhai + 22, E.out);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* the street: shop smoking behind, the caller in front */}
      <AbsoluteFill style={{ opacity: swap }}>
        <AbsoluteFill style={{ filter: "blur(4px)" }}>
          <CamView cam={{ z: 0.8 + push * 0.06, cx: 470, cy: 1250, ax: 380, ay: 1330 }}>
            <Shopfront t={f + 400} cool={0} green={0} fire={fire} smoke={smoke} heat={0.3 * fire} street={0.9} />
          </CamView>
        </AbsoluteFill>
        <CamView cam={{ z: 1.45 + push * 0.08, cx: 660, cy: 1190, ax: 640, ay: 1290 }}>
          <Caller t={f} fire={fire} point={point} />
        </CamView>
        <TopFade to={880} />
      </AbsoluteFill>
      {/* the owner's phone, ringing on the bedside */}
      <AbsoluteFill
        style={{
          opacity: ph * (1 - swap),
          filter: swap > 0 ? `blur(${swap * 14}px)` : undefined,
          background: "radial-gradient(ellipse 520px 640px at 540px 1300px, rgba(60,80,120,0.22) 0%, rgba(0,0,0,0) 70%)",
        }}
      >
        <div style={{ position: "absolute", left: 540 - 190, top: 900, scale: `${0.94 + 0.06 * ph}` }}>
          <Phone mode="call" t={f} ring={1} />
        </div>
      </AbsoluteFill>
      <Stack top={380}>
        <Display words={["RAAT", "KE", { w: "2", c: C.gold }, "BAJE..."]} at={raat} out={bhai - 6} />
        <TypeOn words={["kisi", { w: "unknown", c: C.gold }, "number", "se", "call:"]} at={unk} out={bhai - 6} perLetter={0.8} color={C.fa} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["\u201CBhai,", "aapki", "dukaan", "mein"]} at={bhai} perLetter={0.8} color={C.fa} />
        <Display words={[{ w: "AAG", c: C.gold }, "LAGI", "HAI!\u201D"]} at={aag} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 4 ARRIVE - the real shock: jammed shutter, a lane the tender can't enter. */
/* L6 Lekin asli jhatka... pahunchne ke baad lagta hai.                  */
/* L7 Shutter garmi se jam. Gali itni tang, ki fire brigade andar tak nahi aa paati. */
/* ------------------------------------------------------------------ */
export const SH4Arrive: React.FC = () => {
  const f = useCurrentFrame();
  const asli = at("arrive", "asli");
  const pah = at("arrive", "pahunch");
  const jam = at("arrive", "jam");
  const gali = at("arrive", "gali");
  const brig = at("arrive", "brigade");
  const run = prog(f, 0, jam, E.inOut);
  const A: Cam = { z: 0.85, cx: 540, cy: 1150, ay: 1250 };
  const B: Cam = { z: 1.35, cx: 540, cy: 1250, ay: 1300 };
  const J: Cam = { z: 2.4, cx: 540, cy: 1360, ay: 1260 };
  let cam = lerpCam(A, B, run);
  cam = lerpCam(cam, J, prog(f, jam - 4, jam + 14, E.out));
  const shake = f < gali ? 2 + 4 * prog(f, jam, jam + 6) * (1 - prog(f, jam + 6, jam + 30)) : 0;
  cam.sx = noise1(f * 0.5, 1) * shake + Math.sin(f * 0.45) * 2 * (1 - prog(f, jam - 10, jam));
  cam.sy = noise1(f * 0.5, 2) * shake + Math.abs(Math.sin(f * 0.45)) * 4 * (1 - prog(f, jam - 10, jam));
  const toLane = prog(f, gali - 8, gali + 8, E.inOut);
  const creep = prog(f, gali, brig + 6, E.out); // the tender noses in, then stops
  const stop = f > brig + 6 ? Math.max(0, 1 - (f - brig - 6) / 12) : 0;
  const bars = prog(f, brig + 16, brig + 40, E.out);
  const laneZoom = prog(f, gali, brig + 30, E.cam);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ opacity: 1 - toLane }}>
        <CamView cam={cam}>
          <Shopfront t={f + 560} cool={0} green={0} fire={0.9} smoke={1} heat={ip(f, [0, jam], [0.5, 1])} street={0.8} />
        </CamView>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: toLane }}>
        <CamView cam={{ z: 1.75 - 0.3 * laneZoom, cx: 540, cy: 980 + 330 * prog(f, gali, brig + 20, E.cam), ay: 1250 }}>
          <GaliTop t={f} creep={creep} jolt={stop} bars={bars} />
        </CamView>
      </AbsoluteFill>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["Lekin", "asli"]} at={asli} out={jam - 6} color={C.fa} />
        <Display words={[{ w: "JHATKA...", c: C.gold }]} at={asli + 14} out={jam - 6} />
        <TypeOn words={["pahunchne", "ke", "baad", "lagta", "hai."]} at={pah} out={jam - 6} perLetter={0.8} color={C.fa} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Shutter", "garmi", "se"]} at={jam} out={gali - 6} color={C.fa} />
        <Display words={[{ w: "JAM.", c: C.gold }]} at={jam + 14} out={gali - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Gali", "itni"]} at={gali} color={C.fa} />
        <Display words={[{ w: "TANG,", c: C.gold }]} at={gali + 10} />
        <TypeOn words={["ki", "fire", "brigade", "andar", "tak"]} at={brig} perLetter={0.7} color={C.fa} />
        <TypeOn words={["nahi", "aa", "paati."]} at={brig + 30} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 5 PROOF - after the fire, the second fight.                          */
/* L8 Aur aag bujhne ke baad, insurance poochta hai: "Saboot kahan hai?" */
/* ------------------------------------------------------------------ */
export const SH5Proof: React.FC = () => {
  const f = useCurrentFrame();
  const bujh = at("proof", "bujhne");
  const ins = at("proof", "insurance");
  const sab = at("proof", "saboot");
  const card = prog(f, ins + 4, ins + 20, E.out);
  const q1 = prog(f, ins + 18, ins + 26);
  const q2 = prog(f, sab, sab + 8);
  const cam: Cam = { z: 1.0 + prog(f, 0, 128) * 0.06, cx: 540, cy: 1180, ay: 1280 };
  const row = (k: string, v: number, y: number) => (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid rgba(250,250,250,0.12)", paddingBottom: 14 }}>
      <span style={{ fontFamily: FONT.sans, fontWeight: 500, fontSize: 30, color: C.ash }}>{k}</span>
      <span style={{ fontFamily: FONT.display, fontSize: 54, color: C.gold, opacity: v, scale: `${1.4 - 0.4 * v}` }}>?</span>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ filter: `blur(${card * 6}px)`, opacity: 1 - card * 0.45 }}>
        <CamView cam={cam}>
          <Interior t={f + 700} fridge={0} led={0} burnt={1} smoke={ip(f, [0, 128], [0.7, 0.35])} />
        </CamView>
      </AbsoluteFill>
      <TopFade to={860} />
      <div
        style={{
          position: "absolute",
          left: 150,
          width: 780,
          top: 960,
          height: 380,
          borderRadius: 26,
          background: "rgba(8,8,8,0.92)",
          border: "1.5px solid rgba(250,250,250,0.14)",
          opacity: card,
          translate: `0 ${(1 - card) * 50}px`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
        }}
      >
        <div style={{ position: "absolute", left: 40, top: 34, fontFamily: FONT.sans, fontWeight: 600, fontSize: 24, letterSpacing: "0.18em", color: C.silver }}>
          FIRE CLAIM <span style={{ color: C.gold }}>·</span> SURVEY
        </div>
        {row("Aag kaise lagi?", q1, 110)}
        {row("Stock ka hisaab?", q1, 196)}
        {row("Saboot?", q2, 282)}
      </div>
      <Stack top={380}>
        <TypeOn words={["Aur", "aag", "bujhne", "ke", "baad,"]} at={bujh} perLetter={0.8} color={C.fa} />
        <TypeOn words={["insurance", "poochta", "hai:"]} at={ins} color={C.fa} />
        <Display words={[{ w: "“SABOOT", c: C.gold }, "KAHAN", "HAI?”"]} at={sab} size={112} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 6 TURN - rewind to that night. What if the shop was awake?           */
/* L9 Ab sochiye... agar us raat aapki dukaan khud jaag rahi hoti?       */
/* ------------------------------------------------------------------ */
export const SH6Turn: React.FC = () => {
  const f = useCurrentFrame();
  const so = at("turn", "sochiye");
  const jg = at("turn", "jaag");
  const rw = prog(f, 0, 22, E.inOut); // rewind burnt -> clean
  const tilt = prog(f, so + 10, jg + 6, E.cam);
  const cam: Cam = { z: ip(tilt, [0, 1], [1.0, 1.55]), cx: 540, cy: ip(tilt, [0, 1], [1180, 760]), ay: ip(tilt, [0, 1], [1280, 1110]) };
  const streak = (1 - rw) * (rw > 0 ? 1 : 0);
  const awake = prog(f, jg + 4, jg + 14);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ filter: streak > 0.02 ? `blur(${streak * 10}px) saturate(${1 - streak * 0.8})` : undefined, translate: `${Math.sin(f * 1.3) * streak * 30}px 0` }}>
        <CamView cam={cam}>
          <Interior t={f + 900 - (1 - rw) * 200} fridge={rw} led={rw} burnt={1 - rw} smoke={(1 - rw) * 0.5} protector={prog(f, so, so + 30)} awake={awake} />
          {/* the eye opens: a soft ring from the unit */}
          {awake > 0 && (
            <ellipse cx={540} cy={622} rx={30 + 220 * prog(f, jg + 4, jg + 40, E.out)} ry={8 + 50 * prog(f, jg + 4, jg + 40, E.out)} fill="none" stroke="#3BEA6A" strokeWidth={2} opacity={1 - prog(f, jg + 10, jg + 44)} />
          )}
        </CamView>
      </AbsoluteFill>
      <TopFade to={840} />
      <Stack top={380}>
        <TypeOn words={["Ab", "sochiye..."]} at={so} color={C.fa} />
        <TypeOn words={["agar", "us", "raat", "aapki", "dukaan"]} at={so + 26} perLetter={0.7} color={C.fa} />
        <Display words={["KHUD", { w: "JAAG", c: C.gold }]} at={jg} />
        <TypeOn words={["rahi", "hoti?"]} at={jg + 14} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

export { lerpCam };
