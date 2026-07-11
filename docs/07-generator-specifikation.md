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

Generatorn får följande indata, samtliga valda på startsidan (se `01-produktspecifikation.md` §9):

```ts
WorkoutSettings {

    duration: short | standard | long

    intensity: normal | hard

    hasChair: boolean

    hasPullupBar: boolean

    freeWeights: none | light | heavy

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

## Normal

Tillåtna övningar:

```text
normal
```

Ett Normal-pass innehåller aldrig hårda övningar.

---

## Tufft

Tillåtna övningar:

```text
hard
```

Om en plats saknar hård kandidat får platsen som reserv fyllas med en `normal`-övning via fallback-nivåerna i §7 (i praktiken drag-platsen helt utan utrustning). Bland dessa reserver föredras kandidater med minst medelhögt styrkekrav (`strengthDemand`) - hellre att en krävande övning som kroppsrodd återkommer oftare än att en lätt övning tas in för variationens skull. Fallback åt andra hållet finns inte.

---

# 6. Passmallar

Generatorn skapar aldrig ett helt slumpmässigt pass.

Den arbetar alltid utifrån en mall.

En mall anger VILKA rörelsegrupper ett pass ska innehålla - som en omärkt lista, inte en fast ordning. Generatorn slumpar ordningen på rörelsegrupperna för varje genereringsförsök (se §9 och §13), så listorna nedan visar mallens innehåll, inte den ordning övningarna kommer i.

Mall för 7 huvudövningar (Kortare):

```text
knee
push
conditioning
pull
core
hip
wildcard
```

På sju minuter ligger fokus på de stora rörelsemönstren - vadövning är möjlig via wildcard-platsen men inget krav. `pull`-platsen föredrar bardrag (chins/pull-ups/dead hang) när chinsstång finns - se §7.

Mall för 14 huvudövningar (Standard) bygger på namngivna kärnrörelse-familjer (se `02-teknisk-specifikation.md` B.13):

```text
hip_dominant
conditioning
pushup_rotation
horizontal_pull_row
anti_rotation_core
squat
side_plank
lunge_forward
glute_bridge
chinup
overhead_press
lunge_reverse
chinup
calf
```

`chinup` förekommer två gånger (sedan v1.9, ersätter den tidigare `lunge_lateral`-platsen) - bardrag är en garanterad kärnövning, se §7.

Mallen för 21 huvudövningar (Längre) utökar Standard-mallen med en andra omgång av utvalda familjer samt extra bål- och wildcard-platser. `chinup` förekommer tre gånger (den tidigare `lunge_lateral`-platsen och den tidigare extra press-platsen från v1.7 är sedan v1.9 två ytterligare `chinup`-platser). Passmallarna definieras i `workoutTemplates.ts`.

---

# 7. Kandidaturval

För varje plats i passmallen filtreras övningsbiblioteket på:

* rörelsemönster (matchar `primaryPattern`, se mappningstabellen i `02-teknisk-specifikation.md` B.13)
* intensitet
* utrustning (`"bodyweight"`/`"floor"` alltid tillåtna, `"chair"`/`"pullup_bar"` endast om användaren angett att de finns tillgängliga på startsidan, `"weights_light"`/`"weights_heavy"` styrt av startsidans val Fria vikter - `"heavy"` ger tillgång till båda)
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

**Undantag - bardrag (v1.9):** när den breda `pull`-platsen (Kortare, se §6) löses som den PRIMÄRA mallplatsen filtreras kandidaterna på varje nivå ytterligare: finns det minst en `vertical_pull`-kandidat (chins/pull-ups/dead hang) används bara sådana. Det gör bardrag till en garanterad kärnövning istället för att konkurrera på lika villkor med rodd/liggande Y-lyft om samma plats. Undantaget gäller uttryckligen INTE när `pull` används som `FAMILY_FALLBACK`-reserv (t.ex. för `horizontal_pull_row` utan bord) - annars skulle den reserven konkurrera med Standard/Längres flera dedikerade `chinup`-platser om samma tunna Normal-pool och enstaka utrustningskombinationer sluta gå att generera (se docs/loggbok.md).

Vissa rörelsefamiljer (se `02-teknisk-specifikation.md` B.13) har bara en enda giltig kandidat för en given intensitet och utrustning (t.ex. utfall framåt/sido, som bara har en övning vardera i hela banken). Det är avsiktligt accepterat - övningsbanken ska inte fyllas med konstgjorda dubletter eller halvbra övningar bara för att ge en tunn plats fler alternativ. Variation skapas i stället genom andra delar av passet: övningsvalet på platser med flera kandidater och, sedan v1.8, ordningen på rörelsegrupperna (se §6, §9, §13).

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
* tre golvövningar i rad — undantag: regeln stängs av helt om användaren saknar stol och/eller chinsstång på startsidan, eftersom alla hårda pull-övningar utan utrustning kräver golvet och regeln annars gör Tufft omöjligt att generera för Standard/Längre
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
* ordningen på rörelsegrupperna mellan olika pass (se §13) - ingen rörelsegrupp har en bestämd position, så samma typ av övning ska inte behöva hamna först (eller sist) varje gång

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

Standard- och Längre-pass ska dessutom innehålla minst en vadövning. På Kortare (7 minuter) är vad valfritt - fokus ligger på de stora rörelsemönstren.

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

Varje försök slumpar dessutom en ny ordning på mallens rörelsegrupper innan passet byggs (se §6, §9). Övningarna väljs sedan i den slumpade ordningen, och sekvensreglerna (§8) prövas mot just den ordningen. En ordning som råkar ställa två svåra eller sinsemellan lika övningar intill varandra ger då helt enkelt inga giltiga kandidater för den platsen - försöket avbryts och ett nytt görs, med både ny ordning och nytt övningsval. Det gör ordningsslumpningen självkorrigerande: en olämplig ordning sorteras bort av samma mekanism som redan sorterar bort olämpliga övningsval.

För hela passet:

1. Generera en fullständig sekvens (ny slumpad ordning + övningsval) med samtliga sekvensregler (§8) aktiva. Validera resultatet (§17). Vid fel, prova igen — maximalt 50 försök.
2. Om inget av dessa 50 försök gav ett giltigt pass: gör om samma sak, men med reglerna "två ensidiga övningar i rad" och "tre benövningar i rad" avstängda — återigen maximalt 50 försök.

Detta andra steg krävs för Tufft-intensitet: hard-poolerna för bål och höft är så tunna att nästan alla kandidater delar `muscleGroups: "legs"` och/eller är ensidiga, vilket annars gör vissa passmallar olösliga (se `docs/loggbok.md`).

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
