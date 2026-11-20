"""Synthesise the Shop Owners (Protector) score + SFX, cued from src/shop/timing.ts.

usage: python3 scripts/sound_shop.py public/audio/shop-raw.wav
Then loudness-normalise with ffmpeg (see scripts/render.sh).
"""
import re
import sys
import wave
import numpy as np

SR = 48000
# ---- read the cue sheet straight from the Remotion timing file ----
_ts = open(__file__.replace("scripts/sound_shop.py", "src/shop/timing.ts")).read()
def _block(name):
    body = re.search(name + r" = \{(.*?)\} as const", _ts, re.S).group(1)
    return {k: float(v) for k, v in re.findall(r"(\w+): ([0-9.]+)", body)}
Q = _block("CUE")
CUT = _block("CUTS")
DUR = round(CUT["end"] * 30) / 30.0
N = int(SR * DUR)
rng = np.random.default_rng(11)
L = np.zeros(N)
R = np.zeros(N)
F = lambda frame: frame / 30.0  # frame -> seconds


def t_(d):
    return np.arange(int(d * SR)) / SR


def band(x, lo, hi):
    """Static FFT band-pass."""
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(len(x), 1 / SR)
    m = ((fr >= lo) & (fr <= hi)).astype(float)
    # soft edges
    m = np.convolve(m, np.hanning(31) / np.hanning(31).sum(), mode="same")
    return np.fft.irfft(X * m, n=len(x))


def norm(x):
    p = np.max(np.abs(x)) or 1
    return x / p


def put(x, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N:
        return
    x = x[: N - i]
    gl = gain * np.sqrt((1 - pan) / 2) * np.sqrt(2)
    gr = gain * np.sqrt((1 + pan) / 2) * np.sqrt(2)
    L[i : i + len(x)] += x * gl
    R[i : i + len(x)] += x * gr


def env(n, a, d, curve=4.0):
    """attack seconds, exp decay seconds."""
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-4), np.exp(-(t - a) / max(d, 1e-4) * curve / 4))
    return e


def adsr(n, a, r):
    t = np.arange(n) / SR
    d = n / SR
    return np.clip(np.minimum(t / max(a, 1e-4), (d - t) / max(r, 1e-4)), 0, 1)


# ---------------- instruments ----------------
def thud(f0=58, f1=36, d=0.55, click=0.25):
    t = t_(d)
    fr = f1 + (f0 - f1) * np.exp(-t * 18)
    ph = 2 * np.pi * np.cumsum(fr) / SR
    x = np.sin(ph) * np.exp(-t * 7)
    n = band(rng.standard_normal(len(t)), 200, 3000) * np.exp(-t * 80)
    return norm(x + click * norm(n))


def boom(d=2.6):
    t = t_(d)
    fr = 30 + 30 * np.exp(-t * 6)
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 1.6)
    n = band(rng.standard_normal(len(t)), 20, 220) * np.exp(-t * 2.2)
    return norm(x + 0.6 * norm(n))


def whoosh(d=0.7, lo=300, hi=6000, peak=0.6):
    t = t_(d)
    n = rng.standard_normal(len(t))
    e = np.where(t < d * peak, (t / (d * peak)) ** 2, np.exp(-(t - d * peak) * 9))
    a = band(n, lo, lo * 3) * np.clip(1 - t / d * 1.3, 0, 1)
    b = band(n, lo * 3, hi) * np.clip(t / d * 1.4, 0, 1)
    return norm((a + b) * e)


def tick(f=3200, d=0.05):
    t = t_(d)
    return norm(np.sin(2 * np.pi * f * t) * np.exp(-t * 120) + 0.4 * band(rng.standard_normal(len(t)), 3000, 9000) * np.exp(-t * 200))


def beep(f, d=0.1):
    t = t_(d)
    x = np.sin(2 * np.pi * f * t) + 0.15 * np.sin(2 * np.pi * 2 * f * t)
    return x * adsr(len(t), 0.005, 0.03)


def clank():
    t = t_(0.5)
    x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, a, k in [(523, 1, 9), (1371, 0.6, 14), (2210, 0.4, 20), (3300, 0.2, 30)])
    return norm(x + 0.3 * band(rng.standard_normal(len(t)), 2000, 8000) * np.exp(-t * 90))


def hiss(d):
    t = t_(d)
    return norm(band(rng.standard_normal(len(t)), 1800, 11000)) * adsr(len(t), 0.08, d * 0.5)


def riser(d):
    t = t_(d)
    n = rng.standard_normal(len(t))
    x = np.zeros_like(t)
    k = 5
    for i in range(k):
        lo = 200 * (2 ** i)
        seg = band(n, lo, lo * 2)
        w = np.clip((t / d) * k - i, 0, 1)
        x += seg * w
    tone = np.sin(2 * np.pi * np.cumsum(110 + 330 * (t / d) ** 2) / SR) * 0.35
    return norm(x * (t / d) ** 1.5 + tone * (t / d))


def note(f, d, a=0.6, r=0.8, partials=((1, 1), (2, 0.35), (3, 0.18), (4, 0.08))):
    t = t_(d)
    x = sum(g * (np.sin(2 * np.pi * f * k * t) + np.sin(2 * np.pi * f * k * 1.004 * t + 1.3)) for k, g in partials)
    return x * adsr(len(t), a, r)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)



# ---------------- extra instruments ----------------
def ring(d=1.6):
    """phone ringtone: two-tone marimba-ish pattern + vibration buzz"""
    out = np.zeros(int(d * SR))
    seq = [(1318.5, 0.0), (1046.5, 0.14), (1318.5, 0.28), (1568, 0.42)]
    for f0, s in seq:
        x = np.sin(2 * np.pi * f0 * t_(0.22)) * np.exp(-t_(0.22) * 18)
        i = int(s * SR)
        out[i : i + len(x)] += x
    vt = t_(d)
    buzz = band(rng.standard_normal(len(vt)), 120, 260) * (np.sin(2 * np.pi * 0.0 * vt) + 1) * ((vt % 0.8) < 0.5)
    return norm(out) * 0.8 + norm(buzz) * 0.35


def siren(d):
    tt = t_(d)
    f = np.where((tt % 0.7) < 0.35, 960, 760)
    ph = np.cumsum(f) / SR
    x = np.sign(np.sin(2 * np.pi * ph)) * 0.4 + np.sin(2 * np.pi * ph)
    return band(x, 300, 3000) * adsr(len(tt), 0.05, 0.2)


def rattle(d=0.9):
    """steel shutter rattle"""
    tt = t_(d)
    x = rng.standard_normal(len(tt)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 22 * tt)))
    return norm(band(x, 400, 5000)) * adsr(len(tt), 0.01, 0.5)


def click(f=4000, d=0.03):
    return norm(band(rng.standard_normal(int(d * SR)), f * 0.5, f * 2)) * np.exp(-t_(d) * 120)


def crackle(d, dens=40):
    x = np.zeros(int(d * SR))
    for _ in range(int(d * dens)):
        i = rng.integers(0, len(x) - 400)
        x[i : i + 400] += rng.standard_normal(400) * np.exp(-np.arange(400) / 60) * rng.uniform(0.2, 1)
    return norm(band(x, 800, 9000))


def buzzhum(d, f0=100):
    tt = t_(d)
    x = np.sin(2 * np.pi * f0 * tt) + 0.6 * np.sin(2 * np.pi * 2 * f0 * tt) + 0.3 * np.sign(np.sin(2 * np.pi * f0 * tt))
    return norm(x) * adsr(len(tt), 0.3, 0.3)


S = lambda k: CUT[k]  # scene start (s)

# ---------------- score: dark pad Dm - Bb - F - C ----------------
BAR = 2.4
chords = [[50, 57, 62, 65], [46, 53, 58, 62], [41, 53, 57, 60], [48, 55, 60, 64]]
pad = np.zeros(N)
for b in range(int(DUR / BAR) + 1):
    for m in chords[b % 4]:
        x = note(hz(m), BAR + 0.9, a=0.9, r=1.0)
        i = int(b * BAR * SR)
        x = x[: max(0, N - i)]
        pad[i : i + len(x)] += x
pad = norm(band(pad, 40, 1800))
tt = np.arange(N) / SR
pad_g = np.interp(
    tt,
    [0, 1.5, S("call") - 0.2, S("call"), S("arrive"), S("proof") - 0.3, S("proof"), S("turn"), S("turn") + 1, S("product"), S("hero"), S("hero") + 2, Q["fk"], DUR],
    [0.12, 0.35, 0.5, 0.0, 0.0, 0.55, 0.15, 0.15, 0.0, 0.5, 0.6, 0.35, 0.7, 0],
)
L += pad * pad_g * 0.32
R += pad * pad_g * 0.32

drone = norm(np.sin(2 * np.pi * 36.7 * tt) + 0.5 * np.sin(2 * np.pi * 55 * tt + 0.7))
drone_g = np.interp(tt, [0, 1, S("arrive"), S("proof"), S("turn"), S("product"), Q["fk"], DUR], [0.14, 0.22, 0.3, 0.32, 0.12, 0.18, 0.1, 0])
L += drone * drone_g
R += drone * drone_g

# heartbeat pulse through the problem half
hb = 5.4
while hb < S("turn") - 0.3:
    if not (S("call") <= hb < S("call") + 1.6):
        put(thud(50, 32, 0.3, 0.0), hb, 0.3)
        put(thud(44, 30, 0.3, 0.0), hb + 0.17, 0.18)
    hb += 0.75 if hb < S("arrive") else 0.55

# ---------------- 1 hook ----------------
put(buzzhum(5.0, 50) , 0.0, 0.05)  # fridge hum behind the shutter
for k in range(3):
    put(beep(2200, 0.03), 1.75 + k * 1.75, 0.035, 0.3)  # inverter LED blink
put(whoosh(2.4, 90, 2500, 0.7), Q["andar"] - 0.6, 0.3)
put(thud(60, 36, 0.5), Q["andar"] + 0.5, 0.4)  # KYA

# ---------------- 2 inside ----------------
put(whoosh(0.9, 200, 7000, 0.6), S("inside") - 0.4, 0.35)
put(buzzhum(S("call") - S("inside"), 50), S("inside"), 0.08)
put(thud(60, 36, 0.5), Q["lekinAndar"] + 0.9, 0.4)  # NAHI
for k in ("fridge", "inverter", "board"):
    put(whoosh(0.45, 400, 7000, 0.6), Q[k] - 0.2, 0.22)
    put(tick(2200, 0.04), Q[k] + 0.1, 0.07)
put(thud(60, 36, 0.5), Q["chaarPlug"], 0.42)
eb = t_(S("call") - Q["inmein"])
put(buzzhum(len(eb) / SR, 100) * np.linspace(0.2, 1, len(eb)), Q["inmein"], 0.07)  # electrical buzz rising
put(crackle(S("call") - Q["garam"], 12), Q["garam"], 0.08)
put(riser(1.8), S("call") - 1.9, 0.3)

# ---------------- 3 call ----------------
put(boom(1.6), S("call") + 0.05, 0.5)
for k in range(3):
    put(ring(1.6), Q["raat"] + k * 1.6, 0.16 - k * 0.02, -0.1)
put(whoosh(0.9, 100, 3000, 0.7), Q["bhai"] - 0.2, 0.3)
put(thud(60, 36, 0.5), Q["dhuaan"], 0.45)
put(crackle(S("arrive") - Q["bhai"], 30), Q["bhai"], 0.06)

# ---------------- 4 arrive ----------------
steps = Q["asli"] - 0.3
while steps < Q["jam"] - 0.2:  # running footsteps
    put(thud(110, 60, 0.12, 0.6), steps, 0.18, 0.2 if int(steps * 4) % 2 else -0.2)
    steps += 0.32
put(crackle(Q["gali"] - S("arrive"), 60), S("arrive"), 0.12)
put(thud(56, 34, 0.6), Q["asli"] + 0.5, 0.42)  # JHATKA
put(rattle(1.0), Q["jam"] + 0.1, 0.32)
put(rattle(0.8), Q["jam"] + 1.0, 0.24, 0.2)
put(thud(50, 30, 0.6), Q["jam"] + 0.47, 0.5)  # JAM
put(whoosh(1.2, 120, 4000, 0.6), Q["gali"] - 0.4, 0.3)
put(siren(S("proof") - Q["gali"]) * np.linspace(0.3, 1, int((S("proof") - Q["gali"]) * SR)), Q["gali"], 0.06, 0.3)  # tender far away
put(thud(56, 34, 0.6), Q["gali"] + 0.33, 0.42)  # TANG

# ---------------- 5 proof ----------------
put(boom(1.4), S("proof"), 0.4)
put(hiss(2.5), S("proof"), 0.06)
put(tick(1400, 0.05), Q["insurance"] + 0.6, 0.08)
for k in range(3):
    put(click(2500), Q["insurance"] + 0.75 + k * 0.28, 0.08)  # stamp / pen ticks
put(thud(56, 34, 0.7), Q["saboot"], 0.5)

# ---------------- 6 turn: rewind ----------------
rw = t_(0.8)
sweep = np.sin(2 * np.pi * np.cumsum(1800 - 1500 * (rw / 0.8)) / SR) * adsr(len(rw), 0.02, 0.3)
put(norm(band(rng.standard_normal(len(rw)), 300, 5000)) * adsr(len(rw), 0.05, 0.4) * 0.6 + sweep * 0.3, S("turn"), 0.32)
put(beep(880, 0.08), Q["jaag"] + 0.15, 0.1)
put(beep(1320, 0.12), Q["jaag"] + 0.25, 0.1)
put(riser(1.4), S("product") - 1.5, 0.28)

# ---------------- 7 product ----------------
put(whoosh(1.0, 150, 4000, 0.7), S("product") - 0.1, 0.35)
mt2 = t_(1.6)
put(norm(sum(np.sin(2 * np.pi * f * mt2) * g for f, g in [(196, 1), (294, 0.5), (392, 0.3)])) * (mt2 / 1.6) ** 1.5 * adsr(len(mt2), 0.01, 0.3), Q["ceiling"], 0.14)
put(thud(56, 34, 0.7, 0.1), Q["protector"], 0.45)
put(thud(56, 34, 0.6, 0.1), Q["jaagta"], 0.35)

# ---------------- 8 system ----------------
put(crackle(Q["suppression"] + 1.5 - S("system"), 35), S("system"), 0.08)
for k in ("flame", "heat", "gas"):
    put(tick(2400, 0.035), Q[k], 0.08)
    put(beep(1320, 0.05), Q[k] + 0.05, 0.05, 0.2)
put(beep(880), Q["confirm"] + 0.3, 0.12)
put(beep(1320), Q["confirm"] + 0.43, 0.12)
put(siren(Q["pehle"] - Q["siren"] - 0.2), Q["siren"], 0.13, 0.15)
put(hiss(Q["pehle"] - Q["suppression"]), Q["suppression"], 0.22)
put(thud(50, 32, 0.8, 0.0), Q["suppression"], 0.36)
put(norm(band(rng.standard_normal(int(0.5 * SR)), 300, 5000)) * adsr(int(0.5 * SR), 0.02, 0.3), Q["pehle"] - 0.25, 0.22)  # rewind
put(click(5000, 0.02), Q["photo"], 0.4)
put(click(2500, 0.05), Q["photo"] + 0.08, 0.3)
put(thud(56, 34, 0.6), Q["wahiSaboot"] + 0.2, 0.4)

# ---------------- 9 alert ----------------
put(whoosh(0.8, 200, 5000, 0.6), S("alert") - 0.3, 0.3)
put(beep(1568, 0.1), Q["alert"], 0.12, -0.1)
put(beep(2093, 0.16), Q["alert"] + 0.11, 0.12, -0.1)
put(thud(56, 34, 0.6), Q["alert"] + 0.4, 0.4)

# ---------------- 10 hero ----------------
put(click(1800, 0.06), Q["taala"] - 0.1, 0.3)  # padlock clack
put(thud(70, 40, 0.4), Q["taala"], 0.4)
put(boom(1.4), Q["aagKo"], 0.5)
put(whoosh(2.0, 100, 3000, 0.3), Q["fk"] - 0.6, 0.3)
put(boom(3.0), Q["fk"], 0.85)
put(thud(52, 30, 1.2, 0.2), Q["fk"], 0.45)
et = t_(5.0)
tone = (np.sin(2 * np.pi * 73.4 * et) + 0.5 * np.sin(2 * np.pi * 110 * et) + 0.25 * np.sin(2 * np.pi * 146.8 * et)) * adsr(len(et), 0.4, 2.8)
put(norm(tone), Q["fk"], 0.28)
put(beep(2637, 0.5) * np.exp(-t_(0.5) * 6), Q["fk"] + 0.4, 0.05, 0.3)
put(beep(1568, 0.08), Q["bhejiye"], 0.08, 0.2)
put(beep(2093, 0.12), Q["bhejiye"] + 0.09, 0.08, 0.2)

# ---------------- out ----------------
mix = np.stack([L, R], axis=1)
fade = np.ones(N)
fo = int(0.5 * SR)
fade[-fo:] = np.linspace(1, 0, fo)
mix *= fade[:, None]
mix /= max(1e-6, np.max(np.abs(mix))) / 0.89
pcm = (mix * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", sys.argv[1], round(DUR, 2), "s")
