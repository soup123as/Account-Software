import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import { C } from "../fk/theme";
import { Grain, SafeGuide, Vignette } from "../fk/ui";
import { Bloom, Dip, MistWash } from "../OperatorAkela";
import { B_LEN } from "./timing";
import { B1Hook, B2Answer, B3Zones, B4Product, B5System, B6Punch, B7Hero } from "./scenes";

export type BusOwnersProps = { showSafe: boolean; audio: string | null };
export const busDefaults: BusOwnersProps = { showSafe: false, audio: "audio/bus-mix.wav" };

/** "Bus Owners" reel - bus and coach fleet owners, product: the Sentinel. */
export const BusOwners: React.FC<BusOwnersProps> = ({ showSafe, audio }) => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="1 Hook" durationInFrames={B_LEN.hook}>
        <B1Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="2 Answer" durationInFrames={B_LEN.answer}>
        <B2Answer />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="3 Zones" durationInFrames={B_LEN.zones}>
        <B3Zones />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={20}>
        <MistWash />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="4 Product" durationInFrames={B_LEN.product}>
        <B4Product />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="5 System" durationInFrames={B_LEN.system}>
        <B5System />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={18}>
        <Bloom />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="6 Punch" durationInFrames={B_LEN.punch}>
        <B6Punch />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="7 Hero + CTA" durationInFrames={B_LEN.hero}>
        <B7Hero />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Vignette strength={0.7} />
    <Grain opacity={0.05} />
    {showSafe && <SafeGuide />}
    {audio && <Audio src={staticFile(audio)} />}
  </AbsoluteFill>
);
