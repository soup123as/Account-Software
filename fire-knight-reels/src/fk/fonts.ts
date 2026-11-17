import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FONT } from "./theme";

const faces: { family: string; file: string; weight: string }[] = [
  { family: FONT.display, file: "anton-latin-400-normal.woff2", weight: "400" },
  { family: FONT.sans, file: "dm-sans-latin-400-normal.woff2", weight: "400" },
  { family: FONT.sans, file: "dm-sans-latin-500-normal.woff2", weight: "500" },
  { family: FONT.sans, file: "dm-sans-latin-600-normal.woff2", weight: "600" },
  { family: FONT.sans, file: "dm-sans-latin-700-normal.woff2", weight: "700" },
];

// loadFont() holds the render (delayRender) until every face is ready,
// so no frame is ever drawn in a fallback font.
export const fontsReady = Promise.all(
  faces.map((f) =>
    loadFont({ family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, display: "block" }),
  ),
);
