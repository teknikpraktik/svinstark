---
name: run-svinstark
description: Build, run, and drive the svinstark Next.js PWA. Use when asked to start svinstark, take a screenshot of it, test the workout generator live, or interact with its UI (StartScreen settings, warmup, workout screen).
---

svinstark is a Next.js 16 (Turbopack dev server) PWA with no test suite -
verifying a change means driving the actual UI. For agent/automated use,
drive it via the batch script `.claude/skills/run-svinstark/driver.mjs`: it
starts the dev server itself, opens a headless Chromium page against it, and
runs a script of commands piped in over stdin (same shape as `chromium-cli`:
`node driver.mjs <<'EOF' ... EOF`).

All paths below are relative to the repo root.

## Prerequisites

None beyond Node (this repo already targets Node via `package.json`). Playwright's
browser binary needs a one-time download (~115MB):

```bash
npx playwright install chromium
```

## Setup

```bash
npm install   # playwright is already a devDependency
```

## Run (agent path)

```bash
node .claude/skills/run-svinstark/driver.mjs <<'EOF'
launch
wait-text Träningstid
click-in Chinsstång | Nej
click-in Stol och bord | Nej
click-in Fria vikter | Nej
click-text Längre
click-text Tufft
click-text STARTA PASS
wait-text JAG ÄR UPPVÄRMD
click-text JAG ÄR UPPVÄRMD
wait-text Total längd
ss my-test
console-errors
quit
EOF
```

This starts `npm run dev` itself (killing it again on `quit`), opens the
StartScreen, sets all three equipment selectors to "Nej", picks Längre/Tufft,
starts the workout, dismisses the warmup screen, and screenshots the resulting
workout screen. Every command echoes its own result line, so you don't need
`capture-pane`-style polling - just read the driver's stdout top to bottom.

All settings live inline on the StartScreen (there is no settings dialog or
"Inställningar" button). The `OptionSelector` groups and their buttons:
Träningstid (Kortare/Standard/Längre), Intensitet (Lugnt/Normalt/Tufft),
Chinsstång (Ja/Nej), Stol och bord (Ja/Nej), Fria vikter (Nej/Lätta/Tunga).

Screenshots and the dev server log land in `%TEMP%\svinstark-shots\` (override
with `SCREENSHOT_DIR`). `BASE_URL` overrides the default `http://localhost:3000`.

`next-pwa` disables the service worker in development (`disable: process.env.NODE_ENV === "development"`
in `next.config.ts`) - PWA-specific checks (service worker registration,
`beforeinstallprompt`, install banner) need a production server instead:

```bash
npm run build
DEV_SERVER_CMD="npm run start" node .claude/skills/run-svinstark/driver.mjs <<'EOF'
launch
...
EOF
```

### Commands

| command | what it does |
|---|---|
| `launch` | start a fresh dev server, launch Chromium, navigate to it |
| `nav <path>` | go to `<path>` (relative to `BASE_URL`) |
| `viewport <width> <height>` | resize the page (e.g. `viewport 390 844` for a phone-sized check) |
| `init-script <js>` | run `<js>` before the next navigation (e.g. spoof `navigator.userAgent` or `matchMedia`) - follow with `nav` to apply |
| `wait <css-selector>` | wait up to 10s for a selector |
| `wait-text <text>` | wait up to 10s for text anywhere on the page |
| `click <css-selector>` | click via Playwright locator |
| `click-text <text>` | click the first `<button>` containing exact text |
| `click-in <group-label> \| <button-text>` | within the `OptionSelector`/toggle group labelled `<group-label>`, click the button labelled `<button-text>` - see Gotchas |
| `fill <selector> <text>` | fill an input |
| `press <key>` | keyboard press (e.g. `Enter`) |
| `text [selector]` | print `innerText`/`textContent` (body if no selector) |
| `eval <js-expr>` | `page.evaluate`, prints JSON |
| `ss [name]` | screenshot → `<SHOT_DIR>/<name>.png` |
| `console-errors` | print browser console errors / page errors collected so far |
| `quit` | close the browser and kill the dev server (whole process tree) |

The script always ends by killing the dev server, even if you don't put
`quit` as the last line.

## Run (human path)

```bash
npm run dev   # http://localhost:3000, Ctrl-C to stop
```

## Test

No test suite exists (`npm run lint` and `npx tsc --noEmit` are the only
automated checks). Verifying generator/UI changes means driving the app per
above.

## Gotchas

- **`click-text "Ja"` / `click-text "Nej"` is ambiguous.** The StartScreen
  renders three equipment groups whose buttons share text (Chinsstång and
  Stol och bord are both Ja/Nej; Fria vikter also has a Nej). Use
  `click-in <label> | <button-text>` instead, which scopes the click to the
  `OptionSelector` group whose label matches `<label>` (it walks up one
  parent from the label text node).
- **`waitUntil: "networkidle"` never resolves.** Next's dev server keeps an
  HMR websocket open indefinitely, so Playwright's networkidle condition
  never triggers (30s timeout every time) even though the page finishes
  rendering in under a second. The driver uses `waitUntil: "load"` plus
  explicit `wait-text` calls instead.
- **A leftover/half-compiled dev server answers HTTP but crashes the page.**
  Reusing whatever answers on `BASE_URL` (instead of always spawning fresh)
  produced intermittent Playwright "Page crashed" errors and 30s navigation
  timeouts on this host. `launch` always starts its own server rather than
  detecting an existing one.
- **`chromium.launch()` intermittently crashed the page on this Windows
  host.** Passing `args: ["--no-sandbox", "--disable-gpu"]` fixed it.
- **Killing the dev server needs `taskkill /T`, and it must be awaited.**
  It's spawned as `npm run dev` under `shell:true`, which on Windows is
  cmd.exe → npm-cli.js (node) → `next dev` (node) → the actual server
  process (node) - four processes deep. Plain `child.kill()` only signals
  the top cmd.exe and leaves the real server running and the port stuck.
  `taskkill /PID <pid> /T /F` kills the whole tree, but firing it without
  awaiting its exit lets Node's Windows Job Object reap the still-running
  `taskkill` process the moment the driver itself exits, killing `taskkill`
  before it reaches the grandchildren.
- **Don't drive this with `readline`'s `"line"` event.** An `async (line) =>
  {...}` handler that defers `rl.prompt()` behind a promise silently drops
  every line after the first when stdin is a piped heredoc (reproduced with
  a 5-line minimal script - only line 1 ever fired). The driver instead
  reads all of stdin up front (`fs.readFileSync(0, "utf8")`) and processes
  the commands as a plain array.
- **The warmup screen is unconditional.** `useWorkout`'s `start()` always
  transitions to `screen === "warmup"` regardless of settings - after
  `click-text STARTA PASS` always expect and dismiss `JAG ÄR UPPVÄRMD`
  before the workout screen appears.

## Troubleshooting

- **`spawn EINVAL` from the dev server:** happened when spawning `npm.cmd`
  directly with an args array on Windows. Fixed by spawning the whole
  command as one string (`"npm run dev"`) with `shell: true`.
- **Driver hangs then exits 0 with only the first command's output
  visible:** you're looking at the pre-fix readline bug above (already
  fixed in this driver) - if it recurs, verify `main()` at the bottom of
  `driver.mjs` still reads stdin via `fs.readFileSync(0, ...)`, not
  `readline`.
- **Port 3000 still bound after `quit`:** check for orphaned `node.exe`
  processes (`Get-Process node` in PowerShell) and confirm the `taskkill`
  call in `quit()` is still `await`ed, not fire-and-forget.
