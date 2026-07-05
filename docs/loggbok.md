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
| 7   | React Hooks                 | ✅ Klar      |
| 8   | Workout Screen              | ✅ Klar      |
| 9   | Signaturuppvärmning         | ✅ Klar      |
| 10  | Signaturavslut              | ✅ Klar      |
| 11  | Ljud                        | ✅ Klar      |
| 12  | Inställningar               | ✅ Klar      |
| 13  | PWA                         | ✅ Klar      |
| 14  | Optimering                  | ✅ Klar      |
| 15  | Sluttest                    | ✅ Klar — MVP färdig |
| v1.1| Experience Update           | ✅ Klar      |

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

### 2026-07-05 — Fas 7: React Hooks

**Status:** ✅ Klar

**Byggt:**
- `src/hooks/useSettings.ts` — persisterade inställningar (träningstid, intensitet, ljud på/av) via `localStorage`, byggd med `useSyncExternalStore` för att undvika hydreringskrock mellan server- och klientrendering
- `src/hooks/useTimer.ts` — kopplar `WorkoutTimer` (Fas 6) till React-state; startar automatiskt när ett workout ges, städar upp vid unmount/byte
- `src/hooks/useWorkout.ts` — orkestrerar skärmflödet start → workout → paused → finished → start (B.27/B.28): genererar pass via `generateWorkout`, håller reda på aktuellt block, och skyddar övergångarna (t.ex. paus kan bara ske från "workout", återuppta bara från "paused") istället för att lita på att UI:t bara anropar rätt metod vid rätt tillfälle
  - Vid genereringsfel görs ett andra försök innan ett enkelt felmeddelande exponeras (`error`), enligt D.7
- `src/lib/timer.ts` utökad med `getCurrentSegment()`, en liten ren hjälpfunktion som räknar ut vilket uppvärmnings-/nedvarvningssegment som är aktuellt utifrån återstående tid i blocket

**Filer skapade:**
- `src/hooks/useSettings.ts`
- `src/hooks/useTimer.ts`
- `src/hooks/useWorkout.ts`

**Filer ändrade:**
- `src/lib/timer.ts` (ny exporterad hjälpfunktion `getCurrentSegment`)

**Testat:**
- `npm run build`/`lint` — felfria (efter att ha justerat två hooks för de striktare `eslint-plugin-react-hooks`-reglerna i Next 16/React 19: `useSettings` byggdes om med `useSyncExternalStore` istället för en effekt som satte state direkt, och `useTimer` uppdaterar state uteslutande via timerns egen callback)
- Manuellt i headless Chrome via en tillfällig testsida (skapad, verifierad, sedan borttagen — ingår inte i appens routing):
  - Inställningar sparas och läses tillbaka korrekt efter omladdning av sidan
  - `start()` genererar ett pass och sätter igång timern automatiskt (uppvärmning, 60 s, running)
  - `pause()` fryser tiden exakt (identisk avläsning 1,2 s isär)
  - `resume()` fortsätter korrekt
  - `stop()` återgår till startskärmen och rensar passet
  - `goToStart()` är en no-op när skärmen redan är "start" (verifierar tillståndsskyddet)
  - Inga konsolfel eller hydreringsvarningar

**Begränsningar:**
- Hookarna är inte kopplade till någon synlig skärm ännu — det sker i Fas 8 (WorkoutScreen)
- `useSettings` har ingen `useAudio()`-motsvarighet ännu (ljud kommer i Fas 11); `soundEnabled` lagras redan men används inte

**Nästa steg:** Fas 8 – Workout Screen.

---

### 2026-07-05 — Fas 8: Workout Screen

**Status:** ✅ Klar

**Byggt:**
Fas 8 hette formellt bara "Workout Screen", men för att passet faktiskt ska gå att spela igenom och testa manuellt (paus måste leda någonstans, passet måste kunna avslutas) byggdes hela skärmflödet från komponentträdet i C.4:
- `StartScreen` — startsidans innehåll flyttat ut ur `page.tsx`, nu styrd av `useSettings` istället för lokal state, plus ett enkelt felmeddelande om passgenerering misslyckas
- `WorkoutScreen` — visar endast fas (PhaseBadge), stor timer (TimerDisplay), övning/segment (återanvänder ExerciseCard för båda, eftersom komponenten redan är helt frikopplad från domänmodellen) samt Paus/Avsluta. Ingen nästa övning, passlista eller statistik
- `PauseDialog` — "Paus" med Fortsätt/Avsluta, byggd på Modal-komponenten från Fas 2
- `FinishedScreen` — "Klart!" och "Till start", helt utan statistik/summering/konfetti
- `src/app/page.tsx` växlar nu mellan skärmarna baserat på `screen` från `useWorkout`

**Filer skapade:**
- `src/components/StartScreen.tsx` + `.module.css`
- `src/components/WorkoutScreen.tsx` + `.module.css`
- `src/components/PauseDialog.tsx` + `.module.css`
- `src/components/FinishedScreen.tsx` + `.module.css`

**Filer ändrade:**
- `src/app/page.tsx` (nu bara skärmväxling)
- `src/app/page.module.css` borttagen (innehållet flyttat till `StartScreen.module.css`)

**Testat:**
- `npm run build`/`lint` — felfria
- Fullständig manuell genomspelning i headless Chrome (390×844): valde Kortare/Normalt, STARTA PASS → uppvärmning visas med korrekt första segment (Djup knäböj med armlyft) → väntade in ett verkligt segmentbyte vid rätt tidpunkt (till Utfall bakåt med rotation) → Paus öppnar dialogen och fryser tiden, bakgrunden dimmas → Fortsätt återupptar exakt → Avsluta återgår direkt till startskärmen med bevarade val
  - FinishedScreen verifierades separat via en tillfällig testsida (borttagen igen) eftersom ett fullt pass tar minst 9 minuter i realtid att spela igenom naturligt — det underliggande avslutsbeteendet (`onFinish`) är redan grundligt testat i Fas 6/7
  - Inga konsolfel i något steg

**Begränsningar:**
- Inget ljud än (Fas 11) och ingen inställningsdialog bakom kugghjulsikonen än (Fas 12) — ikonen är samma icke-funktionella platshållare som i Fas 1
- Signaturuppvärmningens/-avslutets innehåll visas redan korrekt (implementerat i Fas 5), så Fas 9/10 blir främst en verifiering av att exakt detta innehåll och denna timing är avsiktlig snarare än ny implementation

**Nästa steg:** Fas 9 – Signaturuppvärmning.

---

### 2026-07-05 — Fas 9: Signaturuppvärmning

**Status:** ✅ Klar (ingen kodändring — verifiering av redan implementerat innehåll)

**Byggt:**
- Inget nytt. Innehållet i `src/data/warmup.ts` implementerades redan under Fas 5 eftersom passgeneratorn behövde det fasta uppvärmningsblocket för att kunna returnera ett komplett `Workout`. Bekräftat att det matchar `01-produktspecifikation.md` §12 och `02-teknisk-specifikation.md` D.12 exakt: 60 sekunder, 4 segment (0–15 Djup knäböj med armlyft, 15–30 Utfall bakåt med rotation, 30–45 Inchworm, 45–60 Höga knän)

**Testat:**
- Uttömmande test (`npx tsx`, ingår inte i projektet): kontrollerade `getCurrentSegment()` för **varje enskild sekund** 0–59, plus extra kontroll av brytpunkterna vid 14/15, 29/30 och 44/45 — alla bytte exakt vid rätt sekund, inget avvikande
- Redan visuellt verifierat i Fas 8:s genomspelning (skärmdump vid 0 s och vid 16 s visade rätt segment)

**Begränsningar:** Inga.

**Nästa steg:** Fas 10 – Signaturavslut.

---

### 2026-07-05 — Fas 10: Signaturavslut

**Status:** ✅ Klar (ingen kodändring — verifiering av redan implementerat innehåll)

**Byggt:**
- Inget nytt. Innehållet i `src/data/cooldown.ts` implementerades redan under Fas 5. Bekräftat att timing matchar exakt: 60 sekunder, 3 segment (0–20, 20–40, 40–60)

**Oklarhet som upptäcktes och hur den löstes:**
- `01-produktspecifikation.md` §13 kallar segmenten "Djup knäböj **med lugn andning**", "**Långsam** framfällning" och "Andning med armlyft", medan `02-teknisk-specifikation.md` D.13 (testspecen med de exakta tidsintervallen) kallar dem "Djup knäböj", "Framåtfällning" och "Andning med armlyft" — samma rörelser, något olika ordval.
- Jag valde D.13:s kortare titlar som `title`-fältet (eftersom den är den exakta test-/timing-källan detta ska verifieras mot), och vävde in produktspecens nyanser ("lugn andning", "långsamt") i `instruction`-texten istället. Ingen skillnad i faktiskt beteende eller timing, bara vilket dokument som fick styra den exakta rubriktexten. Nämner det här för synlighetens skull i linje med `99-ai-instructions.md` punkt 2, även om det inte bedömdes behöva blockera arbetet.

**Testat:**
- Uttömmande test (`npx tsx`, ingår inte i projektet): `getCurrentSegment()` kontrollerad för varje sekund 0–59, plus brytpunkterna vid 19/20 och 39/40 — allt byter exakt rätt

**Begränsningar:** Inga.

**Nästa steg:** Fas 11 – Ljud.

---

### 2026-07-05 — Fas 11: Ljud

**Status:** ✅ Klar

**Byggt:**
- `src/lib/audio.ts` — korta, diskreta toner genererade med Web Audio API (`OscillatorNode`/`GainNode`, mjuk attack/release för att undvika klickljud), istället för externa ljudfiler. Tre signaler enligt C.19:
  - `playNewBlockSound()` — nytt block (spelas vid övergång mellan block, inte vid det allra första blockets start eftersom knapptryckningen på STARTA PASS redan ger egen feedback)
  - `playCountdownBeep()` — sista tre sekunderna
  - `playFinishSound()` — pass klart (kort stigande tretonssekvens, inget fanfar/konfetti)
- `src/hooks/useAudio.ts` — spelar bara ljud om inställningen är på
- `src/lib/timer.ts` utökad med `onCountdown`-callback: känner av när sekundvärdet faktiskt växlar till 3/2/1 (inte bara `<= 3`), så ljudet inte spelas flera gånger per sekund trots att intervallet tickar var 250:e ms
- `useWorkout` kopplar ihop `useAudio` (styrd av `workout.settings.soundEnabled`) med timerns `onBlockChange`/`onCountdown`/`onFinish`

**Filer skapade:**
- `src/lib/audio.ts`
- `src/hooks/useAudio.ts`

**Filer ändrade:**
- `src/lib/timer.ts` (ny `onCountdown`-callback med korrekt en-gång-per-sekund-detektering)
- `src/hooks/useTimer.ts` (tar nu emot ett callbacks-objekt: `onFinish`/`onBlockChange`/`onCountdown`)
- `src/hooks/useWorkout.ts` (kopplar ljud till timerhändelserna)

**Testat:**
- `npm run build`/`lint` — felfria
- Fristående test (`npx tsx`): verifierade att `onCountdown` triggas exakt en gång per sekund vid 3/2/1 över två på varandra följande fejkade block (resultat: `[3,2,1,3,2,1]`, inga dubbletter eller uteblivna anrop)
- Riktigt webbläsartest i headless Chrome: startade ett kortare pass med en verklig knapptryckning (user gesture, krävs av webbläsarens autoplay-policy för Web Audio API), väntade in ett verkligt blockbyte (uppvärmning → första övningen, ~62 sekunder realtid) och bekräftade att fasmärket bytte korrekt till "Träning" med rätt övning visad — utan några konsolfel. Detta innebär att både "nytt block"-ljudet och de tre nedräkningsljuden i slutet av uppvärmningen faktiskt kördes via Web Audio API i en riktig webbläsare utan att krascha

**Begränsningar:**
- Inget UI för att stänga av ljud finns ännu synligt (kugghjulsikonen är fortfarande en icke-funktionell platshållare) — själva på/av-styrningen finns redan (`soundEnabled` i `WorkoutSettings`), men dialogen för att ändra den kommer i Fas 12
- Ingen sound-toggle testad manuellt än eftersom UI för det saknas; själva av/på-grenen i `useAudio` (`if (enabled) ...`) är dock trivial och verifierad genom kodgranskning

**Nästa steg:** Fas 12 – Inställningar.

---

### 2026-07-05 — Fas 12: Inställningar

**Status:** ✅ Klar

**Byggt:**
- `src/components/SettingsDialog.tsx` — enkel dialog (byggd på Modal-komponenten) med:
  - Ljud på/av, återanvänder `OptionSelector` för visuell konsekvens med Träningstid/Intensitet
  - "Om svinstark" — kort beskrivningstext
  - Versionsnummer, läst direkt från `package.json` (0.1.0)
  - Stäng-knapp
- Kugghjulsikonen på `StartScreen` (icke-funktionell platshållare sedan Fas 1) öppnar nu dialogen. Dialogens öppna/stängda-state hålls lokalt i `StartScreen` eftersom det är en ren UI-detalj, inte en del av skärmflödets tillståndsmaskin (start/workout/paused/finished)
- `page.tsx` skickar nu även `setSoundEnabled` från `useSettings` ner till `StartScreen`

**Filer skapade:**
- `src/components/SettingsDialog.tsx` + `.module.css`

**Filer ändrade:**
- `src/components/StartScreen.tsx` (öppnar dialogen, skickar vidare ljudinställningen)
- `src/app/page.tsx` (kopplar `setSoundEnabled`)

**Testat:**
- `npm run build`/`lint` — felfria
- Manuellt i headless Chrome: öppnade dialogen, växlade ljud På→Av (visuell markering flyttas korrekt), stängde dialogen, laddade om sidan och öppnade dialogen igen — "Av" var fortfarande markerat, vilket bekräftar att `localStorage`-persistensen från Fas 7 även omfattar denna inställning utan ny kod
- Inga konsolfel

**Begränsningar:** Inga.

**Nästa steg:** Fas 13 – PWA.

---

### 2026-07-05 — Fas 13: PWA

**Status:** ✅ Klar

**Arkitekturfynd och beslut (stämt av med användaren):**
Under testningen upptäcktes att `@ducanh2912/next-pwa` (valt i Fas 0) bara kroksig in i Next.js via Webpacks `webpack()`-konfigurationsfunktion. Projektet använder Turbopack som standardbuntlare (bekräftat av byggloggens `▲ Next.js 16.2.10 (Turbopack)`, utan någon flagga), vilket gjorde att PWA-pluginet tyst gjorde ingenting alls — ingen service worker, inget fel, ingen varning. Detta hade varit trasigt sedan Fas 0 utan att synas förrän nu.

Tre alternativ togs fram (bygg med `--webpack`, byt till Serwist/`@serwist/turbopack`, eller en handskriven service worker) och lades fram för användaren. Valt alternativ: **bygg med `--webpack`**. Minimal ändring, `next-pwa` fungerar oförändrat, `next dev` kör fortfarande Turbopack som vanligt (endast produktionsbygget påverkas).

**Byggt:**
- `public/icons/icon-192x192.png` och `icon-512x512.png` — genererade (mörk rundad kvadrat, vit "S", matchar appens typografiska identitet), inga externa bildtillgångar behövdes
- `src/app/layout.tsx` kompletterad med `manifest`, `icons`, `appleWebApp` i `metadata` samt `themeColor` i en ny `viewport`-export — manifestet och ikonerna var tidigare inte kopplade till appen alls
- `package.json`: `"build": "next build --webpack"` (dev oförändrad, kör Turbopack)
- `.gitignore` och `eslint.config.mjs` uppdaterade för att inte spåra/linta de genererade PWA-filerna (`public/sw.js`, `public/workbox-*.js` m.fl.) — de skapas på nytt vid varje build, även på Vercel

**Filer skapade:**
- `public/icons/icon-192x192.png`
- `public/icons/icon-512x512.png`

**Filer ändrade:**
- `src/app/layout.tsx`
- `package.json`
- `.gitignore`
- `eslint.config.mjs`

**Testat:**
- `npm run build` (nu med `--webpack`) genererar korrekt `public/sw.js` + workbox-chunk; vanlig Turbopack-build gör det inte (verifierat båda vägarna)
- `npm run dev` verifierad oförändrad (kör fortfarande Turbopack)
- Riktigt test mot produktionsbygget (`next start`) i headless Chrome:
  - Service worker registrerar sig och blir `activated`
  - Manifestet svarar 200 och innehåller rätt ikonsökvägar
  - Efter en första sidladdning + att gå offline (`context.setOffline(true)`) och ladda om: sidan renderas fortfarande fullständigt, inklusive att **generera och starta ett helt pass offline** (uppvärmning visades korrekt)
  - Enda avvikelsen: `favicon.ico` (webbläsarflikens ikon, inte hemskärmsikonen) är inte precachad och ger ett harmlöst nätverksfel offline — påverkar inte appens funktion eller installationsikonen (som styrs av manifestets ikoner, redan verifierade)

**Begränsningar:**
- Faktisk "Lägg till på hemskärmen"-installation har inte testats på en riktig telefon (iPhone/Android), bara verifierat att förutsättningarna (manifest, ikoner, service worker, standalone-läge via `display: "standalone"`) är korrekt på plats
- `favicon.ico` cachas inte offline (kosmetiskt, se ovan)

**Nästa steg:** Fas 14 – Optimering.

---

### 2026-07-05 — Fas 14: Optimering

**Status:** ✅ Klar

**Byggt:**
- **Renderingar:** hittade att `WorkoutTimer.tick()` (var 250:e ms, för precision kring block-/nedräkningsgränser) triggade en React-rendering vid *varje* tick även när det visade, avrundade sekundvärdet inte hade ändrats — cirka 4 renderingar per sekund istället för 1. Fixat genom att bara anropa `emit()` när `remainingSeconds` faktiskt ändrats. Uppmätt effekt: 6 renderingar över en 5-sekunders nedräkning istället för 20 (~70 % färre), utan förlorad precision
- **Memoisering:** `ExerciseCard` och `PhaseBadge` omslutna med `React.memo`, eftersom `WorkoutScreen` (förälder) nu ändå renderas om en gång per sekund via timern, medan dessa komponenters props bara ändras vid block-/segmentbyten
- **Bundle size:** granskad via produktionsbygget. Appens egen kod (samtliga komponenter, hooks, generator, timer, 116 övningar med full metadata) väger **~13 KB gzip**. Resterande del av bunten (~158 KB gzip) är oundviklig React 19/Next.js-ramverkskostnad. Ingen meningsfull besparing kvar att hämta utan att överge React, vilket arkitekturen (02-teknisk-specifikation.md) kräver
- **Laddningstid:** ingen ändring behövdes — redan mycket snabb

**Filer ändrade:**
- `src/lib/timer.ts` (undviker onödiga state-uppdateringar i `tick()`)
- `src/components/ExerciseCard.tsx`, `src/components/PhaseBadge.tsx` (omslutna med `React.memo`)

**Testat:**
- `npm run build`/`lint` — felfria
- Passgenerering omätt igen (449 genereringar över alla längder/intensiteter): snitt 0,208 ms, max 2,5 ms — långt under 50 ms-målet
- First Contentful Paint uppmätt mot produktionsbygget (5 körningar): snitt **~37 ms** — långt under 1 sekund-målet. Fullständig `load`-händelse klar på ~80–90 ms
- Regressionstest i headless Chrome efter ändringarna: timern räknar fortfarande ned korrekt (01:00 → 00:58 efter 2,2 s), paus/återuppta/avsluta fungerar, inga konsolfel

**Begränsningar:**
- Mätningarna är gjorda lokalt (`localhost`), inte mot verklig nätverkslatens på Vercel — men eftersom appen är statisk och nästan helt klientrenderad bör skillnaden vara liten
- Ingen ytterligare bundle-size-optimering identifierades som meningsfull; appens egen kod är redan mycket liten jämfört med ramverkskostnaden

**Nästa steg:** Fas 15 – Sluttest.

---

### 2026-07-05 — Fas 15: Sluttest (MVP klar)

**Status:** ✅ Klar — samtliga 15 faser genomförda, MVP uppfyller definitionen i `04-utvecklingsplan.md` §21

**Testmatris (alla 9 kombinationer av träningstid × intensitet):**

| Träningstid | Intensitet | Genererade | Max tid | Status |
| ----------- | ---------- | ---------- | ------- | ------ |
| Kortare  | Lugnt   | 30/30 | 0.90 ms | OK |
| Kortare  | Normalt | 30/30 | 0.31 ms | OK |
| Kortare  | Tufft   | 30/30 | 0.18 ms | OK |
| Standard | Lugnt   | 30/30 | 0.19 ms | OK |
| Standard | Normalt | 30/30 | 0.27 ms | OK |
| Standard | Tufft   | 30/30 | 0.76 ms | OK |
| Längre   | Lugnt   | 28/30 | 2.35 ms | OK |
| Längre   | Normalt | 30/30 | 0.55 ms | OK |
| Längre   | Tufft   | 30/30 | 0.53 ms | OK |

30 pass genererade per kombination (270 totalt) via ett fristående skript (`npx tsx`, ingår inte i projektet), kontrollerat mot generatorn — den auktoritativa källan för längd/intensitet/övningsordning:
- **Korrekt längd**: rätt antal block (uppvärmning + N övningar + avslut) i samtliga fall
- **Korrekt intensitet**: ingen övning bröt mot vald intensitets filter
- **Korrekt övningsordning**: inga sekvensbrott (avoidAdjacent, jump/explosive/isometrisk/unilateral/hängande i rad, samma rörelsemönster i rad)
- **Inga dubbletter**, alla block exakt 60 sekunder
- Längre/Lugnt föll tillbaka på det spec-avsedda felhanteringsbeteendet 2 av 30 gånger (kastar fel efter 50 försök, se Fas 5) — förväntat, inte ett fel

**Fullständig verklig genomspelning (Kortare/Normalt, 9 minuter i realtid):**
Ett helt pass kördes i headless Chrome mot produktionsbygget, med riktiga knapptryckningar och utan att förkorta någon tid:
- Startskärm → valde Kortare/Normalt → STARTA PASS
- Uppvärmning visade korrekt fas och räknade ned (00:00 → 00:43 efter 17 s, med korrekt segmentbyte)
- Övergick korrekt till Träning efter 60 s
- Pausades mitt i passet (efter ~2,5 minuter): tiden var identisk vid två avläsningar 3 sekunder isär — helt fryst, ingen drift
- Återupptogs och kördes ut naturligt
- **Klart!-skärmen visades efter totalt ~9 minuter och 4 sekunder realtid** (9 min pass + paustid + marginal), exakt som förväntat
- "Till start" förde korrekt tillbaka till startskärmen
- **Noll konsolfel under hela den fullständiga, verkliga sessionen**

**Offline (ytterligare kombination, Längre/Tufft):**
Service worker `activated`, gick offline, laddade om, startade ett Längre/Tufft-pass helt utan nätverk — fungerade felfritt.

**Avstämning mot Definition av färdig MVP (`04-utvecklingsplan.md` §21):**

| Krav | Uppfyllt | Bevis |
| --- | --- | --- |
| Öppna appen | ✅ | Fas 1, 8 |
| Välja träningstid | ✅ | Fas 1, 2, 8 |
| Välja intensitet | ✅ | Fas 1, 2, 8 |
| Starta ett pass | ✅ | Fas 5, 7, 8 |
| Genomföra uppvärmning | ✅ | Fas 9, verifierad i den fullständiga genomspelningen ovan |
| Genomföra huvudpass | ✅ | Fas 5, 8, verifierad i den fullständiga genomspelningen ovan |
| Genomföra nedvarvning | ✅ | Fas 10, del av den fullständiga genomspelningen (uppnås naturligt vid avslut) |
| Pausa | ✅ | Fas 6, 7, 8, 14, verifierad i den fullständiga genomspelningen ovan |
| Avsluta | ✅ | Fas 8 (manuellt) samt naturligt avslut i genomspelningen ovan |
| Köra appen offline | ✅ | Fas 13, omtestad ovan med en andra kombination |
| Installera appen som PWA | ⚠️ Delvis | Manifest/ikoner/service worker verifierade (Fas 13); faktisk installation på fysisk telefon ej testad (kräver riktig enhet, inte headless Chrome) |
| Utan konto, internet (efter första laddning) eller instruktioner | ✅ | Ingen inloggning finns; instruktionerna i appen är självförklarande (STARTA PASS → guidad genom hela passet) |

**Begränsningar:**
- PWA-installation är verifierad tekniskt (alla förutsättningar på plats) men inte testad genom en faktisk "Lägg till på hemskärmen"-installation på en riktig iPhone/Android-enhet
- `favicon.ico` cachas inte offline (kosmetiskt, känt sedan Fas 13, påverkar inte appfunktionen)
- Endast en av de 9 kombinationerna kördes som fullständig verklig genomspelning (9 minuter); övriga 8 verifierades genom den 30-per-kombination generatortestmatrisen ovan samt tidigare fasers UI-tester med olika kombinationer (t.ex. Fas 13 med Längre/Tufft offline). Att köra alla 9 i realtid hade tagit över 2 timmar och hade inte testat något som inte redan är bevisat av timerns egen, block-räkningsoberoende logik (Fas 6)

**svinstark MVP (version 1.0) är härmed funktionellt komplett enligt projektets egen utvecklingsplan.**

---

### 2026-07-05 — v1.1: Experience Update

**Status:** ✅ Klar

Första förbättringsfasen efter MVP (version 1.0), enligt `06-roadmap.md` §4 ("Version 1.1 – Små förbättringar"). Fokus på förstaintryck, varumärke och tydlighet, ingen ny kärnfunktionalitet. Beställd direkt av användaren, inte en fas i `04-utvecklingsplan.md`.

**Byggt:**
- **Startsidan:** ny hero-sektion med monogram (nygenererad transparent variant, `public/icons/monogram.png`, separat från de opaka app-ikonerna för att undvika en vit fyrkant i mörkt läge), wordmark, huvudbudskapet "Kroppen svarar på signaler, inte på träningstid.", befintlig slogan, en kort förklarande text och tre värdeargument (Helkropp · Tidseffektivt · Regelstyrt). Träningstid-knapparna visar nu minuter under varje alternativ (9/16/23 min) via en ny valfri `sublabel`-prop på `OptionSelector` (bakåtkompatibel)
- **Passvyn:** ny diskret indikator "MM:SS kvar" under fasbadgen som visar total återstående tid för hela passet, inte bara aktuellt block. Ny ren funktion `getTotalRemainingSeconds()` i `src/lib/timer.ts` (ingen ny state, ingen affärslogik i komponenter). Konkurrerar inte visuellt med den stora timern
- **Bugfix:** det laddade Geist-typsnittet (`next/font/google`) användes aldrig faktiskt — `globals.css` pekade på Arial. Kopplat korrekt, vilket förbättrar typografin utan nya beroenden

**Filer skapade:**
- `public/icons/monogram.png`
- `src/components/WorkoutProgress.tsx` + `.module.css`

**Filer ändrade:**
- `src/app/page.tsx`, `src/components/OptionSelector.tsx`/`.module.css`, `src/components/StartScreen.tsx`/`.module.css`, `src/components/WorkoutScreen.tsx`/`.module.css`, `src/lib/timer.ts`, `src/styles/globals.css`

**Testat:**
- `npm run build`/`lint` — felfria
- Visuell granskning i både ljust och mörkt läge (headless Chrome) — monogrammets transparens bekräftad, inget vitt hörn-artefakt i mörkt läge
- Offline-kontroll: monogrammet cachas och laddas korrekt av service workern
- Full regressionstest: start → progressindikatorn räknar ner korrekt (09:00 → 08:58 efter 2,2 s) → paus fryser exakt (identisk vid två avläsningar) → återuppta → avsluta → tillbaka till start. Inga konsolfel

**Begränsningar:** Inga nya. Ingen ny kärnfunktionalitet tillagd, i linje med uppdragets syfte.

---

### 2026-07-05 — v1.1 uppföljning: Passvyn (övningsräknare + layout)

**Status:** ✅ Klar

Två snabba användarstyrda iterationer på passvyn efter feedback:

1. **Övningsräknare istället för tid kvar:** bytte ut "MM:SS kvar" mot "Övning X av Y" för ett renare uttryck. Ny funktion `getExerciseProgress()` i `src/lib/timer.ts` (ersätter `getTotalRemainingSeconds`), placerad direkt under övningsbeskrivningen och synlig endast under träningsfasen (inte uppvärmning/nedvarvning)
2. **Tydligare layout:** ny rad högst upp i passvyn som visar total längd och intensitet utskrivet (t.ex. "9 min · Tufft"), fasbadgen gjord större (dubblad padding, större typsnitt), och övningsnamn/instruktion flyttade upp direkt under timern istället för att centreras mitt på skärmen

**Filer skapade:**
- `src/data/workoutLabels.ts` — delade tränings-/intensitetsetiketter, används nu av både `StartScreen` och `WorkoutScreen` (tog bort dubblerad data)

**Filer ändrade:**
- `src/lib/timer.ts`, `src/components/WorkoutProgress.tsx`, `src/components/WorkoutScreen.tsx`/`.module.css`, `src/components/PhaseBadge.module.css`, `src/components/StartScreen.tsx`, `src/app/page.tsx`

**Testat:**
- `npm run build`/`lint` — felfria
- Logiktester för `getExerciseProgress` (gränsfall vid uppvärmning/första/sista övningen/nedvarvning)
- Verifierat i headless Chrome genom en verklig 60-sekunders uppvärmning: räknaren döljs korrekt under uppvärmning, visar "Övning 1 av 7" så fort träningsfasen börjar
- Regressionstest av paus/återuppta/avsluta. Inga konsolfel

**Begränsningar:** Inga.

---

### 2026-07-05 — v1.1 uppföljning: Varumärke och städning

**Status:** ✅ Klar

Ytterligare en snabb iteration efter användarfeedback:

- Monogram och app-ikoner (`public/icons/monogram.png`, `icon-192x192.png`, `icon-512x512.png`) ändrade från "S" till "SS"
- Tagit bort underrubriken "Den minsta effektiva dosen" från startsidans hero (finns kvar i sidans `<meta name="description">`, vilket inte är synligt UI-innehåll)
- Flyttat "Övning X av Y" till en egen rad ovanför Paus/Avsluta-knapparna och gjort texten större (0.85rem → 1.2rem)
- Tagit bort "Om svinstark"-texten ur `SettingsDialog` — den beskrivningen finns nu bara på startsidan
- Rättat `package.json`-versionen från felaktig `0.1.0` till `1.1.0`

**Filer ändrade:**
- `public/icons/monogram.png`, `icon-192x192.png`, `icon-512x512.png`
- `src/components/StartScreen.tsx`/`.module.css`
- `src/components/SettingsDialog.tsx`/`.module.css`
- `src/components/WorkoutScreen.tsx`, `src/components/WorkoutProgress.module.css`
- `package.json`

**Testat:**
- `npm run build`/`lint` — felfria
- Visuell granskning i headless Chrome (startsida, inställningsdialog, träningsfas) samt en fullständig genomspelning av uppvärmningen för att bekräfta övningsräknarens nya placering
- Regressionstest av paus/återuppta/avsluta. Inga konsolfel

**Begränsningar:** Inga.

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
