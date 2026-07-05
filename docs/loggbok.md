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
| 4   | Exercise Library            | ⬜ Ej påbörjad |
| 5   | Workout Generator           | ⬜ Ej påbörjad |
| 6   | Timer Engine                | ⬜ Ej påbörjad |
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
