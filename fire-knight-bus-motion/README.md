# The Fire Knight — Bus Owners × The Sentinel (Bang Motion cut)

A 37 s, 9:16 motion graphic built with the Bang Motion skill: one continuous camera move along a
coach at night. HTML + GSAP; every visual is a pure function of the timeline time.

## Watch

Double-click `index.html`. It autoplays and loops; no server or install needed (GSAP and the brand
fonts are bundled). If the browser blocks sound, it holds on the first frame until the first click.

- `R` restart · `Space` pause
- `index.html?debug=1` shows a scrub panel
- `index.html?clean=1` holds the timeline for export (no autoplay, no sound)

## Files

| Path | What |
|---|---|
| `index.html` | the deliverable (built; do not edit by hand) |
| `tools/template.html` | source: markup, styles and the timeline (absolute seconds) |
| `tools/bus.json` | the coach as three SVG layers (body, body with door open, x-ray), generated from `fire-knight-reels/src/bus/Bus.tsx` |
| `tools/build.py` | template + bus layers + embedded fonts → `index.html` |
| `tools/snap.mjs`, `tools/sheet.py` | verification: photograph key seconds → contact sheet |
| `tools/export.mjs` | frame-by-frame export (Playwright) |
| `tools/timing.ts` | cue sheet read by `fire-knight-reels/scripts/sound_bus.py` |
| `audio/bus-motion-mix.*` | score + SFX (no voiceover yet) |

## Rebuild

```bash
python3 tools/build.py
```

```bash
node tools/snap.mjs shots 0.3 4.6 8.2 12.2 16.3 22.8 28.9 36.5
```

```bash
node tools/export.mjs frames 30
```

```bash
ffmpeg -framerate 30 -i frames/f%05d.jpg -i audio/bus-motion-mix.wav -vf "scale=in_range=pc:out_range=tv,format=yuv420p" -c:v libx264 -crf 15 -c:a aac -b:a 192k -shortest -movflags +faststart out.mp4
```

## Timing

Estimated from the script. When the voiceover arrives, move the absolute seconds in
`tools/template.html` (and `tools/timing.ts` for the sound) onto the spoken words.
