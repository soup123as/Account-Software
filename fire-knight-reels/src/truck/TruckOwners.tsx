import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import { C } from "../fk/theme";
import { Grain, SafeGuide, Vignette } from "../fk/ui";
import { Bloom, Dip, HeatFlash, MistWash } from "../OperatorAkela";
import { S5Product } from "../scenes/S5Product";
import { T_SCENES } from "./timing";
import { T1Hook } from "./T1Hook";
import { T2Night } from "./T2Night";
import { T3Driver } from "./T3Driver";
import { T4Loss } from "./T4Loss";
import { T6System } from "./T6System";
import { T7Hero } from "./T7Hero";

export type TruckProps = { showSafe: boolean; audio: boolean };
export const truckDefaults: TruckProps = { showSafe: false, audio: true };

/** "Truck Owners" reel - negative curiosity hook for truck and fleet owners, product: the Ranger. */
export const TruckOwners: React.FC<TruckProps> = ({ showSafe, audio }) => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="1 Hook" durationInFrames={T_SCENES.hook}>
        <T1Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="2 Night highway" durationInFrames={T_SCENES.night}>
        <T2Night />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={20}>
        <HeatFlash />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="3 Driver tasks" durationInFrames={T_SCENES.driver}>
        <T3Driver />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={18}>
        <Bloom />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="4 Loss re-hook" durationInFrames={T_SCENES.loss}>
        <T4Loss />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={20}>
        <MistWash />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="5 Product" durationInFrames={T_SCENES.product}>
        <S5Product lineAt={7} hitAt={36} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="6 System" durationInFrames={T_SCENES.system}>
        <T6System />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={18}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="7 Hero + CTA" durationInFrames={T_SCENES.hero}>
        <T7Hero />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Vignette strength={0.7} />
    <Grain opacity={0.05} />
    {showSafe && <SafeGuide />}
    {audio && <Audio src={staticFile("audio/truck-mix-vo.wav")} />}
  </AbsoluteFill>
);
