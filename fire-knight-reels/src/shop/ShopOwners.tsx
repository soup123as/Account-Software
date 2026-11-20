import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import { C } from "../fk/theme";
import { Grain, SafeGuide, Vignette } from "../fk/ui";
import { Bloom, Dip, HeatFlash, MistWash } from "../OperatorAkela";
import { S_LEN } from "./timing";
import { SH1Hook, SH2Inside, SH3Call, SH4Arrive, SH5Proof, SH6Turn } from "./scenes1";
import { SH10Hero, SH7Product, SH8System, SH9Alert } from "./scenes2";

export type ShopProps = { showSafe: boolean; audio: string | null };
export const shopDefaults: ShopProps = { showSafe: false, audio: "audio/shop-mix-vo.wav" };

/** "Shop Owners" reel - curiosity hook for shop and showroom owners, product: the Protector. */
export const ShopOwners: React.FC<ShopProps> = ({ showSafe, audio }) => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="1 Hook" durationInFrames={S_LEN.hook}>
        <SH1Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={18}>
        <Bloom />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="2 Inside" durationInFrames={S_LEN.inside}>
        <SH2Inside />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="3 Call" durationInFrames={S_LEN.call}>
        <SH3Call />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={20}>
        <HeatFlash />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="4 Arrive" durationInFrames={S_LEN.arrive}>
        <SH4Arrive />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={18}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="5 Proof" durationInFrames={S_LEN.proof}>
        <SH5Proof />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="6 Turn" durationInFrames={S_LEN.turn}>
        <SH6Turn />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={20}>
        <MistWash />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="7 Product" durationInFrames={S_LEN.product}>
        <SH7Product />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="8 System" durationInFrames={S_LEN.system}>
        <SH8System />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="9 Alert" durationInFrames={S_LEN.alert}>
        <SH9Alert />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={16}>
        <Dip />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="10 Hero" durationInFrames={S_LEN.hero}>
        <SH10Hero />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Vignette strength={0.7} />
    <Grain opacity={0.05} />
    {showSafe && <SafeGuide />}
    {audio && <Audio src={staticFile(audio)} />}
  </AbsoluteFill>
);
