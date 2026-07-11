# svinstark – Teknisk specifikation

**Filnamn:** `02-teknisk-specifikation.md`
**Version:** 2.1
**Status:** Arbetsdokument

---

Detta dokument är sammanslaget från de tidigare delarna 02A (Arkitektur och projektstruktur), 02B (Domänmodell och affärslogik), 02C (UI, komponenter och PWA) och 02D (Kvalitet, testning och implementation). Avsnittsnumren nedan är prefixade med del A–D för spårbarhet mot originalen.

---

# Del A – Arkitektur och projektstruktur

## A.1 Syfte

Detta dokument beskriver den tekniska arkitekturen för svinstark MVP.

Målet är att skapa en kodbas som är:

* enkel att förstå
* enkel att testa
* enkel att vidareutveckla
* modulär
* tydligt separerad mellan data, logik och användargränssnitt

Detta avsnitt (Del A) beskriver endast arkitekturen. Affärslogik, datamodeller och UI beskrivs i Del B och Del C.

---

## A.2 Arkitekturprinciper

Följande principer gäller för hela projektet.

### A.2.1 Separation of Concerns

Projektet delas upp i tre lager:

1. Data
2. Affärslogik
3. Presentation

Inget lager får känna till implementationen av ett annat lager.

---

### A.2.2 Business logic never depends on UI

Detta är projektets viktigaste tekniska princip.

Passgeneratorn ska kunna köras utan React.

Timern ska kunna köras utan React.

Övningsbiblioteket ska inte känna till användargränssnittet.

React visar endast resultatet.

---

### A.2.3 Data first

All träningsdata lagras som strukturerade objekt.

Ingen träningslogik får hårdkodas i komponenterna.

---

### A.2.4 Stateless components

React-komponenter ska vara så "dumma" som möjligt.

De ska:

* visa data
* skicka användarhändelser vidare

De ska inte innehålla träningslogik.

---

### A.2.5 Single Responsibility Principle

Varje modul ska ha ett tydligt ansvar.

Exempel:

* WorkoutGenerator skapar pass.
* Timer hanterar tid.
* ExerciseCard visar en övning.
* exerciseData innehåller endast övningar.

---

## A.3 Teknisk stack

Projektet byggs med:

* Next.js
* React
* TypeScript
* CSS Modules
* PWA
* Vercel

---

### Motivering

#### Next.js

Valt för:

* modern projektstruktur
* App Router
* enkel deployment
* utmärkt stöd i Claude Code
* framtida skalbarhet

---

#### React

Valt för:

* komponentbaserad arkitektur
* enkel state-hantering
* hög återanvändbarhet

---

#### TypeScript

Valt för:

* stark typkontroll
* färre buggar
* bättre autokomplettering
* enklare refaktorering

---

#### CSS Modules

Valt för:

* lokal styling
* inga namnkonflikter
* enkel struktur

---

#### Vercel

Valt för:

* gratis hosting
* perfekt stöd för Next.js
* enkel deployment

---

## A.4 Arkitekturöversikt

```text
                User
                  │
                  ▼
          React Components
                  │
                  ▼
           Application State
                  │
      ┌───────────┴───────────┐
      ▼                       ▼
 Workout Generator        Timer Engine
      │                       │
      └───────────┬───────────┘
                  ▼
           Exercise Library
```

Princip:

React presenterar.

Generatorn tänker.

Övningsbiblioteket innehåller fakta.

---

## A.5 Projektstruktur

```text
svinstark/
│
├── docs/
│   ├── 00-principer.md
│   ├── 01-produktspecifikation.md
│   ├── 02-teknisk-specifikation.md
│   ├── 03-exercise-library-specification.md
│   ├── 04-utvecklingsplan.md
│   ├── 05-designprinciper.md
│   ├── 06-roadmap.md
│   ├── 07-generator-specifikation.md
│   └── 99-ai-instructions.md
│
├── public/
│   ├── icons/
│   ├── manifest.json
│   └── sounds/
│
├── src/
│
│   ├── app/
│   │
│   ├── components/
│   │
│   ├── data/
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   └── styles/
│
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## A.6 Mappstruktur

### app/

Innehåller Next.js App Router.

Ansvar:

* routing
* layout
* startsida

Ingen affärslogik.

---

### components/

Innehåller endast React-komponenter.

Exempel:

* StartScreen
* WorkoutScreen
* TimerDisplay
* ExerciseCard
* PrimaryButton

Komponenterna ska vara återanvändbara.

---

### data/

Innehåller statisk data.

Exempel:

* exerciseData.ts
* workoutTemplates.ts
* workoutLabels.ts

Ingen logik.

---

### hooks/

Egna React-hooks.

Exempel:

* useWorkout()
* useTimer()
* useAudio()

Hooks får använda affärslogik men ska inte innehålla den.

---

### lib/

Projektets kärna.

Här ligger:

* WorkoutGenerator
* Timer
* ljudfunktioner
* sekvenskontroll

Detta är den viktigaste mappen.

---

### types/

Alla TypeScript-typer.

Exempel:

* Exercise
* Workout
* WorkoutBlock
* WorkoutSettings

Inga funktioner.

---

### utils/

Små generella hjälpfunktioner.

Exempel:

* shuffleArray()
* randomItem()
* clamp()

Ingen träningslogik.

---

### styles/

Global styling.

Färger.

Typografi.

CSS-variabler.

---

## A.7 Namngivningsstandard

### React-komponenter

PascalCase.

Exempel:

```text
WorkoutScreen
TimerDisplay
ExerciseCard
PrimaryButton
```

---

### Funktioner

camelCase.

Exempel:

```text
generateWorkout()

matchesPattern()

createWorkout()

shuffleArray()
```

---

### Variabler

camelCase.

Exempel:

```text
currentWorkout

selectedDuration

remainingSeconds

currentExercise
```

---

### TypeScript-typer

PascalCase.

Exempel:

```text
Exercise

Workout

WorkoutBlock

WorkoutSettings
```

---

### Konstanter

UPPER_SNAKE_CASE.

Exempel:

```text
DEFAULT_DURATION

DEFAULT_INTENSITY

WORKOUT_TEMPLATES
```

---

### Filnamn

React-komponenter:

PascalCase.

Exempel:

```text
WorkoutScreen.tsx

ExerciseCard.tsx

TimerDisplay.tsx
```

Övriga moduler:

camelCase.

Exempel:

```text
exerciseData.ts

workoutTemplates.ts

audio.ts
```

---

## A.8 State-hantering

MVP ska använda Reacts inbyggda state.

Tillåtet:

* useState
* useReducer
* useMemo
* useCallback
* useRef
* useEffect
* Context API (om behov uppstår)

Inte tillåtet i MVP:

* Redux
* Zustand
* MobX
* Recoil
* Jotai

Den globala staten ska hållas så liten som möjligt.

---

## A.9 Routing

MVP behöver endast en route:

```text
/
```

Appen växlar mellan vyer med state.

Separata URL:er behövs inte.

---

## A.10 Prestandaprinciper

Appen ska kännas omedelbar.

Mål:

* första rendering < 1 sekund
* knapprespons < 100 ms
* passgenerering < 50 ms
* timer utan hack
* inga onödiga renderingar

---

## A.11 Offline-princip

Efter första laddningen ska hela appen fungera utan internet.

Detta innebär:

* övningsbibliotek lokalt
* passgenerator lokalt
* timer lokalt
* ljud lokalt

Ingen funktion i MVP ska kräva nätverk.

---

## A.12 Säkerhetsprincip

MVP lagrar ingen personlig information.

Ingen användardata skickas till någon server.

Ingen analys eller spårning används.

---

## A.13 Kodkvalitet

Koden ska följa dessa principer:

* små funktioner
* tydliga namn
* låg komplexitet
* hög läsbarhet
* få beroenden
* hög återanvändbarhet

När två lösningar är likvärdiga ska den enklare väljas.

---

## A.14 Definition av god arkitektur

Arkitekturen är godkänd när:

* React kan bytas utan att passgeneratorn behöver skrivas om.
* Passgeneratorn kan testas utan UI.
* Timern kan testas utan UI.
* Övningsbiblioteket kan utökas utan att generatorn ändras.
* Nya övningar kan läggas till genom data, inte genom ny kod.
* En ny komponent kan skapas utan att påverka affärslogiken.

Detta är den arkitektoniska målbilden för svinstark MVP.

---

# Del B – Domänmodell och affärslogik

## B.1 Syfte

Detta avsnitt beskriver de centrala datamodellerna och affärslogiken i svinstark.

Målet är att all träningslogik ska vara oberoende av användargränssnittet och kunna testas separat.

---

## B.2 Domänmodell

svinstark bygger på följande huvudobjekt:

* Exercise
* Workout
* WorkoutBlock
* WorkoutSettings
* WorkoutTemplate
* AppState

Relation:

```text
WorkoutSettings
        │
        ▼
WorkoutGenerator
        │
        ▼
Workout
        │
        └── Exercise Blocks
```

---

## B.3 Exercise

Varje övning representeras av ett objekt.

Den fullständiga och gällande datamodellen för `Exercise` definieras i `03-exercise-library-specification.md` (avsnitt 12). Detta dokument använder samma modell och definierar inte en egen, avvikande version.

De fält som är mest relevanta för affärslogiken i detta dokument är:

* `id`, `name`, `instruction`
* `primaryPattern`, `secondaryPatterns`
* `intensity` (`ExerciseIntensity`: `normal` / `hard`)
* `equipment`
* `muscleGroups`
* `explosive`, `unilateral`, `jump`
* `bodyPosition`, `movementType`
* `avoidAdjacent`

> **Historisk notering:** en tidigare version av detta dokument definierade en egen, förenklad `Exercise`-modell (med bl.a. `intensityClass`, `effort: 1–5`, `pulse: 1–5`, `static`, `floor`). Den modellen är utgången och ersatt av modellen i `03-exercise-library-specification.md`, som är mer detaljerad och uttryckligen förbjuder subjektiva femgradiga skalor i MVP.

---

## B.4 ExercisePattern

Tillåtna värden:

```typescript
type ExercisePattern =
    | "knee"
    | "hip"
    | "horizontal_push"
    | "vertical_push"
    | "horizontal_pull"
    | "vertical_pull"
    | "core"
    | "conditioning"
    | "balance"
    | "calf";
```

---

## B.5 WorkoutIntensity

```typescript
type WorkoutIntensity =
    | "normal"
    | "hard";
```

Visas i gränssnittet som:

* Normal
* Tuff

Ett tidigare sparat `"calm"`-värde (intensiteten Lugnt, borttagen) migreras vid inläsning till `"normal"`.

---

## B.6 WorkoutDuration

```typescript
type WorkoutDuration =
    | "short"
    | "standard"
    | "long";
```

Mappning:

| Kod      | Visas    |
| -------- | -------- |
| short    | Kortare  |
| standard | Standard |
| long     | Längre   |

---

## B.7 Equipment

```typescript
type Equipment =
    | "bodyweight"
    | "floor"
    | "chair"
    | "pullup_bar"
    | "weights_light"
    | "weights_heavy";
```

Ingen annan utrustning får förekomma i MVP.

`"bodyweight"` och `"floor"` antas alltid finnas tillgängligt. `"chair"` och `"pullup_bar"` filtreras bort från generatorns kandidatpool om användaren anger på startsidan att de saknas (se B.9 `WorkoutSettings.hasChair`/`hasPullupBar`).

`"weights_light"` och `"weights_heavy"` styrs av `WorkoutSettings.freeWeights` (se B.9a): `"light"` ger `"weights_light"`, `"heavy"` ger både `"weights_light"` och `"weights_heavy"` (tunga fria vikter täcker per definition även lätta övningar). Ingen övning i MVP kräver annan utrustning än ovanstående sex värden.

---

## B.7a FreeWeightsLevel

```typescript
type FreeWeightsLevel =
    | "none"
    | "light"
    | "heavy";
```

Visas i gränssnittet som:

* Nej
* Lätta
* Tunga

Inga exakta kiloangivelser anges i MVP - "Lätta"/"Tunga" är en grov klassificering av vilka övningar som är lämpliga (se `03-exercise-library-specification.md`).

---

## B.8 MuscleGroup

Muskelgrupper används för analys och framtida utveckling.

```typescript
type MuscleGroup =
    | "legs"
    | "glutes"
    | "chest"
    | "back"
    | "shoulders"
    | "arms"
    | "core"
    | "full_body";
```

Generatorn använder `muscleGroups` i MVP endast för en specifik sekvensregel: att undvika tre övningar i rad vars `muscleGroups` innehåller `"legs"` (se B.19). Utöver detta används `muscleGroups` inte för filtrering eller urval i MVP.

---

## B.9 WorkoutSettings

Representerar användarens val.

```typescript
export interface WorkoutSettings {

    duration: WorkoutDuration;

    intensity: WorkoutIntensity;

    soundEnabled: boolean;

    hasChair: boolean;

    hasPullupBar: boolean;

    freeWeights: FreeWeightsLevel;

}
```

`duration`, `intensity`, `hasChair`, `hasPullupBar` och `freeWeights` väljs på startsidan (se `01-produktspecifikation.md` §9) - det finns ingen separat inställningssida i MVP. `hasChair`/`hasPullupBar` (standardvärde: båda `true`) och `freeWeights` (standardvärde `"none"`) styr vilken utrustning generatorn får använda (se B.7/B.7a).

`soundEnabled` styrs istället av en ljudikon på WorkoutScreen (se C.7/C.19) och är inte kopplad till passgenereringen. Eftersom ikonen är synlig och kan tryckas på medan passet pågår läser ljuduppspelningen (`useAudio` via `useWorkout`) `soundEnabled` live från `WorkoutSettings` i `useSettings`, inte den frusna kopian i `workout.settings` som skapades när passet startade - annars skulle en tryckning under passet inte höras förrän nästa pass.

---

## B.10 Workout

Representerar ett färdigt pass.

```typescript
export interface Workout {

    id: string;

    createdAt: Date;

    settings: WorkoutSettings;

    blocks: WorkoutBlock[];

}
```

---

## B.11 WorkoutBlock

Alla block i passet följer samma modell. Varje block är en övning.

```typescript
export interface WorkoutBlock {

    id: string;

    duration: number;

    exercise: Exercise;

}
```

---

## B.12 WorkoutTemplate

Passgeneratorn arbetar med mallar.

```typescript
export interface WorkoutTemplate {

    duration: WorkoutDuration;

    patterns: PatternKey[];

}
```

---

## B.13 PatternKey

Tillåtna värden:

```typescript
type PatternKey =

    | "knee"

    | "hip"

    | "push"

    | "pull"

    | "horizontal_push"

    | "vertical_push"

    | "horizontal_pull"

    | "vertical_pull"

    | "conditioning"

    | "core"

    | "knee_or_hip"

    | "wildcard"

    | "calf"

    | <kärnrörelse-familjer, se nedan>;
```

Utöver de breda kategorierna finns smalare kärnrörelse-nycklar som Standard/Längre-mallarna bygger på (`squat`, `lunge_forward`, `lunge_reverse`, `hip_dominant`, `pushup_rotation`, `chinup`, `glute_bridge`, `overhead_press`, `horizontal_pull_row`, `anti_rotation_core`, `side_plank`). De matchas mot uttryckliga listor av övnings-id:n i `workoutGenerator.ts` (`MOVEMENT_FAMILIES`), inte mot `primaryPattern`. Den fullständiga typen finns i `src/types/workout.ts`.

`hip_dominant` (döpt om från `hip_hinge` i v1.8) täcker höftdominant träning brett - marklyftsvarianter, höftlyftsfamiljen och donkey kick - istället för att bara matcha renodlade höftfällningar. Se `03-exercise-library-specification.md` och `docs/loggbok.md`.

`lunge_lateral` (Sidoutfall) togs bort som egen namngiven plats i v1.9 för att ge rum åt `chinup`s tre garanterade platser (se B.17 nedan). `lateral_lunge` finns kvar i övningsbanken och nås fortfarande via Kortares breda `knee`-kategori.

`chinup` är sedan v1.9 en garanterad kärnövning - 1x på Kortare (via den breda `pull`-platsen, se nedan), 2x på Standard, 3x på Längre - istället för en enda plats. Familjen utökades med `dead_hang` (statiskt håll), och `negative_pull_up` omklassades tillbaka till `normal`: utan detta hade `chinup`-platsen haft noll Normal-kandidater (samtliga fyra ursprungliga medlemmar var hard) och chins/pull-ups visades aldrig på Normal-pass.

### Mappning mot `primaryPattern`

Passmallar refererar ibland till generiska nycklar som inte finns direkt som `primaryPattern`-värden. Följande mappning gäller vid kandidaturval:

| `PatternKey`          | Matchar `primaryPattern`             |
| --------------------- | ------------------------------------- |
| `push`                | `horizontal_push` eller `vertical_push` |
| `pull`                | `horizontal_pull` eller `vertical_pull` |
| `knee_or_hip`         | `knee` eller `hip`                    |
| `wildcard`            | valfritt (se 07-generator-specifikation.md §11) |
| övriga värden         | exakt samma värde som `primaryPattern` |

---

## B.14 Passgenerator

Generatorn exponeras som:

```typescript
generateWorkout(settings: WorkoutSettings): Workout
```

Den ska vara en ren funktion.

Ingen React.

Ingen DOM.

Ingen lokal lagring.

---

## B.15 Genereringsprocess

Generatorn arbetar enligt följande:

1. Läs inställningar.
2. Hämta rätt passmall.
3. Filtrera övningar efter intensitet.
4. Filtrera övningar efter tillåten utrustning.
5. Skapa huvudpass.
6. Kontrollera sekvensregler.
7. Returnera Workout.

---

## B.16 Intensitetsregler

### Normal

Tillåtna övningar:

```
normal
```

Ett Normal-pass innehåller aldrig hårda övningar. Generatorn får aldrig bryta mot denna regel.

---

### Tufft

Tillåtna övningar:

```
hard
```

Om en plats saknar hård kandidat (t.ex. drag-platsen helt utan utrustning) får platsen som reserv fyllas med en `normal`-övning (se B.20).

---

## B.17 Passmallar

Generatorn bygger alltid pass utifrån mallar.

Den skapar aldrig ett helt slumpmässigt pass.

En mall (`WorkoutTemplate.patterns`) anger vilka rörelsegrupper passet ska innehålla - en omärkt lista, inte en fast ordning. Sedan v1.8 slumpar `generateWorkout` ordningen på rörelsegrupperna för varje genereringsförsök (se B.20), så ingen rörelsegrupp har en bestämd position i det färdiga passet. Det garanterar bara balans mellan:

* knä
* höft
* press
* drag
* bål
* puls

- oberoende av i vilken ordning platserna hamnar. Standard- och Längre-pass innehåller dessutom alltid minst en vadövning; på Kortare är vad valfritt (se `07-generator-specifikation.md` §10).

Bardrag (chins/pull-ups, `primaryPattern: "vertical_pull"`) är sedan v1.9 en garanterad kärnövning: minst 1x på Kortare, 2x på Standard, 3x på Längre, när chinsstång finns. På Kortare sker det inte via en egen namngiven plats utan genom att den breda `pull`-platsen föredrar bardrag när chinsstång finns; på Standard/Längre via flera explicita `chinup`-platser (se `07-generator-specifikation.md` §6).

---

## B.18 Slumpning

När flera kandidater återstår ska generatorn slumpa.

Alla kandidater ska ha samma sannolikhet.

Ingen viktning används i MVP.

---

## B.19 Sekvensregler

Generatorn ska kontrollera:

* `avoidAdjacent` (två övningar som finns i varandras `avoidAdjacent`)
* två hoppövningar (`jump`) i rad
* två explosiva övningar (`explosive`) i rad
* två isometriska övningar (`movementType: "isometric"`) i rad
* två ensidiga övningar (`unilateral`) i rad
* två övningar med samma `primaryPattern` i rad
* två hängande övningar (`bodyPosition: "hanging"`) i rad
* tre övningar med `bodyPosition: "floor"` i rad — **avstängd** om användaren saknar stol och/eller chinsstång (`WorkoutSettings.hasChair`/`hasPullupBar`), eftersom hårda pull-övningar utan utrustning alltid utförs på golvet och regeln annars gör Tufft praktiskt taget omöjligt att generera för Standard/Längre (se `07-generator-specifikation.md` §8 och `docs/loggbok.md`)
* tre övningar vars `muscleGroups` innehåller `"legs"` i rad

De två sistnämnda reglerna (två ensidiga i rad, tre benövningar i rad) kan dessutom stängas av som sista utväg för hela passet om ingen giltig sekvens går att generera med dem aktiva (se B.20 och `07-generator-specifikation.md` §13). Generatorn försöker alltid först med samtliga regler aktiva.

Denna lista är synkroniserad med `03-exercise-library-specification.md` §14 och `07-generator-specifikation.md` §8, som är den fullständiga och gällande referensen.

---

## B.20 Fallback

**Per plats i passmallen** (se `07-generator-specifikation.md` §7): om ingen kandidat hittas med strikta villkor (unik övning, primärt mönster, korrekt intensitet) luckras filtren upp i åtta nivåer — upprepning tillåten, sekundärt mönster tillåtet och nedgraderad intensitet tillåten, i alla kombinationer, i den ordningen. Ger den sista nivån heller ingen kandidat kastas ett fel och hela försöket görs om (se nedan).

**För hela passet:**

1. Slumpa en ny ordning på mallens rörelsegrupper (se B.17). Bygg en fullständig sekvens i den ordningen med alla sekvensregler (B.19) aktiva. Validera. Vid fel (ogiltig ordning eller sekvens), slumpa en ny ordning och prova igen. Max 50 försök.
2. Lyckas inget av dessa: gör om samma sak med reglerna "två ensidiga i rad" och "tre benövningar i rad" avstängda. Max 50 nya försök.

Steg 2 krävs på Tufft-intensitet eftersom hard-poolerna för bål och höft är så tunna att nästan alla kandidater delar muskelgrupp `"legs"` och/eller är ensidiga, vilket annars gör vissa passmallar olösliga (se `docs/loggbok.md`).

Om generatorn fortfarande misslyckas efter båda stegen returneras ett fel som fångas av appen.

---

## B.21 TimerModel

Timern arbetar endast med ett Workout.

```typescript
export interface TimerState {

    currentBlock: number;

    remainingSeconds: number;

    isRunning: boolean;

    isPaused: boolean;

}
```

Timern känner inte till React.

---

## B.22 AppState

Applikationens globala state.

```typescript
export interface AppState {

    screen: Screen;

    workout?: Workout;

    timer: TimerState;

    settings: WorkoutSettings;

}
```

---

## B.23 Screen

```typescript
type Screen =

    | "start"

    | "workout"

    | "paused"

    | "finished";
```

---

## B.24 State Machine

```text
START

↓

Workout Generated

↓

Exercise 1

↓

Exercise 2

↓

...

↓

Exercise N

↓

Finished

↓

Back to Start
```

Passet genereras och startar direkt när användaren trycker på STARTA PASS - det finns ingen mellanliggande skärm, och hela den valda tiden används till själva träningspasset.

Paus kan ske från:

* Exercise

Inte från:

* Start
* Finished

---

## B.25 Timerregler

Varje block är exakt:

```
60 sekunder
```

Ingen individuell tidsjustering finns i MVP.

`WorkoutTimer.skip()` avslutar det aktuella blocket omedelbart och startar nästa block med dess fulla 60 sekunder räknat från anropsögonblicket - en engångshandling, till skillnad från `tick()`s kumulativa katch-up-logik som håller schemat efter bakgrundsfördröjning. Om det skippade blocket var det sista avslutas passet på samma sätt som vid normal timeout (`onFinish`). Giltigt endast medan passet pågår (`screen === "workout"`), inte under paus. Ingen bekräftelsedialog, ingen historik över skippade övningar.

---

## B.26 Affärslogik kontra UI

Följande får aldrig finnas i React-komponenterna:

* filtrering av övningar
* slumpning
* sekvensregler
* timerlogik
* träningslogik

React ska endast:

* visa data
* ta emot användarinput
* anropa affärslogiken

---

## B.27 Felhantering

Generatorn ska kasta tydliga fel.

Exempel:

```text
NoExercisesFound

InvalidWorkoutTemplate

SequenceGenerationFailed
```

UI visar aldrig dessa fel direkt.

Appen ska istället försöka skapa ett nytt pass eller visa ett användarvänligt felmeddelande.

---

## B.28 Framtidssäkerhet

Domänmodellen ska kunna utökas utan att bryta befintlig kod.

Exempel på framtida tillägg:

* egen utrustning
* skador och begränsningar
* träningshistorik
* progression
* AI-genererade pass
* personliga mål

Den nuvarande modellen ska kunna stödja dessa utan större omstrukturering.

---

# Del C – UI, komponenter och PWA

## C.1 Syfte

Detta avsnitt beskriver användargränssnittet, komponentarkitekturen och PWA-funktionaliteten för svinstark.

Målet är att skapa en app som känns snabb, lugn och självklar att använda.

---

## C.2 Designfilosofi

UI ska följa dessa principer:

* Mobile First
* Ett beslut per skärm
* Minimalism
* Hög läsbarhet
* Mycket luft
* Inga distraktioner

Användaren ska aldrig behöva fundera över hur appen fungerar.

---

## C.3 Skärmflöde

```text
Start

↓

Workout

↓

Paused

↓

Workout

↓

Finished

↓

Start
```

Passet genereras och startar direkt från Start. Ingen annan navigering behövs i MVP.

---

## C.4 React-komponenter

```text
App

├── StartScreen
│   ├── Logo
│   ├── DurationSelector
│   ├── IntensitySelector
│   ├── SoundToggle
│   └── StartButton
│
├── WorkoutScreen
│   ├── TimerDisplay
│   ├── ExerciseCard
│   ├── WorkoutProgress
│   ├── PauseButton
│   └── StopButton
│
├── PauseDialog
│
└── FinishedScreen
    └── HomeButton
```

Alla komponenter ska ha ett tydligt ansvar.

---

## C.5 StartScreen

Visar:

* svinstark
* Kort tagline: "Träna med minsta effektiva dosen"
* Helkropp · Tidseffektivt · Regelstyrt (value props)
* Träningstid
* Intensitet
* Utrustning: Chinsstång, Stol/pall, Fria vikter (se B.7/B.7a)
* Informationsikon (öppnar `AboutModal`), uppe till höger, större variant (se C.22)
* Starta pass
* Installationsruta (`InstallPrompt`, se C.28a), diskret under Starta pass

Visar inte längre en ljudikon - flyttad till WorkoutScreen (se C.7/C.19), eftersom ljud är mest relevant medan passet faktiskt pågår. Den längre förklarande texten som tidigare stod på startsidan (om minsta effektiva dosen m.m.) flyttades till `AboutModal` för att hålla startsidan kort och direkt.

Standardval:

* Standard (14 min)
* Normal
* Chinsstång: Ja, Stol/pall: Ja, Fria vikter: Nej
* Ljud på

---

## C.6 (utgått)

Skärmen mellan Start och Workout (tidigare en valfri uppvärmningsskärm) är borttagen. Passet genereras och startar direkt när användaren trycker STARTA PASS - hela den valda tiden används till själva träningspasset.

---

## C.7 WorkoutScreen

WorkoutScreen är appens viktigaste vy.

Den ska endast visa:

* total längd och intensitet för passet
* ljudikon (större variant, se C.22), uppe till höger - flyttad hit från startsidan eftersom ljud är mest relevant medan passet pågår (C.19)
* stor timer
* övningsnamn - passets visuella huvudfokus, responsiv storlek (se C.9)
* instruktion
* vilken övning i ordningen (t.ex. "Övning 4 av 14")
* hoppa över (diskret textknapp, nere till höger direkt ovanför Paus/Avsluta, se B.25)
* paus
* avsluta

Den ska inte visa:

* nästa övning
* passlista
* statistik
* kalorier
* träningshistorik

---

## C.8 TimerDisplay

Timern är den viktigaste komponenten.

Krav:

* mycket stor
* lättläst
* tydlig kontrast

Visar endast:

```text
00:43
```

Ingen cirkulär progressring i MVP.

---

## C.9 ExerciseCard

Visar:

* övningsnamn
* kort instruktion

Exempel:

```text
Armhävningar

Håll kroppen rak.
Sänk kontrollerat.
Pressa upp.
```

Ingen bild.

Ingen video.

Ingen animation.

Övningsnamnet är skärmens visuella huvudfokus under passet och renderas märkbart större än instruktionen och övrig text, med responsiv skalning (`clamp()`, golv och tak) så att korta namn förblir stora och långa namn radbryts istället för att flöda över eller krympa layouten.

---

## C.10 WorkoutProgress

Visar diskret vilken övning i ordningen användaren är på, t.ex. "Övning 4 av 14".

Uppdateras automatiskt vid varje övningsbyte.

Ska aldrig konkurrera visuellt med TimerDisplay.

---

## C.11 PauseDialog

Visar:

```text
Paus

[Fortsätt]

[Avsluta]
```

Enkel modal.

---

## C.12 FinishedScreen

Visar:

```text
Klart!

[Till start]
```

Ingen statistik.

Ingen summering.

Ingen konfetti.

---

## C.13 Knappar

Alla knappar ska:

* vara stora
* vara tydliga
* ha konsekvent utseende

Minsta tryckyta:

44 × 44 px

---

## C.14 Färgpalett

MVP använder få färger.

Primär:

* mörk text
* ljus bakgrund

Accent:

* en primär accentfärg

Statusfärger används sparsamt.

---

## C.15 Typografi

Prioritet:

1. Timer
2. Övningsnamn
3. Instruktion
4. Knappar

Produkten ska kännas lugn.

---

## C.16 Animationer

Animationer används endast när de hjälper användaren.

Tillåtna:

* mjuka övergångar
* knappfeedback
* fade mellan övningar

Inte tillåtna:

* studs
* konfetti
* blinkningar
* långa animationer

---

## C.17 Responsiv design

Appen utvecklas Mobile First.

Målbredd:

320–430 px

Ska även fungera på surfplatta.

Desktop är sekundärt.

---

## C.18 Tillgänglighet

Krav:

* hög kontrast
* stora knappar
* tydlig text
* fungerande med tangentbord
* ARIA-attribut där det behövs

Färg får aldrig vara enda informationsbärare.

---

## C.19 Ljud

Ljud används endast som stöd.

Signaler:

* ny övning
* sista tre sekunderna
* pass klart

Ljud ska kunna stängas av. Detta görs via en ljudikon (🔊/🔇) uppe till höger på WorkoutScreen, inte via en separat inställningsskärm (se B.9). Placerad på träningsskärmen snarare än startsidan eftersom ljud är mest relevant medan passet faktiskt pågår - en tryckning gäller omedelbart för det pågående passet, inte bara framtida pass.

---

## C.20 Komponentprinciper

Komponenter ska:

* vara små
* återanvändbara
* testbara

De ska inte innehålla affärslogik.

---

## C.21 CSS-struktur

Varje större komponent får en egen CSS Module.

Exempel:

```text
WorkoutScreen.tsx
WorkoutScreen.module.css
```

Gemensamma variabler ligger i global CSS.

---

## C.22 Ikoner

Endast enkla ikoner används.

Exempel:

* play
* pause
* stop
* speaker

Ikoner ska stödja text, inte ersätta den.

`IconButton` har två storlekar: standard (44×44 px) och en större variant (56×56 px, `size="large"`) för ikoner som ska vara extra lätta att upptäcka och trycka på - informationsikonen på startsidan och ljudikonen på WorkoutScreen (se C.5/C.7/C.19). Båda är fortfarande sekundära (ingen ram eller fylld bakgrund).

---

## C.23 PWA

Appen ska kunna installeras på:

* iPhone
* Android
* Desktop

Installationen ska ge en app-liknande upplevelse.

Startsidan visar en diskret, valbar installationsruta (`InstallPrompt`) för att göra installationen tydligare, se C.28a.

---

## C.24 Manifest

Manifestet ska innehålla:

* namn
* kortnamn
* ikon (`"any"` och `"maskable"`, se C.25)
* theme color
* background color
* standalone

Appen ska öppnas utan webbläsarens adressfält.

---

## C.25 Ikoner (format)

Appen ska innehålla minst:

* 192×192 px och 512×512 px, `purpose: "any"`
* 192×192 px och 512×512 px, `purpose: "maskable"` (motivet inom Androids säkerhetszon, en cirkel med diameter 80 % av kanvasen, så att runda/squircle-launchermasker inte klipper bort det)
* en Apple touch icon, 180×180 px, utan egen rundning eller transparens (iOS applierar sin egen mask)

PNG-format.

Ikonen är ett enda bokstavsmonogram ("S") i appens svart/vita palett - inte en dubbel "SS" (kan associeras med historisk symbolik och undviks därför uttryckligen) och inte heller en illustration i MVP. Se `docs/loggbok.md` v1.3.

---

## C.26 Service Worker

Service Worker ska:

* cachelagra appens filer
* göra appen användbar offline
* uppdatera cache kontrollerat

Ingen dynamisk cache behövs i MVP.

---

## C.27 Offline

Efter första laddningen ska följande fungera utan internet:

* starta app
* generera pass
* timer
* ljud

Ingen funktion i MVP kräver nätverk.

---

## C.28 Lokal lagring

MVP använder lokal lagring för:

* hela `WorkoutSettings` (B.9): senaste valda träningstid, intensitet, ljud på/av, chinsstång, stol/pall och fria vikter
* om användaren stängt installationsrutan (`svinstark:install-prompt-dismissed`, se C.28a) - permanent, tills webbläsarens lagring rensas

Ingen träningshistorik sparas.

---

## C.28a InstallPrompt

Självständig, propless komponent på startsidan (under STARTA PASS) som avgör helt själv om, och i vilken variant, installationsinformation ska visas:

* **Döljs helt** om appen körs i standalone-läge (`matchMedia("(display-mode: standalone)")` eller `navigator.standalone` på iOS), eller om användaren tidigare stängt den (C.28)
* **Riktig installationsknapp** om webbläsaren skjutit upp ett `beforeinstallprompt`-event (Chrome/Edge, både Android och desktop) - triggar webbläsarens egen dialog via `event.prompt()`
* **iOS-instruktion** (kort text om Dela-ikonen) om enheten är en iPhone/iPad/iPod, eftersom Safari aldrig skickar `beforeinstallprompt`
* **Generell instruktion** om webbläsarens meny annars

Läsning av `localStorage`/`navigator`/`matchMedia` sker via `useSyncExternalStore` (samma mönster som B.9/`useSettings`), inte ett vanligt `useEffect`+`setState`, för att undvika en hydreringskrock mellan serverns första rendering (utan `window`) och klientens.

---

## C.29 Prestanda

Mål:

* första rendering < 1 sekund
* knapprespons < 100 ms
* timer utan hack
* inga onödiga renderingar

---

## C.30 Deployment

Appen publiceras på Vercel.

Produktionsflöde:

```text
GitHub

↓

Vercel

↓

https://svinstark.se
```

Deployment ska ske automatiskt från huvudgrenen.

---

## C.31 Browserstöd

MVP ska fungera i:

* Safari (iOS)
* Chrome
* Edge
* Firefox

Äldre webbläsare prioriteras inte.

---

## C.32 Definition av färdig UI

UI är färdigt när användaren kan:

1. Öppna appen.
2. Välja träningstid.
3. Välja intensitet.
4. Starta pass.
5. Följa timern.
6. Följa instruktionerna.
7. Pausa.
8. Avsluta.
9. Slutföra passet.
10. Starta ett nytt pass.

Allt utan instruktioner och utan att behöva fundera över hur appen fungerar.

---

# Del D – Kvalitet, testning och implementation

## D.1 Syfte

Detta avsnitt beskriver hur svinstark ska utvecklas, testas och kvalitetssäkras.

Målet är att säkerställa en stabil, lättunderhållen och förutsägbar kodbas.

---

## D.2 Utvecklingsprincip

Utvecklingen ska ske inkrementellt.

Varje steg ska:

* vara litet
* kunna testas isolerat
* kunna återställas
* inte introducera onödig komplexitet

Ingen större funktion implementeras förrän föregående steg fungerar.

---

## D.3 Definition of Done

En funktion är färdig först när:

* den fungerar enligt specifikationen
* koden är läsbar
* TypeScript saknar fel
* projektet bygger utan varningar
* manuell testning är genomförd
* dokumentationen är uppdaterad vid behov

Kod som bara "verkar fungera" är inte färdig.

---

## D.4 Kvalitetsprinciper

Projektet ska prioritera:

* korrekthet före snabb utveckling
* enkelhet före smarta lösningar
* tydlighet före kort kod
* förutsägbarhet före flexibilitet

När två lösningar är likvärdiga ska den enklaste väljas.

---

## D.5 Kodstandard

All kod ska:

* använda TypeScript
* följa projektets namngivningsstandard
* ha tydliga funktioner
* undvika duplicering
* undvika magiska tal
* använda konstanter där det är lämpligt

---

## D.6 Kodgranskning

Vid varje större implementation ska Claude Code redovisa:

* vilka filer som skapats
* vilka filer som ändrats
* varför ändringarna gjorts
* eventuella avvikelser från specifikationen

---

## D.7 Felhantering

Applikationen ska hantera fel på ett kontrollerat sätt.

Användaren ska aldrig mötas av:

* stack traces
* tekniska felmeddelanden
* tomma skärmar

Istället ska appen:

* försöka återhämta sig
* skapa ett nytt pass vid behov
* visa ett enkelt felmeddelande om återhämtning inte är möjlig

---

## D.8 Logging

I utvecklingsläge får appen använda `console`.

I produktionsläge ska onödiga loggutskrifter tas bort.

Ingen användardata ska loggas.

---

## D.9 Testnivåer

Projektet använder tre nivåer av testning.

### Nivå 1

Manuell testning.

Genomförs kontinuerligt.

---

### Nivå 2

Logiska tester.

Exempel:

* generator
* timer
* sekvensregler

---

### Nivå 3

Integrationstest.

Kontrollera att:

* UI
* timer
* generator

samverkar korrekt.

---

## D.10 Test av passgenerator

Generatorn ska verifieras genom att skapa ett stort antal pass.

Minimikrav:

* 100 korta pass
* 100 standardpass
* 100 långa pass

För varje intensitetsnivå.

Kontrollera:

* korrekt antal övningar
* korrekt intensitet
* inga förbjudna sekvenser
* inga otillåtna redskap
* inga dubbla övningar där regler förbjuder det

---

## D.11 Test av timer

Verifiera:

* start
* paus
* fortsätt
* stopp
* blockbyte
* avslut

Timer ska hålla korrekt tid även om appen tillfälligt hamnar i bakgrunden.

---

## D.12 UI-test

Verifiera:

* stora knappar
* korrekt timer
* rätt övning visas
* ingen nästa övning visas
* instruktionen är läsbar
* paus fungerar
* avsluta fungerar

---

## D.13 PWA-test

Verifiera:

* installation fungerar
* appikon visas korrekt
* appen startar i standalone-läge
* offline fungerar efter första laddning
* manifest laddas korrekt
* service worker registreras

---

## D.14 Prestandatest

Mål:

* appstart under 1 sekund
* passgenerering under 50 ms
* timer uppdateras utan synligt hack
* inga märkbara fördröjningar vid blockbyte

---

## D.15 Kompatibilitet

Verifiera på:

iPhone Safari

Android Chrome

Chrome Desktop

Edge

Firefox

---

## D.16 Tillgänglighet

Kontrollera:

* tillräcklig kontrast
* läsbar text
* stora tryckytor
* fokusmarkeringar
* skärmläsare fungerar för grundläggande funktioner

---

## D.17 Git-strategi

Projektet använder Git.

Rekommenderad huvudgren:

```text
main
```

Nya funktioner utvecklas i separata brancher.

Exempel:

```text
feature/timer

feature/generator

feature/pwa
```

---

## D.18 Commits

Commits ska vara små.

Exempel:

```text
Add workout generator

Implement timer

Add PWA support

Improve sequence rules
```

Undvik stora "allt-i-ett"-commits.

---

## D.19 Deployment

Automatisk deployment från GitHub till Vercel.

Flöde:

```text
Local Development

↓

Git Commit

↓

GitHub

↓

Vercel Build

↓

Production
```

Produktionsgrenen är alltid:

```text
main
```

---

## D.20 Versionshantering

Semantisk versionshantering används.

Exempel:

```text
1.0.0

1.1.0

1.2.0

2.0.0
```

---

## D.21 Dokumentation

Vid större förändringar ska följande uppdateras vid behov:

* teknisk specifikation
* övningsbibliotek
* roadmap

Produkt- och designprinciper ändras endast om funktionaliteten faktiskt förändras.

---

## D.22 Claude Code-arbetsflöde

Varje större arbetsuppgift ska följa samma struktur:

1. Läs relevant dokumentation.
2. Sammanfatta uppgiften.
3. Identifiera eventuella oklarheter.
4. Implementera.
5. Bygg projektet.
6. Rätta eventuella fel.
7. Redovisa ändringarna.
8. Beskriv hur funktionen testas.

Claude Code ska inte påbörja nästa större steg utan att föregående steg fungerar.

---

## D.23 Acceptanskriterier för MVP

MVP anses färdig när följande fungerar:

* Startskärmen visas korrekt.
* Träningstid kan väljas.
* Intensitet kan väljas.
* Pass genereras korrekt.
* Samtliga övningar visas i rätt ordning.
* Timern fungerar genom hela passet.
* Paus fungerar.
* Avsluta fungerar.
* Färdigskärm visas.
* Appen fungerar offline efter första laddning.
* Appen kan installeras som PWA.

---

## D.24 Tekniska mål

Projektet ska efter MVP uppfylla följande:

* Modulär arkitektur
* Ingen beroendecykel mellan moduler
* Affärslogik helt frikopplad från UI
* Full TypeScript-typning
* Enkel att vidareutveckla
* Enkel att testa
* Enkel att förstå för nya utvecklare

---

## D.25 Långsiktig målbild

Den tekniska plattformen ska kunna bära framtida funktioner utan större ombyggnad, exempelvis:

* träningshistorik
* personlig progression
* egna övningar
* alternativa passmallar
* AI-stöd
* Apple Watch och Wear OS
* fler språk
* synkronisering mellan enheter

Arkitekturen ska därför vara stabil, modulär och lätt att utöka, samtidigt som MVP hålls så liten och fokuserad som möjligt.
