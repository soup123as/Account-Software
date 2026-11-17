# The Fire Knight: cinematic reels (Remotion)

Premium 9:16 industrial reels for The Fire Knight, built as code so each new reel starts from a prompt.

## Reels

| Composition | Length | What it is |
|---|---|---|
| `OperatorAkela` | 20 s, 1080×1920, 30 fps | Mining dumper, night shift: "Fire plan? Sirf operator?" → thermal heat in the engine bay → one operator, four tasks → detection → alert → suppression response (conceptual) → the Ranger → logo end frame |
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

## Brand system (v3 "Steel & Gold")

The full rules are in the `fire-knight-video` skill (`../.claude/skills/fire-knight-video/SKILL.md`).

- Black frame. White Anton hits, #fafafa DM Sans sentences, gold `#F0B242` as the only accent.
- Type caps: Anton 120 px (max 132) · DM Sans 52 / 40 px · labels 24 px.
- No header bar. At most 3 elements per frame. A machine or the real product in every scene.
- The end frame always uses the official logo (`public/brand/`).

## Brand guard

- Products are "fire suppression aids". Never "extinguishes", "100%", "guaranteed", "replaces your extinguisher".
- No response-time numbers, thresholds or certification claims. Scene 4's response sequence is labelled *Conceptual illustration*.
- No people or faces. Fire is drawn, never stock flames.
