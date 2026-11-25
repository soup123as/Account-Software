import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, E, FONT, SAFE, TYPE, ip, prog } from "../fk/theme";
import { Label } from "../fk/ui";
import { CityMap } from "../call/CityMap";
import { Handset } from "../call/Handset";
import { at } from "../call/timing";
import { Card, Chip, Fx, Head, IcoComodo, IcoDetector, IcoDoor, IcoKey, IcoPhone, Mark, RED, RoomDiagram, Row, Stamp, Tag } from "./kit";

const X = SAFE.x0;
const W = SAFE.x1 - SAFE.x0;
const gold = (w: string) => ({ w, c: C.gold });

/** Scene wrapper: a quick blur in and out, so cuts feel like one continuous build. */
export const Shot: React.FC<{ len: number; first?: boolean; children: React.ReactNode }> = ({ len, first, children }) => {
  const f = useCurrentFrame();
  const a = first ? 1 : prog(f, 0, 3);
  const b = prog(f, len - 3, len);
  const o = Math.min(a, 1 - b);
  return <AbsoluteFill style={{ opacity: o, filter: o < 1 ? `blur(${(1 - o) * 16}px)` : undefined, scale: `${1 + 0.02 * prog(f, 0, len)}` }}>{children}</AbsoluteFill>;
};

const Contact: React.FC<{ initial: string; name: string; sub: string; status: string; f: number }> = ({ initial, name, sub, status, f }) => (
  <Card w={W} h={150} style={{ display: "flex", alignItems: "center", gap: 22 }}>
    <div style={{ position: "relative", width: 96, height: 96 }}>
      {[0, 1].map((i) => {
        const ph = (f * 0.035 + i * 0.5) % 1;
        return <div key={i} style={{ position: "absolute", inset: -ph * 26, borderRadius: "50%", border: "2px solid rgba(250,250,250,0.5)", opacity: 1 - ph }} />;
      })}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#3a4152", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 700, color: "#c3cbdb" }}>{initial}</div>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.02em" }}>{name}</div>
      <div style={{ fontSize: 26, opacity: 0.6, marginTop: 2 }}>{sub}</div>
    </div>
    <Chip color={C.fa} size={20}>
      {status}
      {status === "Calling" ? ".".repeat(1 + (Math.floor(f / 8) % 3)) : ""}
    </Chip>
  </Card>
);

/* 1 HOOK ------------------------------------------------------------ */
export const K1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const ph = at("hook", "phone");
  const ak = at("hook", "abKya");
  const ky = at("hook", "kyaW");
  return (
    <AbsoluteFill>
      <Head small="Raat 2 baje" lines={[["ALARM", "BAJA."], [gold("PHIR"), gold("PHONE.")]]} at={-40} ats={[-40, ph]} out={ak - 5} />
      <Head small="Ab aap" lines={[[gold("KYA"), "KARENGE?"]]} at={ak} ats={[ky]} />
      <Fx at={-40} kind="slide" style={{ left: X, top: 770 }}>
        <Card w={398} h={340} red>
          <Tag>Server room</Tag>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
            <IcoDetector t={f + 40} size={250} />
          </div>
          <div style={{ position: "absolute", left: 22, bottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 30, fontWeight: 700 }}>Smoke alarm</div>
          </div>
          <div style={{ position: "absolute", right: 20, bottom: 20 }}>
            <Chip color={RED} fill size={17}>
              Ringing
            </Chip>
          </div>
        </Card>
      </Fx>
      <Fx at={ph} kind="slide" dx={60} dy={0} style={{ left: X + 422, top: 770 }}>
        <Card w={398} h={340} gold>
          <Tag>Aapka phone</Tag>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
            <IcoPhone t={f} ring={1} size={206} />
          </div>
          <div style={{ position: "absolute", left: 22, bottom: 20 }}>
            <div style={{ fontSize: 30, fontWeight: 700 }}>Security Desk</div>
          </div>
          <div style={{ position: "absolute", right: 20, bottom: 24, fontSize: 22, opacity: 0.6 }}>2:01 AM</div>
        </Card>
      </Fx>
      {["Guard?", "IT team?", "Khud jaayein?"].map((t, i) => (
        <Fx key={t} at={ky + 4 + i * 7} kind="pop" style={{ left: X + [0, 196, 450][i], top: 1146 }}>
          <Card w={[176, 234, 370][i]} h={84} pad={0} style={{ borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700 }}>
            {t}
          </Card>
        </Fx>
      ))}
    </AbsoluteFill>
  );
};

/* 2 CALL 1 ---------------------------------------------------------- */
export const K2Call1: React.FC = () => {
  const f = useCurrentFrame();
  const c1 = at("call1", "call1");
  const gw = at("call1", "guardW");
  const cb = at("call1", "chaabi");
  const nw = at("call1", "nahiW");
  return (
    <AbsoluteFill>
      <Head small="Call 01" lines={[["GUARD", "KO."]]} at={c1 - 6} ats={[gw - 14]} out={cb - 5} />
      <Head small="Server room ki chaabi" lines={[["USKE", "PAAS", gold("NAHI.")]]} at={cb} ats={[nw - 8]} />
      <Fx at={2} kind="slide" style={{ left: X, top: 770 }}>
        <Contact initial="G" name="Guard" sub="Office · night shift" status={f < cb ? "Calling" : "On site"} f={f} />
      </Fx>
      <Fx at={cb} kind="slide" style={{ left: X, top: 944 }}>
        <Card w={398} h={350}>
          <Tag>Server room door</Tag>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
            <IcoDoor t={f} size={250} />
          </div>
          <div style={{ position: "absolute", right: 20, bottom: 20 }}>
            <Chip color={RED} size={17}>
              Locked
            </Chip>
          </div>
        </Card>
      </Fx>
      <Fx at={cb + 10} kind="slide" dx={60} dy={0} style={{ left: X + 422, top: 944 }}>
        <Card w={398} h={350} red={f >= nw}>
          <Tag>Chaabi</Tag>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
            <IcoKey size={230} cross={prog(f, nw, nw + 8)} />
          </div>
        </Card>
      </Fx>
      <Stamp at={nw + 6} x={X + 470} y={1210} rot={-7}>
        Chaabi nahi
      </Stamp>
    </AbsoluteFill>
  );
};

/* 3 CALL 2 ---------------------------------------------------------- */
export const K3Call2: React.FC = () => {
  const f = useCurrentFrame();
  const c2 = at("call2", "call2");
  const iw = at("call2", "itW");
  const si = at("call2", "silent");
  return (
    <AbsoluteFill>
      <Head small="Call 02" lines={[["IT", "TEAM", "KO."]]} at={c2 - 6} ats={[iw - 14]} out={si - 5} />
      <Head small="Phone" lines={[[gold("SILENT"), "PAR."]]} at={si} ats={[si + 6]} />
      <Fx at={2} kind="slide" style={{ left: X, top: 770 }}>
        <Contact initial="I" name="IT Team" sub="On-call engineer" status={f < si ? "Calling" : "No answer"} f={f} />
      </Fx>
      <Fx at={si} kind="slide" style={{ left: X, top: 944 }}>
        <Card w={W} h={350} red={f >= si + 22}>
          <Tag>Unka phone</Tag>
          {/* a small lock screen, asleep */}
          <div style={{ position: "absolute", left: 30, top: 66, width: 150, height: 258, borderRadius: 26, background: "#0a0b0d", border: "3px solid #c9ced3" }}>
            <div style={{ position: "absolute", top: 34, width: "100%", textAlign: "center", fontSize: 46, fontWeight: 500, letterSpacing: "-0.03em", opacity: 0.85 }}>2:06</div>
            <div style={{ position: "absolute", top: 104, left: 37, width: 70, height: 70 }}>
              <svg width={70} height={70} viewBox="0 0 24 24">
                <path d="M6 17h12l-1.5-2V11a4.5 4.5 0 0 0-9 0v4L6 17zM10 20h4" fill="none" stroke="#c9ced3" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 4l16 16" stroke={RED} strokeWidth={2.2} strokeLinecap="round" />
              </svg>
            </div>
          </div>
          {[0, 1].map((i) => (
            <Fx key={i} at={si + 10 + i * 12} kind="drop" style={{ left: 214, top: 80 + i * 96 }}>
              <Card w={576} h={82} pad={0} style={{ borderRadius: 18, display: "flex", alignItems: "center", padding: "0 20px", gap: 14 }}>
                <div style={{ color: RED, display: "flex" }}>
                  <Mark size={26} />
                </div>
                <div style={{ fontSize: 30, fontWeight: 700 }}>Missed call</div>
                <div style={{ fontSize: 24, opacity: 0.55, marginLeft: "auto" }}>Facility Manager</div>
              </Card>
            </Fx>
          ))}
          <div style={{ position: "absolute", left: 214, bottom: 24 }}>
            <Chip color={C.ash} size={17}>
              Silent mode
            </Chip>
          </div>
        </Card>
      </Fx>
      <Stamp at={si + 26} x={X + 500} y={1218} rot={-6}>
        Jawaab nahi
      </Stamp>
    </AbsoluteFill>
  );
};

/* 4 DRIVE ----------------------------------------------------------- */
export const K4Drive: React.FC = () => {
  const f = useCurrentFrame();
  const kh = at("drive", "khud");
  const ni = at("drive", "nikalteW");
  const ko = at("drive", "kone");
  const kw = at("drive", "koneW");
  return (
    <AbsoluteFill>
      <Head small="Toh aap khud" lines={[["NIKALTE", "HAIN."]]} at={kh - 6} ats={[ni - 12]} out={ko - 5} />
      <Head small="Office" lines={[["SHEHAR", "KE", "DOOSRE"], [gold("KONE"), "MEIN."]]} at={ko} ats={[ko + 8, kw - 4]} />
      <Fx at={2} kind="slide" style={{ left: X, top: 770 }}>
        <Card w={W} h={530} pad={0}>
          <svg width={W} height={530} viewBox="-56 730 1191 770" style={{ position: "absolute", inset: 0 }}>
            <CityMap t={f} route={prog(f, ko - 4, kw + 30, E.inOut)} car={ip(f, [kh, 137], [0, 0.18], E.out)} />
            <text x={236} y={1464} fontFamily="FK DM Sans" fontWeight={700} fontSize={34} fill={C.fa} letterSpacing={4}>
              AAP
            </text>
            <text x={846} y={746 + 58} textAnchor="end" fontFamily="FK DM Sans" fontWeight={700} fontSize={34} fill={C.fa} letterSpacing={4}>
              OFFICE
            </text>
          </svg>
          <div style={{ position: "absolute", left: 20, top: 18 }}>
            <Tag color="rgba(250,250,250,0.8)">Raat · 2:10 AM</Tag>
          </div>
        </Card>
      </Fx>
      <Stamp at={kw + 12} x={X + 470} y={1190} rot={-6}>
        Bahut door
      </Stamp>
    </AbsoluteFill>
  );
};

/* 5 INSIDE ---------------------------------------------------------- */
export const K5Inside: React.FC = () => {
  const f = useCurrentFrame();
  const ka = at("inside", "kaam");
  const kw = at("inside", "kaamW");
  const an = at("inside", "andar");
  const ki = at("inside", "kisiW");
  const kiy = at("inside", "kiyaW");
  const fire = ip(f, [0, an, 176], [0.5, 0.75, 1.15], E.inOut);
  const dark: [number, number, number] = [f > kiy + 10 ? 0.6 : 0, f > ki ? 0.6 : 0.3, f > an ? 1 : 0.6];
  return (
    <AbsoluteFill>
      <Head small="Alarm ne" lines={[["KAAM", "KAR", "DIYA."]]} at={ka - 6} ats={[kw - 10]} out={an - 5} />
      <Head small="Room ke andar" lines={[["KISI", "NE", "KUCH"], [gold("NAHI"), "KIYA."]]} at={an} ats={[ki - 6, kiy - 4]} />
      <Fx at={2} kind="slide" style={{ left: X, top: 770 }}>
        <Card w={W} h={270} red>
          <RoomDiagram t={f + 60} ring={1} fire={fire} dark={dark} />
          <div style={{ position: "absolute", left: 22, bottom: 18 }}>
            <Tag>Server room · conceptual</Tag>
          </div>
          <Fx at={kw - 4} kind="pop" style={{ left: 210, top: 22 }}>
            <Chip color={C.fa} fill size={17}>
              <Mark ok size={18} /> Alarm on
            </Chip>
          </Fx>
        </Card>
      </Fx>
      {[
        ["Guard", "chaabi nahi"],
        ["IT team", "phone silent"],
        ["Aap", "raaste mein"],
      ].map(([n, note], i) => (
        <Fx key={n} at={an + 2 + i * 9} kind="slide" dy={30} style={{ left: X, top: 1058 + i * 84 }}>
          <Row w={W} name={n} note={note} flip={ki - 4 + i * 8} after="Kuch nahi" />
        </Fx>
      ))}
    </AbsoluteFill>
  );
};

/* 6 TURN ------------------------------------------------------------ */
export const K6Turn: React.FC = () => {
  const f = useCurrentFrame();
  const ta = at("turn", "tareeka");
  return (
    <AbsoluteFill>
      <Head small="Ek aur" lines={[[gold("TAREEKA"), "HAI."]]} at={ta - 6} ats={[ta + 8]} />
      <Fx at={0} kind="blur" style={{ left: X, top: 770 }}>
        <Card w={W} h={270} gold={f > ta + 12}>
          <RoomDiagram t={f + 300} ring={1} fire={0.9} dark={[0.6, 0.6, 1]} slot={prog(f, ta + 10, ta + 20, E.out)} />
          <div style={{ position: "absolute", left: 22, bottom: 18 }}>
            <Tag>Wahi room</Tag>
          </div>
        </Card>
      </Fx>
      <Fx at={ta + 16} kind="pop" style={{ left: X + 520, top: 1066 }}>
        <Chip color={C.gold} size={22}>
          Deewar par?
        </Chip>
      </Fx>
    </AbsoluteFill>
  );
};

/* 7 PRODUCT --------------------------------------------------------- */
export const K7Product: React.FC = () => {
  const f = useCurrentFrame();
  const un = at("product", "unit");
  const uw = at("product", "unitW");
  const fl = at("product", "flameW");
  const ga = at("product", "garmiW");
  const sw = at("product", "senseW");
  const sweep = ip(f, [uw - 2, uw + 30], [-30, 130], E.inOut);
  const CW = W;
  const CH = 400;
  const IW = 620;
  const IH = (IW * 1122) / 1402;
  const chip = (t: string, s: string, a: number, x: number, w: number, g?: boolean) => (
    <Fx at={a} kind="pop" style={{ left: X + x, top: 1206 }}>
      <Card w={w} h={96} pad={0} gold={g} style={{ borderRadius: 20, padding: "12px 20px", ...(g ? { background: C.gold, color: "#111" } : {}) }}>
        <div style={{ fontFamily: FONT.display, fontSize: 40, letterSpacing: "0.02em", lineHeight: 1.05, display: "flex", alignItems: "center", gap: 10 }}>
          {t}
          {g && <Mark ok size={30} />}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.6, marginTop: 2 }}>{s}</div>
      </Card>
    </Fx>
  );
  return (
    <AbsoluteFill>
      <Head small="Deewar par" lines={[["EK", gold("UNIT.")]]} at={un - 4} ats={[uw - 8]} />
      <Fx at={0} kind="slide" dy={60} style={{ left: X, top: 720 }}>
        <div style={{ position: "relative", width: CW, height: CH, borderRadius: 26, overflow: "hidden", background: "#fff", boxShadow: "0 30px 90px rgba(0,0,0,0.75)" }}>
          <Img src={staticFile("product/comodo.webp")} style={{ position: "absolute", left: (CW - IW) / 2, top: (CH - IH) / 2 - 8, width: IW, height: IH, scale: `${1 + prog(f, 0, 143) * 0.05}` }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #e2e2e2 0%, #d2d2d2 60%, #bcbcbc 100%)", mixBlendMode: "multiply" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, rgba(255,255,255,0) ${sweep - 10}%, rgba(255,255,255,0.3) ${sweep}%, rgba(255,255,255,0) ${sweep + 10}%)`, mixBlendMode: "screen" }} />
        </div>
      </Fx>
      <Fx at={uw + 6} kind="blur" style={{ left: X, top: 1140 }}>
        <Label style={{ color: C.silver }}>
          The Comodo <span style={{ color: C.gold }}>·</span> fire suppression aid
        </Label>
      </Fx>
      {chip("FLAME", "IR detection", fl, 0, 236)}
      {chip("GARMI", "Rate-of-rise", ga, 252, 236)}
      {chip("KHUD SENSE", "Koi insaan nahi", sw, 504, 316, true)}
    </AbsoluteFill>
  );
};

/* 8 SYSTEM ---------------------------------------------------------- */
export const K8System: React.FC = () => {
  const f = useCurrentFrame();
  const ac = at("system", "activate");
  const aw = at("system", "activateW");
  const nc = at("system", "naChaabi");
  const ncw = at("system", "naCallW");
  const fire = ip(f, [0, aw + 6, aw + 44], [0.85, 0.9, 0], E.inOut);
  const led = (label: string, on: boolean, col: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 14, height: 14, borderRadius: "50%", background: on ? col : "#3a3f45", boxShadow: on ? `0 0 12px ${col}` : undefined }} />
      <Tag color={on ? C.fa : "#5c6168"} size={20}>
        {label}
      </Tag>
    </div>
  );
  return (
    <AbsoluteFill>
      <Head small="Aur khud" lines={[[gold("ACTIVATE.")]]} at={ac - 4} ats={[aw - 8]} out={nc - 5} />
      <Head small="Na chaabi chahiye," lines={[["NA", gold("CALL.")]]} at={nc} ats={[ncw - 6]} />
      <Fx at={0} kind="blur" style={{ left: X, top: 770 }}>
        <Card w={W} h={270} gold>
          <RoomDiagram t={f + 600} fire={fire} unit={1} sense={f < aw ? 1 : 0} mist={prog(f, aw, aw + 14, E.out) * (1 - prog(f, nc + 20, nc + 40))} />
          <div style={{ position: "absolute", left: 22, bottom: 18 }}>
            <Tag>Server room · conceptual</Tag>
          </div>
        </Card>
      </Fx>
      <Fx at={2} kind="slide" dy={30} out={nc - 5} style={{ left: X, top: 1058 }}>
        <Card w={W} h={76} pad={0} style={{ borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          {led("Armed", true, "#3BEA6A")}
          {led("Sensed", f >= ac, RED)}
          {led("Active", f >= aw, C.gold)}
        </Card>
      </Fx>
      <Stamp at={aw + 10} x={X + 430} y={1160} color={C.gold} rot={-5}>
        Automatic ✓
      </Stamp>
      <Fx at={nc} kind="slide" dy={30} style={{ left: X, top: 1058 }}>
        <Card w={398} h={236} gold={f >= nc + 10}>
          <Tag>Chaabi</Tag>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IcoKey size={150} struck={prog(f, nc + 6, nc + 14, E.out)} />
          </div>
          <div style={{ position: "absolute", left: 22, bottom: 16, fontSize: 26, fontWeight: 700 }}>nahi chahiye</div>
        </Card>
      </Fx>
      <Fx at={ncw - 6} kind="slide" dx={60} dy={0} style={{ left: X + 422, top: 1058 }}>
        <Card w={398} h={236} gold={f >= ncw + 6}>
          <Tag>Call</Tag>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IcoPhone t={f} size={150} struck={prog(f, ncw, ncw + 8, E.out)} />
          </div>
          <div style={{ position: "absolute", left: 22, bottom: 16, fontSize: 26, fontWeight: 700 }}>nahi chahiye</div>
        </Card>
      </Fx>
    </AbsoluteFill>
  );
};

/* 9 ALERT ----------------------------------------------------------- */
export const K9Alert: React.FC = () => {
  const f = useCurrentFrame();
  const al = at("alert", "alert");
  const apw = at("alert", "alertPhoneW");
  const ap = at("alert", "app");
  const ch = at("alert", "chalaW");
  const sw = prog(f, ap - 4, ap + 4);
  const press = prog(f, ch + 4, ch + 16);
  const done = f >= ch + 14;
  const S = 0.66;
  const note = (app: string, a: number, i: number) => (
    <Fx key={app} at={a} kind="drop" out={ap - 4} style={{ left: X + 286, top: 790 + i * 112 }}>
      <Card w={534} h={96} pad={0} red style={{ borderRadius: 20, padding: "12px 20px" }}>
        <Tag color={RED} size={17}>
          {app}
        </Tag>
        <div style={{ fontSize: 30, fontWeight: 700, marginTop: 2 }}>Server room: fire detected</div>
      </Card>
    </Fx>
  );
  return (
    <AbsoluteFill>
      <Head small="Alert" lines={[["AAPKE", gold("PHONE"), "PAR."]]} at={al - 6} ats={[apw - 8]} out={ap - 5} />
      <Head small="Aur app se bhi" lines={[["UNIT", gold("CHALA")], ["SAKTE", "HAIN."]]} at={ap} ats={[ch - 10, ch + 4]} />
      <Fx at={0} kind="slide" style={{ left: X, top: 770 }}>
        <div style={{ width: 380 * S, height: 780 * S }}>
          <div style={{ scale: `${S}`, transformOrigin: "0 0", position: "absolute", opacity: 1 - sw }}>
            <Handset screen="lock" t={f} time="2:01" notes={[{ app: "THE FIRE KNIGHT", title: "Server room: fire detected", body: "Auto response on · tap to view", danger: true, p: prog(f, al, al + 10, E.out) }]} />
          </div>
          <div style={{ scale: `${S}`, transformOrigin: "0 0", position: "absolute", opacity: sw }}>
            <Handset screen="app" t={f} time="2:01" press={press} done={done ? 1 : 0} />
          </div>
        </div>
      </Fx>
      {note("App", al, 0)}
      {note("SMS", al + 9, 1)}
      {note("Email", al + 18, 2)}
      <Stamp at={apw + 14} x={X + 520} y={1130} color={C.gold} rot={-5} size={40}>
        Alert sent ✓
      </Stamp>
      <Fx at={ap + 2} kind="slide" dx={60} dy={0} style={{ left: X + 286, top: 790 }}>
        <Card w={534} h={300} gold={done}>
          <Tag>Remote control</Tag>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14 }}>
            <IcoComodo w={150} led={done ? RED : "#3BEA6A"} />
            <div>
              <div style={{ fontSize: 34, fontWeight: 700 }}>The Comodo</div>
              <div style={{ fontSize: 22, opacity: 0.6 }}>Server room · wall</div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 22,
              right: 22,
              bottom: 22,
              height: 72,
              borderRadius: 36,
              background: done ? "#1F9D55" : C.gold,
              color: done ? "#fff" : "#141414",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontSize: 28,
              fontWeight: 700,
              scale: `${1 - 0.05 * Math.sin(press * Math.PI)}`,
            }}
          >
            {done ? (
              <>
                Activated <Mark ok size={26} />
              </>
            ) : (
              "Activate unit"
            )}
          </div>
          {press > 0 && press < 1 && (
            <div style={{ position: "absolute", left: 267 - 40 - press * 70, bottom: 58 - 40 - press * 70, width: 80 + press * 140, height: 80 + press * 140, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.85)", opacity: 1 - press }} />
          )}
        </Card>
      </Fx>
      <Fx at={ap + 8} kind="blur" style={{ left: X + 286, top: 1110 }}>
        <Tag size={17}>Illustrative app screen</Tag>
      </Fx>
    </AbsoluteFill>
  );
};

/* 10 PUNCH ---------------------------------------------------------- */
export const K10Punch: React.FC = () => {
  const f = useCurrentFrame();
  const za = at("punch", "zaroori");
  const aw = at("punch", "awaaz");
  const aww = at("punch", "awaazW");
  const ja = at("punch", "jawaab");
  const pj = prog(f, ja, ja + 6, E.out);
  return (
    <AbsoluteFill>
      <Head small="Alarm" lines={[["ZAROORI", "HAI."]]} at={za - 6} ats={[za + 6]} out={aw - 5} />
      <Head small="Lekin alarm sirf" lines={[[gold("AWAAZ"), "DETA", "HAI."]]} at={aw} ats={[aww - 8]} out={ja - 5} />
      {/* the punch: a gold card, black type - the one inverted moment of the reel */}
      {f >= ja && (
        <div
          style={{
            position: "absolute",
            left: X,
            top: 368,
            width: W,
            height: 372,
            borderRadius: 30,
            background: C.gold,
            boxSizing: "border-box",
            padding: "30px 36px",
            opacity: Math.min(1, pj * 3),
            scale: `${1.16 - 0.16 * pj}`,
            filter: pj < 1 ? `blur(${(1 - pj) * 12}px)` : undefined,
            boxShadow: "0 0 80px rgba(240,178,66,0.3)",
          }}
        >
          <div style={{ fontFamily: FONT.display, fontSize: 196, lineHeight: 0.98, color: "#0b0b0b", letterSpacing: "0.01em" }}>JAWAAB</div>
          <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 52, letterSpacing: "-0.02em", color: "#0b0b0b", marginTop: 10 }}>kisi ko dena padta hai.</div>
        </div>
      )}
      <Fx at={0} kind="slide" style={{ left: X, top: 800 }}>
        <Card w={398} h={420}>
          <Tag>Alarm</Tag>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
            <IcoDetector t={f} ring={f >= aww - 6 ? 1 : 0} size={270} />
          </div>
          <div style={{ position: "absolute", left: 22, bottom: 24, display: "flex", gap: 10 }}>
            <Fx at={za + 8} kind="pop" style={{ position: "relative" }}>
              <Chip color={C.fa} fill size={18}>
                <Mark ok size={18} /> Zaroori
              </Chip>
            </Fx>
          </div>
          <Fx at={aww} kind="pop" style={{ right: 22, bottom: 24 }}>
            <Chip color={C.fa} size={18}>
              Sirf awaaz
            </Chip>
          </Fx>
        </Card>
      </Fx>
      <Fx at={aww + 10} kind="slide" dx={60} dy={0} style={{ left: X + 422, top: 800 }}>
        <Card w={398} h={420} gold={f >= ja}>
          <Tag color={f >= ja ? C.gold : undefined}>Unit</Tag>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 56, opacity: f >= ja ? 1 : 0.45 }}>
            <IcoComodo w={300} />
          </div>
          <Fx at={ja + 6} kind="pop" style={{ right: 22, bottom: 24 }}>
            <Chip color={C.gold} fill size={18}>
              <Mark ok size={18} /> Jawaab
            </Chip>
          </Fx>
        </Card>
      </Fx>
    </AbsoluteFill>
  );
};

/* 11 HERO ----------------------------------------------------------- */
const EMBLEM_H = 300;
const EMBLEM_W = Math.round((EMBLEM_H * 762) / 909);
const WORD_W = 450;
const WORD_H = Math.round((WORD_W * 104) / 1077);
const WHATSAPP = "+91 79080 54311";
export const LOGO_AT = 30; // frames after "bhejiye" starts

export const K11Hero: React.FC = () => {
  const f = useCurrentFrame();
  const ji = at("hero", "jinke");
  const yc = at("hero", "yehCallW");
  const bj = at("hero", "bhejiye");
  const L = bj + LOGO_AT;
  const out = prog(f, L - 6, L);
  const em = prog(f, L, L + 14, E.out);
  const sheen = ip(f, [L + 10, L + 36], [-30, 130], E.inOut);
  const wm = prog(f, L + 10, L + 22, E.out);
  const tag = prog(f, L + 18, L + 30, E.out);
  const cta = prog(f, L + 26, L + 40, E.out);
  const emblemSrc = staticFile("brand/emblem.png");
  const top = 420;
  const tagTop = top + EMBLEM_H + 40 + WORD_H + 40;
  const sent = f >= bj + 2;
  const tap = prog(f, bj - 4, bj + 8);
  const roles = ["Facility manager", "IT head", "Office admin"];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0 ? `blur(${out * 14}px)` : undefined }}>
        <Head small="Jinke paas raat ko" lines={[["YEH", gold("CALL")], ["AATA", "HAI"]]} at={ji - 6} ats={[yc - 10, yc + 2]} />
        <Fx at={2} kind="slide" style={{ left: X, top: 780 }}>
          <Card w={W} h={404}>
            <Tag>Yeh reel bhejiye</Tag>
            {roles.map((r, i) => {
              const on = i === 0 && sent;
              return (
                <Fx key={r} at={ji + i * 8} kind="slide" dy={24} style={{ left: 22, top: 62 + i * 108 }}>
                  <Card w={W - 44} h={92} pad={0} gold={on} style={{ borderRadius: 20, display: "flex", alignItems: "center", padding: "0 20px", gap: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#3a4152" }} />
                    <div style={{ fontSize: 34, fontWeight: 700, flex: 1 }}>{r}</div>
                    <div style={{ padding: "10px 26px", borderRadius: 999, background: on ? C.gold : C.fa, color: "#111", fontSize: 26, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                      {on ? (
                        <>
                          Sent <Mark ok size={22} />
                        </>
                      ) : (
                        "Send"
                      )}
                    </div>
                  </Card>
                </Fx>
              );
            })}
            {tap > 0 && tap < 1 && <div style={{ position: "absolute", right: 86 - 30 - tap * 50, top: 108 - 30 - tap * 50, width: 60 + tap * 100, height: 60 + tap * 100, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.85)", opacity: 1 - tap }} />}
          </Card>
        </Fx>
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
      <div style={{ position: "absolute", left: X, width: W, top: tagTop, textAlign: "center", fontFamily: FONT.sans, fontWeight: 500, fontSize: TYPE.support, letterSpacing: "-0.01em", color: C.fa, opacity: tag, translate: `0 ${(1 - tag) * 14}px` }}>
        Because every <span style={{ color: C.gold }}>second</span> matters.
      </div>
      <div style={{ position: "absolute", left: X, width: W, top: tagTop + 84, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: cta, translate: `0 ${(1 - cta) * 24}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 34px", borderRadius: 999, border: `2px solid ${C.gold}`, background: "rgba(240,178,66,0.12)", fontFamily: FONT.sans, whiteSpace: "nowrap" }}>
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
