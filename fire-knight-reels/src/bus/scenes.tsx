import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, E, FONT, SAFE, TYPE, ip, prog } from "../fk/theme";
import { Display, Label, Stack, TypeOn } from "../fk/ui";
import { Cam, CamView } from "../shop/fx";
import { Phone } from "../shop/Phone";
import { TopFade } from "../shop/scenes1";
import { EXT, ZONE } from "./Bus";
import { BUS, BusWorld } from "./BusWorld";
import { at } from "./timing";

const W = (x: number, y: number) => ({ x: x + BUS.x, y: y + BUS.y }); // bus -> world
const WIDE: Cam = { z: 0.86, cx: 540, cy: 1100, ay: 1170 };
const lerpCam = (a: Cam, b: Cam, p: number): Cam => ({
  z: ip(p, [0, 1], [a.z, b.z]),
  cx: ip(p, [0, 1], [a.cx, b.cx]),
  cy: ip(p, [0, 1], [a.cy, b.cy]),
  ax: ip(p, [0, 1], [a.ax ?? 540, b.ax ?? 540]),
  ay: ip(p, [0, 1], [a.ay ?? 960, b.ay ?? 960]),
});

/** Gold hairline zone frame + label, drawn in world space (UI, brand colours). */
const ZoneFrame: React.FC<{ z: { x: number; y: number; w: number; h: number }; label: string; p: number; hot?: boolean }> = ({ z, label, p, hot }) => {
  if (p <= 0) return null;
  const o = W(z.x, z.y);
  return (
    <g opacity={p}>
      <rect x={o.x - 6} y={o.y - 6} width={z.w + 12} height={z.h + 12} rx={10} fill={hot ? "rgba(240,178,66,0.10)" : "none"} stroke={C.gold} strokeWidth={3} strokeDasharray={hot ? undefined : "10 8"} />
      <text x={o.x - 2} y={o.y - 16} fontFamily="FK DM Sans" fontWeight={700} fontSize={30} letterSpacing="2" fill={C.gold}>
        {label}
      </text>
    </g>
  );
};

/* 1 HOOK - passengers cared for... but the engine and the battery? */
export const B1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const kya = at("hook", "kya");
  const CABIN: Cam = { z: 1.55, cx: 520, cy: 1030, ay: 1180 };
  const REAR: Cam = { z: 1.0, cx: 640, cy: 1150, ay: 1250 };
  const cam = lerpCam(CABIN, REAR, prog(f, kya - 8, kya + 30, E.cam));
  cam.cx += f * 0.25;
  const p = prog(f, kya + 18, kya + 32, E.out);
  const eng = W(ZONE.engine.x, ZONE.engine.y);
  const bat = W(ZONE.battery.x, ZONE.battery.y);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <BusWorld t={f} scroll={f * 14} wheelAngle={f * 9} cabinLight={1} heatEngine={0.15 + 0.25 * prog(f, kya, kya + 40)} />
        {/* the two places nobody is watching */}
        {[eng, bat].map((o, i) => {
          const z = i ? ZONE.battery : ZONE.engine;
          return (
            <g key={i} opacity={p}>
              <rect x={o.x - 8} y={o.y - 8} width={z.w + 16} height={z.h + 16} rx={10} fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray="10 8" />
              <text x={o.x + z.w / 2} y={o.y - 20} textAnchor="middle" fontFamily="FK Anton" fontSize={44} fill={C.gold}>
                ?
              </text>
            </g>
          );
        })}
      </CamView>
      <TopFade to={880} />
      <Stack top={380}>
        <TypeOn words={["Passengers", "ki", "safety", "ka"]} at={-40} out={kya - 6} color={C.fa} />
        <Display words={["POORA", { w: "KHAYAL.", c: C.gold }]} at={-40} out={kya - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["par", "engine", "aur", "battery", "ki"]} at={kya} perLetter={0.8} color={C.fa} />
        <Display words={["SAFETY", "KA", { w: "KYA?", c: C.gold }]} at={kya + 22} />
      </Stack>
    </AbsoluteFill>
  );
};

/* 2 ANSWER - x-ray: a red cylinder behind the driver's seat. */
export const B2Answer: React.FC = () => {
  const f = useCurrentFrame();
  const jw = at("answer", "jawab");
  const st = at("answer", "seat");
  const cy = at("answer", "cylinder");
  const e = W(EXT.x, EXT.y);
  const cam: Cam = { z: 2.3 + prog(f, 0, 123) * 0.15, cx: e.x + 40, cy: e.y - 10, ay: 1220 };
  const xr = prog(f, jw, jw + 24, E.inOut);
  const glow = prog(f, cy, cy + 10) * (0.7 + 0.3 * Math.sin(f * 0.25));
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <BusWorld t={f + 200} scroll={(f + 200) * 14} wheelAngle={(f + 200) * 9} cabinLight={0.8} xray={xr} extGlow={glow} poles={0.6} />
      </CamView>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["Shayad", "jawab", "hai..."]} at={jw} color={C.fa} />
        <TypeOn words={["driver", "ki", "seat", "ke", "peeche,"]} at={st} perLetter={0.8} color={C.fa} />
        <Display words={["EK", { w: "LAAL", c: C.gold }, "CYLINDER."]} at={cy} />
      </Stack>
    </AbsoluteFill>
  );
};

/* 3 ZONES - the fire starts where nobody is looking. */
export const B3Zones: React.FC = () => {
  const f = useCurrentFrame();
  const lk = at("zones", "lekin");
  const dk = at("zones", "dekh");
  const en = at("zones", "engine");
  const bt = at("zones", "battery");
  const cb = at("zones", "cabin");
  const e = W(EXT.x, EXT.y);
  const FRONT: Cam = { z: 2.3, cx: e.x + 40, cy: e.y - 10, ay: 1220 };
  const cam = lerpCam(FRONT, WIDE, prog(f, 0, 34, E.cam));
  const eng = W(ZONE.engine.x + ZONE.engine.w / 2, ZONE.engine.y + 60);
  const dist = prog(f, dk - 4, dk + 26, E.inOut);
  const zFocus = (k: number) => prog(f, k, k + 10, E.out);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <BusWorld t={f + 320} scroll={(f + 320) * 14} wheelAngle={(f + 320) * 9} cabinLight={0.75} xray={1} extGlow={0.6} heatEngine={ip(f, [en, en + 30, cb + 40], [0.2, 0.75, 0.6])} poles={0.6} />
        {/* the distance between the cylinder and the engine */}
        {dist > 0 && (
          <g opacity={1 - prog(f, en - 6, en + 4)}>
            <line x1={e.x} y1={e.y + 40} x2={e.x + (eng.x - e.x) * dist} y2={e.y + 40} stroke={C.gold} strokeWidth={3} strokeDasharray="12 10" />
            <circle cx={e.x} cy={e.y + 40} r={7} fill={C.gold} />
            {dist > 0.98 && <circle cx={eng.x} cy={e.y + 40} r={7} fill={C.gold} />}
          </g>
        )}
        <ZoneFrame z={ZONE.engine} label="01 ENGINE BAY" p={zFocus(en)} hot={f < bt} />
        <ZoneFrame z={ZONE.battery} label="02 BATTERY" p={zFocus(bt)} hot={f >= bt && f < cb} />
        <ZoneFrame z={ZONE.cabin} label="03 CABIN" p={zFocus(cb)} hot={f >= cb} />
      </CamView>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["Lekin", "aag", "wahan", "lagti", "hai,"]} at={lk} out={en - 6} perLetter={0.8} color={C.fa} />
        <TypeOn words={["jahan", "koi"]} at={dk} out={en - 6} color={C.fa} />
        <Display words={[{ w: "DEKH", c: C.gold }, "NAHI", "RAHA."]} at={dk + 12} out={en - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={[{ w: "01", c: C.gold }]} at={en} out={bt - 4} size={40} />
        <Display words={["ENGINE", "BAY."]} at={en + 2} out={bt - 4} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={[{ w: "02", c: C.gold }]} at={bt} out={cb - 4} size={40} />
        <Display words={["BATTERY", "BOX."]} at={bt + 2} out={cb - 4} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={[{ w: "03", c: C.gold }]} at={cb} size={40} />
        <Display words={["CABIN."]} at={cb + 2} />
        <TypeOn words={["passengers", "ke", "beech."]} at={cb + 20} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

/* 4 PRODUCT - the real Sentinel render on a studio card. */
export const B4Product: React.FC = () => {
  const f = useCurrentFrame();
  const sn = at("product", "sentinel");
  const p = prog(f, 0, 18, E.out);
  const sweep = ip(f, [sn + 8, sn + 40], [-30, 130], E.inOut);
  const CW = 840;
  const CH = 560;
  const CT = 860;
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
        <Img src={staticFile("product/sentinel-system.png")} style={{ position: "absolute", left: 20, top: -20, width: 800, height: 568, scale: `${1 + prog(f, 0, 64) * 0.04}` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0) 50%, rgba(0,0,0,0.06) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, rgba(255,255,255,0) ${sweep - 10}%, rgba(255,255,255,0.5) ${sweep}%, rgba(255,255,255,0) ${sweep + 10}%)`, mixBlendMode: "screen" }} />
      </div>
      <div style={{ position: "absolute", left: 120, top: CT + CH + 34, opacity: prog(f, sn + 20, sn + 32) }}>
        <Label style={{ color: C.silver }}>
          The Sentinel <span style={{ color: C.gold }}>·</span> vehicle fire suppression aid
        </Label>
      </div>
      <Stack top={380}>
        <TypeOn words={["The", "Fire", "Knight", "ka"]} at={sn} color={C.fa} />
        <Display words={[{ w: "SENTINEL.", c: C.gold }]} at={sn + 26} />
      </Stack>
    </AbsoluteFill>
  );
};

/** The driver's dashboard button, drawn as a real switch panel (callout). */
const DashButton: React.FC<{ f: number; press: number }> = ({ f, press }) => (
  <svg width={260} height={260} viewBox="-130 -130 260 260">
    <defs>
      <radialGradient id="dbBtn" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#ff6b5a" />
        <stop offset="0.5" stopColor="#d4231a" />
        <stop offset="1" stopColor="#7a0f0b" />
      </radialGradient>
    </defs>
    <circle r={128} fill="#0d0e10" />
    <rect x={-92} y={-62} width={184} height={124} rx={14} fill="#1b1d20" stroke="#3a3d41" strokeWidth={2} />
    <rect x={-92} y={-62} width={184} height={6} rx={3} fill="#ffffff" opacity={0.08} />
    <circle cx={0} cy={4} r={40 - press * 2} fill="url(#dbBtn)" />
    <circle cx={0} cy={4} r={48} fill="none" stroke="#e2b322" strokeWidth={4} />
    <ellipse cx={-12} cy={-10} rx={14} ry={8} fill="#ffffff" opacity={0.35} />
    <circle cx={64} cy={-38} r={6} fill="#3BEA6A" opacity={0.5 + 0.5 * Math.sin(f * 0.2)} />
    <circle cx={-64} cy={-38} r={6} fill="#e2a91f" opacity={0.7} />
    <circle r={128} fill="none" stroke={C.gold} strokeWidth={3} />
  </svg>
);

/* 5 SYSTEM - every zone watched; discharge only where the fire is; button + alert. */
export const B5System: React.FC = () => {
  const f = useCurrentFrame();
  const nz = at("system", "nazar");
  const ag = at("system", "aag");
  const ds = at("system", "discharge");
  const bt = at("system", "button");
  const al = at("system", "alert");
  const sent = prog(f, nz - 6, nz + 14, E.out);
  const fire = ip(f, [ag, ag + 12, ds + 6, ds + 40], [0, 0.7, 0.7, 0]);
  const mist = prog(f, ds, ds + 16, E.out) * (1 - prog(f, ds + 70, ds + 90));
  const cam: Cam = { ...WIDE, z: 0.86 + prog(f, 0, 270) * 0.04 };
  const call = prog(f, bt, bt + 14, E.out) * (1 - prog(f, al - 6, al + 4));
  const ph = prog(f, al, al + 14, E.out);
  const note = prog(f, al + 8, al + 20, E.out);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <BusWorld t={f + 600} scroll={(f + 600) * 14} wheelAngle={(f + 600) * 9} cabinLight={0.75} xray={1} sentinel={sent} sense={sent} fire={fire} heatEngine={fire * 0.6} mist={mist} poles={0.6} />
        <ZoneFrame z={ZONE.engine} label="ENGINE" p={sent * (f >= ag ? 1 : 0.6)} hot={f >= ag} />
        <ZoneFrame z={ZONE.battery} label="BATTERY" p={sent * (f >= ag ? 0.35 : 0.6)} />
        <ZoneFrame z={ZONE.cabin} label="CABIN" p={sent * (f >= ag ? 0.35 : 0.6)} />
      </CamView>
      <TopFade to={860} />
      {/* dashboard button callout */}
      {call > 0 && (
        <div style={{ position: "absolute", left: 540 - 130, top: 1290, opacity: call, scale: `${0.9 + 0.1 * call}` }}>
          <DashButton f={f} press={Math.max(0, Math.sin((f - bt) * 0.2)) * call} />
        </div>
      )}
      {/* owner's phone */}
      {ph > 0 && (
        <div style={{ position: "absolute", left: 540 - 95, top: 1270, width: 380, height: 780, scale: "0.5", transformOrigin: "0 0", opacity: ph, translate: `0 ${(1 - ph) * 40}px` }}>
          <Phone mode="alert" t={f} note={note} time="11:42" app="SENTINEL" title="Fire alert: Bus 07" body="Engine zone · suppression active" />
        </div>
      )}
      <Stack top={380}>
        <TypeOn words={["har", "zone", "par"]} at={nz} out={ag - 6} color={C.fa} />
        <Display words={[{ w: "NAZAR.", c: C.gold }]} at={nz + 14} out={ag - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Aag", "jis", "zone", "mein,"]} at={ag} out={bt - 6} color={C.fa} />
        <Display words={[{ w: "DISCHARGE", c: C.gold }]} at={ds} out={bt - 6} />
        <TypeOn words={["sirf", "usi", "zone", "mein."]} at={ds + 16} out={bt - 6} color={C.fa} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Driver", "ke", "paas"]} at={bt} out={al - 6} color={C.fa} />
        <Display words={["DASHBOARD", { w: "BUTTON.", c: C.gold }]} at={bt + 14} out={al - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Aapke", "phone", "par"]} at={al} color={C.fa} />
        <Display words={[{ w: "ALERT.", c: C.gold }]} at={al + 14} />
      </Stack>
      <div style={{ position: "absolute", left: SAFE.x0, top: 1690, opacity: 0.6 * sent }}>
        <Label style={{ fontSize: 18 }}>Conceptual illustration</Label>
      </div>
    </AbsoluteFill>
  );
};

/* 6 PUNCH - stop, hazards on, door open: passengers first. */
export const B6Punch: React.FC = () => {
  const f = useCurrentFrame();
  const ky = at("punch", "kyunki");
  const dh = at("punch", "dhoondhna");
  const stop = prog(f, 0, 40, E.out);
  const door = prog(f, ky + 20, ky + 50, E.inOut);
  const DOOR: Cam = { z: 1.5, cx: W(120, 0).x + 160, cy: 1110, ay: 1240 };
  const cam = lerpCam(WIDE, DOOR, prog(f, 0, 90, E.cam));
  const scroll = 600 * 14 + (1 - Math.pow(1 - Math.min(1, f / 40), 2)) * 280;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <BusWorld t={f + 900} scroll={scroll} wheelAngle={scroll * 0.64} cabinLight={0.75 + 0.25 * door} hazard={stop} door={door} heatEngine={0.15} />
        {/* light spilling out of the open door onto the road */}
        <polygon points={`${W(92, 330).x},${W(92, 330).y} ${W(148, 330).x},${W(148, 330).y} ${W(260, 420).x},${W(260, 420).y} ${W(-40, 420).x},${W(-40, 420).y}`} fill="#ffdca6" opacity={0.18 * door} />
      </CamView>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["Kyunki", "driver", "ka", "pehla", "kaam"]} at={ky} perLetter={0.8} color={C.fa} />
        <Display words={[{ w: "PASSENGERS", c: C.gold }, "KO"]} at={ky + 30} />
        <TypeOn words={["utaarna", "hai..."]} at={ky + 46} color={C.fa} />
        <TypeOn words={["cylinder", "dhoondhna", "nahi."]} at={dh} weight={500} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

/* 7 HERO - the question, then the logo and the comment CTA. */
const EMBLEM_H = 300;
const EMBLEM_W = Math.round((EMBLEM_H * 762) / 909);
const WORD_W = 450;
const WORD_H = Math.round((WORD_W * 104) / 1077);

export const B7Hero: React.FC = () => {
  const f = useCurrentFrame();
  const cm = at("hero", "comment");
  const lg = cm + 66;
  const em = prog(f, lg, lg + 16, E.out);
  const wm = prog(f, lg + 14, lg + 28, E.out);
  const sheen = ip(f, [lg + 12, lg + 40], [-30, 130], E.inOut);
  const tag = prog(f, lg + 26, lg + 38, E.out);
  const cta = prog(f, lg + 34, lg + 48, E.out);
  const pulse = f > lg + 48 ? 0.5 + 0.5 * Math.sin((f - lg) * 0.12) : 0;
  const emblemSrc = staticFile("brand/emblem.png");
  const top = 400;
  const tagTop = top + EMBLEM_H + 40 + WORD_H + 40;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={{ z: 0.72, cx: 540, cy: 1120, ay: 1420 }}>
        <BusWorld t={f + 1100} scroll={0} cabinLight={0.9} hazard={1} door={1} heatEngine={0.1} />
      </CamView>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.96) 0px, rgba(0,0,0,0.9) 950px, rgba(0,0,0,0.2) 1300px)" }} />
      <Stack top={380}>
        <TypeOn words={["Aapki", "bus", "mein", "kitne"]} at={cm} out={lg - 8} color={C.fa} />
        <Display words={[{ w: "ZONE", c: C.gold }, "COVERED", "HAIN?"]} at={cm + 18} out={lg - 8} />
        <TypeOn words={["Comment", "kijiye."]} at={cm + 50} out={lg - 8} color={C.fa} />
      </Stack>
      <div style={{ position: "absolute", left: 540 - EMBLEM_W / 2, top, width: EMBLEM_W, height: EMBLEM_H, opacity: em, translate: `0 ${(1 - em) * 40}px`, scale: `${0.94 + 0.06 * em}`, filter: em < 1 ? `blur(${(1 - em) * 12}px)` : undefined }}>
        <Img src={emblemSrc} style={{ width: "100%", height: "100%", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, rgba(255,255,255,0) ${sheen - 14}%, rgba(255,255,255,0.55) ${sheen}%, rgba(255,255,255,0) ${sheen + 14}%)`, WebkitMaskImage: `url(${emblemSrc})`, WebkitMaskSize: "100% 100%", mixBlendMode: "screen" }} />
      </div>
      <div style={{ position: "absolute", left: 540 - WORD_W / 2, top: top + EMBLEM_H + 40, width: WORD_W, height: WORD_H, clipPath: `inset(0 ${(1 - wm) * 100}% 0 0)`, opacity: wm > 0 ? 1 : 0 }}>
        <Img src={staticFile("brand/wordmark-light.png")} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>
      <div style={{ position: "absolute", left: SAFE.x0, width: SAFE.x1 - SAFE.x0, top: tagTop, textAlign: "center", fontFamily: FONT.sans, fontWeight: 500, fontSize: TYPE.support, color: C.fa, opacity: tag, translate: `0 ${(1 - tag) * 14}px` }}>
        Because every <span style={{ color: C.gold }}>second</span> matters.
      </div>
      <div style={{ position: "absolute", left: SAFE.x0, width: SAFE.x1 - SAFE.x0, top: tagTop + 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: cta, translate: `0 ${(1 - cta) * 24}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 30px", borderRadius: 999, border: `2px solid ${C.gold}`, background: `rgba(240,178,66,${0.1 + 0.08 * pulse})`, boxShadow: `0 0 ${18 * pulse}px rgba(240,178,66,0.35)`, fontFamily: FONT.sans, whiteSpace: "nowrap" }}>
          <svg width={30} height={30} viewBox="0 0 24 24">
            <path d="M4 5h16v11H9l-5 4z" fill="none" stroke={C.gold} strokeWidth={2} strokeLinejoin="round" />
          </svg>
          <span style={{ fontWeight: 600, fontSize: 32, color: C.fa }}>
            Kitne zone? <span style={{ color: C.gold }}>Comment</span> karein
          </span>
        </div>
        <Label style={{ fontSize: 22 }}>Free consultation · WhatsApp +91 79080 54311</Label>
      </div>
    </AbsoluteFill>
  );
};
