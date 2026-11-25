import React from "react";
import { AbsoluteFill, Series, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C, E, FONT, SAFE, prog } from "../fk/theme";
import { Grain, SafeGuide, Vignette } from "../fk/ui";
import { Bloom, Dip, HeatFlash, MistWash } from "../OperatorAkela";
import { Bare, N10Punch, N11Hero, N1Hook, N2Call1, N3Call2, N4Drive, N5Inside, N6Turn, N7Product, N8System, N9Alert } from "../call/scenes";
import { CUE, N_LEN, N_START, at } from "../call/timing";
import { Captions, Card, Fx, Head, Header, Mark, Pill, RED, Stamp, Tag } from "../cards/kit";
import { WORDS } from "../cards/words";

export type FullProps = { showSafe: boolean; audio: string | null };
export const fullDefaults: FullProps = { showSafe: false, audio: "audio/call-mix-vo.wav" };

const X = SAFE.x0;
const gold = (w: string) => ({ w, c: C.gold });
const LIFT = -130; // the pictures sit a little higher, so the spoken captions get the bottom of the frame

/** The meter: nobody answers (0/3), then the unit does. */
const Meter: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  if (f < N_START.call1) {
    return (
      <Pill color="rgba(227,40,28,0.7)">
        <div style={{ width: 11, height: 11, borderRadius: "50%", background: RED, opacity: Math.sin(f * 0.5) > 0 ? 1 : 0.25 }} />
        <Tag color={C.fa} size={19}>
          Raat 2:00 · alarm
        </Tag>
      </Pill>
    );
  }
  if (f < N_START.turn) {
    const fails = [CUE.nahiW + 0.2, CUE.silent + 0.87, CUE.koneW + 0.4];
    const n = fails.filter((x) => t >= x).length;
    return (
      <Pill color={n > 0 ? "rgba(227,40,28,0.7)" : undefined}>
        <Tag color={C.fa} size={19}>
          Jawaab
        </Tag>
        <div style={{ display: "flex", gap: 6 }}>
          {fails.map((x, i) => (
            <div key={i} style={{ width: 26, height: 6, borderRadius: 3, background: t >= x ? RED : "rgba(250,250,250,0.22)" }} />
          ))}
        </div>
        <Tag color={C.fa} size={19}>
          0/3
        </Tag>
      </Pill>
    );
  }
  const active = t >= CUE.activateW;
  return (
    <Pill color={C.gold}>
      <div style={{ width: 11, height: 11, borderRadius: "50%", background: active ? C.gold : "#3BEA6A" }} />
      <Tag color={C.fa} size={19}>
        Unit · {active ? "jawaab" : "armed"}
      </Tag>
      {active && (
        <div style={{ color: C.gold, display: "flex" }}>
          <Mark ok size={20} />
        </div>
      )}
    </Pill>
  );
};

/** One full-screen picture (the cinematic scene without its own text), lifted, with this cut's headline on top. */
const Shot: React.FC<{ lift?: number; topOut?: number; children: React.ReactNode; over?: React.ReactNode }> = ({ lift = LIFT, topOut, children, over }) => {
  const f = useCurrentFrame();
  const top = topOut === undefined ? 1 : 1 - prog(f, topOut - 8, topOut);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ translate: lift ? `0 ${lift}px` : undefined }}>
        <Bare.Provider value={true}>{children}</Bare.Provider>
      </AbsoluteFill>
      {/* calm fields for the headline (top) and the spoken captions (bottom): text never sits on an object */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.96) 0px, rgba(0,0,0,0.9) 560px, rgba(0,0,0,0) 790px)", opacity: top }} />
      {lift !== 0 && <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.97) 0px, rgba(0,0,0,0.94) 470px, rgba(0,0,0,0.6) 610px, rgba(0,0,0,0) 740px)" }} />}
      {over}
    </AbsoluteFill>
  );
};

const O1: React.FC = () => {
  const ph = at("hook", "phone");
  const ak = at("hook", "abKya");
  const ky = at("hook", "kyaW");
  return (
    <>
      <Head small="Raat 2 baje" lines={[["ALARM", "BAJA."], [gold("PHIR"), gold("PHONE.")]]} at={-40} ats={[-40, ph]} out={ak - 5} />
      <Head small="Ab aap" lines={[[gold("KYA"), "KARENGE?"]]} at={ak} ats={[ky]} />
    </>
  );
};
const O2: React.FC = () => {
  const c1 = at("call1", "call1");
  const gw = at("call1", "guardW");
  const cb = at("call1", "chaabi");
  const nw = at("call1", "nahiW");
  return (
    <>
      <Head small="Call 01" lines={[["GUARD", "KO."]]} at={c1 - 6} ats={[gw - 14]} out={cb - 5} />
      <Head small="Server room ki chaabi" lines={[["USKE", "PAAS", gold("NAHI.")]]} at={cb} ats={[nw - 8]} />
      <Stamp at={nw + 6} x={X + 20} y={1150} rot={-7}>
        Chaabi nahi
      </Stamp>
    </>
  );
};
const O3: React.FC = () => {
  const c2 = at("call2", "call2");
  const iw = at("call2", "itW");
  const si = at("call2", "silent");
  return (
    <>
      <Head small="Call 02" lines={[["IT", "TEAM", "KO."]]} at={c2 - 6} ats={[iw - 14]} out={si - 5} />
      <Head small="Phone" lines={[[gold("SILENT"), "PAR."]]} at={si} ats={[si + 6]} />
      <Stamp at={si + 26} x={X + 500} y={1150} rot={-6}>
        Jawaab nahi
      </Stamp>
    </>
  );
};
const O4: React.FC = () => {
  const kh = at("drive", "khud");
  const ni = at("drive", "nikalteW");
  const ko = at("drive", "kone");
  const kw = at("drive", "koneW");
  return (
    <>
      <Head small="Toh aap khud" lines={[["NIKALTE", "HAIN."]]} at={kh - 6} ats={[ni - 12]} out={ko - 5} />
      <Head small="Office" lines={[["SHEHAR", "KE", "DOOSRE"], [gold("KONE"), "MEIN."]]} at={ko} ats={[ko + 8, kw - 4]} />
      <Stamp at={kw + 12} x={X + 430} y={1010} rot={-6}>
        Bahut door
      </Stamp>
    </>
  );
};
const O5: React.FC = () => {
  const ka = at("inside", "kaam");
  const kw = at("inside", "kaamW");
  const an = at("inside", "andar");
  const ki = at("inside", "kisiW");
  const kiy = at("inside", "kiyaW");
  return (
    <>
      <Head small="Alarm ne" lines={[["KAAM", "KAR", "DIYA."]]} at={ka - 6} ats={[kw - 10]} out={an - 5} />
      <Head small="Room ke andar" lines={[["KISI", "NE", "KUCH"], [gold("NAHI"), "KIYA."]]} at={an} ats={[ki - 6, kiy - 4]} />
    </>
  );
};
const O6: React.FC = () => {
  const ta = at("turn", "tareeka");
  return <Head small="Ek aur" lines={[[gold("TAREEKA"), "HAI."]]} at={ta - 6} ats={[ta + 8]} />;
};
const O7: React.FC = () => {
  const un = at("product", "unit");
  const uw = at("product", "unitW");
  const fl = at("product", "flameW");
  const ga = at("product", "garmiW");
  const sw = at("product", "senseW");
  const chip = (t: string, s: string, a: number, x: number, w: number, g?: boolean) => (
    <Fx at={a} kind="pop" style={{ left: X + x, top: 1256 }}>
      <Card w={w} h={88} pad={0} gold={g} style={{ borderRadius: 20, padding: "10px 20px", ...(g ? { background: C.gold, color: "#111" } : {}) }}>
        <div style={{ fontFamily: FONT.display, fontSize: 40, letterSpacing: "0.02em", lineHeight: 1.05, display: "flex", alignItems: "center", gap: 10 }}>
          {t}
          {g && <Mark ok size={30} />}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.6, marginTop: 2 }}>{s}</div>
      </Card>
    </Fx>
  );
  return (
    <>
      <Head small="Deewar par" lines={[["EK", gold("UNIT.")]]} at={un - 4} ats={[uw - 8]} />
      {chip("FLAME", "IR detection", fl, 0, 236)}
      {chip("GARMI", "Rate-of-rise", ga, 252, 236)}
      {chip("KHUD SENSE", "Koi insaan nahi", sw, 504, 316, true)}
    </>
  );
};
const O8: React.FC = () => {
  const ac = at("system", "activate");
  const aw = at("system", "activateW");
  const nc = at("system", "naChaabi");
  const ncw = at("system", "naCallW");
  return (
    <>
      <Head small="Aur khud" lines={[[gold("ACTIVATE.")]]} at={ac - 4} ats={[aw - 8]} out={nc - 5} />
      <Head small="Na chaabi chahiye," lines={[["NA", gold("CALL.")]]} at={nc} ats={[ncw - 6]} />
      <Fx at={aw + 10} kind="stamp" rot={-5} out={nc - 5} style={{ left: X + 10, top: 1170 }}>
        <div style={{ padding: "8px 20px 4px", border: `4px solid ${C.gold}`, borderRadius: 8, background: "rgba(0,0,0,0.78)", color: C.gold, fontFamily: FONT.display, fontSize: 46, letterSpacing: "0.04em", whiteSpace: "nowrap", lineHeight: 1.05 }}>AUTOMATIC ✓</div>
      </Fx>
    </>
  );
};
const O9: React.FC = () => {
  const al = at("alert", "alert");
  const apw = at("alert", "alertPhoneW");
  const ap = at("alert", "app");
  const ch = at("alert", "chalaW");
  return (
    <>
      <Head small="Alert" lines={[["AAPKE", gold("PHONE"), "PAR."]]} at={al - 6} ats={[apw - 8]} out={ap - 5} />
      <Head small="Aur app se bhi" lines={[["UNIT", gold("CHALA")], ["SAKTE", "HAIN."]]} at={ap} ats={[ch - 10, ch + 4]} />
      <Stamp at={apw + 14} x={X + 520} y={900} color={C.gold} rot={-5} size={40}>
        Alert sent ✓
      </Stamp>
    </>
  );
};
const O10: React.FC = () => {
  const f = useCurrentFrame();
  const za = at("punch", "zaroori");
  const aw = at("punch", "awaaz");
  const aww = at("punch", "awaazW");
  const ja = at("punch", "jawaab");
  const pj = prog(f, ja, ja + 6, E.out);
  return (
    <>
      <Head small="Alarm" lines={[["ZAROORI", "HAI."]]} at={za - 6} ats={[za + 6]} out={aw - 5} />
      <Head small="Lekin alarm sirf" lines={[[gold("AWAAZ"), "DETA", "HAI."]]} at={aw} ats={[aww - 8]} out={ja - 5} />
      {f >= ja && (
        <div
          style={{
            position: "absolute",
            left: X,
            top: 360,
            width: SAFE.x1 - SAFE.x0,
            height: 330,
            borderRadius: 30,
            background: C.gold,
            boxSizing: "border-box",
            padding: "24px 34px",
            opacity: Math.min(1, pj * 3),
            scale: `${1.16 - 0.16 * pj}`,
            filter: pj < 1 ? `blur(${(1 - pj) * 12}px)` : undefined,
            boxShadow: "0 0 80px rgba(240,178,66,0.3)",
          }}
        >
          <div style={{ fontFamily: FONT.display, fontSize: 176, lineHeight: 0.98, color: "#0b0b0b", letterSpacing: "0.01em" }}>JAWAAB</div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 50, letterSpacing: "-0.02em", color: "#0b0b0b", marginTop: 8 }}>kisi ko dena padta hai.</div>
        </div>
      )}
    </>
  );
};
const O11: React.FC = () => {
  const ji = at("hero", "jinke");
  const yc = at("hero", "yehCallW");
  const bj = at("hero", "bhejiye");
  return <Head small="Jinke paas raat ko" lines={[["YEH", gold("CALL")], ["AATA", "HAI"]]} at={ji - 6} ats={[yc - 10, yc + 2]} out={bj - 10} />;
};

const Top: React.FC = () => {
  const f = useCurrentFrame();
  const end = Math.round(CUE.bhejiye * 30);
  const o = 1 - Math.min(1, Math.max(0, (f - (end - 10)) / 8));
  if (o <= 0) return null;
  return (
    <Header o={o}>
      <Meter />
    </Header>
  );
};

/**
 * "Raat ka call" - full-screen cut: the cinematic pictures edge to edge (like the shutter reel), with the
 * short headline stack, the meter, the stamps and the word-by-word captions from the cards cut.
 */
export const NightCallFull: React.FC<FullProps> = ({ showSafe, audio }) => {
  const seq: [keyof typeof N_LEN, React.ReactNode, React.ReactNode, number][] = [
    ["hook", <N1Hook key="a" />, <O1 key="b" />, LIFT],
    ["call1", <N2Call1 key="a" />, <O2 key="b" />, LIFT],
    ["call2", <N3Call2 key="a" />, <O3 key="b" />, LIFT],
    ["drive", <N4Drive key="a" />, <O4 key="b" />, LIFT],
    ["inside", <N5Inside key="a" />, <O5 key="b" />, LIFT],
    ["turn", <N6Turn key="a" />, <O6 key="b" />, LIFT],
    ["product", <N7Product key="a" />, <O7 key="b" />, LIFT],
    ["system", <N8System key="a" />, <O8 key="b" />, LIFT],
    ["alert", <N9Alert key="a" />, <O9 key="b" />, LIFT],
    ["punch", <N10Punch key="a" />, <O10 key="b" />, -40],
    ["hero", <N11Hero key="a" />, <O11 key="b" />, 0],
  ];
  const overlays = [Dip, Dip, Bloom, HeatFlash, Dip, MistWash, Dip, Dip, Dip, Dip];
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <Series>
        {seq.map(([k, scene, over, lift]) => (
          <Series.Sequence key={k} name={k} durationInFrames={N_LEN[k]}>
            <Shot lift={lift} over={over} topOut={k === "hero" ? at("hero", "bhejiye") : undefined}>
              {scene}
            </Shot>
          </Series.Sequence>
        ))}
      </Series>
      {/* the same motivated transitions as the cinematic cut, centred on each cut */}
      {overlays.map((Ov, i) => {
        const cutF = N_START[seq[i + 1][0]];
        return (
          <Series key={i}>
            <Series.Sequence durationInFrames={Math.max(1, cutF - 9)} layout="none">
              <></>
            </Series.Sequence>
            <Series.Sequence durationInFrames={18}>
              <Ov />
            </Series.Sequence>
          </Series>
        );
      })}
      <Top />
      <Captions words={WORDS} top={1376} hideAfter={CUE.end + 0.2} />
      <Vignette strength={0.6} />
      <Grain opacity={0.05} />
      {showSafe && <SafeGuide />}
      {audio && <Audio src={staticFile(audio)} />}
    </AbsoluteFill>
  );
};
