/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// Cloud container: Remotion cannot download its own Chrome (remotion.media is blocked),
// so use the pre-installed Chromium headless shell when it exists.
import fs from "node:fs";
const LOCAL_CHROME =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (fs.existsSync(LOCAL_CHROME)) {
  Config.setBrowserExecutable(LOCAL_CHROME);
}
Config.setChromiumOpenGlRenderer("angle");
