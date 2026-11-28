import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import { C } from "../fk/theme";
import { Grain, SafeGuide, Vignette } from "../fk/ui";
import { Bloom, Dip, HeatFlash, MistWash } from "../OperatorAkela";
import { P_LEN } from "./timing";
import { P1Hook, P2Habit, P3Heat, P4Rule, P5Fix, P6Turn, P7Product, P8System, P9Cta } from "./scenes";

export type PillowProps = { showSafe: boolean; audio: string | null };
export const pillowDefaults: PillowProps = { showSafe: false, audio: "audio/bed-mix.wav" };

/** "Takiye ke paas" reel - the phone charging on the bed, every night; product: the Protector. */
export const PillowCharge: React.FC<PillowProps> = ({ showSafe, audio }) => {
  const S = TransitionSeries.Sequence;
  const O = TransitionSeries.Overlay;
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <TransitionSeries>
        <S name="1 Hook" durationInFrames={P_LEN.hook}>
          <P1Hook />
        </S>
        <S name="2 Habit" durationInFrames={P_LEN.habit}>
          <P2Habit />
        </S>
        <O durationInFrames={18}>
          <Bloom />
        </O>
        <S name="3 Heat" durationInFrames={P_LEN.heat}>
          <P3Heat />
        </S>
        <O durationInFrames={18}>
          <HeatFlash />
        </O>
        <S name="4 Rule" durationInFrames={P_LEN.rule}>
          <P4Rule />
        </S>
        <O durationInFrames={16}>
          <Dip />
        </O>
        <S name="5 Fix" durationInFrames={P_LEN.fix}>
          <P5Fix />
        </S>
        <O durationInFrames={18}>
          <Dip />
        </O>
        <S name="6 Turn" durationInFrames={P_LEN.turn}>
          <P6Turn />
        </S>
        <O durationInFrames={18}>
          <Bloom />
        </O>
        <S name="7 Product" durationInFrames={P_LEN.product}>
          <P7Product />
        </S>
        <O durationInFrames={16}>
          <Dip />
        </O>
        <S name="8 System" durationInFrames={P_LEN.system}>
          <P8System />
        </S>
        <O durationInFrames={18}>
          <MistWash />
        </O>
        <S name="9 CTA" durationInFrames={P_LEN.cta}>
          <P9Cta />
        </S>
      </TransitionSeries>
      <Vignette strength={0.7} />
      <Grain opacity={0.05} />
      {showSafe && <SafeGuide />}
      {audio && <Audio src={staticFile(audio)} />}
    </AbsoluteFill>
  );
};
