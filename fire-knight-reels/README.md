# The Fire Knight: cinematic reels (Remotion)

Premium 9:16 industrial reels for The Fire Knight, built as code so each new reel starts from a prompt.

## Reels

| Composition | Length | What it is |
|---|---|---|
| `OperatorAkela` | 20 s, 1080×1920, 30 fps | Mining dumper, night shift: "Fire plan? Sirf operator?" → thermal heat in the engine bay → one operator, four tasks → detection → alert → suppression response (conceptual) → hero + lockup |
| `OperatorAkela-Scenes/*` | per scene | Each scene on its own timeline for fast previews |

## Commands

```bash
npm i                      # install
npm run dev                # Remotion Studio preview (localhost:3000)
python3 scripts/sound.py public/audio/akela-raw.wav   # rebuild score + SFX
ffmpeg -y -i public/audio/akela-raw.wav -af "volume=5.6dB,alimiter=limit=0.84:attack=4:release=80:level=disabled" -ar 48000 public/audio/akela-mix.wav
npx remotion render OperatorAkela out/operator-akela.mp4 --codec=h264 --crf=16 --audio-bitrate=192k
node scripts/frames.mjs OperatorAkela 15,60,100,600 check '{"showSafe":true,"logoSrc":null,"audio":false}' 0.5   # contact sheet
```

`remotion.config.ts` points Remotion at the pre-installed Chromium when it exists (cloud containers block Remotion's own Chrome download). On your own machine nothing needs changing.

## Props (`OperatorAkela`)

- `showSafe`: overlays the Instagram safe box (x 130-950, y 300-1460) and the UI zones.
- `logoSrc`: put the official logo in `public/brand/` and pass `"brand/logo.png"` to replace the typographic lockup.
- `audio`: turn the soundtrack off for silent previews.

## Structure

```
src/fk/theme.ts     palette, fonts, safe box, scene timings, easing
src/fk/Dumper.tsx   detailed 100-t haul truck (lights, wheels, heat/thermal, accent, overlay hook)
src/fk/World.tsx    night pit world: parallax benches, floodlight towers, road, dust, camera rig
src/fk/ui.tsx       header, masked text reveals, slam headlines, reticle, grain, vignette, safe guide
src/scenes/S1..S5   one file per scene
src/OperatorAkela.tsx  sequencing + motivated transition overlays + audio
scripts/sound.py    numpy score + SFX cued to frames
scripts/frames.mjs  bundle once, render any frames to a contact sheet
```

## Brand guard (from the Fire Knight reel playbook)

- Products are "fire suppression aids". Never "extinguishes", "100%", "guaranteed", "replaces your extinguisher".
- No response-time numbers, thresholds or certification claims. Scene 4 is labelled *Conceptual illustration*.
- No people or faces; fire is drawn, never stock flames. Palette: charcoal, steel, ember `#FF5A1F`, heat `#FFB13D`, ok `#1F9D55`.
