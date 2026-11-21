import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import { C } from "../fk/theme";
import { Grain, SafeGuide, Vignette } from "../fk/ui";
import { Dip, MistWash } from "../OperatorAkela";
import { B_LEN } from "./timing";
import { C1Hook, C2Passenger, C3Danger, C4Sentinel, C5Zones, C6Driver, C7Payoff } from "./scenesCine";

export type BusOwnersProps = { showSafe: boolean; audio: string | null };
export const busDefaults: BusOwnersProps = { showSafe: false, audio: "audio/bus-mix.wav" };

/** "Bus Owners" reel - cinematic cut to the client's visual direction; product: the Sentinel. */
export const BusOwners: React.FC<BusOwnersProps> = ({ showSafe, audio }) => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="01 Hook" durationInFrames={B_LEN.hook}>
        <C1Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={14}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="02 Hidden passenger" durationInFrames={B_LEN.passenger}>
        <C2Passenger />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={10}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="03 Hidden danger" durationInFrames={B_LEN.danger}>
        <C3Danger />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="04 Sentinel" durationInFrames={B_LEN.sentinel}>
        <C4Sentinel />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={14}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="05 Zones" durationInFrames={B_LEN.zones}>
        <C5Zones />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={12}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="06 Driver + alert" durationInFrames={B_LEN.driver}>
        <C6Driver />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <MistWash />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="07 Payoff + CTA" durationInFrames={B_LEN.payoff}>
        <C7Payoff />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Vignette strength={0.75} />
    <Grain opacity={0.05} />
    {showSafe && <SafeGuide />}
    {audio && <Audio src={staticFile(audio)} />}
  </AbsoluteFill>
);
