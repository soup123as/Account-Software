import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import { S1Hook } from "./scenes/S1Hook";
import { S2Night } from "./scenes/S2Night";
import { S3Operator } from "./scenes/S3Operator";
import { S4System } from "./scenes/S4System";
import { S5Hero } from "./scenes/S5Hero";
import { C, SCENES, ip } from "./fk/theme";
import { Grain, SafeGuide, Vignette } from "./fk/ui";

export type AkelaProps = {
  showSafe: boolean;
  logoSrc: string | null;
  audio: boolean;
};

export const akelaDefaults: AkelaProps = { showSafe: false, logoSrc: null, audio: true };

/** The heat signature flares and whips us into the operator sequence. */
const HeatFlash: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const a = ip(f, [0, d * 0.45, d], [0, 1, 0]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 540px 1050px, rgba(255,244,220,${a}) 0%, rgba(255,179,58,${a * 0.9}) 18%, rgba(255,106,26,${a * 0.75}) 42%, rgba(0,0,0,${a * 0.6}) 85%)`,
      }}
    />
  );
};

/** A cool bloom: the panel dives into the engine bay schematic. */
const Bloom: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const a = ip(f, [0, d * 0.5, d], [0, 0.85, 0]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 600px 500px at 540px 960px, rgba(240,178,66,${a * 0.14}) 0%, rgba(0,0,0,${a * 0.6}) 100%)`,
      }}
    />
  );
};

/** Mist washes the frame as the camera pulls back to the hero. */
const MistWash: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const a = ip(f, [0, d * 0.5, d], [0, 0.7, 0]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 900px 700px at 540px 1000px, rgba(250,250,250,${a * 0.35}) 0%, rgba(0,0,0,${a * 0.5}) 100%)`,
      }}
    />
  );
};

export const OperatorAkela: React.FC<AkelaProps> = ({ showSafe, logoSrc, audio }) => (
  <AbsoluteFill style={{ backgroundColor: C.black }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="1 Hook" durationInFrames={SCENES.hook}>
        <S1Hook />
      </TransitionSeries.Sequence>
      <TransitionSeries.Sequence name="2 Night haul" durationInFrames={SCENES.night}>
        <S2Night />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={10} offset={-1}>
        <HeatFlash />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="3 Operator" durationInFrames={SCENES.operator}>
        <S3Operator />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={10}>
        <Bloom />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="4 System" durationInFrames={SCENES.system}>
        <S4System />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={12}>
        <MistWash />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="5 Hero" durationInFrames={SCENES.hero}>
        <S5Hero logoSrc={logoSrc} />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    <Vignette strength={0.7} />
    <Grain opacity={0.05} />
    {showSafe && <SafeGuide />}
    {audio && <Audio src={staticFile("audio/akela-mix.wav")} />}
  </AbsoluteFill>
);
