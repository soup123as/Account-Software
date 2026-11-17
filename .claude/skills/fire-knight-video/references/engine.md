# Engine reference (Remotion 4)

The working project lives in `assets/engine/` (or `fire-knight-reels/` in the repo). Copy it, then run `npm i`.

```
src/fk/theme.ts     C (palette), FONT, TYPE (size caps), SAFE, SCENES (frame lengths), easing E, ip/prog/rand/noise1
src/fk/fonts.ts     loads DM Sans 400-700 + Anton from public/fonts via @remotion/fonts
src/fk/ui.tsx       TypeOn (letter type-on), Display (Anton mask rise), Label, Stack, Reticle, TopShade, Grain, Vignette, SafeGuide
src/fk/Dumper.tsx   100-t haul truck, viewBox 1000x560, ground y=540; BAY = engine bay centre
src/fk/World.tsx    night pit world + camera rig: <World t cam scroll wheelAngle headlights rim heat thermal accent crush truckFilter overlay/>
src/scenes/S1..S5   one file per scene, local frames from 0
src/OperatorAkela.tsx   TransitionSeries of scenes + Overlay transitions (HeatFlash, Bloom, MistWash) + Audio
src/Root.tsx        main composition + per-scene compositions (folder OperatorAkela-Scenes)
scripts/frames.mjs  bundle once, render chosen frames, write a labelled contact sheet
scripts/sound.py    score + SFX cued by frame -> public/audio/akela-raw.wav (then limit to -14 LUFS)
public/brand        emblem.png, wordmark-light.png, logo-on-black.png
public/product      ranger-cylinder.png (cut-out)
```

## Text
```tsx
<Stack top={380}>
  <ScanReveal at={66} out={120} dur={18}>
    <Line w={["Engine", "bay", "mein"]} />
    <Hit w={[{ w: "HEAT", c: C.gold }, "BADH"]} />
    <Line w={["rahi", "hai."]} />
  </ScanReveal>
</Stack>
```
- `ScanReveal` props:
  - `at` / `out`: local frames
  - `dur` (default 16) and `outDur` (default 12)
  - `plate` (default true): the black legibility plate
  - `glintAt`: an extra scanner pass over text that is already visible (the poster first frame uses `at={-20} glintAt={3}`)
- Only one ScanReveal block is visible at a time: make the next `at` ≥ the previous `out + 12`.
- A word given as `{ w, c }` takes a colour. Use `C.gold` on one key word per group only.
- `ScanReveal` injects `.fk-gold` CSS (`!important` gold) to draw the scan band, so text inside must not rely on `!important` colours.

## Camera
`cam = { z, cx, cy, ax?, ay?, sx?, sy? }` places world point (cx, cy) at screen anchor (ax, ay) with zoom z. Each layer has a depth d (0 = sky, 1 = machine), so pushes produce parallax automatically. For continuity, end scene N's camera exactly where scene N+1's begins. Scene 2 exports `s2Camera` and Scene 4 exports `S4_CAM` for that reason.

## Thermal / schematic looks
Pass `truckFilter` (for example `grayscale(1) brightness(.95) contrast(1.25)`). World then draws the body filtered and the heat plus overlay unfiltered on top, so the gold heat never turns grey. Clip a second World with `clipPath: inset(...)` for a viewfinder reveal.

## Product cut-out recipe
```python
import cv2, numpy as np
img = cv2.imread(src, cv2.IMREAD_UNCHANGED); bgr = img[..., :3]; H, W = bgr.shape[:2]
mask = np.zeros((H, W), np.uint8); bgd = np.zeros((1, 65)); fgd = np.zeros((1, 65))
cv2.grabCut(bgr, mask, (int(W*.02), int(H*.05), int(W*.97), int(H*.9)), bgd, fgd, 6, cv2.GC_INIT_WITH_RECT)
m = np.where((mask == 1) | (mask == 3), 255, 0).astype(np.uint8)   # keep largest component, close, blur 5px
# then clear near-white, low-chroma pixels in the lower third (studio floor between feet)
```
`pip install opencv-python-headless` if cv2 is missing. Always check the cut-out on black.

## Render + QA
```bash
npx tsc --noEmit
node scripts/frames.mjs OperatorAkela 20,110,250,350,470,599 check '{"showSafe":true,"logoSrc":null,"audio":false}' 0.4
python3 scripts/sound.py public/audio/akela-raw.wav
ffmpeg -y -i public/audio/akela-raw.wav -af "volume=4.9dB,alimiter=limit=0.84:attack=4:release=80:level=disabled" -ar 48000 public/audio/akela-mix.wav
npx remotion render OperatorAkela out/master.mp4 --codec=h264 --crf=16 --audio-bitrate=192k --concurrency=4
ffmpeg -y -i out/master.mp4 -vf "scale=in_range=pc:out_range=tv,format=yuv420p" -c:v libx264 -preset slow -crf 15 -profile:v high \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -c:a copy -movflags +faststart out/final.mp4
ffmpeg -i out/final.mp4 -vf "fps=1.5,scale=270:480,tile=6x5:padding=4:color=white" -frames:v 1 sheet.jpg
ffmpeg -i out/final.mp4 -af ebur128=peak=true -f null -     # want I ≈ -14 LUFS, Peak ≤ -1 dBFS
```
Gotchas:
- No CSS transitions or animations; drive everything from `useCurrentFrame()`.
- No `backdrop-filter` (it mirrors the frame edges).
- Duplicate SVG ids across World instances are fine because their definitions are identical.
- Parallel `remotion still` runs collide on the bundler cache, so use `frames.mjs` instead.
