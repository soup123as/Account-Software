# The Fire Knight · Bus Owners × The Sentinel — "Nazar" film

42.0 s, 1080×1920, 30 fps, with sound. Built with the motionmaxxing skill as one HTML film (`index.html`, source in `src/`).
This note says what was made and what was checked. It does not certify the film as good; that is the client's call.

## The one idea
**Nazar: who is looking where.** The driver's mirror watches the passengers. Nothing watches the engine bay. The Sentinel's sensor module, a steel oval with one black lens, is the eye that does. The script's own verb is "nazar rakhta hai" and the product's own part looks like an eye, so the idea belongs to this product: cover the logo and the steel oval still says whose film it is.

Put aside: the x-ray bus with three highlighted zones as the whole film (already made twice for this client, and any suppression brand could run it). It survives as one beat only.

Gold has one meaning: the Sentinel acting (its name, the word "discharge"). Red is only the real extinguisher, the fire, the button and the alert.

## Beats and what each buys
| # | time | on-screen words | picture | buys |
|---|---|---|---|---|
| 1 | 0.0–4.6 | Passengers ka poora khayal. | the driver's view, the mirror on the lit cabin | the viewer agrees: yes, we look after passengers |
| 2 | 4.6–7.4 | Par engine aur battery ka kya? | the engine bay in the dark, belt running | nobody is looking down here |
| 3 | 7.4–11.8 | Shayad jawab hai… ek laal cylinder. | push down the aisle to the extinguisher | the "answer" is one cylinder, far from the engine |
| 4 | 11.8–15.6 | Aag wahan lagti hai, jahan koi DEKH NAHI RAHA | dark bay, a glow is born | fire starts where nobody looks (the point) |
| 5 | 15.6–20.8 | Engine bay. / Battery box. / Cabin. Passengers ke beech. | flame, sparks, haze: three cuts | three places it can start |
| 6 | 20.8–24.8 | SENTINEL / Har zone par nazar. | the steel module turns and looks, fire in its lens; then the real system render | something is watching (the point) |
| 7 | 24.8–28.6 | Aag jis zone mein, discharge sirf usi zone mein. | x-ray coach: engine zone sprays, battery and cabin modules stay idle | only the affected zone discharges |
| 8 | 28.6–32.6 | Driver ke paas: dashboard button. / Aapke phone par alert. | finger on the red button; lock screen, alert rolls up | the driver has a button, the owner is told |
| 9 | 32.6–37.8 | Driver ka pehla kaam: passengers ko utaarna. Cylinder dhoondhna nahi. | coach stopped, hazards, door open | so the driver can do his real job |
| 10 | 37.8–42.0 | Aapki bus mein kitne zone covered hain? / Comment kijiye. | pull back; emblem arrives | they answer the question |

Every line of the approved script is on screen as a caption, shortened only where the full sentence would not read in its time.

## What is real and what is illustrative
- **Real:** the Sentinel system render (from thefireknight.in), the shield emblem and wordmark, the product facts (per-zone flame sensing, only the triggered zone discharges in Normal Mode, dashboard button, phone alert).
- **Rebuilt:** the sensor module in the hero shot is a 3D rebuild of the real part (brushed steel oval, one lens), not a photograph.
- **Illustrated:** the coach, cabin, passengers, engine bay, battery box, dashboard and finger are drawings.
- **Illustrative, not captured:** the phone lock screen and both notifications ("Depot Indore", "Sentinel · Bus 07") are written for the film. The real app's wording was not available.
- **Sound:** a synthesised bed (drone, road rumble, placed hits, hiss, chime). There is **no voiceover and no music**: no ElevenLabs key in this environment. The client's VO drops in later.
- No statistics, response times or "extinguishes" claims are made.

## Checks run on `final.mp4` (numbers quoted from the scripts)
- **G0 render exists: PASS** — "duration 42.00 s matches --expect 42.00 s; audio stream present"
- **G2 no empty frame: PASS** — "no run of > 3 flat frames"
- **G3 end card: PASS** — "end hold 1.20 s (0.6-1.4); final shot 2.00 s = 5 % of the film (<= 25 %)"
- **G5 no page chrome: PASS** (`lint.mjs`, all rules PASS; it cannot see text inside images or canvas)
- **G1 proof readable / G4 one hero per frame:** judged by eye on `look-final/sheet.jpg`, no script number. Captions are large and clear of the objects. The notification text is small until the camera pushes in on it. One hero per frame holds on the sheet.
- **Audio:** "integrated -14.0 LUFS, LRA 4.6 LU, true peak -1.0 dBFS", audible 100 %, "3 of 15 cuts land within ±80 ms of a sound onset (20 %; pros ~35 %)".
- **Motion:** "mean frame-to-frame luma change 2.6/255 (human-made films: median 6.8, IQR 4.4–9.8): below the human band". The film is quieter than the reference films; see below.
- **Seek safety:** `Motion.selfTest` PASS, 24 samples, 0 mismatches.

## The sheet, frame by frame (what is actually on screen)
1. 1.3 s — driver's hands on the wheel, the mirror above showing the lit cabin; caption top. Hero: the mirror.
2. 3.9 s — same shot, the lamp sweep crossing it.
3. 6.5 s — the engine bay, very dark, belt and pulley visible; caption top. Hero: the bay, but it is dim.
4. 9.2 s — the cabin aisle, pushing toward a small red cylinder at the front.
5. 11.8 s — the dark bay with no caption: the held breath before the point.
6. 14.4 s — "DEKH NAHI RAHA" large over the bay, light sweeping, a first ember.
7. 17.0 s — flame in the engine bay, "Engine bay."
8. 19.7 s — hazy cabin, "Cabin. Passengers…" arriving.
9. 22.3 s — the steel module facing camera, fire in its lens, "SENTINEL" in gold. Hero frame.
10. 24.9 s — x-ray coach rear, the engine zone boxed in red with a flame.
11. 27.5 s — wider x-ray coach, cylinder and lines, "discharge" in gold.
12. 30.2 s — dashboard, finger on the red button, LED red, caption top.
13. 32.8 s — the coach from the side, stopped, no caption yet.
14. 35.4 s — front of the coach, door lit, "Driver ka pehla kaam: passengers ko utaarna."
15. 38.0 s — same coach, the question arriving.
16. 40.7 s — the shield emblem, wordmark, "Comment kijiye."

## What I would still improve
- **Too still.** 2.6/255 against a human band of 4.4–9.8. The dark shots (2, 4, 5 and the end) are held with only a light sweep and small procedural motion. More camera travel inside the engine bay would help most.
- **The engine bay drawing is the weakest art.** It is a simple block with a belt; it reads as "engine" but not as a real coach engine. A photographed or properly modelled bay would lift beats 2, 4 and 5.
- **The finger** is a simple shape. It reads, but it is not handsome. Given the client removed a drawn person from the shop reel, this and the hands on the wheel in beat 1 may be the first things they ask to change.
- **The real system render is small-source** (400×284 on the site, upscaled). A full-size render from the client would sharpen beat 6.
- **Timing is estimated** (2.6 words/s). With the client's VO, re-time the frame table `F` in `src/film.src.html` and `src/timing.ts`.
- **Sound** is a bed, not a score, and only 20 % of cuts land on a sound.
- **Open fact:** the site lists "EV battery compartments" as a zone. The script says "battery box" for any bus. The client should confirm the battery zone applies to diesel coaches.

## Rebuild
```bash
python3 src/build.py
```
```bash
BUS_TIMING=$PWD/src/timing.ts BUS_NO_STEPS=1 python3 ../fire-knight-reels/scripts/sound_bus.py audio/bed-raw.wav
```
Then mix with the skill's `mix.py` (`--duration 42 --music audio/bed-raw.wav --music-gain 0`) and render with its `render.mjs` (`--audio audio/mix.wav --grain 0.03`).
