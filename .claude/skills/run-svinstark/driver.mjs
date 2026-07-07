// Batch driver for svinstark (Next.js PWA). Starts the dev server, opens a
// headless Chromium page against it, and runs a script of commands piped in
// via stdin - one per line, in order. Designed to be used like chromium-cli:
// `node driver.mjs <<'EOF' ... EOF`.
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

const APP_DIR = path.resolve(import.meta.dirname, "../../..");
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const SHOT_DIR = process.env.SCREENSHOT_DIR || path.join(os.tmpdir(), "svinstark-shots");
fs.mkdirSync(SHOT_DIR, { recursive: true });

let devServer = null;
let browser = null;
let page = null;
const consoleErrors = [];

process.on("unhandledRejection", (err) => {
  fs.writeSync(2, `UNHANDLED REJECTION: ${err?.stack || err}\n`);
});
process.on("uncaughtException", (err) => {
  fs.writeSync(2, `UNCAUGHT EXCEPTION: ${err?.stack || err}\n`);
});

async function waitForServer(timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok || res.status < 500) return true;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

const COMMANDS = {
  async launch() {
    if (page) return console.log("already launched");

    // Always start a fresh server rather than reusing whatever answers on
    // BASE_URL - a leftover instance from a killed previous run (or a
    // half-compiled one) answers HTTP fine but reliably produced flaky
    // "Page crashed" / 30s navigation timeouts here. See Gotchas in SKILL.md.
    devServer = spawn("npm run dev", {
      cwd: APP_DIR,
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    });
    const logPath = path.join(SHOT_DIR, "dev-server.log");
    const logStream = fs.createWriteStream(logPath);
    devServer.stdout.pipe(logStream);
    devServer.stderr.pipe(logStream);
    console.log("dev server starting, log:", logPath);
    const ok = await waitForServer(30_000);
    if (!ok) return console.log("ERROR: dev server did not come up within 30s, see log");

    // --no-sandbox/--disable-gpu avoid an intermittent "Page crashed" seen on
    // this Windows host with a plain chromium.launch() - see Gotchas in
    // SKILL.md.
    browser = await chromium.launch({ args: ["--no-sandbox", "--disable-gpu"] });
    page = await browser.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(String(err)));
    await page.goto(BASE_URL, { waitUntil: "load" });
    console.log("launched:", BASE_URL);
  },

  async nav(urlPath) {
    if (!page) return console.log("ERROR: launch first");
    await page.goto(new URL(urlPath || "/", BASE_URL).toString(), { waitUntil: "load" });
    console.log("nav ->", page.url());
  },

  async viewport(args) {
    if (!page) return console.log("ERROR: launch first");
    const [width, height] = args.split(/\s+/).map(Number);
    await page.setViewportSize({ width, height });
    console.log("viewport ->", width, "x", height);
  },

  async wait(selector) {
    if (!page) return console.log("ERROR: launch first");
    try {
      await page.waitForSelector(selector, { timeout: 10_000 });
      console.log("found:", selector);
    } catch {
      console.log("TIMEOUT:", selector);
    }
  },

  async "wait-text"(text) {
    if (!page) return console.log("ERROR: launch first");
    try {
      await page.waitForSelector(`text=${text}`, { timeout: 10_000 });
      console.log("found text:", text);
    } catch {
      console.log("TIMEOUT waiting for text:", text);
    }
  },

  async click(selector) {
    if (!page) return console.log("ERROR: launch first");
    try {
      await page.click(selector, { timeout: 5000 });
      console.log("click", selector, "-> OK");
    } catch (e) {
      console.log("click", selector, "-> ERROR:", e.message.split("\n")[0]);
    }
  },

  async "click-text"(text) {
    if (!page) return console.log("ERROR: launch first");
    try {
      await page.click(`button:has-text("${text}")`, { timeout: 5000 });
      console.log("click-text", JSON.stringify(text), "-> OK");
    } catch (e) {
      console.log("click-text", JSON.stringify(text), "-> ERROR:", e.message.split("\n")[0]);
    }
  },

  // Scoped click: finds the OptionSelector group whose label matches
  // `groupLabel` (StartScreen/SettingsDialog render several groups with
  // identically-labelled buttons, e.g. two "Ja"/"Nej" toggles side by side -
  // a plain click-text is ambiguous) and clicks the button with `buttonText`
  // inside that group only.
  async "click-in"(args) {
    if (!page) return console.log("ERROR: launch first");
    const [groupLabel, buttonText] = args.split("|").map((s) => s.trim());
    try {
      const group = page.locator(`text=${groupLabel}`).locator("..");
      await group.locator(`button:has-text("${buttonText}")`).click({ timeout: 5000 });
      console.log("click-in", JSON.stringify(groupLabel), JSON.stringify(buttonText), "-> OK");
    } catch (e) {
      console.log("click-in -> ERROR:", e.message.split("\n")[0]);
    }
  },

  async fill(args) {
    if (!page) return console.log("ERROR: launch first");
    const [selector, ...rest] = args.split(" ");
    await page.fill(selector, rest.join(" "));
    console.log("fill", selector, "-> OK");
  },

  async press(key) {
    if (!page) return console.log("ERROR: launch first");
    await page.keyboard.press(key);
    console.log("press", key, "-> OK");
  },

  async text(selector) {
    if (!page) return console.log("ERROR: launch first");
    const content = selector
      ? await page.locator(selector).first().textContent().catch(() => null)
      : await page.textContent("body");
    console.log(content ?? "(null)");
  },

  async eval(expr) {
    if (!page) return console.log("ERROR: launch first");
    try {
      console.log(JSON.stringify(await page.evaluate(expr)));
    } catch (e) {
      console.log("ERROR:", e.message);
    }
  },

  async ss(name) {
    if (!page) return console.log("ERROR: launch first");
    const file = path.join(SHOT_DIR, `${name || "ss-" + Date.now()}.png`);
    await page.screenshot({ path: file });
    console.log("screenshot:", file);
  },

  async "console-errors"() {
    console.log(consoleErrors.length === 0 ? "no console errors" : consoleErrors.join("\n"));
  },

  async quit() {
    if (browser) await browser.close().catch(() => {});
    if (devServer) {
      // devServer.kill() only signals the immediate child. Because it was
      // spawned with shell:true, that child is cmd.exe wrapping `npm run
      // dev`, which itself wraps the actual `next dev` node process - kill()
      // leaves next dev running and holding the port. taskkill /T kills the
      // whole tree - but it must be awaited: Node's Windows Job Object
      // reaps un-awaited child processes as soon as the driver exits, which
      // otherwise kills taskkill itself mid-run before it reaches the
      // grandchildren, leaving `next dev` orphaned and the port stuck.
      if (process.platform === "win32") {
        await new Promise((resolve) => {
          const killer = spawn("taskkill", ["/PID", String(devServer.pid), "/T", "/F"], { stdio: "ignore" });
          killer.on("exit", resolve);
          killer.on("error", resolve);
        });
      } else {
        devServer.kill();
      }
    }
    browser = null;
    page = null;
    devServer = null;
  },

  help() {
    console.log("commands:", Object.keys(COMMANDS).join(", "));
  },
};

// Not readline: readline's "line" event combined with an async handler that
// defers rl.prompt() via a promise chain silently drops every line after the
// first when stdin is a piped/redirected heredoc (reproduced with a minimal
// repro script - readline stops emitting further "line" events once the
// handler stops calling prompt() synchronously in the same tick). Piped
// batch input is exactly how this driver is used (heredoc of commands, like
// chromium-cli), so read stdin fully up front and process the commands as a
// plain array - no readline involved, no pause/resume ambiguity.
async function main() {
  const input = fs.readFileSync(0, "utf8");
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  console.log('svinstark driver - "help" for commands, "launch" to start');

  for (const line of lines) {
    const spaceIdx = line.indexOf(" ");
    const cmd = spaceIdx === -1 ? line : line.slice(0, spaceIdx);
    const rest = spaceIdx === -1 ? "" : line.slice(spaceIdx + 1);
    console.log("driver>", line);
    const fn = COMMANDS[cmd];
    if (!fn) {
      console.log("unknown:", cmd, "- try: help");
      continue;
    }
    try {
      await fn(rest);
    } catch (e) {
      console.log("ERROR:", e.message);
    }
    if (cmd === "quit") break;
  }

  await COMMANDS.quit();
  // process.exit() right after console.log can truncate unflushed stdout
  // when stdout is a pipe (always true when an agent captures this
  // process's output) - give one event-loop turn for writes to drain.
  await new Promise((r) => setImmediate(r));
  process.exit(0);
}

main();
