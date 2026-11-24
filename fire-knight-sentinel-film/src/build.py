"""Assemble index.html: film source + static SVG art + embedded brand fonts."""
import base64, json, os

here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(here)
fonts_dir = os.path.join(root, "..", "fire-knight-reels", "public", "fonts")
faces = [("FK Anton", 400, "anton-latin-400-normal.woff2"), ("FK DM Sans", 500, "dm-sans-latin-500-normal.woff2"),
         ("FK DM Sans", 600, "dm-sans-latin-600-normal.woff2"), ("FK DM Sans", 700, "dm-sans-latin-700-normal.woff2")]
css = ""
for fam, w, f in faces:
    b = base64.b64encode(open(os.path.join(fonts_dir, f), "rb").read()).decode()
    css += f'@font-face{{font-family:"{fam}";font-weight:{w};font-style:normal;font-display:block;src:url(data:font/woff2;base64,{b}) format("woff2")}}\n'
art = json.load(open(os.path.join(root, "art", "art.json")))
bus = json.load(open(os.path.join(root, "art", "bus.json")))
import re
art["pov"] = re.sub(r'<rect[^>]*fill="#e6e6e6"[^>]*></rect>', "", art["pov"])
FINGER = '<g id="hand" transform="translate(700 1250)"><path d="M26 34 L640 470" stroke="#000" stroke-width="118" stroke-linecap="round" opacity="0.32"></path><path d="M330 236 L760 540" stroke="#3a2416" stroke-width="250" stroke-linecap="round"></path><path d="M-23.1 32.7 A40 40 0 0 1 23.1 -32.7 L656.7 387.8 L585.1 489.2 Z" fill="#6b4429"></path><path d="M-6 -22 L600 404" stroke="#8a5a38" stroke-width="22" stroke-linecap="round" opacity="0.55"></path><path d="M20 34 L640 470" stroke="#2c1a0f" stroke-width="26" stroke-linecap="round" opacity="0.4"></path><ellipse cx="22" cy="12" rx="30" ry="24" transform="rotate(35 22 12)" fill="#d9a988" opacity="0.5"></ellipse><path d="M150 74 L128 112 M168 86 L146 124 M300 180 L276 222" stroke="#2a180e" stroke-width="5" stroke-linecap="round" opacity="0.5"></path></g>'
art["dash"], n_hand = re.subn(r'<g id="hand".*?</g>', FINGER, art["dash"], count=1, flags=re.S)
assert n_hand == 1
t = open(os.path.join(here, "film.src.html")).read()
rep = {"/*__FONTS__*/": css, "__AISLE_MIRROR__": art["aisleMirror"], "__AISLE_EXT__": art["aisleExt"], "__AISLE_HAZE__": art["aisleHaze"],
       "__ENGINE__": art["engine"], "__BATTERY__": art["battery"], "__DASH__": art["dash"], "__POV__": art["pov"],
       "__BUS_XRAY__": bus["xray"], "__BUS_DOOR__": bus["door"], "__BUS_BODY__": bus["body"]}
for k, v in rep.items():
    assert k in t, k
    t = t.replace(k, v)
open(os.path.join(root, "index.html"), "w").write(t)
print("index.html", len(t) // 1024, "KB")
