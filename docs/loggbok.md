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
| v1.2| Fria vikter + förenklat startflöde | ✅ Klar |
| v1.3| PWA-installation, ny appikon, hoppa över övning | ✅ Klar |
| v1.4| UI-förbättringar: renare startsida, tydligare passkärm | ✅ Klar |
| v1.5| Kärnrörelse-mallar för Standard/Längre + vader | ✅ Klar |
| v1.6| Bord-utrustning, tillåt upprepning i passet | ✅ Klar |

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

### 2026-07-06 — v1.1 uppföljning: Wake Lock + passvyns layout

**Status:** ✅ Klar

**Byggt:**
- **Skärmen hålls vaken under pass:** `src/lib/wakeLock.ts` (inkapslar `navigator.wakeLock`, misslyckas tyst utan stöd) och `src/hooks/useWakeLock.ts` (begär låset på nytt vid `visibilitychange`). Kopplad i `useWorkout` — aktiv så länge ett workout finns, dvs. hela passet inklusive paus, släpps vid avslut
- **Passvyn:** "Övning X av Y" flyttad tillbaka upp med tydligt mellanrum (~2 rader) under övningsbeskrivningen. Passinformationen högst upp skriven som två rader: "Total längd: X min" / "Intensitet: Y" istället för en hopslagen rad

**Filer skapade:**
- `src/lib/wakeLock.ts`, `src/hooks/useWakeLock.ts`

**Filer ändrade:**
- `src/hooks/useWorkout.ts`, `src/components/WorkoutScreen.tsx`, `src/components/WorkoutProgress.module.css`

**Testat:**
- `npm run build`/`lint` — felfria
- Wake Lock: avlyssnat riktiga anrop genom hela flödet (inget anrop före start, begärs vid start, hålls kvar under paus, släpps exakt en gång vid avsluta) samt bekräftat att API:t faktiskt stöds och kan begäras i webbläsarmiljön
- Layout: visuell granskning av uppvärmning och träningsfas, regressionstest av paus/återuppta/avsluta. Inga konsolfel

**Begränsningar:** Wake Lock stöds inte i äldre webbläsare (t.ex. Safari innan iOS 16.4) — misslyckas då tyst utan att påverka appens övriga funktion.

---

### 2026-07-06 — Bugfix: inget ljud på mobil

**Status:** ✅ Klar

**Problem:** Användaren hörde inget ljud alls på mobilen, trots att Fas 11:s tester inte visade några fel.

**Grundorsak:** `AudioContext` skapades första gången inifrån en `setInterval`-callback (den första nedräkningssignalen, ~57 sekunder efter knapptryckningen på STARTA PASS), inte synkront i själva klicket. Mobila webbläsare (särskilt iOS Safari) håller då ljudet permanent pausat (`state: "suspended"`) utan att kasta något fel — därför missade Fas 11:s tester det, som dessutom av misstag kördes med en flagga (`--autoplay-policy=no-user-gesture-required`) som kringgick just den policy som orsakade problemet.

**Byggt:**
- `unlockAudioContext()` i `src/lib/audio.ts` — spelar en tyst, momentan ton för att låsa upp ljudet
- Anropas synkront i `start()` i `src/hooks/useWorkout.ts`, dvs. i själva knapptryckningen på STARTA PASS (inte senare från en timer-callback)

**Filer ändrade:**
- `src/lib/audio.ts`, `src/hooks/useWorkout.ts`

**Testat:**
- Körde om verifieringen *utan* policy-bypass-flaggan (den strikta, verkliga policyn): `AudioContext` startar nu i `running`-läge direkt vid klicket, inte `suspended`
- Instrumenterade `OscillatorNode.start()` genom ett helt live-flöde: bekräftade att en tyst upplåsningston (440 Hz) spelas direkt vid klicket, följt av tre riktiga nedräkningstoner (880 Hz) och ett blockbytesljud (660 Hz) vid rätt tidpunkter under uppvärmningen — helt utan bypass-flagga
- Full regressionstest av paus/återuppta/avsluta. Inga konsolfel

**Begränsningar:** Kan inte fysiskt bekräfta hörbart ljud på en riktig telefon (endast webbläsarmotorn kan testas programmatiskt) — användaren behöver bekräfta på sin enhet.

---

### 2026-07-06 — Ta bort uppvärmning/nedvarvning

**Status:** ✅ Klar

På uttrycklig begäran av användaren: signaturuppvärmningen och signaturavslutet togs bort helt. Passet går nu direkt på övningarna för "ett renare upplägg". Passlängden ändras därmed från 9/16/23 till **7/14/21 minuter** (var tidigare 9/16/23 minuter inklusive 1 min uppvärmning + 1 min avslut).

**Dokumentation uppdaterad** (ovanligt för loggboken, men en del av samma uppdrag): samtliga referenser till uppvärmning/nedvarvning/signatur städades bort i `00`, `01`, `02`, `04`, `05`, `06` och `07`. B-, C- och D-sektionerna i `02-teknisk-specifikation.md` samt sektionerna i `07-generator-specifikation.md` numrerades om. I `04-utvecklingsplan.md` behölls Fas 9/10:s nummer (markerade som borttagna) istället för att numrera om hela fas-sekvensen, för att inte bryta spårbarheten mot tidigare loggbokposter som redan refererar till "Fas 11", "Fas 15" osv.

**Byggt:**
- `src/types/workout.ts`: `WorkoutPhase` och `WorkoutSegment` borttagna. `WorkoutBlock.exercise` är nu obligatoriskt (var `Exercise | undefined`) — varje block är en övning
- `src/data/warmup.ts`, `src/data/cooldown.ts`: borttagna
- `src/data/workoutLabels.ts`: `durationMinutes` 9/16/23 → 7/14/21
- `src/lib/workoutGenerator.ts`: tar bort `createWarmupBlock`/`createCooldownBlock`, returnerar bara övningsblock
- `src/lib/timer.ts`: tar bort `getCurrentSegment`. `getExerciseProgress` kraftigt förenklad (ingen fasfiltrering behövs när alla block är övningar)
- `src/components/PhaseBadge`: borttagen helt — hade bara visat en konstant "Träning" utan informationsvärde
- `src/components/WorkoutScreen`: visar inte längre någon fasbadge

**Filer skapade:** Inga (endast borttagningar och ändringar).

**Filer borttagna:**
- `src/data/warmup.ts`, `src/data/cooldown.ts`
- `src/components/PhaseBadge.tsx`, `src/components/PhaseBadge.module.css`

**Filer ändrade:**
- `src/types/workout.ts`, `src/lib/timer.ts`, `src/lib/workoutGenerator.ts`, `src/data/workoutLabels.ts`, `src/components/WorkoutScreen.tsx`, `src/components/WorkoutProgress.tsx`, `src/hooks/useWorkout.ts`
- `docs/00-principer.md`, `docs/01-produktspecifikation.md`, `docs/02-teknisk-specifikation.md`, `docs/04-utvecklingsplan.md`, `docs/05-designprinciper.md`, `docs/06-roadmap.md`, `docs/07-generator-specifikation.md`

**Testat:**
- `npm run build`/`lint` — felfria
- Genererade 179 pass (20 per kombination av längd/intensitet): korrekt antal block (7/14/21), alla block har en övning och exakt 60 sekunders längd, inget kvarvarande `phase`-fält
- **Fullständig, verklig genomspelning** (Kortare/Normalt, 7 minuter i realtid, produktionsbygge): startar direkt på första övningen (ingen uppvärmning), paus fryser tiden exakt (00:30 → 00:30 efter 3 s), återupptas korrekt, avslutas naturligt till Klart!-skärmen efter ~7 minuter. Noll konsolfel
- Offline (Standard/14 övningar) och manuell Avsluta (Längre/21 övningar) verifierade separat, båda felfria

**Begränsningar:** Inga.

---

### 2026-07-06 — Innehåll: Utökade övningsbeskrivningar

**Status:** ✅ Klar

**Byggt:**
- Gick igenom samtliga 114 övningar i `src/data/exerciseData.ts` och lade till explicit sidbytesinstruktion på alla ensidiga (`unilateral: true`) övningar som saknade det
- Två mönster används beroende på övningens karaktär: "Byt sida/ben varje gång" för utfallsrörelser som återgår till neutral ställning varje repetition (t.ex. sidoutfall, utfall fram/bak, curtsy lunge), och "Byt sida/ben efter halva tiden" för statiska håll eller övningar med kostsam ombyggnad av ställning (enbensbalans, sidoplanka, enbenshöftlyft, m.fl.)
- Övningar som redan tydligt uttryckte växelvis rörelse (t.ex. `mountain_climber`, `bicycle_crunch`, `high_knees`) lämnades oförändrade
- 33 övningar uppdaterade totalt

**Filer ändrade:**
- `src/data/exerciseData.ts`

**Testat:**
- `npm run lint` och `npm run build` — felfria
- Längsta instruktionstexten efter ändring: 132 tecken, i linje med redan existerande längre texter i filen (t.ex. `single_leg_squat_to_chair`, ~120 tecken)
- `ExerciseCard.module.css` har ingen fast bredd/höjd på instruktionstexten (`white-space: pre-line`, ingen `max-width`), så längre texter radbryts naturligt utan overflow

**Begränsningar:** Inga.

---

### 2026-07-06 — Ny skärm: Valfri uppvärmning

**Status:** ✅ Klar

**Byggt:**
- Ny skärm "Valfri uppvärmning" visas efter att träningstid/intensitet valts och "STARTA PASS" tryckts, innan passet skapas och startas. Uppmanar användaren att värma upp på valfritt sätt och har en knapp ("Jag är uppvärmd") som genererar passet och startar det, samt en "Tillbaka"-knapp som återgår till Start utan att skapa något pass
- Ny skärmstate `"warmup"` i tillståndsmaskinen (`start` → `warmup` → `workout` → ...). `useWorkout.start()` unlockar ljudet (samma riktiga användargest som tidigare) och sparar valda inställningar i `pendingSettings`, men väntar med att generera passet och sätta `workout`-state tills `beginWorkout()` anropas — annars skulle timern (som startar automatiskt så fort `workout` är satt, se `useTimer.ts`) börja räkna ner medan uppvärmningsskärmen visas
- Ny `cancelWarmup()` för "Tillbaka"-knappen, som nollställer `pendingSettings` och går till Start

**Filer skapade:**
- `src/components/WarmupScreen.tsx`, `src/components/WarmupScreen.module.css`

**Filer ändrade:**
- `src/types/workout.ts` (Screen-typen), `src/hooks/useWorkout.ts`, `src/app/page.tsx`
- `docs/02-teknisk-specifikation.md`: B.23 Screen, B.24 State Machine, C.3 Skärmflöde och C.4 React-komponenter uppdaterade; ny sektion C.6 WarmupScreen infogad (C.6–C.31 → C.7–C.32, alla efterföljande C-sektioner skiftade +1)

**Testat:**
- `npm run lint`/`build` — felfria
- Playwright mot produktionsbygge: uppvärmningsskärmen visas efter STARTA PASS, ingen övning/timer syns medan den visas, "Tillbaka" återgår korrekt till Start, och "Jag är uppvärmd" startar passet precis som tidigare (verifierat på Kortare/7 övningar). Noll konsolfel

**Begränsningar:** Inga.

---

### 2026-07-06 — Utrustningsanpassning (stol/pall, chinsstång) + kortare förstasidestext

**Status:** ✅ Klar

**Byggt:**
- Startsidans hero-text förkortad till en mening ("Den minsta effektiva dosen: korta, balanserade helkroppspass som ger kroppen tydlig träningsstimulans.")
- Två nya inställningar i Inställningar-dialogen (samma plats som Ljud): "Stol/pall" och "Chinsstång", ja/nej, standard "Ja" för båda. Sparas i `WorkoutSettings.hasChair`/`hasPullupBar` via `useSettings` (localStorage, samma mönster som övriga inställningar)
- `workoutGenerator.ts`: `ALLOWED_EQUIPMENT` (som tidigare alltid tillät all utrustning, oavsett inställning — ett dött no-op sedan MVP) ersatt med `getAllowedEquipment(settings)`. `"bodyweight"`/`"floor"` alltid tillåtna, `"chair"`/`"pullup_bar"` endast om användaren angett att de finns

**Innehållsgap som upptäcktes och åtgärdades:**
- Stresstest av generatorn (100+ körningar per kombination av längd/intensitet, direkt i Node via `--experimental-strip-types`, utan webbläsare) visade att flera kombinationer helt saknade lösning utan utrustning: Tufft (alla längder) och Lugnt/Längre
- Rotorsak 1 (utbudsgap): för hårt/utan utrustning fanns 0 giltiga pull-övningar (alla 7 vertical_pull kräver chinsstång; de 3 golv-baserade horizontal_pull-övningarna är alla lugna). Löst genom 6 nya övningar i `exerciseData.ts` (`additionalExercises`): `explosive_prone_y_raise`, `superman_row`, `prone_scapular_pulse` (hårt, golv, horizontal_pull), `half_kneeling_push_up`, `wall_incline_plank_hold` (lugnt, golv/bodyweight, horizontal_push), `single_leg_glute_bridge_explosive` (hårt, golv, hip, med sidbytesinstruktion)
- Rotorsak 2 (sekvensregelkrock, upptäckt efter att rotorsak 1 var åtgärdad): sekvensregeln "aldrig tre golvövningar i rad" gjorde Tufft/Standard och Tufft/Längre praktiskt taget omöjliga att generera ändå (0/100 resp. 0/300 i stresstest), eftersom varje hård pull-övning utan utrustning måste utföras liggande på golvet — fler övningar löser inte detta eftersom de per definition också blir golvövningar. En mjukare gräns (max fyra i rad) testades men räckte inte för Längre (~6 % lyckade försök). Regeln stängs nu av helt när `!hasChair || !hasPullupBar` (`equipmentRestricted` i `workoutGenerator.ts`), oförändrad annars

**Filer ändrade:**
- `src/types/workout.ts` (`WorkoutSettings.hasChair`/`hasPullupBar`), `src/hooks/useSettings.ts`, `src/lib/workoutGenerator.ts`, `src/components/SettingsDialog.tsx`, `src/components/StartScreen.tsx`, `src/app/page.tsx`, `src/data/exerciseData.ts` (6 nya övningar)
- `docs/02-teknisk-specifikation.md`: B.7 Equipment, B.9 WorkoutSettings, B.19 Sekvensregler
- `docs/07-generator-specifikation.md`: §7 Kandidaturval, §8 Sekvensregler, §19 Framtida utveckling (tog bort "tillgänglig utrustning" — nu byggt)

**Testat:**
- `npm run lint`/`build` — felfria
- Direkt stresstest av `generateWorkout` i Node (200 körningar per kombination av längd × intensitet × utrustning på/av = 3 600 pass): 100 % lyckade i alla kombinationer utan utrustning, ingen regression med full utrustning (oförändrad kodväg när `equipmentRestricted` är false)
- Playwright mot produktionsbygge: förkortad hero-text verifierad, Stol/pall och Chinsstång växlas i Inställningar via riktiga klick, Tufft/Längre (värsta scenariot) genererar och startar korrekt utan utrustning. Noll konsolfel

**Begränsningar:** Inga.

---

### 2026-07-06 — Manuell genomgång av övningsbanken + generatorfixar

**Status:** ✅ Klar

**Byggt:**
- Användaren gick igenom hela övningsbanken manuellt: döpte om ett antal övningar, utökade instruktioner på andra, och tog bort 22 övningar hen tyckte var otydliga eller ej önskvärda (100 övningar kvar, ner från 121). `inverted_row`s instruktion utökades till att tillåta ett bord som alternativ till stång; utrustningstaggen uppdaterades i linje med detta, från `["pullup_bar"]` till `["bodyweight"]`
- `exerciseData.ts`: rensade `avoidAdjacent`-referenser till borttagna övningar (`single_leg_hip_thrust`, `russian_twist`, `star_jump`), uppdaterade antals-kommentarer per kategori till faktiska värden
- `workoutGenerator.ts`: kandidatsökningen per plats görs nu i åtta nivåer (unikt/upprepning × primärt/sekundärt mönster × korrekt/nedgraderad intensitet) istället för två, eftersom borttagningen av övningar gjorde vissa mönster/intensitet/utrustnings-kombinationer tomma (t.ex. 0 drag-övningar på Tufft utan chinsstång)
- `isValidWorkout`s slutkontroll matchar nu samma sekundära-mönster-logik som kandidatsökningen (`exerciseMatchesKey`) istället för att bara läsa `primaryPattern` - annars avvisades pass som byggts giltigt via sekundärt mönster
- Ny sista utväg i `generateWorkout`: om separation av liknande övningar (två ensidiga eller tre benövningar i rad) gör passmallen olöslig på Tufft (core/höft/rörlighet-poolerna på hård intensitet överlappar nästan helt i "ben" och "ensidig"), körs en andra generationsomgång med de två reglerna avstängda. Separation försöks alltid först

**Rotorsak (upptäckt via stresstest, inte i produktionskoden förrän nu):**
- Borttagningen av övningar tunnade ut hard-poolerna för core (2), höft (2) och rörlighet (3) till den grad att i princip alla alternativ i alla tre kategorier delar muskelgrupp "legs" och/eller är `unilateral`. Eftersom passmallarna (Standard, Längre) placerar core → höft → rörlighet i följd, gjorde reglerna "tre benövningar i rad" och "två ensidiga i rad" dessa platser praktiskt taget olösliga på Tufft (100 % misslyckande utan chinsstång, sporadiskt misslyckande även med full utrustning)

**Filer ändrade:**
- `src/data/exerciseData.ts`, `src/lib/workoutGenerator.ts`

**Testat:**
- `npx tsc --noEmit`, `npm run lint`, `npm run build` - felfria
- Stresstest av `generateWorkout` i Node (`--experimental-strip-types` + en alias-resolvande loader för `@/`, 200 körningar per kombination av längd × intensitet × utrustning = 7 200 pass): 0 misslyckanden i alla 36 kombinationer, ner från flera kombinationer med 100 % misslyckande innan fixarna

**Begränsningar / öppna frågor:**
- `02-teknisk-specifikation.md` (B.19/B.20), `03-exercise-library-specification.md` och `07-generator-specifikation.md` beskriver fortfarande den gamla tvånivå-kandidatsökningen och den strikta unika/primära-mönster-kontrollen - uppdaterades inte denna gång eftersom dokändringar kräver godkännande (se `99-ai-instructions.md`)

---

### 2026-07-07 — Dokumentationsuppdatering: spec-dokument synkade med generatorkoden

**Status:** ✅ Klar

**Byggt:**
- På användarens godkännande uppdaterades de tre spec-dokumenten som låg efter koden sedan förra sessionen:
  - `02-teknisk-specifikation.md`: B.19 fick ett tillägg om att "två ensidiga i rad"/"tre benövningar i rad" kan stängas av som sista utväg för hela passet; B.20 skrevs om från den gamla 3-stegs-fallbacken till den faktiska processen (åtta kandidatnivåer per plats, två genereringsomgångar för hela passet); tog bort en inaktuell "Historisk notering"
  - `03-exercise-library-specification.md`: §14 fick samma två undantag tillagda; §16 (övningsbankens omfattning) uppdaterades med exakta antal per `primaryPattern` (100 totalt: knä 18, höft 13, horisontell press 12, vertikal press 2, horisontellt drag 3, vertikalt drag 7, bål 14, kondition 10, balans 9, rörlighet 12), och en rad om minskningen från 121 lades till
  - `07-generator-specifikation.md`: §7 skrevs om till den faktiska 8-nivåers fallback-ordningen (unikt/upprepning × primärt/sekundärt mönster × korrekt/nedgraderad intensitet); §8 fick en referens till att två av reglerna kan stängas av; §13 skrevs om från den gamla vaga listan till den faktiska tvåomgångsprocessen

**Filer ändrade:**
- `docs/02-teknisk-specifikation.md`, `docs/03-exercise-library-specification.md`, `docs/07-generator-specifikation.md`

**Testat:**
- Endast dokumentationsändringar, ingen kodpåverkan

---

### 2026-07-07 — v1.2: Fria vikter + förenklat startflöde

**Status:** ✅ Klar

**Byggt:**
- Alla passval (träningstid, intensitet, chinsstång, stol/pall, fria vikter) flyttade till startsidan. Inställningssidan (kugghjul + `SettingsDialog`) togs bort helt - inget appbeteende blev kvar att visa där när ljud också flyttade ut
- Ny ljudikon (🔊/🔇) och infoikon (ⓘ) längst upp till höger på startsidan, ersätter kugghjulet. Ljudvalet sparas som tidigare i `localStorage` (`svinstark:settings`) och styr fortfarande nedräkningsljudet under passet oförändrat (via `workout.settings.soundEnabled`, satt vid passets start)
- Ny `AboutModal`-komponent ("Om Svinstark") - scrollbar, öppnas via infoikonen. `Modal.module.css` fick `max-height: 90vh; overflow-y: auto` på content-containern (gäller nu alla modaler, inklusive `PauseDialog`)
- Nytt utrustningsval **Fria vikter** (`FreeWeightsLevel`: `none`/`light`/`heavy`, visas som Nej/Lätta/Tunga) i datamodellen (`WorkoutSettings.freeWeights`), `useSettings` (persisteras, bakåtkompatibel default `"none"` för redan sparade inställningar) och generatorn
- `Equipment` utökad med `weights_light`/`weights_heavy`. `getAllowedEquipment` lägger till dessa baserat på `freeWeights` - Tunga ger tillgång till både lätta och tunga övningar (superset). Ingen annan generatorlogik behövde ändras: befintlig `isEquipmentAllowed` (kräver att *alla* en övnings utrustningsposter finns tillgängliga) löser redan "kräver både stol och vikt → båda måste finnas"
- 24 nya övningar i `exerciseData.ts` (ny `freeWeightExercises`-array, samma mönster som `additionalExercises`): 12 med lätta vikter, 12 med tunga, enligt användarens lista. Inga swings/cleans/snatches/Turkish get-ups. Två tunga roddövningar (`one_arm_row_heavy`, `bent_over_row`) lades särskilt till för att fylla det tidigare tunna `horizontal_pull`-hard-utbudet (0 övningar utan chinsstång innan denna ändring) - fungerar automatiskt genom den befintliga kandidatsökningen, ingen viktning/prioriteringslogik byggdes (se nedan)

**Medvetna tolkningar av specen:**
- "Dragövningar med fria vikter ska prioriteras som alternativ när användaren saknar chinsstång" tolkades som att övningarna ska *finnas tillgängliga*, inte att slumpen ska viktas - `07-generator-specifikation.md` §12/B.18 är uttryckliga om att generatorn aldrig viktar slumpen i MVP. Att lägga till övningarna med rätt `primaryPattern`/`equipment` räcker för att lösa behovet.
- `weighted_russian_twist` återinför "russian twist" som rörelse, vars kroppsviktsvariant togs bort 2026-07-06 för att vara otydlig - byggdes ändå eftersom användaren uttryckligen listade den i den här specen (senaste instruktionen gäller, `99-ai-instructions.md` §14).

**Filer ändrade:**
- `src/types/workout.ts`, `src/hooks/useSettings.ts`, `src/data/workoutLabels.ts`, `src/lib/workoutGenerator.ts`, `src/data/exerciseData.ts`, `src/components/StartScreen.tsx`, `src/components/StartScreen.module.css`, `src/components/Modal.module.css`, `src/app/page.tsx`

**Filer skapade:**
- `src/components/AboutModal.tsx`, `src/components/AboutModal.module.css`

**Filer borttagna:**
- `src/components/SettingsDialog.tsx`, `src/components/SettingsDialog.module.css`

**Testat:**
- `npx tsc --noEmit`, `npm run lint`, `npm run build` - felfria
- Stresstest av `generateWorkout` i Node (samma `--experimental-strip-types` + alias-loader-teknik som tidigare), 30 körningar per kombination av längd × intensitet × chinsstång × stol/pall × fria vikter = 3 240 pass över 108 kombinationer: 0 misslyckanden, och en extra kontroll per pass att ingen vald övning kräver utrustning som inte är tillåten enligt inställningarna
- Live i appen via `.claude/skills/run-svinstark/driver.mjs` (utökad med ett nytt `viewport`-kommando för mobilkontroll): startsidan på 390 px bredd med alla val synliga, Tufft + fria vikter Tunga + ingen chinsstång gav ett giltigt pass, infomodalen öppnas/scrollar/stängs korrekt, ljudikonen togglar och sparar till `localStorage` (verifierat att fältet `freeWeights` finns med i den sparade posten)

**Begränsningar / öppna frågor:**
- Inga - på användarens godkännande uppdaterades `01`, `02`, `03`, `04`, `06` och `07` i samma session (se separat loggpost nedan) innan commit.

---

### 2026-07-07 — Dokumentationsuppdatering: spec-dokument synkade med v1.2

**Status:** ✅ Klar

**Byggt:**
- `01-produktspecifikation.md` §9: användarflödet uppdaterat med utrustningsvalen och de två nya ikonerna, och en rad om att ingen separat inställningssida längre finns
- `02-teknisk-specifikation.md`: B.7 fick `weights_light`/`weights_heavy`; ny B.7a (`FreeWeightsLevel`); B.9 (`WorkoutSettings`) fick `freeWeights` och en rad om att allt väljs på startsidan; C.19 och C.28 uppdaterade för ljudikonen respektive den fullständiga lagrade inställningsmängden
- `03-exercise-library-specification.md` §3: `Equipment` utökad, med förklaring av `"weights_light"`/`"weights_heavy"` som en superset-relation samt riktlinjer för säkra/enkla viktövningar (inga swings/cleans/snatches/TGU); §16 uppdaterad till 124 övningar med nya kategorital (knä 25, höft 15, horisontell press 14, vertikal press 4, horisontellt drag 6, vertikalt drag 7, bål 19, kondition 13, balans 9, rörlighet 12)
- `04-utvecklingsplan.md`: Fas 12 ("Inställningar") märkt "(ersatt 2026-07-07)" och omskriven, samma mönster som Fas 9/10 använde när de togs bort - fasnumret behålls för spårbarhet
- `06-roadmap.md`: "Tillgänglig utrustning" under Version 1.2 markerad som levererad
- `07-generator-specifikation.md` §3, §7, §8: `WorkoutSettings`-exemplet utökat med utrustningsfälten; alla kvarvarande referenser till en "Inställningar"-skärm ändrade till "startsidan"; utrustningsfiltreringen i §7 nämner nu fria vikter explicit

**Filer ändrade:**
- `docs/01-produktspecifikation.md`, `docs/02-teknisk-specifikation.md`, `docs/03-exercise-library-specification.md`, `docs/04-utvecklingsplan.md`, `docs/06-roadmap.md`, `docs/07-generator-specifikation.md`

**Testat:**
- Endast dokumentationsändringar, ingen kodpåverkan

---

### 2026-07-07 — v1.3: PWA-installation, ny appikon, hoppa över övning

**Status:** ✅ Klar

**Byggt:**
- **Hoppa över övning:** `WorkoutTimer.skip()` (`src/lib/timer.ts`) - avancerar direkt till nästa block med dess fulla tid (till skillnad från `tick()`s kumulativa katch-up-logik för bakgrundsfördröjning, som inte är relevant för en explicit engångshandling). Om sista övningen hoppas över anropas samma `onFinish`-väg som normal timeout. Exponerad via `useTimer`/`useWorkout` (`skip()`, giltig endast under `screen === "workout"`) och en diskret textknapp "Hoppa över" i `WorkoutScreen.tsx`, placerad under övningskortet (mindre framträdande än Paus/Avsluta). Ljud för nytt block spelas automatiskt eftersom skip återanvänder samma `onBlockChange`-callback som den vanliga timerloopen
- **Ny appikon:** Den gamla ikonen visade bokstäverna "SS" i fet stil - för nära den historiska nazistiska symboliken. Ersatt med ett enda fett "S" (en av de uttryckligen godkända, säkra riktningarna i uppdraget), genererad programmatiskt (HTML/CSS + Playwright-skärmdump vid varje målstorlek, skript sparat i sessionens scratchpad, inte i repot) i samma svart/vit-palett som appen i övrigt. Nya filer: `icon-192x192.png`, `icon-512x512.png`, `apple-touch-icon.png` (180×180), samt två nya maskable-varianter (`icon-maskable-192x192.png`/`-512x512.png`, bokstaven hålls inom Androids säkerhetszon på 80 % av kanvasen). `monogram.png` (startsidans hero-bild) fick samma behandling. `manifest.json` uppdaterad med `purpose: "any"`/`"maskable"` per ikon; `layout.tsx` pekar nu apple-ikonen mot den dedikerade `apple-touch-icon.png` istället för att återanvända `icon-192x192.png`
- **Tydligare PWA-installation:** Ny självständig komponent `InstallPrompt.tsx`, placerad direkt under STARTA PASS-knappen på startsidan. Döljs helt när appen körs i standalone-läge (`matchMedia('(display-mode: standalone)')` eller `navigator.standalone` på iOS). Tre lägen beroende på vad webbläsaren faktiskt stödjer: (1) om `beforeinstallprompt` har skjutits upp av webbläsaren (Chrome/Edge, Android *och* desktop) visas en riktig "Lägg till på hemskärmen"-knapp som triggar webbläsarens egen dialog, (2) på iOS (som aldrig skickar det eventet) visas en kort textinstruktion om Dela-ikonen, (3) annars en generell instruktion om webbläsarens meny. Stängs med en liten ×-knapp, kommer ihåg valet permanent via `localStorage` (`svinstark:install-prompt-dismissed`)

**Tekniska val värda att notera:**
- `InstallPrompt` läser `localStorage`/`navigator`/`matchMedia` via `useSyncExternalStore` (samma mönster som `useSettings.ts`), inte ett vanligt `useEffect`+`setState` - det senare triggar `react-hooks/set-state-in-effect`-lintregeln och riskerar en hydreringskrock mellan serverns första rendering (utan `window`) och klientens
- Install-knappen gates på att `beforeinstallprompt` faktiskt har inträffat, inte på user-agent-sniffing för "Android" - fångar därmed även desktop Chrome/Edge, som skickar samma event

**Filer ändrade:**
- `src/lib/timer.ts`, `src/hooks/useTimer.ts`, `src/hooks/useWorkout.ts`, `src/components/WorkoutScreen.tsx`, `src/components/WorkoutScreen.module.css`, `src/app/page.tsx`, `public/manifest.json`, `src/app/layout.tsx`, `public/icons/icon-192x192.png`, `public/icons/icon-512x512.png`, `public/icons/monogram.png`, `.claude/skills/run-svinstark/driver.mjs` (nya kommandon `init-script` och `DEV_SERVER_CMD`-stöd), `.claude/skills/run-svinstark/SKILL.md`

**Filer skapade:**
- `src/components/InstallPrompt.tsx`, `src/components/InstallPrompt.module.css`, `public/icons/apple-touch-icon.png`, `public/icons/icon-maskable-192x192.png`, `public/icons/icon-maskable-512x512.png`

**Testat:**
- `npx tsc --noEmit`, `npm run lint`, `npm run build` - felfria
- Live mot produktionsbygge (`npm run build && npm run start`, nödvändigt eftersom `next-pwa` stänger av service worker i dev-läge) via `.claude/skills/run-svinstark/driver.mjs`: service worker registrerar sig, alla ikonfiler svarar 200, installationsrutan visar rätt läge (generisk text i vanlig Chromium, iOS-instruktion vid spoofad iPhone-UA via nytt `init-script`-kommando, helt dold vid spoofad standalone-`matchMedia`), stängs och kommer ihåg valet efter omladdning
- Hoppa över testat genom ett helt kort pass (7 övningar): övning och timer (01:00) byts korrekt vid varje hopp, paus/återuppta fungerar oförändrat tillsammans med hoppa över, och att hoppa över sista övningen landar korrekt på Klart!-skärmen

**Begränsningar / öppna frågor:**
- Inga - på användarens godkännande uppdaterades `00`, `01`, `02` och `04` i samma session (se separat loggpost nedan) innan commit.

---

### 2026-07-07 — Dokumentationsuppdatering: spec-dokument synkade med v1.3

**Status:** ✅ Klar

**Byggt:**
- `00-principer.md` §13: "hoppa över" tillagd i listan över vad som visas under passet
- `01-produktspecifikation.md` §9: nämner nu att en övning kan hoppas över utan bekräftelse, och att en diskret installationsruta visas under Starta pass i vanlig webbläsare
- `02-teknisk-specifikation.md`: C.5 (StartScreen) uppdaterad fullt ut - den hade redan halkat efter v1.2 (saknade utrustningsval och ikoner) och fick nu även installationsrutan; C.7 (WorkoutScreen) fick "hoppa över" i listan över vad som visas; C.23/C.24/C.25 (PWA/manifest/ikonformat) beskriver nu maskable-ikoner, Apple touch icon och principen bakom det nya enkla "S"-monogrammet; ny C.28a dokumenterar `InstallPrompt`; C.28 nämner den nya lagrade nyckeln; B.25 (Timerregler) beskriver `skip()`
- `04-utvecklingsplan.md`: Fas 13 ("PWA") fick ett tillägg om ikonbytet och installationsrutan, samma mönster som tidigare tillägg till Fas 9/10/12

**Filer ändrade:**
- `docs/00-principer.md`, `docs/01-produktspecifikation.md`, `docs/02-teknisk-specifikation.md`, `docs/04-utvecklingsplan.md`

**Testat:**
- Endast dokumentationsändringar, ingen kodpåverkan

---

### 2026-07-07 — v1.4: UI-förbättringar (renare startsida, tydligare passkärm)

**Status:** ✅ Klar

**Byggt:**
- **Startsidan förenklad:** rubriken "Kroppen svarar på signaler, inte på träningstid." och förklaringsstycket under den togs bort. Ersatt av en kort tagline "Träna med minsta effektiva dosen". Kvar: monogram, "svinstark", taglinen, de tre value props (Helkropp/Tidseffektivt/Regelstyrt), valen (träningstid/intensitet/utrustning) och Starta pass
- **Informationsrutan:** den borttagna rubriken/förklaringen flyttades in som en ny inledning i `AboutModal` (`Kroppen svarar på signaler...` + det gamla förklaringsstycket), före den befintliga "Träning ska vara enkel"-rubriken. `IconButton` fick en ny `size`-prop (`"default" | "large"`); informationsikonen på startsidan använder nu `size="large"` (56×56, större glyf) - påverkar inte andra `IconButton`-användningar (t.ex. `InstallPrompt`s stäng-knapp) eftersom `"default"` är oförändrad
- **Ljud på/av flyttat till träningsskärmen:** ikonen (nu också `size="large"`) togs bort från `StartScreen` och visas istället uppe till höger på `WorkoutScreen`, positionerad absolut i headern så den centrerade sammanfattningstexten (Total längd/Intensitet) inte påverkas. `useWorkout` tog tidigare `workout.settings.soundEnabled` (en fryst kopia från när passet skapades) - eftersom ljudikonen nu är synlig och kan tryckas på *under* passet ändrades hooken till att ta emot `soundEnabled` live som argument (`useWorkout(settings.soundEnabled)`), så en tryckning under passet hörs direkt i samma pass, inte bara i nästa
- **Övningsnamnet större:** `ExerciseCard`s `.name` gick från fast `1.5rem` till `clamp(1.75rem, 8vw, 2.75rem)` - skalar med skärmbredden men med golv och tak, så korta namn inte blir för små och långa namn inte flödar över (radbryts istället, som tidigare)
- **"Hoppa över" flyttad:** låg tidigare direkt under övningskortet/progress-texten, mitt i huvudinnehållet. Flyttad till en egen högerjusterad rad direkt ovanför Paus/Avsluta-knapparna (`.content` har `flex:1` och trycker därmed ner den mot botten) - nere till höger, sekundär (ingen ram/bakgrund), i vägen för varken timer eller övningsnamn

**Filer ändrade:**
- `src/components/StartScreen.tsx`, `src/components/AboutModal.tsx`, `src/components/AboutModal.module.css`, `src/components/IconButton.tsx`, `src/components/IconButton.module.css`, `src/components/WorkoutScreen.tsx`, `src/components/WorkoutScreen.module.css`, `src/components/ExerciseCard.module.css`, `src/hooks/useWorkout.ts`, `src/app/page.tsx`

**Testat:**
- `npx tsc --noEmit`, `npm run lint`, `npm run build` - felfria
- Live i appen (mobilbredd 390px) via `.claude/skills/run-svinstark/driver.mjs`: startsidan renderad och jämförd visuellt (endast angiven kortinformation kvar, infoikonen märkbart större), informationsrutan visar den flyttade texten överst, ljudikonen (56px, bekräftat via `getComputedStyle`) syns och togglar korrekt på träningsskärmen och sparar till `localStorage`, övningsnamnet klart större/tydligare i skärmdump, "Hoppa över" nere till höger ovanför Paus/Avsluta. Ett fullständigt kort pass kört med hoppa-över genom samtliga sju övningar (inklusive sista) för att bekräfta att flytten inte påverkade funktionen

**Begränsningar / öppna frågor:**
- Inga - på användarens godkännande uppdaterades `01` och `02` i samma session (se separat loggpost nedan) innan commit.

---

### 2026-07-07 — Dokumentationsuppdatering: spec-dokument synkade med v1.4

**Status:** ✅ Klar

**Byggt:**
- `01-produktspecifikation.md` §9: ljudikonen flyttad från "på startsidan" till "under passet, uppe till höger"; nämner nu bara informationsikonen kvar på startsidan
- `02-teknisk-specifikation.md`: C.5 (StartScreen) uppdaterad - ny tagline och value props i listan, ljudikonen borttagen därifrån med en förklarande rad om flytten och om att den längre texten gick till `AboutModal`; C.7 (WorkoutScreen) fick ljudikonen tillagd (med hänvisning till varför den flyttades hit) och en notering om att övningsnamnet är huvudfokus samt var "hoppa över" nu sitter; C.9 (ExerciseCard) beskriver den responsiva textstorleken; C.19 (Ljud) pekar nu mot WorkoutScreen istället för startsidan, med motiveringen att en tryckning ska gälla omedelbart för pågående pass; C.22 (Ikoner) dokumenterar `IconButton`s nya `size`-variant; B.9 (WorkoutSettings) förklarar att `soundEnabled` läses live via `useWorkout`, inte den frusna kopian i `workout.settings`

**Filer ändrade:**
- `docs/01-produktspecifikation.md`, `docs/02-teknisk-specifikation.md`

**Testat:**
- Endast dokumentationsändringar, ingen kodpåverkan

---

### 2026-07-09 — v1.5: Kärnrörelse-mallar för Standard/Längre + vader

**Status:** ✅ Klar

**Bakgrund:** Användaren granskade övningsbanken (se separat post samma dag om borttagna/ändrade övningar) och beskrev sedan en tydlig vision: Standard- och Längre-passen ska byggas kring ett fast antal namngivna "kärnrörelser" (draken/hip-hinge, armhävning med rotation, utfall åt tre håll, dead bug/bird dog, knäböj, sidoplanka, glute bridge, axelpress, chins, horisontellt drag) istället för att bara slumpa fritt inom breda kategorier som "knee"/"push"/"pull". Vill även ha vadövningar (både rakt och böjt knä), främst i de längre passen. Kortare ska förbli oförändrat och helkroppsfokuserat.

**Byggt:**
- **Ny matchningsmekanism i `workoutGenerator.ts`:** `MOVEMENT_FAMILIES` mappar tolv nya, smalare `PatternKey`-värden (`squat`, `lunge_forward`, `lunge_lateral`, `lunge_reverse`, `hip_hinge`, `pushup_rotation`, `chinup`, `glute_bridge`, `overhead_press`, `horizontal_pull_row`, `anti_rotation_core`, `side_plank`) mot explicita listor av övnings-id:n, istället för `ExercisePattern`-matchning - varje familj är en delmängd av en bredare kategori (t.ex. är "squat" bara knäböjsvarianter, inte alla knädominanta övningar). `exerciseMatchesKey` kollar family-listan först.
- **`FAMILY_FALLBACK`:** varje ny familj har en bredare reservkategori (t.ex. `chinup` → `pull`) som `buildMainExercises` faller tillbaka till om familjen saknar giltiga kandidater för given utrustning/intensitet/sekvens - annars hade t.ex. `chinup` gjort hela passet omöjligt att generera utan chinsstång. `isValidWorkout`s befintliga `hasAny()`-kontroller (knee/hip/push/pull/core/conditioning/balance_or_mobility) behövde inte ändras - de matchar mot övningarnas faktiska `primaryPattern`/`secondaryPatterns`, oavsett vilken plats-nyckel som valde dem.
- **Ny `ExercisePattern`/kategori "calf":** tre nya övningar i `exerciseData.ts` (`calfExercises`): `calf_raise` ("Tåhävningar", rakt knä, lugnt), `bent_knee_calf_raise` ("Böjda tåhävningar", böjt knä genom hela rörelsen, normalt) och `squat_calf_raise` ("Knäböj med tåhävning", kombo-övning enligt användarens eget förslag, tufft).
- **En ny övning:** `t_push_up` ("Armhävning med rotation", horizontal_push, tufft) - armhävning som avslutas i en sidoplanka med övre armen sträckt mot taket. Bildar tillsammans med det redan existerande `spiderman_push_up` (normalt) familjen `pushup_rotation` - ingen ny övning behövdes för normal-nivån.
- **Standard (14 platser) och Längre (21 platser) omskrivna** i `workoutTemplates.ts` kring de tolv namngivna familjerna + kondition + vader (Standard) respektive samma + balans/rörlighet/wildcard/extra volym på knäböj, horisontellt drag och axelpress (Längre). Kortare är helt oförändrat.
- **Ordningsfix:** `hip_hinge`s båda medlemmar (draken/enbens höftfällning) är alltid ensidiga, liksom båda `pushup_rotation`-medlemmarna - placerade de två platserna direkt efter varandra (som i det första utkastet) blockerade "aldrig två ensidiga övningar i rad"-regeln `pushup_rotation`-familjen deterministiskt, så platsen föll alltid tillbaka till en slumpad press-övning istället för att faktiskt visa rotationsvarianten. Löst genom att lägga en kondition-plats emellan.

**Filer ändrade:**
- `src/types/workout.ts`, `src/lib/workoutGenerator.ts`, `src/data/exerciseData.ts`, `src/data/workoutTemplates.ts`

**Testat:**
- `npx tsc --noEmit`, `npm run lint` - felfria
- Stresstest via `.claude/skills/run-svinstark/driver.mjs`: Standard och Längre × Lugnt/Normalt/Tufft × ingen utrustning/all utrustning, fyra genereringar per kombination (48 st), kört två gånger om (96 genereringar totalt) - alla lyckades, inga konsolfel
- Ett fullständigt Längre-pass (21 övningar, all utrustning, Normalt) genomklickat övning för övning - alla namn renderade korrekt (inklusive "Spiderman push-up", "Tåhävningar"), passet nådde "Klart!"
- Bekräftat att `chinup`-platsen faller tillbaka till en giltig kroppsviktsövning ("Rodd i stång") när chinsstång saknas, utan fel
- Bekräftat efter ordningsfixen att "Armhävning med rotation" faktiskt visas på Tufft (4/4 försök) - innan fixen visades den aldrig

**Begränsningar / öppna frågor:**
- `lunge_forward`/`lunge_lateral`-familjerna har bara en medlem vardera (`forward_lunge`/`lateral_lunge`) - samma övning varje gång den platsen fylls. Medvetet val (kvalitet före kvantitet, enligt användaren), men värt att komma ihåg om fler utfallsvarianter känns önskvärt senare.
- ~~Upptäckte i förbigående att `squat_hold` (knee) och `deep_squat_hold` (mobility) har identiskt visningsnamn~~ - åtgärdat samma dag: `deep_squat_hold` döpt om till "Djup knäböj" (se nedan).

---

### 2026-07-09 — v1.6: Bord-utrustning, tillåt upprepning i passet

**Status:** ✅ Klar

**Byggt:**
- **Ny utrustningstyp "table":** `inverted_row` ("Rodd i stång") krävde tidigare bara `["bodyweight"]`, trots att instruktionen alltid nämnt "en stång eller ett bord" - i praktiken går den inte att göra utan något att hänga under. Kräver nu `["table"]`. `hasChair`-inställningen (UI-etikett ändrad från "Stol/pall" till "Stol och bord", på både startsidan och infosidan) styr nu både `"chair"`- och `"table"`-utrustning tillsammans i `getAllowedEquipment` - en enda fråga, inte två separata inställningar, enligt användarens instruktion.
- **Upprepning inom samma pass är nu tillåtet och inte längre en sista utväg:** `allowRepeat`/`usedIds` togs bort helt ur `workoutGenerator.ts` (både `findCandidates`, `candidatesForKey` och `buildMainExercises` förenklade). `CANDIDATE_TIERS` gick från åtta kombinationer (`allowSecondary` × `allowRepeat` × `allowIntensityFallback`) till fyra (`allowSecondary` × `allowIntensityFallback`) - en redan använd övning väljs nu med samma sannolikhet som en oanvänd, istället för att bara accepteras när inget oanvänt alternativ finns. Motivering från användaren: om övningspoolen för en plats är tunn (t.ex. en smal kärnrörelse-familj) är det önskvärt att samma bra övning återkommer, hellre än att generatorn letar upp en sämre passande övning bara för variationens skull.
- **Infosidan:** "Kroppen svarar på stimulans, inte på hur länge du tränar." slogs ihop med meningen efter den till ett fetmarkerat stycke. Tog bort meningen "Pulsövningarna gör att även konditionen får sin signal – inte bara musklerna."

**Filer ändrade:**
- `src/types/workout.ts`, `src/lib/workoutGenerator.ts`, `src/data/exerciseData.ts`, `src/components/StartScreen.tsx`, `src/components/AboutModal.tsx`

**Testat:**
- `npx tsc --noEmit`, `npm run lint` - felfria
- Stresstest (samma matris som v1.5: Standard/Längre × Lugnt/Normalt/Tufft × ingen/all utrustning, 48 genereringar) - alla lyckades, inga konsolfel
- Bekräftat att "Rodd i stång" aldrig visas utan "Stol och bord" (ett helt Standard-pass genomklickat, `horizontal_pull_row`-platsen föll korrekt tillbaka till "Liggande Y-lyft" - som dessutom visade sig två gånger i samma pass, vilket bekräftar att upprepning nu faktiskt sker) och att den visas när utrustningen finns (två separata pass, båda träffade "Rodd i stång" på samma plats)

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
