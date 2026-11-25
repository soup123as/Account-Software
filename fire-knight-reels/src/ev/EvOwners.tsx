import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import { C } from "../fk/theme";
import { Grain, SafeGuide, Vignette } from "../fk/ui";
import { Bloom, Dip, HeatFlash, MistWash } from "../OperatorAkela";
import { CUE, E_LEN } from "./timing";
import { E10Ending, E1Hook, E2Dash, E3Heat, E4Places, E5Gap, E6Real, E7Product, E8System, E9Wait } from "./scenes";

export type EvProps = { showSafe: boolean; audio: string | null };
export const evDefaults: EvProps = { showSafe: false, audio: "audio/ev-mix-vo.wav" };

/**
 * The shield, small, in the bottom-right corner of the safe area for the whole reel (client request).
 * It leaves just before the logo end frame, where the full logo takes over.
 */
const Mark: React.FC = () => {
  const f = useCurrentFrame();
  const out = Math.round(CUE.logo * 30) - 14;
  const o = 1 - Math.min(1, Math.max(0, (f - out) / 10));
  if (o <= 0) return null;
  const H = 86;
  const W = Math.round((H * 762) / 909);
  return <Img src={staticFile("brand/emblem.png")} style={{ position: "absolute", left: 950 - W, top: 1456 - H, width: W, height: H, opacity: 0.92 * o }} />;
};

/** "EV Owners" reel - full-screen illustrated night scenes in the shutter-reel style; product: the Sentinel. */
export const EvOwners: React.FC<EvProps> = ({ showSafe, audio }) => {
  const S = TransitionSeries.Sequence;
  const O = TransitionSeries.Overlay;
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <TransitionSeries>
        <S name="1 Hook" durationInFrames={E_LEN.hook}>
          <E1Hook />
        </S>
        <O durationInFrames={18}>
          <Dip />
        </O>
        <S name="2 Dash" durationInFrames={E_LEN.dash}>
          <E2Dash />
        </S>
        <O durationInFrames={18}>
          <Dip />
        </O>
        <S name="3 Heat" durationInFrames={E_LEN.heat}>
          <E3Heat />
        </S>
        <O durationInFrames={18}>
          <Bloom />
        </O>
        <S name="4 Places" durationInFrames={E_LEN.places}>
          <E4Places />
        </S>
        <O durationInFrames={18}>
          <Dip />
        </O>
        <S name="5 Gap" durationInFrames={E_LEN.gap}>
          <E5Gap />
        </S>
        <O durationInFrames={20}>
          <HeatFlash />
        </O>
        <S name="6 Real gap" durationInFrames={E_LEN.real}>
          <E6Real />
        </S>
        <O durationInFrames={20}>
          <MistWash />
        </O>
        <S name="7 Product" durationInFrames={E_LEN.product}>
          <E7Product />
        </S>
        <O durationInFrames={16}>
          <Dip />
        </O>
        <S name="8 System" durationInFrames={E_LEN.system}>
          <E8System />
        </S>
        <O durationInFrames={16}>
          <Dip />
        </O>
        <S name="9 Wait" durationInFrames={E_LEN.wait}>
          <E9Wait />
        </S>
        <O durationInFrames={16}>
          <Dip />
        </O>
        <S name="10 Ending" durationInFrames={E_LEN.ending}>
          <E10Ending />
        </S>
      </TransitionSeries>
      <Vignette strength={0.7} />
      <Mark />
      <Grain opacity={0.05} />
      {showSafe && <SafeGuide />}
      {audio && <Audio src={staticFile(audio)} />}
    </AbsoluteFill>
  );
};
