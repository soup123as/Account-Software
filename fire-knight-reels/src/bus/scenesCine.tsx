import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, E, FONT, REAL, SAFE, ip, noise1, prog } from "../fk/theme";
import { Display, Label, Stack, TypeOn } from "../fk/ui";
import { CamView } from "../shop/fx";
import { Phone } from "../shop/Phone";
import { TopFade } from "../shop/scenes1";
import { ZONE } from "./Bus";
import { BUS, BusWorld } from "./BusWorld";
import { Aisle, BatteryClose, DashPress, DriverPOV, EngineClose, Walker } from "./cine";
import { at } from "./timing";

/* ---------- helpers ---------- */
const W = (x: number, y: number) => ({ x: x + BUS.x, y: y + BUS.y });
/** Visible between a and b with a short dip at each cut (fast cinematic cuts). */
const shot = (f: number, a: number, b: number, fade = 4) => Math.min(prog(f, a, a + fade), 1 - prog(f, b - fade, b));
const Shot: React.FC<{ o: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ o, children, style }) =>
  o <= 0 ? null : <AbsoluteFill style={{ opacity: o, ...style }}>{children}</AbsoluteFill>;
/** Real perspective on a 2D set: a camera that looks at the bus at an angle. */
const Tilt: React.FC<{ ry: number; rx?: number; p?: number; origin?: string; children: React.ReactNode }> = ({ ry, rx = 0, p = 1400, origin = "50% 62%", children }) => (
  <AbsoluteFill style={{ transform: `perspective(${p}px) rotateX(${rx}deg) rotateY(${ry}deg)`, transformOrigin: origin }}>{children}</AbsoluteFill>
);
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    {children}
  </svg>
);

const ZoneBox: React.FC<{ k: keyof typeof ZONE; label: string; state: "idle" | "watch" | "fire" | "off"; p?: number }> = ({ k, label, state, p = 1 }) => {
  const z = ZONE[k];
  const o = W(z.x, z.y);
  const col = state === "fire" ? REAL.lampRed : state === "off" ? "#5b6168" : C.gold;
  return (
    <g opacity={p * (state === "off" ? 0.55 : 1)}>
      <rect x={o.x - 6} y={o.y - 6} width={z.w + 12} height={z.h + 12} rx={10} fill={state === "fire" ? "rgba(227,40,28,0.16)" : "none"} stroke={col} strokeWidth={state === "fire" ? 4 : 3} strokeDasharray={state === "fire" ? undefined : "10 8"} />
      <text x={o.x - 2} y={o.y - 16} fontFamily="FK DM Sans" fontWeight={700} fontSize={30} letterSpacing="2" fill={col}>
        {label}
      </text>
    </g>
  );
};

/* =====================================================================
 * 01 THE HOOK (0-5 s): low-angle bus on the highway -> driver's hands -> passengers -> push in, pause
 * VO: "Apni bus mein passengers ki safety ka toh poora khayal rakhte hain... par engine aur battery ki safety ka kya?"
 * ===================================================================== */
export const C1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const kya = at("hook", "kya");
  const pushZ = 0.86 + prog(f, 96, 150, E.cam) * 0.34;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Shot o={shot(f, -10, 44)}>
        <Tilt ry={-34} rx={6} p={1100} origin="40% 66%">
          <CamView cam={{ z: 1.25 + prog(f, 0, 44) * 0.12, cx: 520, cy: 1150, ay: 1290 }}>
            <BusWorld t={f} scroll={f * 22} wheelAngle={f * 14} cabinLight={1} headlights={1} />
          </CamView>
        </Tilt>
      </Shot>
      <Shot o={shot(f, 44, 70)}>
        <Svg>
          <DriverPOV t={f} />
        </Svg>
      </Shot>
      <Shot o={shot(f, 70, 96)}>
        <Svg>
          <Aisle t={f} dolly={0.4 + prog(f, 70, 96) * 0.5} />
        </Svg>
      </Shot>
      <Shot o={shot(f, 96, 170)}>
        <CamView cam={{ z: pushZ, cx: 600 + prog(f, 96, 150) * 260, cy: 1130, ay: 1180 }}>
          <BusWorld t={f} scroll={f * 14} wheelAngle={f * 9} cabinLight={1} heatEngine={0.12 + 0.2 * prog(f, 110, 150)} />
        </CamView>
      </Shot>
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

/* =====================================================================
 * 02 THE HIDDEN PASSENGER (5-10 s): dolly down the aisle -> the red extinguisher behind the driver's seat
 * VO: "Shayad jawab hai... driver ki seat ke peeche lagaa, ek laal cylinder."
 * ===================================================================== */
export const C2Passenger: React.FC = () => {
  const f = useCurrentFrame();
  const jw = at("passenger", "jawab");
  const st = at("passenger", "seat");
  const cy = at("passenger", "cylinder");
  const dolly = 0.2 + prog(f, 0, cy + 6, E.inOut) * 6.0;
  const ext = prog(f, cy - 4, cy + 10, E.out) * (0.75 + 0.25 * Math.sin(f * 0.22));
  const zoom = 1 + prog(f, cy, 150, E.cam) * 0.32;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ transformOrigin: "706px 1021px", scale: `${zoom}` }}>
        <Svg>
          <Aisle t={f + 100} dolly={dolly} ext={ext} />
        </Svg>
      </AbsoluteFill>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["Shayad", "jawab", "hai..."]} at={jw} color={C.fa} />
        <TypeOn words={["driver", "ki", "seat", "ke", "peeche,"]} at={st} perLetter={0.8} color={C.fa} />
        <Display words={["EK", { w: "LAAL", c: C.gold }, "CYLINDER."]} at={cy} />
      </Stack>
    </AbsoluteFill>
  );
};

/* =====================================================================
 * 03 THE HIDDEN DANGER (10-16 s): engine bay fire -> battery smoke -> smoky cabin (fast cuts)
 * VO: "Lekin aag wahan lagti hai, jahan koi dekh nahi raha. Engine bay ke andar. Battery box mein. Ya cabin mein, passengers ke beech."
 * ===================================================================== */
export const C3Danger: React.FC = () => {
  const f = useCurrentFrame();
  const lk = at("danger", "lekin");
  const dk = at("danger", "dekh");
  const en = at("danger", "engine");
  const bt = at("danger", "battery");
  const cb = at("danger", "cabin");
  const shake = (k: number) => ({ translate: `${noise1(f * 0.7, k) * 4}px ${noise1(f * 0.7, k + 3) * 3}px` });
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Shot o={shot(f, -10, bt, 3)} style={{ ...shake(1), scale: `${1.05 + prog(f, 0, bt) * 0.08}` }}>
        <Svg>
          <EngineClose t={f} fire={ip(f, [8, 40, bt], [0, 0.55, 1], E.in)} />
        </Svg>
      </Shot>
      <Shot o={shot(f, bt, cb, 3)} style={{ ...shake(4), scale: `${1.04 + prog(f, bt, cb) * 0.05}` }}>
        <Svg>
          <BatteryClose t={f} smoke={prog(f, bt, bt + 14)} />
        </Svg>
      </Shot>
      <Shot o={shot(f, cb, 200, 3)}>
        <Svg>
          <Aisle t={f + 300} dolly={2.2 + prog(f, cb, 180) * 0.6} smoke={prog(f, cb, cb + 24)} dim={0.6} />
        </Svg>
      </Shot>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["Lekin", "aag", "wahan", "lagti", "hai,"]} at={lk} out={en - 6} perLetter={0.8} color={C.fa} />
        <TypeOn words={["jahan", "koi"]} at={dk} out={en - 6} color={C.fa} />
        <Display words={[{ w: "DEKH", c: C.gold }, "NAHI", "RAHA."]} at={dk + 12} out={en - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={[{ w: "01", c: C.gold }]} at={en} out={bt - 3} size={40} />
        <Display words={["ENGINE", "BAY."]} at={en + 2} out={bt - 3} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={[{ w: "02", c: C.gold }]} at={bt} out={cb - 3} size={40} />
        <Display words={["BATTERY", "BOX."]} at={bt + 2} out={cb - 3} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={[{ w: "03", c: C.gold }]} at={cb} size={40} />
        <Display words={["CABIN."]} at={cb + 2} />
        <TypeOn words={["passengers", "ke", "beech."]} at={cb + 16} color={C.fa} />
      </Stack>
    </AbsoluteFill>
  );
};

/* =====================================================================
 * 04 INTRODUCING THE SENTINEL (16-23 s): smoke -> dark studio, product orbit, scan + tech overlays,
 *    then the system installed in the bus.
 * VO: "The Fire Knight ka Sentinel... har zone par nazar rakhta hai."
 * ===================================================================== */
const Tech: React.FC<{ x: number; y: number; tx: number; ty: number; text: string; p: number }> = ({ x, y, tx, ty, text, p }) =>
  p <= 0 ? null : (
    <g opacity={p}>
      <circle cx={x} cy={y} r={7} fill="none" stroke={REAL.lampRed} strokeWidth={3} />
      <circle cx={x} cy={y} r={2.5} fill={REAL.lampRed} />
      <path d={`M${x} ${y} L ${tx} ${ty} L ${tx + (tx > x ? 60 : -60)} ${ty}`} stroke="#c9cfd4" strokeWidth={1.6} fill="none" strokeDasharray={`${p * 400} 400`} />
      <text x={tx + (tx > x ? 70 : -70)} y={ty + 8} textAnchor={tx > x ? "start" : "end"} fontFamily="FK DM Sans" fontWeight={600} fontSize={24} letterSpacing="1.5" fill="#e9edf0">
        {text}
      </text>
    </g>
  );

export const C4Sentinel: React.FC = () => {
  const f = useCurrentFrame();
  const sn = at("sentinel", "sentinel");
  const nz = at("sentinel", "nazar");
  const studio = shot(f, 10, nz - 2, 10);
  const orbit = prog(f, 10, nz, E.inOut); // 0..1 across the product shot
  const a = 1 - prog(f, 52, 66); // angled render -> front render
  const scan = ip(f, [24, 80], [700, 1340]);
  const inst = prog(f, nz - 6, nz + 10, E.out);
  const busScan = ip(f, [nz + 6, nz + 70], [-60, 1180]);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* smoke clears into the studio */}
      <Shot o={1 - prog(f, 0, 14)}>
        <Svg>
          <EngineClose t={f + 180} fire={0.4} smoke={1} />
        </Svg>
      </Shot>
      <Shot o={studio}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 700px 520px at 540px 1060px, #1a1d21 0%, #07080a 70%)" }} />
        {/* floor plane + reflection */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 1250px, rgba(255,255,255,0.03) 1260px, rgba(0,0,0,0) 1600px)" }} />
        {[
          { src: "product/sentinel-system-cut.png", w: 940, o: a },
          { src: "product/sentinel-front-cut.png", w: 960, o: 1 - a },
        ].map((im, i) => (
          <div key={i} style={{ position: "absolute", left: 540 - im.w / 2, top: 880, width: im.w, opacity: im.o, translate: `${(0.5 - orbit) * 120 * (i ? -1 : 1)}px 0`, scale: `${0.96 + orbit * 0.06}` }}>
            <Img src={staticFile(im.src)} style={{ width: "100%", display: "block", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.8)) contrast(1.05)" }} />
            <Img src={staticFile(im.src)} style={{ width: "100%", display: "block", transform: "scaleY(-1)", opacity: 0.12, WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0) 40%, #000 100%)", marginTop: 8 }} />
          </div>
        ))}
        {/* rim light sweep */}
        <AbsoluteFill style={{ background: `linear-gradient(100deg, rgba(255,255,255,0) ${orbit * 100 - 12}%, rgba(255,255,255,0.08) ${orbit * 100}%, rgba(255,255,255,0) ${orbit * 100 + 12}%)` }} />
        {/* red scan line + technical overlays */}
        <div style={{ position: "absolute", left: 0, right: 0, top: scan, height: 2, background: REAL.lampRed, boxShadow: `0 0 18px 4px rgba(227,40,28,0.45)`, opacity: prog(f, 24, 30) * (1 - prog(f, 78, 86)) }} />
        <Svg>
          <Tech x={700} y={990} tx={820} ty={820} text="SS316 CYLINDER" p={prog(f, 40, 54)} />
          <Tech x={300} y={1100} tx={170} ty={1290} text="IR FLAME SENSOR" p={prog(f, 52, 66)} />
          <Tech x={540} y={1060} tx={760} ty={1300} text="BRAIDED HOSES" p={prog(f, 64, 78)} />
        </Svg>
        <div style={{ position: "absolute", left: SAFE.x0, top: 1480, opacity: prog(f, sn + 20, sn + 32) }}>
          <Label style={{ color: C.silver }}>
            The Sentinel <span style={{ color: C.gold }}>·</span> vehicle fire suppression aid
          </Label>
        </div>
      </Shot>
      {/* installed in the bus: x-ray, modules, red scan across */}
      <Shot o={inst}>
        <Tilt ry={-16} rx={4} p={1600}>
          <CamView cam={{ z: 0.9, cx: 560, cy: 1100, ay: 1160 }}>
            <BusWorld t={f + 500} scroll={(f + 500) * 10} wheelAngle={(f + 500) * 6} xray={1} sentinel={prog(f, nz, nz + 16)} sense={prog(f, nz + 10, nz + 30)} cabinLight={0.7} poles={0.5} />
            <line x1={BUS.x + busScan} y1={BUS.y + 30} x2={BUS.x + busScan} y2={BUS.y + 340} stroke={REAL.lampRed} strokeWidth={3} opacity={0.85} />
            <rect x={BUS.x + busScan - 40} y={BUS.y + 30} width={40} height={310} fill={REAL.lampRed} opacity={0.08} />
            {(["engine", "battery", "cabin"] as const).map((k, i) => (
              <ZoneBox key={k} k={k} label={["ENGINE", "BATTERY", "CABIN"][i]} state="watch" p={prog(f, nz + 14 + i * 6, nz + 26 + i * 6)} />
            ))}
          </CamView>
        </Tilt>
      </Shot>
      <TopFade to={840} />
      <Stack top={380}>
        <TypeOn words={["The", "Fire", "Knight", "ka"]} at={sn} out={nz - 6} color={C.fa} />
        <Display words={[{ w: "SENTINEL.", c: C.gold }]} at={sn + 24} out={nz - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["har", "zone", "par"]} at={nz} color={C.fa} />
        <Display words={[{ w: "NAZAR.", c: C.gold }]} at={nz + 14} />
      </Stack>
    </AbsoluteFill>
  );
};

/* =====================================================================
 * 05 SMART ZONE PROTECTION (23-29 s): 3D cutaway, fire in the engine zone -> that zone red ->
 *    discharge only there; battery + cabin stay inactive.
 * VO: "Aag jis zone mein, discharge sirf usi zone mein."
 * ===================================================================== */
export const C5Zones: React.FC = () => {
  const f = useCurrentFrame();
  const ag = at("zones", "aag");
  const ds = at("zones", "discharge");
  const fire = ip(f, [ag, ag + 14, ds + 10, ds + 60], [0, 0.75, 0.75, 0]);
  const mist = prog(f, ds, ds + 16, E.out) * (1 - prog(f, ds + 90, ds + 110));
  const hot = f >= ag + 6;
  const ry = -22 + prog(f, 0, 180) * 8;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Tilt ry={ry} rx={8} p={1500} origin="55% 60%">
        <CamView cam={{ z: 0.95, cx: 600, cy: 1100, ay: 1160 }}>
          <BusWorld t={f + 700} scroll={(f + 700) * 10} wheelAngle={(f + 700) * 6} xray={1} sentinel={1} sense={hot ? 0.3 : 1} fire={fire} heatEngine={fire * 0.6} mist={mist} cabinLight={0.6} poles={0.4} />
          <ZoneBox k="engine" label={hot ? "ENGINE · ACTIVE" : "ENGINE"} state={hot ? "fire" : "watch"} />
          <ZoneBox k="battery" label={hot ? "BATTERY · STANDBY" : "BATTERY"} state={hot ? "off" : "watch"} />
          <ZoneBox k="cabin" label={hot ? "CABIN · STANDBY" : "CABIN"} state={hot ? "off" : "watch"} />
        </CamView>
      </Tilt>
      <TopFade to={860} />
      <Stack top={380}>
        <TypeOn words={["Aag", "jis", "zone", "mein,"]} at={ag} color={C.fa} />
        <Display words={[{ w: "DISCHARGE", c: C.gold }]} at={ds} />
        <TypeOn words={["sirf", "usi", "zone", "mein."]} at={ds + 16} color={C.fa} />
      </Stack>
      <div style={{ position: "absolute", left: SAFE.x0, top: 1700, opacity: 0.6 }}>
        <Label style={{ fontSize: 18 }}>Conceptual illustration</Label>
      </div>
    </AbsoluteFill>
  );
};

/* =====================================================================
 * 06 DRIVER & MOBILE ALERT (29-35 s): finger presses the dashboard button -> phone alert, push-in
 * VO: "Driver ke paas dashboard button. Aapke phone par alert."
 * ===================================================================== */
export const C6Driver: React.FC = () => {
  const f = useCurrentFrame();
  const bt = at("driver", "button");
  const al = at("driver", "alert");
  const reach = prog(f, bt - 6, bt + 14, E.out);
  const press = prog(f, bt + 14, bt + 20) * (1 - prog(f, bt + 34, bt + 42) * 0.6);
  const ph = shot(f, al - 12, 200, 6);
  const push = 1 + prog(f, al + 4, al + 16, E.out) * 0.14;
  const note = prog(f, al + 2, al + 12, E.out);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <Shot o={shot(f, -10, al - 8, 6)} style={{ scale: `${1 + prog(f, 0, al) * 0.06}`, transformOrigin: "700px 1220px" }}>
        <Svg>
          <DashPress t={f} reach={reach} press={press} />
        </Svg>
      </Shot>
      <Shot o={ph}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 520px 700px at 540px 1250px, rgba(227,40,28,0.14) 0%, rgba(0,0,0,0) 70%)", opacity: note }} />
        <div style={{ position: "absolute", left: 540 - 190, top: 880, scale: `${push}`, transformOrigin: "190px 380px" }}>
          <Phone mode="alert" t={f} note={note} time="11:42" app="SENTINEL" title="Fire alert · Bus 07" body="Engine zone · suppression active" danger />
        </div>
      </Shot>
      <TopFade to={840} />
      <Stack top={380}>
        <TypeOn words={["Driver", "ke", "paas"]} at={bt} out={al - 6} color={C.fa} />
        <Display words={["DASHBOARD", { w: "BUTTON.", c: C.gold }]} at={bt + 14} out={al - 6} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Aapke", "phone", "par"]} at={al} color={C.fa} />
        <Display words={[{ w: "ALERT.", c: C.gold }]} at={al + 14} />
      </Stack>
    </AbsoluteFill>
  );
};

/* =====================================================================
 * 07 PAYOFF & CTA (35-43 s): passengers step out safely -> open highway -> product on black + logo + CTA
 * VO: "Kyunki driver ka pehla kaam passengers ko utaarna hai... cylinder dhoondhna nahi.
 *      Aapki bus mein kitne zone covered hain? Comment kijiye."
 * ===================================================================== */
const EMBLEM_H = 250;
const EMBLEM_W = Math.round((EMBLEM_H * 762) / 909);
const WORD_W = 400;
const WORD_H = Math.round((WORD_W * 104) / 1077);

export const C7Payoff: React.FC = () => {
  const f = useCurrentFrame();
  const ky = at("payoff", "kyunki");
  const dh = at("payoff", "dhoondhna");
  const cm = at("payoff", "comment");
  const evac = shot(f, -10, 104, 8);
  const wide = shot(f, 100, cm + 30, 8);
  const end = prog(f, cm + 24, cm + 40);
  const door = W(120, 326);
  const walkers = [0, 1, 2, 3, 4].map((i) => {
    const t0 = 6 + i * 16;
    const p = Math.max(0, f - t0);
    return { x: door.x - 10 - p * 2.4, y: door.y + 56 + Math.min(30, p * 1.5) * 0.8, ph: p * 0.32, show: f > t0, bag: i % 2 === 1, s: 0.66 + (i % 3) * 0.03 };
  });
  const em = prog(f, cm + 34, cm + 50, E.out);
  const wm = prog(f, cm + 46, cm + 60, E.out);
  const sheen = ip(f, [cm + 46, cm + 74], [-30, 130], E.inOut);
  const cta = prog(f, cm + 62, cm + 76, E.out);
  const pulse = f > cm + 76 ? 0.5 + 0.5 * Math.sin((f - cm) * 0.12) : 0;
  const emblemSrc = staticFile("brand/emblem.png");
  const top = 380;
  return (
    <AbsoluteFill style={{ background: C.black }}>
      {/* the stop: hazards on, door open, people walking clear */}
      <Shot o={evac}>
        <CamView cam={{ z: 1.35, cx: door.x + 40, cy: 1150, ay: 1240 }}>
          <BusWorld t={f + 1000} scroll={0} cabinLight={1} hazard={1} door={1} heatEngine={0.1} poles={0.5} />
          <polygon points={`${door.x - 28},${door.y} ${door.x + 28},${door.y} ${door.x + 150},${door.y + 90} ${door.x - 220},${door.y + 90}`} fill="#ffdca6" opacity={0.2} />
          {walkers.map((w, i) => w.show && <Walker key={i} x={w.x} y={w.y} s={w.s} phase={w.ph} bag={w.bag} />)}
          {/* the driver at the door, waving people through */}
          <Walker x={door.x + 70} y={door.y + 58} s={0.7} phase={Math.sin(f * 0.2) * 0.6} walk={0.25} rim="#ffb347" />
        </CamView>
      </Shot>
      {/* open highway, wide */}
      <Shot o={wide * (1 - end)}>
        <Tilt ry={-10} rx={3} p={1800}>
          <CamView cam={{ z: 0.7, cx: 540, cy: 1120, ay: 1260 }}>
            <BusWorld t={f + 1100} scroll={(f + 1100) * 16} wheelAngle={(f + 1100) * 10} cabinLight={0.9} heatEngine={0} poles={1} />
          </CamView>
        </Tilt>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 900px, rgba(255,170,90,0.06) 1150px, rgba(0,0,0,0) 1300px)" }} />
      </Shot>
      {/* end card: product on black, logo, name, CTA */}
      <Shot o={end}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 600px 380px at 540px 1300px, #15181b 0%, #000 70%)" }} />
        <div style={{ position: "absolute", left: 540 - 380, top: 1150, width: 760, opacity: prog(f, cm + 28, cm + 44), translate: `0 ${(1 - prog(f, cm + 28, cm + 44, E.out)) * 40}px` }}>
          <Img src={staticFile("product/sentinel-front-cut.png")} style={{ width: "100%", display: "block", filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.8))" }} />
        </div>
        <div style={{ position: "absolute", left: 540 - EMBLEM_W / 2, top, width: EMBLEM_W, height: EMBLEM_H, opacity: em, translate: `0 ${(1 - em) * 40}px`, filter: em < 1 ? `blur(${(1 - em) * 12}px)` : undefined }}>
          <Img src={emblemSrc} style={{ width: "100%", height: "100%", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, rgba(255,255,255,0) ${sheen - 14}%, rgba(255,255,255,0.55) ${sheen}%, rgba(255,255,255,0) ${sheen + 14}%)`, WebkitMaskImage: `url(${emblemSrc})`, WebkitMaskSize: "100% 100%", mixBlendMode: "screen" }} />
        </div>
        <div style={{ position: "absolute", left: 540 - WORD_W / 2, top: top + EMBLEM_H + 34, width: WORD_W, height: WORD_H, clipPath: `inset(0 ${(1 - wm) * 100}% 0 0)`, opacity: wm > 0 ? 1 : 0 }}>
          <Img src={staticFile("brand/wordmark-light.png")} style={{ width: "100%", height: "100%", display: "block" }} />
        </div>
        <div style={{ position: "absolute", left: SAFE.x0, width: SAFE.x1 - SAFE.x0, top: top + EMBLEM_H + 34 + WORD_H + 30, textAlign: "center", fontFamily: FONT.display, fontSize: 64, letterSpacing: "0.04em", color: C.gold, opacity: wm }}>
          THE SENTINEL
        </div>
        <div style={{ position: "absolute", left: SAFE.x0, width: SAFE.x1 - SAFE.x0, top: 1480, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: cta, translate: `0 ${(1 - cta) * 24}px` }}>
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
      </Shot>
      <AbsoluteFill style={{ opacity: 1 - end }}>
        <TopFade to={860} />
      </AbsoluteFill>
      <Stack top={380}>
        <TypeOn words={["Kyunki", "driver", "ka", "pehla", "kaam"]} at={ky} out={cm - 6} perLetter={0.8} color={C.fa} />
        <Display words={[{ w: "PASSENGERS", c: C.gold }, "KO"]} at={ky + 30} out={cm - 6} />
        <TypeOn words={["utaarna", "hai..."]} at={ky + 46} out={cm - 6} color={C.fa} />
        <TypeOn words={["cylinder", "dhoondhna", "nahi."]} at={dh} out={cm - 6} weight={500} color={C.fa} />
      </Stack>
      <Stack top={380}>
        <TypeOn words={["Aapki", "bus", "mein", "kitne"]} at={cm} out={cm + 26} color={C.fa} />
        <Display words={[{ w: "ZONE", c: C.gold }, "COVERED", "HAIN?"]} at={cm + 10} out={cm + 26} />
      </Stack>
    </AbsoluteFill>
  );
};

