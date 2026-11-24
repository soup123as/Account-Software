import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import { C } from "../fk/theme";
import { Grain, SafeGuide, Vignette } from "../fk/ui";
import { Bloom, Dip, HeatFlash, MistWash } from "../OperatorAkela";
import { V_LEN } from "./timing";
import { V1Hook, V2Night, V3Alarm, V4Damage, V5Turn, V6Product, V7System, V8Cta, V9Hero } from "./scenes";

export type ServerProps = { showSafe: boolean; audio: string | null };
export const serverDefaults: ServerProps = { showSafe: false, audio: "audio/server-mix.wav" };

/** "Smoke Alarm" reel - negative hook for facility managers and IT heads, product: the Comodo. */
export const ServerAlarm: React.FC<ServerProps> = ({ showSafe, audio }) => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="1 Hook" durationInFrames={V_LEN.hook}>
        <V1Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={18}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="2 Night" durationInFrames={V_LEN.night}>
        <V2Night />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={18}>
        <Bloom />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="3 Alarm" durationInFrames={V_LEN.alarm}>
        <V3Alarm />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={20}>
        <HeatFlash />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="4 Damage" durationInFrames={V_LEN.damage}>
        <V4Damage />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={20}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="5 Turn" durationInFrames={V_LEN.turn}>
        <V5Turn />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={20}>
        <MistWash />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="6 Product" durationInFrames={V_LEN.product}>
        <V6Product />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="7 System" durationInFrames={V_LEN.system}>
        <V7System />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="8 CTA" durationInFrames={V_LEN.cta}>
        <V8Cta />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="9 Hero" durationInFrames={V_LEN.hero}>
        <V9Hero />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Vignette strength={0.7} />
    <Grain opacity={0.05} />
    {showSafe && <SafeGuide />}
    {audio && <Audio src={staticFile(audio)} />}
  </AbsoluteFill>
);
