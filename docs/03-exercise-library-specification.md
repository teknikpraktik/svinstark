# svinstark – Exercise Library Specification

**Filnamn:** `03-exercise-library-specification.md`
**Version:** 2.1
**Status:** Arbetsdokument

---

# 1. Syfte

Detta dokument beskriver svinstark övningsbibliotek.

Dokumentet är den tekniska specifikationen för all träningsdata och ska kunna användas som underlag för:

```text
src/data/exerciseData.ts
```

Övningsbiblioteket ska vara helt frikopplat från användargränssnittet.

---

# 2. Designprinciper

Övningsbiblioteket ska vara:

* datadrivet
* lätt att utöka
* oberoende av UI
* oberoende av passgeneratorn
* typat med TypeScript
* konsekvent klassificerat

Nya övningar ska kunna läggas till utan att generatorn behöver ändras.

---

# 3. Tillåten utrustning

Endast följande utrustning får förekomma i MVP:

```ts
export type Equipment =
  | "bodyweight"
  | "floor"
  | "chair"
  | "pullup_bar";
```

Ingen annan utrustning används i MVP.

---

# 4. Rörelsemönster

Varje övning ska ha ett primärt rörelsemönster.

```ts
export type ExercisePattern =
  | "knee"
  | "hip"
  | "horizontal_push"
  | "vertical_push"
  | "horizontal_pull"
  | "vertical_pull"
  | "core"
  | "conditioning"
  | "balance"
  | "mobility";
```

Sekundära rörelsemönster får användas.

---

# 5. Intensitetsklass

Varje övning klassificeras som:

```ts
export type ExerciseIntensity =
  | "calm"
  | "normal"
  | "hard";
```

Mappning i användargränssnittet:

```text
calm   = Lugnt
normal = Normalt
hard   = Tufft
```

---

# 6. Belastningsnivåer

Subjektiva femgradiga skalor ska inte användas i MVP.

I stället används tydliga nivåer:

```ts
export type DemandLevel =
  | "low"
  | "medium"
  | "high";
```

Används för:

* strengthDemand
* cardioDemand
* mobilityDemand
* balanceDemand
* coordinationDemand

---

# 7. Kroppsposition

```ts
export type BodyPosition =
  | "standing"
  | "floor"
  | "kneeling"
  | "hanging";
```

---

# 8. Rörelsetyp

```ts
export type MovementType =
  | "dynamic"
  | "isometric";
```

---

# 9. Belastning mot leder

```ts
export type Impact =
  | "low"
  | "medium"
  | "high";
```

---

# 10. Rörelseplan

```ts
export type MovementPlane =
  | "sagittal"
  | "frontal"
  | "transverse"
  | "multi";
```

Definition:

* `sagittal`: framåt/bakåt, böj/sträck
* `frontal`: sidled
* `transverse`: rotation
* `multi`: kombinerade rörelser

---

# 11. Muskelgrupper

```ts
export type MuscleGroup =
  | "legs"
  | "glutes"
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "core"
  | "full_body";
```

Används främst för framtida funktioner och för enklare analys av passbalans.

---

# 12. Datamodell

Varje övning ska följa exakt denna modell.

```ts
export interface Exercise {
  // Identitet
  id: string;
  name: string;
  instruction: string;

  // Klassificering
  primaryPattern: ExercisePattern;
  secondaryPatterns: ExercisePattern[];
  intensity: ExerciseIntensity;
  equipment: Equipment[];
  muscleGroups: MuscleGroup[];

  // Objektiva egenskaper
  bodyPosition: BodyPosition;
  movementType: MovementType;
  movementPlane: MovementPlane;
  impact: Impact;

  explosive: boolean;
  unilateral: boolean;
  jump: boolean;
  rotation: boolean;
  overhead: boolean;
  locomotion: boolean;

  // Belastning
  strengthDemand: DemandLevel;
  cardioDemand: DemandLevel;
  mobilityDemand: DemandLevel;
  balanceDemand: DemandLevel;
  coordinationDemand: DemandLevel;

  // Generatorregler
  avoidAdjacent: string[];
}
```

---

# 13. Metadata – syfte

| Fält                 | Syfte                                             |
| -------------------- | ------------------------------------------------- |
| `id`                 | Stabil identifierare i kod                        |
| `name`               | Visas för användaren                              |
| `instruction`        | Kort textinstruktion                              |
| `primaryPattern`     | Passmallar och rörelsemönster                     |
| `secondaryPatterns`  | Variation och sekundär belastning                 |
| `intensity`          | Filtrering utifrån Lugnt/Normalt/Tufft            |
| `equipment`          | Säkerställer att bara tillåten utrustning används |
| `muscleGroups`       | Analys och framtida progression                   |
| `bodyPosition`       | Växling mellan stående/golv/hängande              |
| `movementType`       | Dynamisk/isometrisk variation                     |
| `movementPlane`      | Variation mellan framåt/sidled/rotation           |
| `impact`             | Ledbelastning och framtida skonsamma lägen        |
| `explosive`          | Sekvensregler                                     |
| `unilateral`         | Sekvensregler                                     |
| `jump`               | Sekvensregler                                     |
| `rotation`           | Variation och framtida filter                     |
| `overhead`           | Axellast och framtida filter                      |
| `locomotion`         | Förflyttning/yta/koordination                     |
| `strengthDemand`     | Styrkekrav                                        |
| `cardioDemand`       | Konditionskrav                                    |
| `mobilityDemand`     | Rörlighetskrav                                    |
| `balanceDemand`      | Balanskrav                                        |
| `coordinationDemand` | Koordinationskrav                                 |
| `avoidAdjacent`      | Förbjudna övningskombinationer                    |

---

# 14. Generatorregler kopplade till metadata

Generatorn ska använda metadata för att undvika:

* två hoppövningar i rad
* två explosiva övningar i rad
* två isometriska övningar i rad
* två ensidiga övningar i rad
* tre övningar med `bodyPosition: "floor"` i rad
* tre övningar med `muscleGroups` som innehåller `legs` i rad
* två övningar med samma `primaryPattern` i rad
* övningar som finns i varandras `avoidAdjacent`

Generatorn ska eftersträva variation mellan:

* stående/golv/hängande
* styrka/puls/aktiv återhämtning
* sagittal/frontal/transverse/multi
* dynamisk/isometrisk
* låg/medium/hög konditionsbelastning

---

# 15. Namngivning

## `id`

* engelska
* snake_case
* stabilt över tid
* får inte ändras efter lansering om historik senare införs

Exempel:

```text
push_up
mountain_climber
split_jump
single_leg_bridge
```

## `name`

* svenska
* visas för användaren
* kort och begripligt

Exempel:

```text
Armhävningar
Mountain climbers
Split jumps
Enbenshöftlyft
```

---

# 16. Övningsbank – omfattning

MVP innehåller cirka 100 övningar fördelade på:

| Kategori          |    Antal |
| ----------------- | -------: |
| Knädominanta      |    ca 15 |
| Höftdominanta     |    ca 12 |
| Horisontell press |    ca 10 |
| Vertikal press    |   ca 2–5 |
| Horisontellt drag |   ca 3–5 |
| Vertikalt drag    |   ca 5–7 |
| Bål               | ca 12–15 |
| Kondition         | ca 10–12 |
| Balans            |     ca 8 |
| Rörlighet         |    ca 10 |

Biblioteket ska hellre vara konsekvent och kvalitetssäkrat än stort.

---

# 17. Exempelobjekt

```ts
{
  id: "push_up",

  name: "Armhävningar",

  instruction: "Håll kroppen rak. Sänk kontrollerat och pressa upp.",

  primaryPattern: "horizontal_push",

  secondaryPatterns: ["core"],

  intensity: "normal",

  equipment: ["floor"],

  muscleGroups: ["chest", "arms", "core"],

  bodyPosition: "floor",

  movementType: "dynamic",

  movementPlane: "sagittal",

  impact: "low",

  explosive: false,

  unilateral: false,

  jump: false,

  rotation: false,

  overhead: false,

  locomotion: false,

  strengthDemand: "medium",

  cardioDemand: "medium",

  mobilityDemand: "low",

  balanceDemand: "low",

  coordinationDemand: "low",

  avoidAdjacent: [
    "tempo_push_up",
    "pike_push_up"
  ]
}
```

---

# 18. Valideringsregler

Varje övning måste innehålla:

* alla fält i datamodellen
* unik `id`
* icke-tom `name`
* icke-tom `instruction`
* giltigt `primaryPattern`
* giltig `intensity`
* minst ett värde i `equipment`
* minst ett värde i `muscleGroups`

Biblioteket får inte innehålla:

* dubbla id:n
* tomma instruktioner
* okända rörelsemönster
* otillåten utrustning
* metadata som saknar definierade värden

---

# 19. Övningar som inte ska ingå i MVP

Följande ska inte användas i MVP eftersom de kräver otillåten utrustning:

* Goblet squat
* Hantelrodd
* Dubbel hantelrodd
* Hantelpress
* Axelpress med hantlar
* Enarms axelpress
* Arnold press
* Romanian deadlift med hantlar
* Bandrodd
* Farmer hold
* Kettlebell swing
* Wall ball
* Skivstångsövningar

---

# 20. Implementering

Claude Code ska skapa:

```text
src/data/exerciseData.ts
```

Filen ska exportera:

```ts
export const exerciseData: Exercise[] = [
  // exercises
];
```

TypeScript-typerna ska ligga i:

```text
src/types/workout.ts
```

---

# 21. Definition av färdigt övningsbibliotek

Övningsbiblioteket är färdigt när:

* samtliga övningar följer datamodellen
* TypeScript inte rapporterar typfel
* inga otillåtna redskap förekommer
* alla `id` är unika
* alla övningar har komplett metadata
* generatorn kan skapa alla passkombinationer utan att metadata behöver kompletteras
