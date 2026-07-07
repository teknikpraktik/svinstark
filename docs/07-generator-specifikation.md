# svinstark – Passgeneratorspecifikation

**Filnamn:** `07-generator-specifikation.md`
**Version:** 1.0
**Status:** Arbetsdokument

---

# 1. Syfte

Detta dokument beskriver exakt hur svinstark passgenerator ska fungera.

Målet är att:

* skapa varierade pass
* säkerställa balans mellan rörelsemönster
* undvika dåliga övningskombinationer
* ge användaren en upplevelse av att varje pass känns genomtänkt

Generatorn är svinstark viktigaste algoritm.

---

# 2. Grundprincip

Generatorn arbetar alltid enligt följande:

1. Läs användarens inställningar.
2. Välj passmall.
3. Filtrera övningsbiblioteket.
4. Bygg huvudpasset.
5. Kontrollera regler.
6. Returnera färdigt pass.

---

# 3. Användarens val

Generatorn får följande indata:

```ts
WorkoutSettings {

    duration: short | standard | long

    intensity: calm | normal | hard

}
```

---

# 4. Passlängder

Generatorn bygger alltid:

| Träningstid | Antal övningar |  Total |
| ----------- | -------------: | -----: |
| Kortare     |              7 |  7 min |
| Standard    |             14 | 14 min |
| Längre      |             21 | 21 min |

Alla block är exakt 60 sekunder.

---

# 5. Intensitetsfiltrering

## Lugnt

Tillåtna övningar:

```text
calm
```

---

## Normalt

Tillåtna övningar:

```text
calm
normal
```

---

## Tufft

Tillåtna övningar:

```text
hard
```

Ingen övning utanför vald intensitet får användas.

---

# 6. Passmallar

Generatorn skapar aldrig ett helt slumpmässigt pass.

Den arbetar alltid utifrån en mall.

Exempel på mall för 7 huvudövningar:

```text
knee
push
conditioning
pull
core
hip
balance_or_mobility
```

Exempel på mall för 14 huvudövningar:

```text
knee
push
conditioning
pull
core
hip
mobility
conditioning
push
balance
hip
pull
core
wildcard
```

Passmallarna definieras i `workoutTemplates.ts`.

---

# 7. Kandidaturval

För varje plats i passmallen filtreras övningsbiblioteket på:

* rörelsemönster (matchar `primaryPattern`, se mappningstabellen i `02-teknisk-specifikation.md` B.13)
* intensitet
* utrustning (`"bodyweight"`/`"floor"` alltid tillåtna, `"chair"`/`"pullup_bar"` endast om användaren angett att de finns tillgängliga i Inställningar)
* redan använda övningar (exkluderas)
* sekvensregler (se §8)

Om ingen kandidat hittas med strikta villkor (unik övning, endast primärt mönster, korrekt intensitet), luckras filtren upp stegvis i åtta nivåer, i denna prioritetsordning:

1. unik övning · primärt mönster · korrekt intensitet
2. unik övning · **primärt eller sekundärt mönster** · korrekt intensitet
3. **upprepad övning tillåten** · primärt mönster · korrekt intensitet
4. upprepad övning tillåten · primärt eller sekundärt mönster · korrekt intensitet
5. unik övning · primärt mönster · **närmast lägre intensitet tillåten**
6. unik övning · primärt eller sekundärt mönster · närmast lägre intensitet tillåten
7. upprepad övning tillåten · primärt mönster · närmast lägre intensitet tillåten
8. upprepad övning tillåten · primärt eller sekundärt mönster · närmast lägre intensitet tillåten

Den första nivån som ger minst en kandidat används. Ordningen (unikt före upprepning, korrekt intensitet före nedgraderad) valdes eftersom vissa kombinationer av mönster/intensitet/utrustning (t.ex. drag på Tufft utan stol/chinsstång) annars saknar övningar helt. Se `docs/loggbok.md`.

Bland återstående kandidater på den nivå som används slumpas en övning fram (alla med samma sannolikhet, se §12).

---

# 8. Sekvensregler

Generatorn får aldrig skapa:

* två hoppövningar i rad
* två explosiva övningar i rad
* två isometriska övningar i rad
* två ensidiga övningar i rad
* två övningar med samma `primaryPattern` i rad
* två övningar som finns i varandras `avoidAdjacent`
* två hängande övningar i rad
* tre golvövningar i rad — undantag: regeln stängs av helt om användaren saknar stol och/eller chinsstång i Inställningar, eftersom alla hårda pull-övningar utan utrustning kräver golvet och regeln annars gör Tufft omöjligt att generera för Standard/Längre
* tre benövningar i rad (`muscleGroups` innehåller `"legs"`)

Två av reglerna ovan (två ensidiga övningar i rad, tre benövningar i rad) kan stängas av som sista utväg för hela passet, se §13. Generatorn försöker alltid först generera med samtliga regler aktiva.

---

# 9. Variationsregler

Generatorn ska eftersträva variation mellan:

* stående och golv
* sagittal, frontal, transversal och multipel rörelseplan
* styrka och puls
* höger/vänster belastning
* dynamiska och statiska övningar
* över- och underkropp

Variation är ett mål, men får aldrig bryta passmallen.

---

# 10. Rörelsebalans

Varje pass ska innehålla minst en övning inom:

* knädominant
* höftdominant
* press
* drag
* bål
* kondition

Dessutom ska minst en av följande förekomma:

* balans
* rörlighet

---

# 11. Wildcard

Om passmallen innehåller:

```text
wildcard
```

får generatorn välja valfri övning som:

* inte bryter sekvensregler
* inte redan används
* passar vald intensitet

---

# 12. Slumpning

När flera kandidater återstår:

Alla kandidater har samma sannolikhet.

Ingen viktning används i MVP.

---

# 13. Om inga kandidater finns

Per plats i passmallen hanteras brist på kandidater av de åtta fallback-nivåerna i §7 (upprepning, sekundärt mönster, nedgraderad intensitet). Om ingen övning hittas ens på den sista nivån avbryts försöket.

För hela passet:

1. Generera en fullständig sekvens med samtliga sekvensregler (§8) aktiva. Validera resultatet (§17). Vid fel, prova igen med en ny slumpad sekvens — maximalt 50 försök.
2. Om inget av dessa 50 försök gav ett giltigt pass: gör om samma sak, men med reglerna "två ensidiga övningar i rad" och "tre benövningar i rad" avstängda — återigen maximalt 50 försök.

Detta andra steg krävs för Tufft-intensitet: hard-poolerna för bål, höft och rörlighet är så tunna att nästan alla kandidater delar `muscleGroups: "legs"` och/eller är ensidiga, vilket annars gör vissa passmallar olösliga (se `docs/loggbok.md`).

Om generatorn fortfarande misslyckas efter båda stegen returneras ett fel.

---

# 14. Dubbletter

Samma övning får inte förekomma två gånger i samma pass.

Undantag:

Inga.

---

# 15. Resultat

Generatorn returnerar:

```text
Workout

↓

Exercise Blocks
```

UI bestämmer endast hur detta visas.

---

# 16. Kvalitetskrav

Ett genererat pass ska upplevas som:

* varierat
* balanserat
* logiskt
* fysiskt sammanhängande
* utan onödiga positionsbyten

---

# 17. Validering

Efter att ett pass skapats ska generatorn kontrollera:

* korrekt antal övningar
* korrekt längd
* korrekt intensitet
* inga dubbletter
* inga förbjudna sekvenser
* alla kategorier representerade

Misslyckas någon kontroll ska ett nytt pass genereras.

---

# 18. Definition av ett bra pass

Ett pass anses vara bra när:

* det känns varierat
* det tränar hela kroppen
* övningarna flyter naturligt
* intensiteten motsvarar användarens val
* användaren slipper fundera på ordningsföljden

Det viktigaste kvalitetskriteriet är att användaren upplever passet som genomtänkt snarare än slumpmässigt.

---

# 19. Framtida utveckling

Generatorn är utformad för att kunna utökas med:

* adaptiv svårighetsgrad
* personliga preferenser
* skonsamma lägen (knä, axel, handled)
* träningshistorik
* progression
* AI-optimerade pass

Dessa funktioner ska kunna läggas till utan att generatorns grundarkitektur behöver skrivas om.
