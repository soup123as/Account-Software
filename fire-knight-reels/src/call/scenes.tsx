import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, E, FONT, SAFE, TYPE, ip, noise1, prog } from "../fk/theme";
import { Display, Label, Stack, TypeOn } from "../fk/ui";
import { Cam, CamView, toScreen } from "../shop/fx";
import { TopFade } from "../shop/scenes1";
import { Corridor } from "../server/Corridor";
import { COMODO, DET, Room } from "../server/Room";
import { Callout, Chips, Concept, ROOM, Rings, lerpCam } from "../server/scenes";
import { CityMap, HOME, OFFICE } from "./CityMap";
import { Handset } from "./Handset";
import { at } from "./timing";

const PHONE_X = 540 - 190;
const PHONE_Y = 880;

/** A phone floating over a soft, dark version of the server room. */
const Behind: React.FC<{ t: number; alarm?: number; flame?: number; comodo?: number; o?: number }> = ({ t, alarm = 0, flame = 0, comodo = 0, o = 0.5 }) => (
  <AbsoluteFill style={{ filter: "blur(10px)", opacity: o }}>
    <CamView cam={{ z: 1.15, cx: 560, cy: 1150, ay: 1320 }}>
      <Room t={t} alarm={alarm} heat={flame > 0 ? 1 : 0} flame={flame} smoke={flame * 0.6} comodo={comodo} />
    </CamView>
  </AbsoluteFill>
);

const PhoneWrap: React.FC<{ p: number; o?: number; rot?: number; x?: number; children: React.ReactNode }> = ({ p, o = 1, rot = 0, x = 0, children }) => (
  <div style={{ position: "absolute", left: PHONE_X + x, top: PHONE_Y, opacity: p * o, translate: `0 ${(1 - p) * 60}px`, rotate: `${rot}deg`, filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined }}>{children}</div>
);

/* ------------------------------------------------------------------ */
/* 1 HOOK - the alarm, then your phone.                                */
/* "Raat do baje server room ka alarm bajta hai. Aur phir aapka phone. Ab aap kya karenge?" */
/* ------------------------------------------------------------------ */
export const N1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const ph = at("hook", "phone");
  const ak = at("hook", "abKya");
  const ky = at("hook", "kyaW");
  const sw = prog(f, ph - 10, ph + 4, E.inOut);
  const cam: Cam = { z: 3.0 + prog(f, 0, ph) * 0.14, cx: DET.x, cy: DET.y + 26, ay: 1150, sx: noise1(f * 0.05, 3) * 2.5 };
  const pp = prog(f, ph - 4, ph + 12, E.out);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ opacity: 1 - sw }}>
        <CamView cam={cam}>
          <Room t={f + 40} alarm={1} heat={0.8} flame={0.14} smoke={0.3} />
          <Rings t={f + 40} o={1 - sw} />
        </CamView>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: sw }}>
        <Behind t={f + 40} alarm={1} flame={0.2} o={0.45} />
      </AbsoluteFill>
      <TopFade to={880} />
      <PhoneWrap p={pp}>
        <div style={{ scale: `${1 + prog(f, ph, 214) * 0.04}` }}>
          <Handset screen="incoming" t={f} name="Security Desk" sub="Office · 2:01 AM" />
        </div>
      </PhoneWrap>
      <Stack top={380}>
        <TypeOn words={["Raat", "do", "baje", "server", "room", "ka"]} at={-40} out={ph - 8} perLetter={0.7} color={C.fa} />
        <Display words={[{ w: "ALARM", c: C.gold }, "BAJTA", "HAI."]} at={-40} out={ph - 8} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Aur", "phir"]} at={ph} out={ak - 6} color={C.fa} />
        <Display words={["AAPKA", { w: "PHONE.", c: C.gold }]} at={ph + 8} out={ak - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Ab", "aap"]} at={ak} color={C.fa} />
        <Display words={[{ w: "KYA", c: C.gold }, "KARENGE?"]} at={ky} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 2 CALL 1 - the guard is there, the key is not.                       */
/* "Pehla call, guard ko. Server room ki chaabi uske paas nahi hai."    */
/* ------------------------------------------------------------------ */
export const N2Call1: React.FC = () => {
  const f = useCurrentFrame();
  const c1 = at("call1", "call1");
  const gw = at("call1", "guardW");
  const cb = at("call1", "chaabi");
  const nw = at("call1", "nahiW");
  const sw = prog(f, cb - 10, cb + 4, E.inOut);
  const cam: Cam = { z: 1.42 + prog(f, cb, 157) * 0.1, cx: 640, cy: 1190, ay: 1340 };
  const wob = noise1(f * 0.12, 4) * 14;
  const wob2 = noise1(f * 0.1, 7) * 10;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ opacity: 1 - sw }}>
        <Behind t={f + 300} alarm={1} flame={0.3} o={0.4} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: sw }}>
        <CamView cam={cam}>
          <defs>
            <radialGradient id="nTorch">
              <stop offset="0" stopColor="#FFF3D6" stopOpacity="0.62" />
              <stop offset="0.55" stopColor="#FFF3D6" stopOpacity="0.2" />
              <stop offset="1" stopColor="#FFF3D6" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="nBeam" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#FFF3D6" stopOpacity="0.16" />
              <stop offset="1" stopColor="#FFF3D6" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <Corridor t={f + 500} glow={0.9} alarm={0.4} leak={0.4} />
          {/* the guard's torch on the locked door: he is here, and he cannot get in */}
          <g style={{ mixBlendMode: "screen" }}>
            <polygon points={`120,1920 300,1920 ${790 + wob},${1110 + wob2} ${520 + wob},${1320 + wob2}`} fill="url(#nBeam)" />
            <ellipse cx={660 + wob} cy={1215 + wob2} rx={190} ry={175} fill="url(#nTorch)" />
          </g>
        </CamView>
      </AbsoluteFill>
      <TopFade to={860} />
      <PhoneWrap p={prog(f, 0, 14, E.out)} o={1 - sw}>
        <Handset screen="outgoing" t={f} name="Guard" sub="Office · night shift" status="calling…" />
      </PhoneWrap>
      <Stack top={380}>
        <TypeOn words={[{ w: "01", c: C.gold }]} at={c1} out={cb - 8} size={40} />
        <TypeOn words={["Pehla", "call,"]} at={c1 + 2} out={cb - 8} color={C.fa} />
        <Display words={["GUARD", "KO."]} at={gw} out={cb - 8} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Server", "room", "ki", "chaabi"]} at={cb} perLetter={0.8} color={C.fa} />
        <Display words={["USKE", "PAAS", { w: "NAHI.", c: C.gold }]} at={nw} size={112} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 3 CALL 2 - the IT team is asleep, on silent.                         */
/* "Doosra call, IT team ko. Phone silent par hai."                     */
/* ------------------------------------------------------------------ */
export const N3Call2: React.FC = () => {
  const f = useCurrentFrame();
  const c2 = at("call2", "call2");
  const iw = at("call2", "itW");
  const si = at("call2", "silent");
  const sw = prog(f, si - 8, si + 4, E.inOut);
  const note = prog(f, si + 6, si + 18, E.out);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ opacity: 1 - sw }}>
        <Behind t={f + 700} alarm={1} flame={0.4} o={0.4} />
      </AbsoluteFill>
      <TopFade to={860} />
      <PhoneWrap p={prog(f, 0, 14, E.out)} o={1 - sw}>
        <Handset screen="outgoing" t={f} name="IT Team" sub="On-call engineer" status="calling…" />
      </PhoneWrap>
      {/* the other end: a phone on silent, lighting up with nobody awake to see it */}
      <PhoneWrap p={sw} rot={-5} x={10}>
        <Handset
          screen="lock"
          t={f}
          time="2:06"
          silent
          dim={ip(f, [si, si + 8, 137], [0.75, 0.15, 0.25])}
          notes={[{ app: "Phone", title: "Missed call (2)", body: "Facility Manager", p: note }]}
        />
      </PhoneWrap>
      <Stack top={380}>
        <TypeOn words={[{ w: "02", c: C.gold }]} at={c2} out={si - 8} size={40} />
        <TypeOn words={["Doosra", "call,"]} at={c2 + 2} out={si - 8} color={C.fa} />
        <Display words={["IT", "TEAM", "KO."]} at={iw} out={si - 8} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Phone"]} at={si} color={C.fa} />
        <Display words={[{ w: "SILENT", c: C.gold }, "PAR", "HAI."]} at={si + 8} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 4 DRIVE - so you go yourself. The office is across the city.         */
/* "Toh aap khud nikalte hain. Office shehar ke doosre kone mein hai."  */
/* ------------------------------------------------------------------ */
export const N4Drive: React.FC = () => {
  const f = useCurrentFrame();
  const kh = at("drive", "khud");
  const ni = at("drive", "nikalteW");
  const ko = at("drive", "kone");
  const kw = at("drive", "koneW");
  const cam: Cam = { z: 0.86 + prog(f, 0, 137) * 0.05, cx: 540, cy: 1130, ay: 1165 };
  const h = toScreen(cam, HOME.x, HOME.y);
  const o = toScreen(cam, OFFICE.x, OFFICE.y);
  const lab = prog(f, 4, 18, E.out);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <CityMap t={f} route={prog(f, ko - 6, kw + 34, E.inOut)} car={ip(f, [kh, 137], [0, 0.17], E.out)} />
      </CamView>
      <TopFade to={800} />
      <div style={{ position: "absolute", left: h.x + 30, top: h.y - 16, opacity: lab }}>
        <Label style={{ color: C.fa, fontSize: 24 }}>Aap</Label>
      </div>
      <div style={{ position: "absolute", left: o.x - 150, top: o.y - 16, opacity: lab }}>
        <Label style={{ color: C.fa, fontSize: 24 }}>Office</Label>
      </div>
      <Stack top={380}>
        <TypeOn words={["Toh", "aap", "khud"]} at={kh} out={ko - 6} color={C.fa} />
        <Display words={["NIKALTE", "HAIN."]} at={ni} out={ko - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Office", "shehar", "ke"]} at={ko} color={C.fa} />
        <Display words={["DOOSRE", { w: "KONE", c: C.gold }, "MEIN."]} at={kw} size={108} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 5 INSIDE - the alarm did its job. Nobody else has.                   */
/* "Alarm ne apna kaam kar diya. Room ke andar ab tak kisi ne kuch nahi kiya." */
/* ------------------------------------------------------------------ */
export const N5Inside: React.FC = () => {
  const f = useCurrentFrame();
  const ka = at("inside", "kaam");
  const kw = at("inside", "kaamW");
  const an = at("inside", "andar");
  const ki = at("inside", "kisiW");
  const kiy = at("inside", "kiyaW");
  const DETC: Cam = { z: 2.5, cx: DET.x + 20, cy: DET.y + 26, ay: 1160 };
  const FIRE: Cam = { z: 1.12, cx: 600, cy: 1150, ay: 1320 };
  const cam = lerpCam(DETC, FIRE, prog(f, an - 14, an + 26, E.cam));
  cam.z += prog(f, 0, 176) * 0.05;
  cam.sx = noise1(f * 0.6, 4) * 1.2;
  const ok: [number, number, number] = [ip(f, [an, 176], [1, 0.5]), ip(f, [0, an, 176], [1, 0.5, 0.2]), ip(f, [0, an], [0.5, 0.2])];
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Room t={f + 1200} alarm={1} heat={1} flame={ip(f, [0, an, 176], [0.45, 0.7, 0.95], E.inOut)} smoke={ip(f, [0, 176], [0.5, 0.95])} ok={ok} />
        <Rings t={f} o={1 - prog(f, an - 14, an)} />
      </CamView>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["Alarm", "ne", "apna"]} at={ka} out={an - 6} color={C.fa} />
        <Display words={["KAAM", "KAR", "DIYA."]} at={kw} out={an - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Room", "ke", "andar", "ab", "tak"]} at={an} perLetter={0.8} color={C.fa} />
        <Display words={["KISI", "NE", "KUCH"]} at={ki} size={108} />
        <Display words={[{ w: "NAHI", c: C.gold }, "KIYA."]} at={kiy} size={108} />
      </Stack>
      <Concept o={prog(f, an, an + 14)} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 6 TURN - "Ek aur tareeka hai."                                      */
/* ------------------------------------------------------------------ */
export const N6Turn: React.FC = () => {
  const f = useCurrentFrame();
  const ta = at("turn", "tareeka");
  const cam: Cam = { z: 1.7 + prog(f, 0, 65) * 0.08, cx: COMODO.x - 40, cy: COMODO.y + 110, ay: 1290 };
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Room t={f + 2000} outline={prog(f, ta + 6, ta + 22, E.out)} />
      </CamView>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["Ek", "aur"]} at={ta} color={C.fa} />
        <Display words={[{ w: "TAREEKA", c: C.gold }, "HAI."]} at={ta + 10} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 7 PRODUCT - the real Comodo render; what it senses.                  */
/* "Deewar par ek unit, jo flame aur garmi khud sense karta hai"        */
/* ------------------------------------------------------------------ */
export const N7Product: React.FC = () => {
  const f = useCurrentFrame();
  const un = at("product", "unit");
  const uw = at("product", "unitW");
  const se = at("product", "sense");
  const fl = at("product", "flameW");
  const ga = at("product", "garmiW");
  const sw = at("product", "senseW");
  const p = prog(f, 0, 20, E.out);
  const sweep = ip(f, [uw - 2, uw + 32], [-30, 130], E.inOut);
  const CW = 840;
  const CH = 600;
  const CT = 850;
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
        <Img src={staticFile("product/comodo.webp")} style={{ position: "absolute", left: (CW - W) / 2, top: (CH - Hh) / 2 - 6, width: W, height: Hh, scale: `${1 + prog(f, 0, 143) * 0.045}` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #e2e2e2 0%, #d2d2d2 60%, #bcbcbc 100%)", mixBlendMode: "multiply" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, rgba(255,255,255,0) ${sweep - 10}%, rgba(255,255,255,0.3) ${sweep}%, rgba(255,255,255,0) ${sweep + 10}%)`, mixBlendMode: "screen" }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: CT + CH + 34, opacity: prog(f, uw + 10, uw + 22) }}>
        <Label style={{ color: C.silver }}>
          The Comodo <span style={{ color: C.gold }}>·</span> fire suppression aid
        </Label>
      </div>
      <Stack top={380}>
        <TypeOn words={["Deewar", "par"]} at={un} out={se - 6} color={C.fa} />
        <Display words={["EK", { w: "UNIT.", c: C.gold }]} at={uw} out={se - 6} />
      </Stack>
      <Stack top={380}>
        <Chips names={["Flame", "Garmi"]} on={[fl, ga]} f={f} out={999} />
        <Display words={["KHUD", { w: "SENSE", c: C.gold }]} at={sw} />
        <TypeOn words={["karta", "hai"]} at={sw + 14} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 8 SYSTEM - it acts by itself; the door stays locked.                 */
/* "aur khud activate hota hai. Na chaabi chahiye, na call."            */
/* ------------------------------------------------------------------ */
export const N8System: React.FC = () => {
  const f = useCurrentFrame();
  const ac = at("system", "activate");
  const aw = at("system", "activateW");
  const nc = at("system", "naChaabi");
  const ncw = at("system", "naCallW");
  const UNIT: Cam = { z: 1.72 + prog(f, 0, nc) * 0.14, cx: 775, cy: 1060, ay: 1320, sx: f >= aw && f < nc ? noise1(f * 0.8, 2) * 1.0 : 0 };
  const flame = ip(f, [0, aw + 6, aw + 42], [0.42, 0.46, 0], E.inOut);
  const mist = prog(f, aw, aw + 20, E.out);
  const sense = ip(f, [0, aw - 4, aw + 8], [1, 1, 0]);
  const sw = prog(f, nc - 10, nc + 4, E.inOut);
  const CO: Cam = { z: 1.4 + prog(f, nc, 140) * 0.08, cx: 640, cy: 1190, ay: 1340 };
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ opacity: 1 - sw }}>
        <CamView cam={UNIT}>
          <Room t={f + 2600} heat={ip(f, [0, aw, nc], [1, 1, 0.4])} flame={flame} comodo={1} sense={sense} mist={mist} smoke={0.25} />
        </CamView>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: sw }}>
        <CamView cam={CO}>
          <Corridor t={f + 3000} glow={1} haze={0.65} />
        </CamView>
      </AbsoluteFill>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["aur", "khud"]} at={ac} out={nc - 8} color={C.fa} />
        <Display words={[{ w: "ACTIVATE", c: C.gold }, "HOTA", "HAI."]} at={aw} out={nc - 8} size={108} />
      </Stack>
      <Stack top={380}>
        <Display words={["NA", "CHAABI,"]} at={nc + 2} />
        <Display words={["NA", { w: "CALL.", c: C.gold }]} at={ncw} />
      </Stack>
      <Concept o={1 - sw} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 9 ALERT - you are told, and you can act from the phone.              */
/* "Alert aapke phone par, aur aap app se bhi unit chala sakte hain."   */
/* ------------------------------------------------------------------ */
export const N9Alert: React.FC = () => {
  const f = useCurrentFrame();
  const al = at("alert", "alert");
  const apw = at("alert", "alertPhoneW");
  const ap = at("alert", "app");
  const ch = at("alert", "chalaW");
  const note = prog(f, al, al + 12, E.out);
  const sw = prog(f, ap - 8, ap + 6, E.inOut);
  const press = prog(f, ch + 4, ch + 18);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Behind t={f + 3200} comodo={1} o={0.42} />
      <TopFade to={860} />
      <PhoneWrap p={prog(f, 0, 14, E.out)} o={1 - sw}>
        <div style={{ filter: note > 0 && note < 1 ? `drop-shadow(0 0 ${note * 30}px rgba(227,40,28,0.5))` : undefined }}>
          <Handset screen="lock" t={f} time="2:01" notes={[{ app: "THE FIRE KNIGHT", title: "Server room: fire detected", body: "Auto response on · tap to view", danger: true, p: note }]} />
        </div>
      </PhoneWrap>
      <PhoneWrap p={sw}>
        <Handset screen="app" t={f} time="2:01" press={press} done={prog(f, ch + 16, ch + 22)} />
      </PhoneWrap>
      <div style={{ position: "absolute", left: SAFE.x0, top: 1392, opacity: 0.8 * sw, background: "rgba(0,0,0,0.6)", borderRadius: 8, padding: "8px 12px" }}>
        <Label style={{ fontSize: 18 }}>Illustrative</Label>
        <Label style={{ fontSize: 18 }}>app screen</Label>
      </div>
      <Stack top={380}>
        <TypeOn words={["Alert"]} at={al} out={ap - 6} color={C.fa} />
        <Display words={["AAPKE", { w: "PHONE", c: C.gold }, "PAR."]} at={apw} out={ap - 6} size={112} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["aur", "app", "se", "bhi"]} at={ap} color={C.fa} />
        <Display words={["UNIT", { w: "CHALA", c: C.gold }]} at={ch - 6} />
        <TypeOn words={["sakte", "hain."]} at={ch + 10} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 10 PUNCH - an alarm makes a sound. Someone has to answer.            */
/* "Alarm zaroori hai. Lekin alarm sirf awaaz deta hai. Jawaab kisi ko dena padta hai." */
/* ------------------------------------------------------------------ */
export const N10Punch: React.FC = () => {
  const f = useCurrentFrame();
  const za = at("punch", "zaroori");
  const aw = at("punch", "awaaz");
  const aww = at("punch", "awaazW");
  const ja = at("punch", "jawaab");
  const cam: Cam = { z: 1.0 + prog(f, 0, 209) * 0.05, cx: 560, cy: 1130, ay: 1340 };
  const d = toScreen(cam, DET.x, DET.y + 14);
  const c = toScreen(cam, COMODO.x, COMODO.y);
  const z = cam.z;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Room t={f + 3400} comodo={1} />
        <Rings t={f} o={ip(f, [aww - 4, aww + 6, ja - 10, ja], [0, 1, 1, 0])} />
      </CamView>
      <TopFade to={790} />
      <Callout x={d.x - 78 * z} y={d.y - 40 * z} w={156 * z} h={86 * z} p={prog(f, za + 4, za + 16, E.out)} color="rgba(250,250,250,0.85)" text="Alarm" lx={d.x + 94 * z} ly={d.y - 14} />
      <Callout x={c.x - 124 * z} y={c.y - 100 * z} w={248 * z} h={186 * z} p={prog(f, ja, ja + 12, E.out)} color={C.gold} text="Jawaab" lx={c.x - 124 * z} ly={c.y - 146 * z} />
      <Stack top={380}>
        <TypeOn words={["Alarm"]} at={za} out={aw - 6} color={C.fa} />
        <Display words={["ZAROORI", "HAI."]} at={za + 10} out={aw - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Lekin", "alarm", "sirf"]} at={aw} out={ja - 6} color={C.fa} />
        <Display words={[{ w: "AWAAZ", c: C.gold }, "DETA", "HAI."]} at={aww} out={ja - 6} size={112} />
      </Stack>
      <Stack top={380}>
        <Display words={[{ w: "JAWAAB", c: C.gold }]} at={ja} />
        <TypeOn words={["kisi", "ko", "dena", "padta", "hai."]} at={ja + 12} perLetter={0.8} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 11 HERO - the call again, then the logo and the ask.                 */
/* "Jinke paas raat ko yeh call aata hai, yeh reel unhe bhejiye."       */
/* ------------------------------------------------------------------ */
const EMBLEM_H = 300;
const EMBLEM_W = Math.round((EMBLEM_H * 762) / 909);
const WORD_W = 450;
const WORD_H = Math.round((WORD_W * 104) / 1077);
const WHATSAPP = "+91 79080 54311";

export const N11Hero: React.FC = () => {
  const f = useCurrentFrame();
  const ji = at("hero", "jinke");
  const yc = at("hero", "yehCallW");
  const bj = at("hero", "bhejiye");
  const out = prog(f, bj - 12, bj + 4, E.inOut);
  const em = prog(f, bj, bj + 16, E.out);
  const sheen = ip(f, [bj + 12, bj + 40], [-30, 130], E.inOut);
  const wm = prog(f, bj + 12, bj + 26, E.out);
  const tag = prog(f, bj + 22, bj + 34, E.out);
  const cta = prog(f, bj + 30, bj + 44, E.out);
  const pulse = f > bj + 44 ? 0.5 + 0.5 * Math.sin((f - bj) * 0.12) : 0;
  const emblemSrc = staticFile("brand/emblem.png");
  const top = 400;
  const tagTop = top + EMBLEM_H + 40 + WORD_H + 40;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ opacity: 1 - out }}>
        <Behind t={f + 3800} alarm={1} o={0.4} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: out * 0.5 }}>
        <CamView cam={{ ...ROOM, z: 0.8, ay: 1400 }}>
          <Room t={f + 3800} comodo={1} />
        </CamView>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.97) 0px, rgba(0,0,0,0.9) 1000px, rgba(0,0,0,0.3) 1400px)", opacity: out }} />
      <TopFade to={860} o={1 - out} />
      <PhoneWrap p={prog(f, 0, 14, E.out)} o={1 - out}>
        <Handset screen="incoming" t={f} name="Security Desk" sub="Office · 2:01 AM" />
      </PhoneWrap>
      <Stack top={380}>
        <TypeOn words={["Jinke", "paas", "raat", "ko"]} at={ji} out={bj - 10} perLetter={0.8} color={C.fa} />
        <Display words={["YEH", { w: "CALL", c: C.gold }, "AATA", "HAI,"]} at={yc} out={bj - 10} size={108} />
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
      <div style={{ position: "absolute", left: SAFE.x0, width: SAFE.x1 - SAFE.x0, top: tagTop + 84, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: cta, translate: `0 ${(1 - cta) * 24}px` }}>
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
            Yeh reel <span style={{ color: C.gold }}>unhe</span> bhejiye
          </span>
        </div>
        <Label style={{ fontSize: 22 }}>DM us · WhatsApp {WHATSAPP}</Label>
      </div>
    </AbsoluteFill>
  );
};
