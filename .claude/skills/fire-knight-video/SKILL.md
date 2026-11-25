---
name: fire-knight-video
description: Build a premium cinematic 9:16 reel for The Fire Knight (thefireknight.in) in Remotion - black frame, DM Sans + Anton type, gold #f0b242 accent, detailed machines (haul trucks, buses, gensets, server rooms) and the real Ranger/Sentinel/Comodo/Protector/Guardian products in every scene, ending on the official shield logo. Use for any Fire Knight reel, short video, motion ad or animated post, including "make a Fire Knight video", "Operator Akela style", "same as the last Fire Knight reel", or a storyboard/script for The Fire Knight.
---

# The Fire Knight: cinematic product reels ("Steel & Gold")

A Fire Knight reel looks like a premium automotive or engineering ad. It is quiet, dark and confident. One idea at a time sits on a black frame, a detailed real-coloured machine is always on screen, a single gold accent is used in the type, and it ends on the shield logo.

The reference implementation is **Operator Akela v8** in `fire-knight-reels/` (repo `soup123as/account-software`) or in `assets/engine/` of this skill. **Start every new reel by copying that engine.** Change the content, not the system.

The client approves every stage and does all posting. Never publish, schedule, comment or DM.

## 1. The three rules that make it premium
1. **Less on screen.** At most three things per frame: one text group, one machine or product, and at most one supporting detail (a reticle, a label or a progress line). No header bar, no brand pill, no HUD clutter, no clocks or status chips "for flavour". If a frame feels busy, delete something.
2. **The machine is the hero.** Every scene shows a machine (dumper, truck, bus, excavator, DG set, rack, panel, room) or a real Fire Knight product. Text never plays over an empty frame. Product-first is the brand: the viewer must always see *what* is protected and *what* protects it.
3. **Calm type, one accent, real objects.** Small, crisp DM Sans sentences with one Anton hit. Gold marks only the key word, and text is otherwise white or #fafafa. Machines, fire, lamps and products keep their real colours.

## 1b. Curiosity hook (every reel opens a loop and closes it late)
The reel must make the viewer **need** the ending. Build it in both the script and the visuals:

1. **Frame 0 is a finished poster.** It is the thumbnail and the scroll-stopper, so it must never be black or half-typed. At frame 0 the hook line is already fully on screen (scan-revealed before the start, then the scanner makes one live pass over it from frame 3). Behind it is one unexplained visual: a fire-orange heat signature pulsing in the engine bay, with the machine's silhouette rim-lit in the dark (exposure about 30%, not black). Sound: a heartbeat thud synced to the pulse.
2. **Open loop in the first line (≤ 0.5 s to start, done by 3.5 s).** Promise an answer without giving it. The pattern is: *"Ek cheez [is asset] ko [bacha sakti hai / bachati hai]."* + twist *"[OBVIOUS ANSWER] NAHI."*
   - Operator Akela: "Ek cheez is dumper ko BACHA SAKTI HAI." → "OPERATOR NAHI."
   - Other loops that work: "Is truck ki aag 2 baje kaun dekhega?" → "DRIVER NAHI." · "Extinguisher laga hai. PHIR BHI KHATRA?" · "Is generator room mein ek cheez missing hai."
   - The asset is named by the 5th word. The twist is a Display hit, with the gold word on the twist.
3. **Reveal by camera, not by cut.** Start tight on the mystery (z ≈ 2.3 on the hot spot) and pull back while the line types, so the scale of the machine arrives as part of the hook.
4. **Re-hook at 50–60% of the reel**, right before the answer. Ask it again as a Display hit over the unattended risk ("TOH PHIR KAUN?"), with the music bed dropped to the sub for that beat.
5. **Payoff = the product.** The real product render answers the loop (rise + light sweep + name label), followed by the line and then the logo end frame. Never answer the loop before ~65% of the reel.
6. Don't use cheap retention bait: no "watch till the end", fake countdowns, timers implying response times, or clickbait claims. The loop must be honest and answered.

## 2. Brand system

### Colour (fixed)
**Brand colours are for text, background and UI graphics only.** Physical things (machines, fire, lamps, safety kit, products) keep their real-world colours. Never recolour an object to match the brand.

**Brand: text, background, UI** (`C` in `theme.ts`)
| Token | Hex | Use |
|---|---|---|
| `black` | `#000000` | Background, always. Site primary `#080808` is acceptable for panels |
| `white` | `#FFFFFF` | Display (Anton) text |
| `fa` | `#FAFAFA` | DM Sans sentences and supporting text (75% opacity for support lines) |
| `gold` | `#F0B242` | The only text accent (one key word per group), plus UI graphics: thermal scan line, sensing line, reticle on detect, active step index, hero accent line |
| silver | `#9C9CA4` | Small caps labels only |

**Real-world: objects** (`REAL` in `theme.ts`)
| Object | Colour |
|---|---|
| Mining haul truck / HEMM | Industrial yellow body graded for night light (`#F2B630` → `#D39A1C` → `#5C3F08`), black tyres, steel-grey rims, chassis, deck plate and fuel tank, dark glass |
| Fire and heat | Natural: white-hot core `#FFF4DC` → `#FFB33A` → `#FF6A1A` → `#E2361A` |
| Dashboard warning lamps, park brake, gauge red zone | Red `#E3281C` |
| Rotating beacon and its light rings | Amber `#FFA41A` |
| Floodlights | Sodium `#FFBE6A` |
| Extinguisher | Red body with a white label, a green gauge needle and a yellow pin |
| Fire Knight products, logo | Exactly as the official renders and logo files. Never tint |
| Other machines (trucks, buses, DG sets, racks) | Their real livery or finish. Ask if unsure; default to the common real colour |

- A thermal-camera viewfinder may show the machine in greyscale, because that is what a thermal camera shows. Elsewhere, don't desaturate or tint machines.
- No neon, no gradients behind text, no emoji, no stock flames (fire is drawn).

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
- **Text animation (client-approved, v7):**
  - DM Sans lead lines **type on letter by letter** (`TypeOn`). Each letter moves x+18 px → 0 and blur 14 → 0 over 4 frames, about 1 frame apart (0.6–0.7 for long lines). Exit: the line lifts 24 px and blurs out over 7 frames.
  - Anton hits **rise out of a mask** word by word (`Display`). Each word moves translateY 110% → 0, scale 1.06 → 1 and blur 8 → 0 over 9 frames, staggered 3 frames.
  - For the poster first frame, start the hook group at a negative frame (e.g. `at={-40}`) so it is fully on screen at frame 0.
  - Don't swap this for other text effects. The client tried a thermal-scan reveal (`ScanReveal`, still in `ui.tsx`) and preferred this.
- **Placement rule (client requirement): text never sits on any object.** While text is on screen, the machine, product or graphic stays out of the text zone (y 360–700 for top stacks).
  - Frame close-ups low: anchor the hot spot at y ≈ 1230 at zoom 2.2, which puts the truck's canopy at y ≈ 650.
  - Keep a black top field.
  - Put step-chain text and labels on clear black, below the machine.
  - Check every scene with `showSafe` frames. If a shot can't avoid an overlap, move the text or re-frame the camera; never place text over the object.
- (Legacy, still in `ui.tsx`: `TypeOn` letter type-on and `Display` mask rise. Use them only for small UI labels.)
- **Camera:** every shot has a slow push (2–3%) or a motivated move (push-in to the engine bay, pull-back to the hero). Use bezier (.45,0,.15,1) for camera and (.16,1,.3,1) for reveals. Never linear, never bouncing.
- **Depth:** layered parallax with a camera rig. Pit benches at 0.15, towers at 0.25, mid wall at 0.4, road and machine at 1. Add headlight beams with dust, rim light on the machine's top edges, and soft vignette and grain (5%).
- **Transitions are motivated by the action**, never generic slides:
  - continuous camera between scenes that share the machine
  - **heat flash** (gold → white radial bloom from the hot spot)
  - **dip** (soft gold-black bloom when diving into a panel)
  - **mist wash** (when suppression hands over to the product or the hero)
  - match cut on the same object
  - No `backdrop-filter` (it mirrors the frame edges in Chromium renders).
- **Pacing (v6, the client found faster cuts hard to follow):**
  - Scene transitions are **20–24 frames (0.7–0.8 s)**.
  - Camera pushes and pulls are **55–75 frames**.
  - Text entries are 14–20 frames, and exits 12 frames.
  - Hold every text group at least **1.5 s for ≤ 4 words**, plus about 0.35 s per extra word.
  - Never cut faster than 0.7 s between ideas. A 6-scene reel runs about 25 s. Trim scenes rather than speed them up.

## 4. Frame and safe area
- Format 1080 × 1920, 30 fps (or 60 on request), H.264, yuv420p **tv range**, BT.709, AAC 192k, `+faststart`.
- **Safe box: x 130–950, y 300–1460.** All text, products and logos stay inside it; machines and light may bleed. Check every scene with `showSafe: true`.
- Text zone is y 360–700. The machine or product zone is y 700–1300. Bottom labels sit around y 1230.

## 5. Scene recipes (pick 4–6, never the same recipe twice in a row)
- **Mystery reveal** (hook, default): a poster first frame (see 1b), tight on the fire-orange heat signature in a rim-lit, dark machine with the hook line already on screen. The scanner passes once, the camera holds for 0.8 s, then pulls back over about 2.5 s to reveal the whole machine. The headlights flicker on as the pull starts, and the twist line scans in on the full machine.
- **Emerge** (alternative hook): the machine in darkness, headlights flicker on, a light pool lifts the exposure, and the camera pushes in.
- **Re-hook:** the same risk zone, unattended, with the loop question as one Display hit ("TOH PHIR KAUN?") and a sub boom on the pad drop.
- **Night haul:** the machine drives, the world scrolls in parallax, wheels turn, the body bobs 1.6 px. Use it for time or place ("Raat 2 baje.").
- **Push to the risk zone:** the camera flies into the engine bay, battery pack or panel. A **thermal viewfinder** (hairline corner brackets plus a gold scan line) reveals gold heat contours inside it. The heat layer is drawn unfiltered on top of a greyscale body.
- **Task grid** (manual load): a 2×2 grid of 400×300 rounded tiles that builds up one tile every 22 frames. Each tile holds an illustrated macro shot (gauges, braking, extinguisher, attempt) and a short label (`01 Khatra dekhna`, gold index, DM Sans 600 30). Tiles stay on screen, so the pile-up of work on one person is visible. The newest tile gets a gold hairline border. End by diving into the last tile.
- **Step chain** (how it works; use it for any 3–4 step process):
  - Top half: the machine's risk zone, where each step visibly happens (sensing line draws on, reticle locks, amber beacon rings, nozzle mist).
  - Bottom half (y 1076–1440): a vertical chain of 68 px icon nodes joined by a connector that fills gold node to node.
  - Each node has a looping animated icon: a sensor with heat waves, a beacon with flashing rays, a nozzle with falling droplets. The active node is filled gold with a black icon and has a pulsing ring; finished nodes are outlined.
  - Next to each node: a gold index, a title (DM Sans 600 44) and one plain line (DM Sans 500 30, 72%), scan-revealed.
  - Steps arrive about 1.2 s apart and stay, so the viewer ends on the whole chain.
  - Mark it `CONCEPTUAL ILLUSTRATION`.
- **Product reveal (its own scene, ≥ 3 s):** the real product render rises on black with a light sweep and a caps label; the line scans in above it. This is where the hook's loop closes.
- **Hero + logo end frame:** pull back to the machine low in frame with a restrained gold accent along the protected zone. The emblem rises with one light sweep, the wordmark unmasks left to right, then `Because every second matters.` (DM Sans 40, "second" in gold) and `THEFIREKNIGHT.IN` label. Hold ≥ 1.2 s.

Machines available: `Dumper.tsx` (100-t haul truck, mine setting) and `Truck.tsx` (modern Indian cab-over haulage truck at real proportions: high-roof white cab, raked windshield, big mirrors, steel disc wheels with hand holes, corrugated navy container, aluminium tank; heat shows at the cab's side air intake; `cabAlarm` makes the in-cab emergency light strobe red/amber; `World machine="truck" setting="highway"`, bay = `TBAY_W`). New machines follow `src/fk/Dumper.tsx`: a side view at real proportions, their **real colours** (from `REAL`) with gradients for form, rim-light strokes on top edges, lamps with glows and beams, and props for `heat`, `thermal`, `accent`, `wheelAngle`, `bob`, an `overlay` slot and `layer: "heat"`. Write down real dimensions in a comment (e.g. haul truck ~10.2 m long, 2.5 m tyres). By default there are no people; use objects and POV. The client tried a person in the shop reel (a stranger making the call) and asked for it to be removed. Tell a moment through objects instead (a phone with an "Unknown number" call, then the smoking shutter).

**Shop / retail world** (`src/shop/`, the Protector), all in frame coordinates through `CamView` (`fx.tsx`: `Cam {z, cx, cy, ax, ay, sx, sy}`):
- `Shopfront`: an Indian market shopfront at night. Galvanised rolling shutter, perforated vision strip, brass padlock (`LOCK`), unlit flex sign, neighbours, a pole and wire tangle, sodium street light. Props: `cool` / `green` / `fire` / `strobe` light leaking through the gaps, `smoke`, and `heat` (shimmer, buckle, orange glow).
- `Interior`: the closed shop. Stock shelves, a glass-door cooler, an inverter and tubular battery, and a 4-socket extension board on the floor (`BOARD.hot` overheats). The Protector is drawn as a black oval ceiling plate with two nozzles and a status LED. Props: `boardHeat`, `flame`, `protector`, `awake`, `sense` rings, `strobe`, `mist`, `flash` (camera), `burnt` aftermath, `smoke`, and `highlight` + `hl` to spotlight one object.
- `GaliTop`: a night drone shot straight down into the gali (100 px = 1 m). Top-view scooters sit on both sides under blue tarp and tin awnings, with black water tanks on the roofs and thin overhead wires. A top-view fire tender (FIRE roof marking, red/blue light bar, ladder) noses into the mouth (`creep`) and stops (`jolt`). `bars` draws the gold available-gap hairline against the white tender-width hairline. Fire glows up the lane. Top view beats perspective for anything about width, and the vehicles are recognisable from above.
- `Phone`: an incoming call ("Padosi", 2:04 AM) or a lock-screen fire alert.
- `fx.tsx` also has `Smoke`, `Flame` and `Mist`, all in real colours.

**Server room world** (`src/server/`, the Comodo), same `CamView` coordinates:
- `Room`: an office server room at night (255 px = 1 m). Three 42U racks (servers, network with patch cords, storage) behind mesh doors with blinking LEDs, a ladder cable tray, a wall-mounted electrical panel that overheats (`HOT`), a ceiling smoke detector (`DET`) and a red wall sounder (`HOOT`). The Comodo (`COMODO`) is drawn after the site render: black cylinder in a silver cradle on a wall plate, antenna, pressure gauge, two nozzles down, sensor module underneath. Props: `alarm`, `heat`, `flame`, `smoke`, `ok` (LED health per rack: green, amber, red, dark), `comodo`, `outline` (gold dashed mount outline), `sense`, `mist`, `spot` + `hl`.
- `Corridor`: outside the room. Steel door with a glass panel (rack LEDs glow through it), SERVER ROOM plate, card reader, 02:00 wall clock, EXIT sign, sounder, and an unattended desk with a dark monitor and an empty chair. Props: `glow`, `alarm`, `leak`, `haze`, `desk`. The empty chair carries "nobody is here" without drawing a person.
- Keep alarm light soft: a full-frame red strobe above about 40% opacity turns the shot into a flat red card. It flashes at about 2.4 Hz.
- A multi-word string passed as one `TypeOn` word loses its space; split it into words.
- The Comodo render (`public/product/comodo.webp`) sits on white: put it on a white card and multiply a light-grey gradient over it.

**Night-call set** (`src/call/`):
- `Handset`: a phone with four screens: `incoming`, `outgoing` (status line), `lock` (notification stack, optional Silent pill, `dim`) and `app` (an illustrative remote screen with an Activate button; label it "Illustrative app screen").
- `CityMap`: the city at night from above. `route` draws the gold way from HOME to OFFICE (the far corner) and `car` moves a car with headlights along it. Keep roads light enough to read as a map.
- A torch beam on the locked door (screen-blended ellipse + cone in the scene) shows the guard is there without drawing him.

**Voiceover without ElevenLabs:** `scripts/vo_call.py` synthesises the VO locally with Piper (`pip install piper-tts`, voice `hi_IN-rohan-medium` from the sherpa-onnx `tts-models` GitHub release), one phrase at a time in Devanagari, and prints exact phrase timecodes for `timing.ts`. Check every phrase by transcribing it back with Whisper. It is a stand-in: say so, flag that the voice's dataset licence (IIT Madras IndicTTS) is unverified for commercial use, and offer to re-sync to the client's own VO. sherpa-onnx 2.x no longer phonemises Hindi by itself, and the `pratham` voice is CC BY-NC (do not use).

**Cards cut** (`src/cards/`, client's reference: a flat, fast "access card" reel). Use it when the client wants the quick card-by-card build instead of the cinematic sets. It keeps the brand: black ground, DM Sans + Anton, gold as the one accent, the real product render and the shield end frame.
- `kit.tsx`: `Head` (small line + Anton lines that slam in, one gold word), `Card`, `Tag`, `Chip`, `Stamp` (rotated verdict), `Row` (checklist line whose tag flips), `Fx` (blur / pop / slide / drop / slam / stamp, each landing on its spoken word), flat icons (`IcoDetector`, `IcoPhone`, `IcoDoor`, `IcoKey`, `IcoComodo`, `RoomDiagram`), `Header` + `Pill` for the meter, and `Captions`.
- `Captions`: the spoken words in groups of 2-3 with a pill hopping word to word (gold pill on the key word, marked `*` in `words.ts`). Words are laid out from glyph metrics and the black text is a second layer clipped to the pill, so every frame of a hop reads.
- The meter counts something the story moves (here JAWAAB 0/3, then UNIT · JAWAAB ✓). Never a percentage of protection.
- Red is only a warning colour (alarm, failure tags and stamps). The one inverted moment is the punch: a gold card with black type.
- Frame 0 must be a finished poster: do not fade the first scene in.
- The client asked for "visuals like the previous reel" inside this cut: cards that show a place are `View` windows (in `cards/scenes.tsx`) onto the illustrated sets (`Room`, `Corridor`) through a `CamView`, and phones are the real `Handset` cropped by the card. Keep flat icons only for small UI glyphs (key, struck-out call).
- Something changes about once a second; a scene is one headline plus two or three cards.

**Full-screen cut with the cards grammar** (`src/full/`, the client's final preference for this reel): the cinematic scenes edge to edge like the shutter reel, with the cards cut's `Head` headlines, meter, stamps and word-by-word `Captions` on top.
- The cinematic scenes run in `Bare` mode (`src/call/scenes.tsx`): a context that hides their own caption stacks and shrinks the phone, so nothing is duplicated.
- Each picture is lifted about 130 px and sits between two calm fields: a black fade behind the headline (top) and one behind the captions (bottom). Fade the top field out before the logo, or it darkens the emblem.
- Order the client moved through for this script: cinematic → flat cards → cards with realistic windows → full-screen with headlines and captions. Offer the last one first next time.

**Captions always fit:** `TypeOn` and `Display` measure their line from the fonts' own glyph advances (`src/fk/metrics.ts`, extracted with fontTools) and shrink only that line's font size when it would pass the 820 px safe width. Never let a caption clip or run past x 950. Never use DOM `measureText` for this: render tabs that measure before the font loads cache a different width, and the caption size flickers frame to frame.

**Lighting like the truck reel (the client's benchmark):**
- near-black backgrounds
- one motivated key light (a street lamp, the cooler, the fire) with everything else falling off to dark
- clean gradient materials with crisp highlight lines
- soft ground reflections
- small coloured accent glows

No noisy plaster or dirt textures, no evenly lit sets, no saturated clutter.

**Product presentation:** show the real render on a rounded light-grey studio card (its own backdrop) with a shadow and a light sweep. Never use a radial white vignette circle.

**Bus world** (`src/bus/`, the Sentinel). `Bus.tsx` is an Indian intercity AC coach in side view, front left (100 px = 1 m, 12 m long). It has:
- a rear engine bay with louvres, a battery box behind the front wheel, luggage bays, a front door and an AC pod
- the red extinguisher behind the driver's seat (`EXT`)
- props: `xray` (seats, driver seat, batteries, engine block), `sentinel` (a module per zone, an SS cylinder in the bay, braided hoses), `sense` cones, `fire` and `mist` (engine zone only), `hazard`, `door`, `extGlow`
- `ZONE` / `MOD` coordinates

`BusWorld` sets it on a night highway. Sentinel renders on the site are only 400×284, so `public/product/sentinel-*.png` are 2× Lanczos upscales.

**Cinematic sets** (`src/bus/cine.tsx`), used when the client asks for "realistic automotive cinematography":
- `DriverPOV`: the night road through the windscreen, cluster glow, steering wheel, hands at ten-to-two, under-lit.
- `Aisle`: one-point perspective down a coach aisle. Passengers are heads above the white headrest covers, seen from behind. It has racks, reading lights, blue mood light, window streaks, and the driver's partition with the red extinguisher behind the driver's seat. Props: `dolly`, `ext`, `smoke`, `dim`.
- `EngineClose` and `BatteryClose`: close-ups lit by the fire, with turbulence-displaced flames, embers, sparks and smoke.
- `DashPress`: a guarded red dashboard button and the driver's finger.
- `Walker`: backlit evacuation silhouettes.

`Tilt` (CSS `perspective` + `rotateX/Y` on a CamView layer) gives the 2D sets a real 3D camera angle (low-angle, cutaway). Product cutouts on dark come from flood-filling the white render background (`sentinel-*-cut.png`).

People rule: only when the client asks, and never with faces (hands, backs of heads, silhouettes).

**Pre-VO cue sheet:** when the script is approved before the VO exists, put every beat in `CUE` (seconds) in `timing.ts`. Scenes read their beats with `at(scene, cue)` and `sound_shop.py` parses the same file. Re-syncing to the real VO is then a data edit plus a sound rerun.

## 6. Language and copy
- Instagram: Hinglish in Roman script for sentences. Display hits can be Hinglish or English CAPS. LinkedIn: English.
- Copy structure: **open loop** (asset + promise + twist), the risk, one person / manual limits, **re-hook**, automatic response, **product = answer**, end frame.
- Every claim must trace to `references/facts.md`. Anything else is marked `[VERIFY]` and you tell the client.
- Claims guard (check every frame): the products are **fire suppression aids**. Never say "extinguishes", "100%", "guaranteed" or "replaces your extinguisher". Show no response times, thresholds or numbers the site does not state. Claim no DGMS / AIS / BIS approval. Say "International patent application PCT/AU2023/050224", never "patented". Use none of the site's unsourced statistics (5M trucks, 600,000 DG sets, 500–600 °C turbo heat, the bus rule). No named incidents, companies or competitors.

## 7. Sound
`scripts/sound.py` (numpy, 48 kHz) generates the score and SFX cued by frame:
- a dark pad (Dm–Bb–F–C, 100 BPM) with a sub pulse and a low drone
- headlight relay clunks, sub thuds on display hits, and soft key ticks under typed lines
- low whooshes on camera moves, a riser into the heat flash, and a heartbeat under the tasks
- a double beep (880/1320) on detection, a soft alarm, and a filtered hiss on suppression
- a steel swell on the product and a deep boom plus tone on the logo

Drop the pad for one beat before the turn. **Voiceover:** the client supplies the recording (or an ElevenLabs key; never assume one). Put it in `public/audio/` and pass `voSrc`. The end-frame VO starts at the emblem rise (`VO_AT`) and the bed ducks to 50%. Master with `volume` + `alimiter` to **−14 LUFS, true peak ≤ −1 dB** (check with `ebur128`). If a voiceover is supplied, duck the bed 5 dB under it and time cuts to its words.

## 7b. Voiceover sync (the client supplies the VO file)
The voiceover drives the timeline. Never stretch or cut the voice; move the cuts.
1. **Find the pauses:** `ffmpeg -i vo.mp3 -af silencedetect=noise=-38dB:d=0.18 -f null -` gives the phrase segments.
2. **Transcribe each segment** with sherpa-onnx Whisper (`pip install sherpa-onnx soundfile`). Get the model from GitHub releases, because Hugging Face is blocked in cloud containers: `https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-small.tar.bz2`. Decode each segment with `language="en"` (it gives a readable English gloss) and `language="hi"`, then reconstruct the Hinglish line by hand. List the reconstructed script in the reply.
3. **Re-time the scenes:**
   - Each scene cut sits inside a VO pause.
   - Each on-screen text group starts on its spoken word (≤ 0.1 s early) and matches the spoken words, shortened if needed.
   - Each visual beat lands on the word that names it (task tiles, the product reveal on its name, step nodes on "detect" / "alert" / "suppression", the logo on "The Fire Knight").
   - Reel length = VO length + about 1.8 s logo hold.
   - Write the VO timecodes as comments at the top of each scene.
4. **Mix:**
   - Music and SFX from `scripts/sound.py` sit at −13 dB, ducked by the VO with `sidechaincompress` (threshold 0.02, ratio 5, attack 15, release 400). The VO goes on top at +2 dB.
   - Then `alimiter` and a gain tweak to **−14 LUFS, true peak ≤ −1.3 dB**. The result is one `public/audio/akela-mix.wav`.
   - Keep SFX sparse and low under speech.

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
| 2026-11-17 | Operator Akela v3 (20 s) | Mining HEMM / Ranger | Emerge → Night haul + thermal → Four tasks → Automatic response → Product reveal → Hero + logo | First Steel & Gold build. |
| 2026-11-17 | Operator Akela v4 (20 s) | Mining HEMM / Ranger | Mystery reveal ("Ek cheez is dumper ko BACHA SAKTI HAI. / OPERATOR NAHI.") → Night haul + thermal → Four tasks → Re-hook ("TOH PHIR KAUN?") → Automatic response → Product reveal → Hero + logo | Curiosity hook. Scenes: 3.5 / 4 / 3.5 / 5 / 4 s. |
| 2026-11-17 | Operator Akela v5 (20 s) | Mining HEMM / Ranger | as v4 | Real object colours. |
| 2026-11-17 | Operator Akela v6 (25.4 s) | Mining HEMM / Ranger | Mystery reveal (poster frame 0) → Night haul + thermal → Task grid → Re-hook → Step chain → Product reveal → Hero + logo | Thermal-scan text (rejected), slower pacing, step chain. |
| 2026-11-17 | Operator Akela v7 (25.4 s) | Mining HEMM / Ranger | as v6 | Type-on and mask-rise text restored; text never on objects. |
| 2026-11-17 | Operator Akela v8 (35.5 s, with VO) | Mining HEMM / Ranger | Mystery reveal → Night haul + thermal → Cab + task grid → Re-hook ("Lekin... agar woh waqt par na PAHUNCH PAAYE?") → Product ("Yahin kaam aata hai RANGER.") → Step chain → Hero line + logo | **Reference build.** Cut to the client's ElevenLabs Hinglish VO (34 s). Cuts sit in pauses, text matches speech, beats land on their words, music ducks under the VO. |
| 2026-11-18 | Truck Owners v2 (40.2 s, with VO) | Truck and fleet owners / Ranger | Negative hook poster ("Truck owners, aapka sabse bada NUKSAAN accident nahi... yeh ho sakta hai.") → Night highway + thermal → Driver cab + task grid → Loss re-hook (PAHUNCHE... / MAAL AUR KAMAAI) → Product → Step chain → Hero line (BHAROSE) + logo + WhatsApp CTA | Cut to the client's ElevenLabs VO (38.6 s); `src/truck/timing.ts` has the VO timecodes. |
| 2026-11-18 | Truck Owners v3 (40.2 s, with VO) | as v2 | as v2 | **Posted version.** Realistic truck rebuild; the alarm sounds inside the cab (window strobe + waves from the cab) with a callout of the real Ranger control panel (`public/product/ranger-panel.png`, TRIGGERED + red button pulsing). No roof beacon on trucks. |
| 2026-11-18 | Truck Owners final (40.4 s, VO v2) | as v3 | as v3 | **Posted version.** Closing line changed to "Kyunki aapka business sirf regular safety ke BHAROSE nahi chalna chahiye."; whole reel re-synced to the client's VO v2 (38.77 s). Mudguard arcs and mud flaps removed from the truck at the client's request. |
| 2026-11-20 | Shop Owners preview (66.5 s, no VO yet) | Shop and showroom owners / Protector | Poster hook on the locked shutter ("Shutter gira ke GHAR JAATE HO? / Andar abhi bhi KYA CHAL RAHA HAI?") → Inside the closed shop, one object at a time (01 FRIDGE / 02 INVERTER / 03 CHAAR PLUG, board heats) → 2 a.m. neighbour call + smoking shutter → Re-hook (asli JHATKA) + jammed shutter + narrow gali → Insurance survey card ("SABOOT kahan hai?") → Rewind + "khud JAAG rahi hoti?" (Protector LED wakes) → Real Protector render → Flame/Heat/Gas chips, CONFIRM, siren + light, SUPPRESSION, pre-activation photo → Phone alert ("AAPKE PHONE") → Padlock punch ("TAALA chor ko rokta hai… AAG ko nahi.") + logo + share CTA | Open loops close later (which plug? → board; saboot? → photo; padosi call → own phone). Diya and Diwali stock dropped (season over). Timing is estimated in `src/shop/timing.ts` until the client VO arrives. |
| 2026-11-20 | Shop Owners v2 (67.6 s, no VO yet) | as preview | as preview, but the 2 a.m. call is now from an **unknown number** (phone, then the caller on the street pointing at the smoking shop) and the gali is the new `GaliMouth` (realistic scooters, a tender that can't fit, gap vs width hairlines) | Client feedback: more realistic graphics (textured plaster, slat profiles + grime, granite cladding, pavers, slotted-angle racks, 3D stock, visi-cooler with depth, piggyback adapter on the board), captions auto-fit, padosi replaced by an unknown caller (L5, L13). |
| 2026-11-20 | Shop Owners v3 (67.6 s, no VO yet) | as v2 | as v2; gali beat is now the `GaliTop` drone shot | Client feedback: caption size flicker fixed (glyph-metric fitting); truck-reel lighting on every set; realistic caller (real proportions, profile, three-light shading, medium shot); top-view scooters; product on a studio card instead of a white circle. |
| 2026-11-20 | Shop Owners v4 (67.6 s, no VO yet) | as v3 | as v3, the call beat is the phone ("Unknown number") dissolving into the smoking shutter | Client: "remove the person part, everything else is perfect." Approved look. |
| 2026-11-20 | Shop Owners final (70.8 s, VO) | Shop and showroom owners / Protector | as v4 | **Final.** Synced to the client's ElevenLabs VO (69.25 s). Cue sheet in `src/shop/timing.ts` holds the VO timecodes, and every cut sits in a pause. Mix at −14.1 LUFS, peak −1.4 dB (`public/audio/shop-mix-vo.wav`). |
| 2026-11-21 | Bus Owners preview (39.2 s, no VO yet) | Bus and coach fleet owners / Sentinel | Hook on the night highway ("Passengers ki safety ka POORA KHAYAL… par engine aur battery ki SAFETY KA KYA?") → X-ray reveal of the red cylinder behind the driver's seat → distance line + three zones (ENGINE BAY / BATTERY BOX / CABIN) → Sentinel on a studio card → modules per zone, NAZAR, fire at engine, discharge only there, dashboard button callout, phone alert → bus stops, hazards, door opens (PASSENGERS KO utaarna hai… cylinder dhoondhna nahi) → question + logo + comment CTA | Ask: comment. Timing estimated in `src/bus/timing.ts` until the VO arrives. Battery zone: site says EV battery compartments, so confirm for diesel buses. |
| 2026-11-21 | Bus Owners cinematic (43 s, no VO yet) | Bus and coach fleet owners / Sentinel | Client's 7-scene direction: low-angle highway → driver's hands → passengers → push in (hook) / aisle dolly to the red extinguisher / fast cuts engine fire → battery smoke → smoky cabin / smoke → dark studio Sentinel orbit with red scan + tech overlays → installed in the bus / 3D cutaway, engine zone red + discharge only there / button press → phone alert (red) / evacuation silhouettes → open highway → product + logo + THE SENTINEL + comment CTA | Replaces the motion-graphics preview. Red used as a controlled alarm accent at the client's request. |
| 2026-11-23 | Bus Owners, Bang Motion cut (37 s, no VO yet) | Bus and coach fleet owners / Sentinel | One continuous shot along the coach (HTML + GSAP, `fire-knight-bus-motion/`): lit cabin → dark engine → through the wall (x-ray) → red cylinder → gold line ridden to engine / battery / cabin → Sentinel assembles (real render insert) → engine-only discharge → dashboard button + phone alert lift out → bus stops, door opens → pull back under logo + comment CTA | Built with the client's `bang-motion` skill (they asked for "motionmaxxing", which is not installed). Brand rules kept: captions in the dark pocket, DM Sans + Anton, gold accent. CDNs are blocked in the container, so GSAP and fonts are bundled. |
| 2026-11-24 | Bus Owners, "Nazar" film (42 s, no VO yet) | Bus and coach fleet owners / Sentinel | Built with the motionmaxxing skill (HTML + seek-safe GSAP runtime, `fire-knight-sentinel-film/`). Idea: who is looking where. Driver's mirror on the passengers → dark engine bay nobody watches → aisle push to the red cylinder → fire born in the bay / battery sparks / cabin haze → HERO: the steel sensor module (real 3D rebuild) turns like an eye, fire in its lens, then the real system render → x-ray coach, engine zone only discharges → finger on the dashboard button → lock-screen alert → coach stopped, door open → question → emblem. | Draft for review. Gold means "the Sentinel acting" only. A sodium-lamp sweep every 52 f is the one shared light. Captions carry every script line. Review numbers and the honest to-do list are in that folder's `NOTE.md`. Sound is the synthesised bed only; re-time `F` in `src/film.src.html` and `src/timing.ts` to the client's VO when it arrives. |
| 2026-11-24 | Smoke Alarm preview (63.5 s, no VO yet) | Facility managers and IT heads / Comodo | Client's own script, negative hook ("Smoke alarm BAJ RAHA HAI. Warning mil chuki hai. Par fire ko rokne ke liye AB KYA?"). Tight on the ringing detector, pull to the panel fire → corridor at 02:00, office shut → alarm rings, cut to the empty chair → fire reaches 01 servers / 02 networking / 03 infrastructure, racks go dark → "sirf ALARM NAHI" + gold mount outline → Comodo on a studio card → flame + heat detect, automatic discharge at the panel, racks stay green, corridor still empty → MONITORED vs PROTECTED callouts → logo + "DM us for a free consultation" + WhatsApp. | Timings estimated in `src/server/timing.ts`; sound from `scripts/sound_server.py` (smoke-alarm temporal-3 beeps, rack power-down). End frame carries the DM line the client asked for. |
| 2026-11-25 | Raat ka call (57.5 s, generated VO) | Facility managers and IT heads / Comodo | Client's script. Detector rings → your phone rings ("AB AAP KYA KARENGE?") → 01 call the guard, torch on the locked door ("chaabi USKE PAAS NAHI") → 02 call the IT team, phone on SILENT → city map, office in the far corner → inside: "KISI NE KUCH NAHI KIYA" → "Ek aur TAREEKA hai" + gold outline → Comodo studio card + Flame / Garmi chips → auto discharge, then the still-locked door ("NA CHAABI, NA CALL") → lock-screen alert → app Activate → ALARM vs JAWAAB callouts → the call again → logo + send pill + DM line. | First reel with a locally generated voiceover (`scripts/vo_call.py`); cue sheet in `src/call/timing.ts`, bed from `scripts/sound_call.py`, mix −13.9 LUFS. VO is a stand-in until the client supplies their own. |
| 2026-11-25 | Raat ka call, cards cut (57.5 s, generated VO) | Facility managers and IT heads / Comodo | Same script, VO and cue sheet as the cinematic cut, rebuilt in the client's reference grammar: alarm card + phone card + three option chips → contact card, door + key, CHAABI NAHI stamp → contact card, silent phone + missed calls → map card, BAHUT DOOR → room diagram + three rows flipping to KUCH NAHI → gold slot → Comodo studio card + FLAME / GARMI / KHUD SENSE chips → diagram with the unit spraying, AUTOMATIC ✓, then key and call struck out → phone + APP / SMS / EMAIL notes, ALERT SENT ✓, Activate button → gold JAWAAB punch card → send sheet, Sent ✓ → shield logo + DM line. | Hybrid chosen by the client (brand kept, pacing and captions from the reference). Bed is the call bed plus soft pops on each card (`public/audio/cards-mix-vo.wav`). |
| 2026-11-25 | Raat ka call, full-screen cut (57.5 s, generated VO) | Facility managers and IT heads / Comodo | The cinematic scenes full screen (detector → phone → torch on the locked door → silent phone → city map → room on fire → gold outline → Comodo studio card → discharge → locked door → alert + app → callouts → logo), under short headlines, the JAWAAB meter, stamps and word-by-word captions. | Client: "make the visuals full screen like the shutter reel". Same VO and cue sheet; audio is the cinematic mix (`call-mix-vo.wav`). |
