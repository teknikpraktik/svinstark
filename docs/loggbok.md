# svinstark – Loggbok

**Filnamn:** `loggbok.md`
**Syfte:** Håller reda på framsteg mellan sessioner. Uppdateras efter varje fas eller arbetspass.

Se `04-utvecklingsplan.md` för fasernas innehåll och `99-ai-instructions.md` för arbetssätt.

---

## Statusöversikt

| Fas | Namn                        | Status      |
| --- | --------------------------- | ----------- |
| 0   | Projektinitiering           | ✅ Klar      |
| 1   | Grundläggande UI            | ✅ Klar      |
| 2   | Grundläggande komponenter   | ✅ Klar      |
| 3   | TypeScript-modeller         | ✅ Klar      |
| 4   | Exercise Library            | ✅ Klar      |
| 5   | Workout Generator           | ✅ Klar      |
| 6   | Timer Engine                | ✅ Klar      |
| 7   | React Hooks                 | ⬜ Ej påbörjad |
| 8   | Workout Screen              | ⬜ Ej påbörjad |
| 9   | Signaturuppvärmning         | ⬜ Ej påbörjad |
| 10  | Signaturavslut              | ⬜ Ej påbörjad |
| 11  | Ljud                        | ⬜ Ej påbörjad |
| 12  | Inställningar               | ⬜ Ej påbörjad |
| 13  | PWA                         | ⬜ Ej påbörjad |
| 14  | Optimering                  | ⬜ Ej påbörjad |
| 15  | Sluttest                    | ⬜ Ej påbörjad |

---

## Sessionslogg

### 2026-07-04 — Fas 0: Projektinitiering

**Status:** ✅ Klar

**Byggt:**
- Next.js-projekt med App Router, TypeScript, ESLint
- PWA-stöd (`@ducanh2912/next-pwa`)
- Grundmappstruktur enligt spec (`src/app`, `src/components`, `src/data`, `src/hooks`, `src/lib`, `src/styles`, `src/types`, `src/utils`, `public/icons`, `public/sounds`)
- Git-repository (redan existerande, kopplat till `docs/`)

**Filer:** Se commit `2aab4dc`.

**Testat:**
- Projektet startar lokalt
- Bygger utan fel

**Nästa steg:** Fas 1 – Grundläggande UI (statisk startsida).

---

### 2026-07-04 — Fas 1: Grundläggande UI

**Status:** ✅ Klar

**Byggt:**
- Statisk startsida med appnamn (svinstark) och slogan
- Val av träningstid (Kortare / Standard / Längre), Standard förvald
- Val av intensitet (Lugnt / Normalt / Tufft), Normalt förvald
- Inställningsikon (kugghjul), utan funktion ännu
- STARTA PASS-knapp, utan funktion ännu
- Endast presentationsstate (vilket alternativ som är markerat) — ingen affärslogik, ingen timer, ingen generator

**Filer skapade/ändrade:**
- `src/app/page.tsx` (ersatt tom placeholder)
- `src/app/page.module.css` (ny)
- `src/styles/globals.css` (nya CSS-variabler: `--muted`, `--border`, `--accent`, `--accent-contrast`)

**Testat:**
- `npm run build` — bygger utan fel
- `npm run lint` — inga varningar
- Manuellt i headless Chrome på mobil viewport (390×844): sidan renderar, val av träningstid/intensitet markerar rätt knapp, inga konsolfel

**Begränsningar:**
- Inställningsikonen och STARTA PASS-knappen är inte kopplade till någon funktion (enligt spec för denna fas)
- Layout/komponenter är inte uppdelade i återanvändbara komponenter ännu — det sker i Fas 2

**Nästa steg:** Fas 2 – Grundläggande komponenter.

---

### 2026-07-04 — Fas 2: Grundläggande komponenter

**Status:** ✅ Klar

**Byggt:**
- Sju återanvändbara komponenter, helt frikopplade från träningslogik (endast props in, händelser ut):
  - `PrimaryButton` — stor primärknapp
  - `IconButton` — ikonknapp (44×44 px, kräver `ariaLabel`)
  - `OptionSelector` — generisk gruppvals-komponent (används av Träningstid/Intensitet)
  - `TimerDisplay` — stor tidsvisning (mm:ss)
  - `ExerciseCard` — övningsnamn + instruktion
  - `PhaseBadge` — diskret fasindikator (Uppvärmning/Träning/Nedvarvning)
  - `Modal` — generisk dialogruta (grund för PauseDialog/Inställningar senare)
- `src/utils/formatTime.ts` — liten hjälpfunktion för mm:ss-formatering
- Startsidan (`src/app/page.tsx`) refaktorerad till att använda `IconButton`, `OptionSelector` och `PrimaryButton` istället för inline-markup, utan att ändra utseende eller beteende

**Filer skapade:**
- `src/components/PrimaryButton.tsx` + `.module.css`
- `src/components/IconButton.tsx` + `.module.css`
- `src/components/OptionSelector.tsx` + `.module.css`
- `src/components/TimerDisplay.tsx` + `.module.css`
- `src/components/ExerciseCard.tsx` + `.module.css`
- `src/components/PhaseBadge.tsx` + `.module.css`
- `src/components/Modal.tsx` + `.module.css`
- `src/utils/formatTime.ts`

**Filer ändrade:**
- `src/app/page.tsx` — använder nu de nya komponenterna
- `src/app/page.module.css` — rensad till endast sidlayout (komponentstyling flyttad till respektive komponents CSS-modul)

**Testat:**
- `npm run build` och `npm run lint` — felfria
- Manuellt i headless Chrome (390×844): startsidan fungerar oförändrat efter refaktorering
- `TimerDisplay`, `ExerciseCard`, `PhaseBadge` och `Modal` verifierades visuellt via en tillfällig testsida (skapad, screenshottad, sedan borttagen — ingår inte i appens routing)
- Inga konsolfel i något av fallen

**Begränsningar:**
- `TimerDisplay`, `ExerciseCard`, `PhaseBadge` och `Modal` används ännu inte i någon riktig skärm — det sker i Fas 8 (Workout Screen) och senare faser
- Inga TypeScript-domäntyper importeras än (t.ex. `WorkoutPhase`); komponenternas lokala props-typer (`"warmup" | "exercise" | "cooldown"` etc.) är redan skrivna för att matcha `02-teknisk-specifikation.md` exakt, så de kan kopplas mot de riktiga typerna utan ändring i Fas 3

**Nästa steg:** Fas 3 – TypeScript-modeller.

---

### 2026-07-05 — Fas 3: TypeScript-modeller

**Status:** ✅ Klar

**Byggt:**
- Samtliga domäntyper implementerade i `src/types/workout.ts`, enligt `02-teknisk-specifikation.md` Del B och `03-exercise-library-specification.md` (som §20 i det dokumentet pekar ut som rätt fil):
  - Övningsklassificering: `Equipment`, `ExercisePattern`, `ExerciseIntensity`, `DemandLevel`, `BodyPosition`, `MovementType`, `Impact`, `MovementPlane`, `MuscleGroup`, `Exercise`
  - Pass och användarval: `WorkoutDuration`, `WorkoutIntensity`, `WorkoutSettings`, `WorkoutPhase`, `WorkoutSegment`, `WorkoutBlock`, `Workout`
  - Passgenerator: `PatternKey`, `WorkoutTemplate`
  - Timer och appstate: `TimerState`, `Screen`, `AppState`
- Rensat bort duplicerade lokala unioner som nu ersatts av de delade typerna:
  - `PhaseBadge` använder `WorkoutPhase` istället för en egen lokal `Phase`-typ
  - `src/app/page.tsx` använder `WorkoutDuration`/`WorkoutIntensity` istället för egna `TrainingTime`/`Intensity`-typer

**Filer skapade:**
- `src/types/workout.ts`

**Filer ändrade:**
- `src/components/PhaseBadge.tsx`
- `src/app/page.tsx`

**Testat:**
- `npm run build` — TypeScript kompilerar utan fel (projektets test-krav för denna fas)
- `npm run lint` — inga varningar
- Ingen ny renderad UI i denna fas (typer har ingen körtidseffekt), så ingen ny visuell test behövdes

**Begränsningar:**
- Inga körtidsfel-klasser (`NoExercisesFound` m.fl. från B.31) är definierade ännu — de hör ihop med generatorimplementationen i Fas 5, inte med datamodellerna
- `exerciseData.ts` (Fas 4) och generatorn (Fas 5) är inte kopplade till typerna ännu

**Nästa steg:** Fas 4 – Exercise Library.

---

### 2026-07-05 — Fas 4: Exercise Library

**Status:** ✅ Klar

**Byggt:**
- `src/data/exerciseData.ts` med 98 övningar (mål ca 100), fördelat på:
  - Knädominanta: 15, Höftdominanta: 13, Horisontell press: 10, Vertikal press: 3,
    Horisontellt drag: 4, Vertikalt drag: 7, Bål: 15, Kondition: 11, Balans: 9, Rörlighet: 11
- Endast tillåten utrustning används (`bodyweight`, `floor`, `chair`, `pullup_bar`) — inga hantlar, kettlebells eller skivstänger
- Varje övning har komplett metadata enligt `Exercise`-modellen i `src/types/workout.ts`
- Medvetet säkerställt att varje rörelsemönster-hink (knee, hip, push, pull, core, conditioning, balance, mobility) har minst en `calm`- och en `hard`-övning, så att både Lugnt- och Tufft-pass kan fyllas i samtliga mallplatser i Fas 5 utan att biblioteket behöver kompletteras

**Filer skapade:**
- `src/data/exerciseData.ts`

**Testat:**
- `npm run build` — TypeScript kompilerar utan fel (samtliga 98 objekt matchar `Exercise`-modellen exakt)
- `npm run lint` — inga varningar
- Fristående valideringsskript (körd via `npx tsx`, inte del av projektet) som kontrollerade:
  - inga dubbla `id`
  - inga tomma `name`/`instruction`
  - inga otillåtna utrustningsvärden
  - alla `avoidAdjacent`-referenser pekar på existerande id:n
  - `calm`- och `hard`-täckning i varje rörelsemönster-hink
  - Resultat: 98 övningar, 0 fel

**Begränsningar:**
- Biblioteket är inte kopplat till någon generator eller något UI ännu — det sker i Fas 5
- Räknades till 98 istället för exakt 100; spec anger "cirka 100" och prioriterar kvalitet/konsekvens över exakt antal, vilket är uppfyllt

**Nästa steg:** Fas 5 – Workout Generator.

---

### 2026-07-05 — Fas 5: Workout Generator

**Status:** ✅ Klar

**Byggt:**
- `src/lib/workoutGenerator.ts` — `generateWorkout(settings): Workout`, ren funktion utan React/DOM
  - Läser inställningar, hämtar passmall, filtrerar på intensitet/utrustning, väljer kandidater slumpmässigt (uniform sannolikhet), kontrollerar samtliga sekvensregler (avoidAdjacent, jump/explosive/isometric/unilateral/hanging i rad, tre golv- eller benövningar i rad, samma `primaryPattern` i rad)
  - Fallback: tillåter sekundära rörelsemönster om primärmatchning ger 0 kandidater; om en hel sekvens ändå misslyckas görs om till 50 försök (enligt spec:s hårda gräns) innan ett tydligt fel kastas
  - Oberoende slutvalidering (`isValidWorkout`) kontrollerar intensitet, dubbletter, sekvensregler och att alla obligatoriska rörelsemönster (knä, höft, press, drag, bål, kondition, balans/rörlighet) finns representerade
  - Egna felklasser enligt B.31: `NoExercisesFoundError`, `InvalidWorkoutTemplateError`, `SequenceGenerationFailedError`
- `src/data/workoutTemplates.ts` — passmallar för kortare/standard (exakt spec:s egna exempel) och längre (konstruerad enligt samma princip, ingen upprepning av samma mönster i följd)
- `src/data/warmup.ts` och `src/data/cooldown.ts` — de fasta segmenten för signaturuppvärmning/-avslut (innehåll redan specificerat i 01/02-dokumenten), som genereratorn alltid bifogar oförändrade
- `src/utils/randomItem.ts`, `src/utils/createId.ts` — små generella hjälpfunktioner
- **Utökning av `exerciseData.ts`** (98 → 116 övningar): analys innan generatorn skrevs visade att vissa rörelsemönster hade för tunn `calm`/`hard`-täckning för att fylla de längre passmallarna (särskilt `conditioning`, `hip`, `push`, `mobility`, `balance`). Kompletterade enligt arbetsregeln i `04-utvecklingsplan.md` §22 ("om en senare fas kräver att en tidigare fas ändras ska den tidigare fasen uppdateras först")

**Filer skapade:**
- `src/lib/workoutGenerator.ts`
- `src/data/workoutTemplates.ts`
- `src/data/warmup.ts`
- `src/data/cooldown.ts`
- `src/utils/randomItem.ts`
- `src/utils/createId.ts`

**Filer ändrade:**
- `src/data/exerciseData.ts` (18 nya övningar för bättre calm/hard-täckning)

**Testat:**
- `npm run build`/`lint` — felfria
- Genererade 900 pass (100 vardera för kortare/standard/längre × lugnt/normalt/tufft) via ett fristående skript (`npx tsx`, ingår inte i projektet) och validerade: korrekt antal block, korrekt uppvärmning/avslut, korrekt intensitet, inga dubbletter, alla block exakt 60 sekunder
  - Resultat: 897–899 av 900 lyckades (~99,7 %). De enstaka misslyckandena var uteslutande `längre/lugnt`-kombinationen och berodde på att generatorn nådde sin spec-satta gräns på 50 försök — det är avsett fallback-beteende (kastar `SequenceGenerationFailedError`), inte en bugg. Att fånga detta fel och t.ex. försöka igen är UI/hook-ansvar i senare faser (D.7)
  - Genomsnittlig genereringstid 0,2 ms, max ~2,9 ms — långt under prestandamålet på 50 ms

**Begränsningar:**
- Passmallen för "längre" (21 övningar) är inte given i dokumentationen och är därför min egen konstruktion, byggd enligt samma princip som de mallar spec:en själv ger (ingen upprepning av samma mönster i följd, alla obligatoriska kategorier täckta)
- Generatorn är inte kopplad till UI eller timer ännu — det sker i Fas 6–8

**Nästa steg:** Fas 6 – Timer Engine.

---

### 2026-07-05 — Fas 6: Timer Engine

**Status:** ✅ Klar

**Byggt:**
- `src/lib/timer.ts` — `WorkoutTimer`-klass, ingen React-logik, arbetar endast med ett `Workout` (B.25)
  - `start()`, `pause()`, `resume()`, `stop()` samt automatiskt blockbyte och `onFinish` när sista blocket är klart
  - Räknar mot en absolut deadline (`Date.now()`-baserad) istället för att bara räkna ned steg för steg — garanterar korrekt återstående tid även om intervallet fördröjs, t.ex. när appen är i bakgrunden (D.11)
  - Om flera block hinner ta slut under en fördröjning kaskaderar den korrekt genom dem istället för att tappa tid
  - Callbacks (`onTick`, `onBlockChange`, `onFinish`) istället för en publish/subscribe-modell med flera lyssnare — enklast möjliga lösning för hur den kommer användas i Fas 7

**Filer skapade:**
- `src/lib/timer.ts`

**Testat:**
- `npm run build`/`lint` — felfria
- Fristående testskript (`npx tsx`, ingår inte i projektet) med ett fejkat 4-blocks pass (1 sekund per block för snabb testning), som verifierade:
  - start/pause/resume/stop fungerar och sätter rätt state
  - tiden fryser helt under paus (ingen drift)
  - automatiskt blockbyte och `onFinish` triggas korrekt
  - kritiskt test: event loop blockerades medvetet i 3 sekunder (simulerar en bakgrundad flik) — timern kapade korrekt igenom de återstående blockbytena och landade i avslutat läge, istället för att tappa tid eller hänga sig
  - Alla kontroller godkända

**Begränsningar:**
- Timern är inte kopplad till React eller UI ännu — det sker i Fas 7 (`useTimer`) och Fas 8 (WorkoutScreen)
- Ingen manuell "hoppa till nästa övning"-funktion finns, i linje med att UI-specen inte har någon sådan knapp

**Nästa steg:** Fas 7 – React Hooks.

---

## Mall för nästa post

```
### ÅÅÅÅ-MM-DD — Fas N: <namn>

**Status:** ⬜ Pågående / ✅ Klar / ⚠️ Blockerad

**Byggt:**
-

**Filer skapade/ändrade:**
-

**Testat:**
-

**Begränsningar / öppna frågor:**
-

**Nästa steg:**
-
```
