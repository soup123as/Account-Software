import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, E, FONT, SAFE, TYPE, ip, noise1, prog } from "../fk/theme";
import { Display, Label, Stack, TypeOn } from "../fk/ui";
import { Cam, CamView } from "./fx";
import { Interior } from "./Interior";
import { Phone } from "./Phone";
import { LOCK, Shopfront } from "./Shopfront";
import { TopFade } from "./scenes1";
import { at } from "./timing";

/* ------------------------------------------------------------------ */
/* 7 PRODUCT - the real Protector render from thefireknight.in.         */
/* L10 Ceiling par, The Protector. Shutter girne ke baad bhi... jaagta hua. */
/* ------------------------------------------------------------------ */
export const SH7Product: React.FC = () => {
  const f = useCurrentFrame();
  const ce = at("product", "ceiling");
  const pr = at("product", "protector");
  const gi = at("product", "girne");
  const ja = at("product", "jaagta");
  const p = prog(f, 0, 22, E.out);
  const sweep = ip(f, [pr - 4, pr + 30], [-30, 130], E.inOut);
  const src = staticFile("product/protector.webp");
  const CW = 840;
  const CH = 560;
  const CT = 860;
  const W = 900;
  const Hh = (W * 1920) / 2560;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* studio card: the real render on its own light-grey backdrop, framed like a product shot */}
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
        <Img
          src={src}
          style={{
            position: "absolute",
            left: (CW - W) / 2,
            top: (CH - Hh) / 2 + 10,
            width: W,
            height: Hh,
            scale: `${1 + prog(f, 0, 132) * 0.035}`,
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.12) 100%)" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(110deg, rgba(255,255,255,0) ${sweep - 10}%, rgba(255,255,255,0.28) ${sweep}%, rgba(255,255,255,0) ${sweep + 10}%)`,
            mixBlendMode: "screen",
          }}
        />
      </div>
      <div style={{ position: "absolute", left: 120, top: CT + CH + 34, opacity: prog(f, pr + 10, pr + 22) }}>
        <Label style={{ color: C.silver }}>
          The Protector <span style={{ color: C.gold }}>·</span> fire suppression aid
        </Label>
      </div>
      
      <Stack top={380}>
        <TypeOn words={["Ceiling", "par,"]} at={ce} out={gi - 6} color={C.fa} />
        <Display words={[{ w: "PROTECTOR.", c: C.gold }]} at={pr} out={gi - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Shutter", "girne", "ke", "baad", "bhi..."]} at={gi} perLetter={0.8} color={C.fa} />
        <Display words={[{ w: "JAAGTA", c: C.gold }, "HUA."]} at={ja} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 8 SYSTEM - sense, confirm, siren + light, suppression; the photo.    */
/* L11 Flame, heat aur gas sensors milkar confirm karte hain. Siren, light... aur suppression, apne aap. */
/* L12 Aur usse pehle... ek photo. Wahi saboot, jo insurance maangega.   */
/* ------------------------------------------------------------------ */
const Chips: React.FC<{ on: number[]; f: number; out: number }> = ({ on, f, out }) => {
  const o = prog(f, out, out + 7, E.in);
  if (f < on[0] - 1 || o >= 1) return null;
  const names = ["Flame", "Heat", "Gas"];
  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 18, opacity: 1 - o, translate: `0 ${-o * 20}px` }}>
      {names.map((n, i) => {
        const p = prog(f, on[i], on[i] + 8, E.out);
        return (
          <div
            key={n}
            style={{
              padding: "10px 22px",
              borderRadius: 999,
              border: `1.5px solid ${p > 0.5 ? C.gold : "rgba(250,250,250,0.2)"}`,
              background: `rgba(240,178,66,${0.12 * p})`,
              fontFamily: FONT.sans,
              fontWeight: 600,
              fontSize: 32,
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

export const SH8System: React.FC = () => {
  const f = useCurrentFrame();
  const fl = at("system", "flame");
  const he = at("system", "heat");
  const ga = at("system", "gas");
  const co = at("system", "confirm");
  const si = at("system", "siren");
  const li = at("system", "light");
  const su = at("system", "suppression");
  const pe = at("system", "pehle");
  const ph = at("system", "photo");
  const ws = at("system", "wahiSaboot");

  const cam: Cam = { z: 0.92 + prog(f, 0, pe) * 0.06, cx: 540, cy: 1100, ay: 1300, sx: f >= si && f < pe ? noise1(f * 0.8, 2) * 1.2 : 0 };
  const flameH = ip(f, [0, fl, si, su + 8, su + 50], [0.05, 0.25, 0.5, 0.5, 0], E.inOut);
  const mist = prog(f, su, su + 28, E.out) * (1 - prog(f, pe - 10, pe));
  const strobe = f >= si && f < pe - 4 ? 1 : 0;
  const sense = ip(f, [fl - 6, fl + 4, co + 20, si], [0, 1, 1, 0]);
  // L12: rewind to the moment before activation, the flash, the photo
  const back = prog(f, pe - 8, pe + 6, E.inOut);
  const flash = f >= ph ? Math.max(0, 1 - (f - ph) / 9) : 0;
  const card = prog(f, ph + 4, ph + 22, E.out);
  const tStill = 1200 + (si - 10);

  const scene = (
    <Interior
      t={f + 1200}
      boardHeat={1}
      flame={flameH}
      protector={1}
      awake={1}
      sense={sense}
      strobe={strobe}
      mist={mist}
      smoke={0.2 * prog(f, su, su + 40)}
    />
  );
  const before = <Interior t={tStill} boardHeat={1} flame={0.3} protector={1} awake={1} flash={flash} />;

  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ opacity: 1 - back }}>
        <CamView cam={cam}>{scene}</CamView>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: back, filter: `saturate(${0.6 + 0.4 * flash}) blur(${card * 5}px)` }}>
        <CamView cam={{ z: 0.98, cx: 540, cy: 1100, ay: 1300 }}>{before}</CamView>
      </AbsoluteFill>
      {/* rewind streak */}
      {back > 0 && back < 1 && <AbsoluteFill style={{ background: `rgba(250,250,250,${Math.sin(back * Math.PI) * 0.14})` }} />}

      {/* the photo, saved before activation */}
      {card > 0 && (
        <div
          style={{
            position: "absolute",
            left: 540 - 290,
            top: 930,
            width: 580,
            height: 520,
            background: "#F4F2EC",
            borderRadius: 10,
            padding: 22,
            boxShadow: "0 30px 80px rgba(0,0,0,0.75)",
            opacity: card,
            rotate: `${-4 + (1 - card) * 8}deg`,
            scale: `${0.86 + 0.14 * card}`,
            translate: `0 ${(1 - card) * 60}px`,
          }}
        >
          <div style={{ position: "relative", width: 536, height: 400, overflow: "hidden", background: "#000" }}>
            <CamView cam={{ z: 0.55, cx: 520, cy: 1200, ax: 268, ay: 210 }}>
              <Interior t={tStill} boardHeat={1} flame={0.3} protector={1} awake={1} />
            </CamView>
            <div style={{ position: "absolute", left: 14, bottom: 10, fontFamily: FONT.sans, fontWeight: 600, fontSize: 20, color: "#FFB33A", letterSpacing: "0.04em" }}>
              02:03:41
            </div>
          </div>
          <div style={{ marginTop: 18, fontFamily: FONT.sans, fontWeight: 600, fontSize: 24, color: "#1b1b1b", letterSpacing: "-0.01em" }}>
            Photo · before activation
          </div>
        </div>
      )}

      <TopFade to={860} />
      <Stack top={380}>
        <Chips on={[fl, he, ga]} f={f} out={si - 6} />
        <TypeOn words={["sensors", "milkar"]} at={ga + 10} out={si - 6} color={C.fa} />
        <Display words={[{ w: "CONFIRM", c: C.gold }, "KARTE", "HAIN."]} at={co} out={si - 6} size={112} />
      </Stack>
      <Stack top={380}>
        <Display words={["SIREN,"]} at={si} out={pe - 8} />
        <Display words={["LIGHT..."]} at={li} out={pe - 8} />
        <TypeOn words={["aur"]} at={su - 6} out={pe - 8} color={C.fa} />
        <Display words={[{ w: "SUPPRESSION,", c: C.gold }]} at={su} out={pe - 8} size={112} />
        <TypeOn words={["apne", "aap."]} at={su + 30} out={pe - 8} color={C.fa} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Aur", "usse", "pehle..."]} at={pe} out={ws - 6} color={C.fa} />
        <Display words={["EK", { w: "PHOTO.", c: C.gold }]} at={ph} out={ws - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Wahi"]} at={ws} color={C.fa} />
        <Display words={[{ w: "SABOOT,", c: C.gold }]} at={ws + 6} />
        <TypeOn words={["jo", "insurance", "maangega."]} at={ws + 24} perLetter={0.8} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 9 ALERT - this time, no stranger's call.                            */
/* L13 Is baar kisi unknown call ka intezaar nahi... alert seedha aapke phone par. */
/* ------------------------------------------------------------------ */
export const SH9Alert: React.FC = () => {
  const f = useCurrentFrame();
  const ib = at("alert", "isBaar");
  const al = at("alert", "alert");
  const ph = prog(f, 0, 16, E.out);
  const note = prog(f, al, al + 12, E.out);
  const cam: Cam = { z: 1.1, cx: 540, cy: 1200, ay: 1300 };
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ filter: "blur(8px)", opacity: 0.6 }}>
        <CamView cam={cam}>
          <Shopfront t={f + 1500} cool={0.4} green={0} strobe={0.7} street={0.9} />
        </CamView>
      </AbsoluteFill>
      <TopFade to={860} />
      <div
        style={{
          position: "absolute",
          left: 540 - 190,
          top: 900,
          opacity: ph,
          translate: `0 ${(1 - ph) * 60}px`,
          filter: note > 0 && note < 1 ? `drop-shadow(0 0 ${note * 30}px rgba(227,40,28,0.5))` : undefined,
        }}
      >
        <Phone mode="alert" t={f} note={note} time="2:03" />
      </div>
      <Stack top={380}>
        <TypeOn words={["Is", "baar", "kisi", "unknown", "call", "ka"]} at={ib} out={al - 6} perLetter={0.8} color={C.fa} />
        <Display words={["INTEZAAR", { w: "NAHI...", c: C.gold }]} at={ib + 36} out={al - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["alert", "seedha"]} at={al} color={C.fa} />
        <Display words={[{ w: "AAPKE", c: C.gold }, "PHONE"]} at={al + 12} />
        <TypeOn words={["par."]} at={al + 28} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 10 HERO - the lock, the line, the logo, the share.                   */
/* L14 Kyunki taala chor ko rokta hai... aag ko nahi.                    */
/* L15 The Fire Knight. Yeh reel har us dukaandaar ko bhejiye... jo aaj raat shutter giraayega. */
/* ------------------------------------------------------------------ */
const EMBLEM_H = 300;
const EMBLEM_W = Math.round((EMBLEM_H * 762) / 909);
const WORD_W = 450;
const WORD_H = Math.round((WORD_W * 104) / 1077);
const WHATSAPP = "+91 79080 54311";

export const SH10Hero: React.FC = () => {
  const f = useCurrentFrame();
  const ta = at("hero", "taala");
  const ak = at("hero", "aagKo");
  const fk = at("hero", "fk");
  const bj = at("hero", "bhejiye");
  const pull = prog(f, fk - 14, fk + 30, E.cam);
  const LOCKCAM: Cam = { z: 3.4 + prog(f, 0, fk) * 0.15, cx: LOCK.x, cy: LOCK.y - 10, ay: 1240 };
  const WIDE: Cam = { z: 0.78, cx: 540, cy: 1150, ay: 1380 };
  const cam: Cam = {
    z: ip(pull, [0, 1], [LOCKCAM.z, WIDE.z]),
    cx: 540,
    cy: ip(pull, [0, 1], [LOCKCAM.cy, WIDE.cy]),
    ay: ip(pull, [0, 1], [LOCKCAM.ay!, WIDE.ay!]),
  };
  const em = prog(f, fk, fk + 16, E.out);
  const sheen = ip(f, [fk + 12, fk + 40], [-30, 130], E.inOut);
  const wm = prog(f, fk + 14, fk + 28, E.out);
  const tag = prog(f, fk + 26, fk + 38, E.out);
  const cta = prog(f, bj, bj + 14, E.out);
  const pulse = f > bj + 14 ? 0.5 + 0.5 * Math.sin((f - bj) * 0.12) : 0;
  const emblemSrc = staticFile("brand/emblem.png");
  const top = 400;
  const tagTop = top + EMBLEM_H + 40 + WORD_H + 40;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <CamView cam={cam}>
        <Shopfront t={f + 1700} cool={0.35} green={1} street={0.9} />
      </CamView>
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.96) 0px, rgba(0,0,0,0.9) 900px, rgba(0,0,0,0.2) 1300px)",
          opacity: Math.max(0.9 - pull * 0.9 + 0.0, prog(f, fk - 6, fk + 20)),
        }}
      />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.95) 0px, rgba(0,0,0,0.85) 620px, rgba(0,0,0,0) 860px)", opacity: 1 - pull }} />
      <Stack top={380}>
        <Display words={[{ w: "TAALA", c: C.gold }]} at={ta} out={fk - 8} />
        <TypeOn words={["chor", "ko", "rokta", "hai..."]} at={ta + 14} out={fk - 8} color={C.fa} />
        <Display words={[{ w: "AAG", c: C.gold }]} at={ak} out={fk - 8} />
        <TypeOn words={["ko", "nahi."]} at={ak + 12} out={fk - 8} color={C.fa} />
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
          top: tagTop + 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: cta,
          translate: `0 ${(1 - cta) * 24}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 30px",
            borderRadius: 999,
            border: `2px solid ${C.gold}`,
            background: `rgba(240,178,66,${0.1 + 0.08 * pulse})`,
            boxShadow: `0 0 ${18 * pulse}px rgba(240,178,66,0.35)`,
            fontFamily: FONT.sans,
            whiteSpace: "nowrap",
          }}
        >
          <svg width={30} height={30} viewBox="0 0 24 24">
            <path d="M3 11.5 21 3l-8.5 18-2.2-7.3L3 11.5z" fill="none" stroke={C.gold} strokeWidth={2} strokeLinejoin="round" />
            <path d="M10.3 13.7 21 3" stroke={C.gold} strokeWidth={2} />
          </svg>
          <span style={{ fontWeight: 600, fontSize: 32, color: C.fa }}>
            Har <span style={{ color: C.gold }}>dukaandaar</span> ko bhejiye
          </span>
        </div>
        <Label style={{ fontSize: 22 }}>
          Free consultation · WhatsApp {WHATSAPP}
        </Label>
      </div>
    </AbsoluteFill>
  );
};
