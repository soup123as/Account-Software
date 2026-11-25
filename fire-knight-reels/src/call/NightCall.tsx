import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import { C } from "../fk/theme";
import { Grain, SafeGuide, Vignette } from "../fk/ui";
import { Bloom, Dip, HeatFlash, MistWash } from "../OperatorAkela";
import { N_LEN } from "./timing";
import { N10Punch, N11Hero, N1Hook, N2Call1, N3Call2, N4Drive, N5Inside, N6Turn, N7Product, N8System, N9Alert } from "./scenes";

export type CallProps = { showSafe: boolean; audio: string | null };
export const callDefaults: CallProps = { showSafe: false, audio: "audio/call-mix-vo.wav" };

/** "Raat ka call" reel - the 2 a.m. call nobody can answer; product: the Comodo. */
export const NightCall: React.FC<CallProps> = ({ showSafe, audio }) => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="1 Hook" durationInFrames={N_LEN.hook}>
        <N1Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="2 Call 1" durationInFrames={N_LEN.call1}>
        <N2Call1 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="3 Call 2" durationInFrames={N_LEN.call2}>
        <N3Call2 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={18}>
        <Bloom />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="4 Drive" durationInFrames={N_LEN.drive}>
        <N4Drive />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={20}>
        <HeatFlash />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="5 Inside" durationInFrames={N_LEN.inside}>
        <N5Inside />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={20}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="6 Turn" durationInFrames={N_LEN.turn}>
        <N6Turn />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={18}>
        <MistWash />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="7 Product" durationInFrames={N_LEN.product}>
        <N7Product />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={14}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="8 System" durationInFrames={N_LEN.system}>
        <N8System />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="9 Alert" durationInFrames={N_LEN.alert}>
        <N9Alert />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="10 Punch" durationInFrames={N_LEN.punch}>
        <N10Punch />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="11 Hero" durationInFrames={N_LEN.hero}>
        <N11Hero />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Vignette strength={0.7} />
    <Grain opacity={0.05} />
    {showSafe && <SafeGuide />}
    {audio && <Audio src={staticFile(audio)} />}
  </AbsoluteFill>
);
