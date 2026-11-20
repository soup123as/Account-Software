import "./fk/fonts";
import React from "react";
import { AbsoluteFill, Composition, Folder } from "remotion";
import { OperatorAkela, akelaDefaults } from "./OperatorAkela";
import { S1Hook } from "./scenes/S1Hook";
import { S2Night } from "./scenes/S2Night";
import { S3Operator } from "./scenes/S3Operator";
import { S4System } from "./scenes/S4System";
import { S4Rehook } from "./scenes/S4Rehook";
import { S5Product } from "./scenes/S5Product";
import { S5Hero } from "./scenes/S5Hero";
import { T1Hook } from "./truck/T1Hook";
import { TruckOwners, truckDefaults } from "./truck/TruckOwners";
import { T_TOTAL } from "./truck/timing";
import { TruckThumbnail } from "./truck/TruckThumbnail";
import { Still } from "remotion";
import { ShopOwners, shopDefaults } from "./shop/ShopOwners";
import { S_TOTAL } from "./shop/timing";
import { ShopThumbnail } from "./shop/ShopThumbnail";
import { FPS, H, SCENES, TOTAL, W } from "./fk/theme";
import { Grain, SafeGuide, Vignette } from "./fk/ui";

/** Standalone scene preview with the same film finish as the reel. */
const scene = (Comp: React.FC) => {
  const Wrapped: React.FC<{ showSafe: boolean }> = ({ showSafe }) => (
    <AbsoluteFill style={{ background: "#0B0B0C" }}>
      <Comp />
      <Vignette strength={0.7} />
      <Grain />
      {showSafe && <SafeGuide />}
    </AbsoluteFill>
  );
  return Wrapped;
};

const s1 = scene(S1Hook);
const s2 = scene(S2Night);
const s3 = scene(S3Operator);
const s4 = scene(S4Rehook);
const s4b = scene(S4System);
const s5 = scene(S5Product);
const S6Only: React.FC = () => <S5Hero />;
const s6 = scene(S6Only);
const t1 = scene(T1Hook);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="OperatorAkela"
      component={OperatorAkela}
      durationInFrames={TOTAL}
      fps={FPS}
      width={W}
      height={H}
      defaultProps={akelaDefaults}
    />
    <Folder name="OperatorAkela-Scenes">
      <Composition id="S1-Hook" component={s1} durationInFrames={SCENES.hook} fps={FPS} width={W} height={H} defaultProps={{ showSafe: false }} />
      <Composition id="S2-Night" component={s2} durationInFrames={SCENES.night} fps={FPS} width={W} height={H} defaultProps={{ showSafe: false }} />
      <Composition id="S3-Operator" component={s3} durationInFrames={SCENES.operator} fps={FPS} width={W} height={H} defaultProps={{ showSafe: false }} />
      <Composition id="S4-Rehook" component={s4} durationInFrames={SCENES.rehook} fps={FPS} width={W} height={H} defaultProps={{ showSafe: false }} />
      <Composition id="S5-Product" component={s5} durationInFrames={SCENES.product} fps={FPS} width={W} height={H} defaultProps={{ showSafe: false }} />
      <Composition id="S6-System" component={s4b} durationInFrames={SCENES.system} fps={FPS} width={W} height={H} defaultProps={{ showSafe: false }} />
      <Composition id="S7-Hero" component={s6} durationInFrames={SCENES.hero} fps={FPS} width={W} height={H} defaultProps={{ showSafe: false }} />
    </Folder>
    <Composition id="TruckOwners" component={TruckOwners} durationInFrames={T_TOTAL} fps={FPS} width={W} height={H} defaultProps={truckDefaults} />
    <Still id="TruckThumbnail" component={TruckThumbnail} width={W} height={H} />
    <Composition id="ShopOwners" component={ShopOwners} durationInFrames={S_TOTAL} fps={FPS} width={W} height={H} defaultProps={shopDefaults} />
    <Still id="ShopThumbnail" component={ShopThumbnail} width={W} height={H} />
    <Folder name="TruckOwners-Scenes">
      <Composition id="T1-Hook" component={t1} durationInFrames={110} fps={FPS} width={W} height={H} defaultProps={{ showSafe: false }} />
    </Folder>
  </>
);
