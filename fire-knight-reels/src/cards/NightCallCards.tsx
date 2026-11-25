import React from "react";
import { AbsoluteFill, Series, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C } from "../fk/theme";
import { Grain, SafeGuide, Vignette } from "../fk/ui";
import { CUE, N_LEN, N_START } from "../call/timing";
import { Captions, Header, Mark, Pill, RED, Tag } from "./kit";
import { K10Punch, K11Hero, K1Hook, K2Call1, K3Call2, K4Drive, K5Inside, K6Turn, K7Product, K8System, K9Alert, LOGO_AT, Shot } from "./scenes";
import { WORDS } from "./words";

export type CardsProps = { showSafe: boolean; audio: string | null };
export const cardsDefaults: CardsProps = { showSafe: false, audio: "audio/cards-mix-vo.wav" };

const fr = (s: number) => Math.round(s * 30);
const LOGO_F = fr(CUE.bhejiye) + LOGO_AT;

/** The meter: something countable that the story moves. Nobody answers (0/3), then the unit does. */
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

const Top: React.FC = () => {
  const f = useCurrentFrame();
  const o = 1 - Math.min(1, Math.max(0, (f - (LOGO_F - 6)) / 6));
  if (o <= 0) return null;
  return (
    <Header o={o}>
      <Meter />
    </Header>
  );
};

/** "Raat ka call" - cards cut: fast card-by-card build and word-by-word captions, brand black and gold. */
export const NightCallCards: React.FC<CardsProps> = ({ showSafe, audio }) => {
  const S = (k: keyof typeof N_LEN, node: React.ReactNode) => (
    <Series.Sequence key={k} name={k} durationInFrames={N_LEN[k]}>
      <Shot len={N_LEN[k]} first={k === "hook"}>
        {node}
      </Shot>
    </Series.Sequence>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 42% at 50% 56%, rgba(40,44,50,0.5) 0%, rgba(0,0,0,0) 100%)" }} />
      <Series>
        {S("hook", <K1Hook />)}
        {S("call1", <K2Call1 />)}
        {S("call2", <K3Call2 />)}
        {S("drive", <K4Drive />)}
        {S("inside", <K5Inside />)}
        {S("turn", <K6Turn />)}
        {S("product", <K7Product />)}
        {S("system", <K8System />)}
        {S("alert", <K9Alert />)}
        {S("punch", <K10Punch />)}
        {S("hero", <K11Hero />)}
      </Series>
      <Top />
      <Captions words={WORDS} hideAfter={(LOGO_F - 4) / 30} />
      <Vignette strength={0.55} />
      <Grain opacity={0.05} />
      {showSafe && <SafeGuide />}
      {audio && <Audio src={staticFile(audio)} />}
    </AbsoluteFill>
  );
};
