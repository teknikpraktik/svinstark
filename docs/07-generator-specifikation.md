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

För varje plats i passmallen:

1. Filtrera på rörelsemönster.
2. Filtrera på intensitet.
3. Filtrera på utrustning (`"bodyweight"`/`"floor"` alltid tillåtna, `"chair"`/`"pullup_bar"` endast om användaren angett att de finns tillgängliga i Inställningar).
4. Filtrera bort redan använda övningar.
5. Filtrera bort övningar som bryter sekvensregler.
6. Slumpa bland återstående kandidater.

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
* tre golvövningar i rad — undantag: regeln stängs av om användaren saknar stol och/eller chinsstång i Inställningar, eftersom alla hårda pull-övningar utan utrustning kräver golvet och regeln annars gör Tufft omöjligt att generera för Standard/Längre
* tre benövningar i rad

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

Generatorn arbetar enligt följande:

1. Försök hitta annan övning inom samma kategori.
2. Tillåt sekundärt rörelsemönster.
3. Välj alternativ passmall.
4. Starta om genereringen.

Maximalt:

```text
50
```

försök.

Om generatorn fortfarande misslyckas returneras ett fel.

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
