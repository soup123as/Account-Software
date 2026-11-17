---
name: fire-knight-video
description: Build a premium cinematic 9:16 reel for The Fire Knight (thefireknight.in) in Remotion - black frame, DM Sans + Anton type, gold #f0b242 accent, detailed machines (haul trucks, buses, gensets, server rooms) and the real Ranger/Sentinel/Comodo/Protector/Guardian products in every scene, ending on the official shield logo. Use for any Fire Knight reel, short video, motion ad or animated post, including "make a Fire Knight video", "Operator Akela style", "same as the last Fire Knight reel", or a storyboard/script for The Fire Knight.
---

# The Fire Knight: cinematic product reels ("Steel & Gold")

A Fire Knight reel looks like a premium automotive or engineering ad. It is quiet, dark and confident. One idea at a time sits on a black frame, a detailed machine is always on screen, a single gold accent is used, and it ends on the shield logo.

The reference implementation is **Operator Akela v3** in `fire-knight-reels/` (repo `soup123as/account-software`) or in `assets/engine/` of this skill. **Start every new reel by copying that engine.** Change the content, not the system.

The client approves every stage and does all posting. Never publish, schedule, comment or DM.

## 1. The three rules that make it premium
1. **Less on screen.** At most three things per frame: one text group, one machine or product, and at most one supporting detail (a reticle, a label or a progress line). No header bar, no brand pill, no HUD clutter, no clocks or status chips "for flavour". If a frame feels busy, delete something.
2. **The machine is the hero.** Every scene shows a machine (dumper, truck, bus, excavator, DG set, rack, panel, room) or a real Fire Knight product. Text never plays over an empty frame. Product-first is the brand: the viewer must always see *what* is protected and *what* protects it.
3. **Calm type, one accent.** Small, crisp DM Sans sentences with one Anton hit. Gold marks only the key word. Everything else is white or #fafafa.

## 2. Brand system

### Colour (fixed)
| Token | Hex | Use |
|---|---|---|
| `black` | `#000000` | Background, always. Site primary `#080808` is acceptable for panels |
| `white` | `#FFFFFF` | Display (Anton) text |
| `fa` | `#FAFAFA` | DM Sans sentences and supporting text (75% opacity for support lines) |
| `gold` | `#F0B242` | The only accent: one key word per text group, heat, alerts, the active step |
| `goldL` | `#F7D58F` | Heat core and glow only (never text) |
| Steel greys | `#1C1F22` `#272B30` `#3A4047` `#9C9CA4` `#C8CCD6` | Only for drawing machines and products, plus the small silver caps label (`#9C9CA4`). These are the site's silver scale |

- No orange, red, green, blue, neon, gradients behind text, emoji or stock flames.
- Fire and heat are drawn as gold to white-hot glows and contour lines, never as photographic flames.
- Resolved / OK states are `#fafafa`, not green.

### Typography (fixed)
- **Primary: DM Sans** (400/500/600/700). Use it for all sentences, labels and the end-card line. Install with `npm i @fontsource/dm-sans`.
- **Secondary: Anton** (400). Use it for the one CAPS hit per text group. Install with `npm i @fontsource/anton`.
- Load both with `@remotion/fonts` `loadFont()` from `public/fonts/` (see `src/fk/fonts.ts`). Never render in a fallback font.

**Type scale for 1080×1920.** This is a hard ceiling; the previous reels were too big.
| Role | Font | Size | Notes |
|---|---|---|---|
| Display hit | Anton, CAPS | **120 px** (max 132) | line-height 1.02, tracking +.01em, max 2 lines, ≤ 14 characters per line |
| Lead sentence | DM Sans 600 | **52 px** | tracking −.02em, line-height 1.16, ≤ 24 characters per line |
| Support | DM Sans 500 | **40 px** | `#fafafa`, task lines, end-card line |
| Label | DM Sans 600 CAPS | **24 px** (20 min) | tracking .18em, silver `#9C9CA4` |

- **Stack** = lead + display (or lead / display / lead), left-aligned at x 130, top y 360–380. The size jump between lead and display is ≥ 2.2×.
- One text group on screen at a time. The next group enters only after the last one has left.
- Keep sentences short. If a line needs more than 24 DM Sans characters, split it over two lines; never shrink below 52 px.

### Logo (fixed)
- The end frame **always** uses the official logo from `assets/brand/`:
  - `emblem.png`: the steel shield and flame, unchanged.
  - `wordmark-light.png`: "THE FIRE KNIGHT" recoloured to `#fafafa` for black backgrounds. The original wordmark is black.
  - `logo-on-black.png`: both together.
- Never redraw, recolour the shield, stretch, or add effects other than the light sweep below.
- Do not show the logo or a brand header anywhere else in the reel.

### Product imagery (real, from thefireknight.in)
Use real renders wherever a product appears, cut out on black. Fetch them from `https://thefireknight.in/wp-content/uploads/2026/06/` (the site needs network access to `thefireknight.in`):
- Ranger: `Ranger_Product_Angle_4-1.webp` (cylinder and module; cut-out ready in `assets/product/ranger-cylinder.png`), `Ranger_Product_Angle_2-1.webp` (cylinder, hose and nozzle bar), `Ranger_Product_Angle_3-1.webp` (adds the control panel), `Ranger_Product_Angle_1-1-e1789194941280.webp`.
- Guardian: `Asset-5-1.webp` (steel) and `Asset-3-2.webp` (green).
- Protector: `protector-black-2-scaled-1.webp`. The `shield-black-scaled-1.webp` render (ceiling device, black) is unlabelled; confirm which product it is before using it.
- Comodo: `comodo-1-167x300-1.webp` (small) and `/2026/09/the-comodo-img.webp`.
- Sentinel and Ranger parts: `image-19.webp` (cylinder with nozzles), `image-20.webp` (bracket).
- Cut-out: OpenCV GrabCut with a rectangle init, keep the largest component, then clear near-white floor pixels in the lower third (see `scripts/` notes in `references/engine.md`). Check the result on black before using it.
- Present a product with: a rise from +70 px plus a blur clear, a slow 3% push, one light sweep masked to the product's alpha, a faint floor glow, and a silver caps label `THE RANGER · FIRE SUPPRESSION AID`.

## 3. Motion language
- **Lead sentences type on letter by letter** (from the iType system). Each letter moves x+18 px → 0 and blur 14 → 0 over 4 frames, with letters about 1 frame apart (0.7 for long lines). Exit: the whole line lifts 24 px and blurs out over 7 frames.
- **Display hits rise out of a mask** word by word. Each word moves translateY 110% → 0, scale 1.06 → 1 and blur 8 → 0 over 9 frames, staggered 3 frames.
- **Camera:** every shot has a slow push (2–3%) or a motivated move (push-in to the engine bay, pull-back to the hero). Use bezier (.45,0,.15,1) for camera and (.16,1,.3,1) for reveals. Never linear, never bouncing.
- **Depth:** layered parallax with a camera rig. Pit benches at 0.15, towers at 0.25, mid wall at 0.4, road and machine at 1. Add headlight beams with dust, rim light on the machine's top edges, and soft vignette and grain (5%).
- **Transitions are motivated by the action**, never generic slides:
  - continuous camera between scenes that share the machine
  - **heat flash** (gold → white radial bloom from the hot spot)
  - **dip** (soft gold-black bloom when diving into a panel)
  - **mist wash** (when suppression hands over to the product or the hero)
  - match cut on the same object
  - No `backdrop-filter` (it mirrors the frame edges in Chromium renders).
- Hold every text group long enough to read: at least **1.3 s for ≤ 4 words** and about **0.3 s per extra word**. Hero moves are fast (0.2–0.4 s), then hold.

## 4. Frame and safe area
- Format 1080 × 1920, 30 fps (or 60 on request), H.264, yuv420p **tv range**, BT.709, AAC 192k, `+faststart`.
- **Safe box: x 130–950, y 300–1460.** All text, products and logos stay inside it; machines and light may bleed. Check every scene with `showSafe: true`.
- Text zone is y 360–700. The machine or product zone is y 700–1300. Bottom labels sit around y 1230.

## 5. Scene recipes (pick 4–6, never the same recipe twice in a row)
- **Emerge** (hook): the machine in darkness, headlights flicker on (2 flickers), a light pool lifts the exposure, the camera pushes in, and the hook stack lands.
- **Night haul:** the machine drives, the world scrolls in parallax, wheels turn, the body bobs 1.6 px. Use it for time or place ("Raat 2 baje.").
- **Push to the risk zone:** the camera flies into the engine bay, battery pack or panel. A **thermal viewfinder** (hairline corner brackets plus a gold scan line) reveals gold heat contours inside it. The heat layer is drawn unfiltered on top of a greyscale body.
- **Four tasks / checklist:** one rounded window with no border, showing illustrated macro shots that whip-swap every 0.9 s. Below it go one support line (`01  Khatra notice karna`, gold index) and a hairline 4-step progress bar.
- **Automatic response:** the same zone as a schematic. One stage line at a time (`01 Detection` → `02 Alert` → `03 Suppression response`) with visuals: the sensing line draws on with a pulse, the reticle locks, the beacon pulses gold rings, then the nozzles mist. Mark it `CONCEPTUAL ILLUSTRATION` (20 px label, 55%).
- **Product reveal:** the real product render rises on black with a light sweep and a caps label; the line sits above it.
- **Hero + logo end frame:** pull back to the machine low in frame with a restrained gold accent along the protected zone. The emblem rises with one light sweep, the wordmark unmasks left to right, then `Because every second matters.` (DM Sans 40, "second" in gold) and `THEFIREKNIGHT.IN` label. Hold ≥ 1.2 s.

New machines follow `src/fk/Dumper.tsx`: a side view at real proportions, steel greys with gradients for form, rim-light strokes on top edges, lamps with glows and beams, and props for `heat`, `thermal`, `accent`, `wheelAngle`, `bob`, an `overlay` slot and `layer: "heat"`. Write down real dimensions in a comment (e.g. haul truck ~10.2 m long, 2.5 m tyres). No people or faces anywhere; use objects and POV only.

## 6. Language and copy
- Instagram: Hinglish in Roman script for sentences. Display hits can be Hinglish or English CAPS. LinkedIn: English.
- Copy structure: hook (asset + gap), the risk, one person / manual limits, automatic response, product, end frame.
- Every claim must trace to `references/facts.md`. Anything else is marked `[VERIFY]` and you tell the client.
- Claims guard (check every frame): the products are **fire suppression aids**. Never say "extinguishes", "100%", "guaranteed" or "replaces your extinguisher". Show no response times, thresholds or numbers the site does not state. Claim no DGMS / AIS / BIS approval. Say "International patent application PCT/AU2023/050224", never "patented". Use none of the site's unsourced statistics (5M trucks, 600,000 DG sets, 500–600 °C turbo heat, the bus rule). No named incidents, companies or competitors.

## 7. Sound
`scripts/sound.py` (numpy, 48 kHz) generates the score and SFX cued by frame:
- a dark pad (Dm–Bb–F–C, 100 BPM) with a sub pulse and a low drone
- headlight relay clunks, sub thuds on display hits, and soft key ticks under typed lines
- low whooshes on camera moves, a riser into the heat flash, and a heartbeat under the tasks
- a double beep (880/1320) on detection, a soft alarm, and a filtered hiss on suppression
- a steel swell on the product and a deep boom plus tone on the logo

Drop the pad for one beat before the turn. Master with `volume` + `alimiter` to **−14 LUFS, true peak ≤ −1 dB** (check with `ebur128`). If a voiceover is supplied, duck the bed 5 dB under it and time cuts to its words.

## 8. Workflow
1. **Plan:** reply with a beat table (time · on-screen text · machine/product · recipe · transition) and the claims you're relying on.
2. **Build:** copy the engine, edit `src/scenes/*` and `src/fk/theme.ts` `SCENES` timings, then run `npx tsc --noEmit`.
3. **Check frames:** run `node scripts/frames.mjs OperatorAkela <frames> <name> '{"showSafe":true,"logoSrc":null,"audio":false}' 0.4`. It bundles once and returns a contact sheet. Look at it and fix:
   - more than 3 elements in a frame
   - text over an empty frame
   - text outside the safe box, or over the size caps
   - two text groups overlapping
   - any colour outside the palette
   - leaking masks, or blur artifacts
4. **Render:** run `npx remotion render OperatorAkela out/x.mp4 --codec=h264 --crf=16 --audio-bitrate=192k`, then convert to tv range (`scale=in_range=pc:out_range=tv,format=yuv420p`, BT.709 tags, `-movflags +faststart`). Run long renders in the background.
5. **QA the MP4:** make a 1.5 fps contact sheet with ffmpeg `tile`, run `ffprobe` (1080×1920, 30/1, yuv420p) and check loudness. Then send the MP4 plus a cover frame, with a note covering scenes, what was estimated, and anything marked `[VERIFY]`.

In a cloud container, Remotion cannot download Chrome, so `remotion.config.ts` points at `/opt/pw-browsers/.../chrome-headless-shell` when it exists. Fetching product images needs `thefireknight.in` on the network allowlist.

## 9. Reel log
| Date | Reel | Viewer / product | Recipes in order | Notes |
|---|---|---|---|---|
| 2026-11-17 | Operator Akela v3 (20 s) | Mining HEMM / Ranger | Emerge → Night haul + thermal → Four tasks → Automatic response → Product reveal → Hero + logo | Reference build. Next reel: change the machine and the recipe order. |
