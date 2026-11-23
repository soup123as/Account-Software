"""Assemble the single-file deliverable: template + bus SVG layers + embedded brand fonts -> index.html"""
import base64, json, os
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.dirname(here)
fonts_dir = os.path.join(root, "..", "fire-knight-reels", "public", "fonts")
faces = [("FK Anton", 400, "anton-latin-400-normal.woff2"), ("FK DM Sans", 500, "dm-sans-latin-500-normal.woff2"),
         ("FK DM Sans", 600, "dm-sans-latin-600-normal.woff2"), ("FK DM Sans", 700, "dm-sans-latin-700-normal.woff2")]
css = ""
for fam, w, f in faces:
    b = base64.b64encode(open(os.path.join(fonts_dir, f), "rb").read()).decode()
    css += f'@font-face{{font-family:"{fam}";font-weight:{w};font-style:normal;font-display:block;src:url(data:font/woff2;base64,{b}) format("woff2")}}\n'
bus = json.load(open(os.path.join(here, "bus.json")))
t = open(os.path.join(here, "template.html")).read()
t = t.replace("/*__FONTS__*/", css).replace("__XRAY__", bus["xray"]).replace("__DOOR__", bus["door"]).replace("__BODY__", bus["body"])
open(os.path.join(root, "index.html"), "w").write(t)
print("index.html", len(t) // 1024, "KB")
