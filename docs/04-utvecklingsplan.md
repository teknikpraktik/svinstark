# svinstark – Utvecklingsplan

**Filnamn:** `04-utvecklingsplan.md`
**Version:** 2.0
**Status:** Arbetsdokument

---

# 1. Syfte

Detta dokument beskriver i vilken ordning svinstark ska utvecklas.

Målet är att:

* minimera teknisk skuld
* säkerställa hög kvalitet
* bygga funktioner stegvis
* kunna testa efter varje steg

Ingen ny fas påbörjas innan föregående fungerar.

---

# 2. Grundprincip

Utvecklingen sker i små, testbara iterationer.

Varje fas ska:

* kompilera utan fel
* fungera isolerat
* kunna demonstreras
* kunna testas manuellt

---

# 3. Fas 0 – Projektinitiering

## Mål

Skapa ett komplett Next.js-projekt.

## Claude Code ska

* Initiera ett Next.js-projekt
* Aktivera TypeScript
* Skapa App Router
* Konfigurera ESLint
* Installera PWA-stöd
* Skapa grundläggande mappstruktur
* Skapa Git-repository (om det inte redan finns)

## Projektstruktur

```text
svinstark/

docs/

public/
    icons/
    sounds/

src/
    app/
    components/
    data/
    hooks/
    lib/
    styles/
    types/
    utils/

package.json
tsconfig.json
next.config.ts
```

## Test

Projektet ska:

* starta lokalt
* bygga utan fel
* visa en tom startsida

---

# 4. Fas 1 – Grundläggande UI

## Mål

Bygg en statisk startsida.

## Funktioner

* Appnamn
* Slogan
* Val av träningstid
* Val av intensitet
* Inställningsikon
* Startknapp

Ingen logik.

Ingen timer.

Ingen generator.

## Test

Startsidan fungerar på mobil.

---

# 5. Fas 2 – Grundläggande komponenter

Skapa återanvändbara komponenter.

Minst:

* PrimaryButton
* OptionSelector
* TimerDisplay
* ExerciseCard
* PhaseBadge
* Modal
* IconButton

Komponenterna ska vara helt frikopplade från träningslogiken.

---

# 6. Fas 3 – TypeScript-modeller

Implementera samtliga typer.

Exempel:

* Exercise
* Workout
* WorkoutBlock
* WorkoutSettings
* ExercisePattern
* ExerciseIntensity
* TimerState

Projektet ska nu kunna typkontrolleras utan fel.

---

# 7. Fas 4 – Exercise Library

Implementera:

```text
src/data/exerciseData.ts
```

med cirka 100 övningar.

All metadata ska följa Dokument 03.

## Test

Validera:

* unika id
* inga saknade fält
* korrekt typning

---

# 8. Fas 5 – Workout Generator

Implementera:

```text
src/lib/workoutGenerator.ts
```

Generatorn ska:

* läsa WorkoutSettings
* välja rätt mall
* filtrera övningar
* skapa pass
* kontrollera sekvensregler
* returnera Workout

Ingen React-kod.

## Test

Generera minst:

* 100 korta pass
* 100 standardpass
* 100 långa pass

för varje intensitet.

---

# 9. Fas 6 – Timer Engine

Implementera:

```text
src/lib/timer.ts
```

Timern ska kunna:

* starta
* pausa
* återuppta
* stoppa
* byta block
* avsluta pass

Ingen React-logik.

---

# 10. Fas 7 – React Hooks

Implementera:

* useWorkout()
* useTimer()
* useSettings()

Hooks kopplar ihop UI med affärslogiken.

---

# 11. Fas 8 – Workout Screen

Implementera träningsvyn.

Visar endast:

* fas
* timer
* övning
* instruktion
* paus
* avsluta

Ingen nästa övning.

Ingen passlista.

Ingen statistik.

---

# 12. Fas 9 – Signaturuppvärmning (borttagen 2026-07-06)

Denna fas byggde en fast 60-sekunders uppvärmning som alltid kördes före huvudpasset.

Funktionen togs bort på uttrycklig begäran av användaren: passet går numera direkt på övningarna, utan uppvärmning eller nedvarvning. Se `docs/loggbok.md` för detaljer om ändringen.

Fas-numret behålls oförändrat för att inte bryta spårbarheten mot tidigare loggbokposter.

---

# 13. Fas 10 – Signaturavslut (borttagen 2026-07-06)

Denna fas byggde ett fast 60-sekunders avslut som alltid kördes efter huvudpasset.

Funktionen togs bort på uttrycklig begäran av användaren, av samma anledning som Fas 9. Se `docs/loggbok.md` för detaljer.

---

# 14. Fas 11 – Ljud

Implementera ljud.

Signaler:

* nytt block
* sista tre sekunderna
* pass klart

Inställning:

Ljud på/av.

---

# 15. Fas 12 – Inställningar (ersatt 2026-07-07)

Byggde ursprungligen en separat inställningsdialog (kugghjul på startsidan) med ljud, versionsnummer och "Om svinstark".

Ersatt på uttrycklig begäran av användaren av två små ikoner direkt på startsidan: en ljudikon (🔊/🔇) och en informationsikon som öppnar "Om Svinstark" som en scrollbar modal. Utrustningsvalen som senare lades till i samma dialog (Fas "Anpassa efter utrustning", se `docs/loggbok.md` v1.1) flyttades till startsidan i samma ändring. Ingen separat inställningsskärm finns längre. Versionsnumret visas inte längre någonstans i UI:t - det fanns inget uttryckligt krav på det i den nya specen.

Inställningar (träningstid, intensitet, ljud, utrustning, fria vikter) lagras fortfarande lokalt, se `02-teknisk-specifikation.md` C.28.

Fas-numret behålls oförändrat för att inte bryta spårbarheten mot tidigare loggbokposter.

---

# 16. Fas 13 – PWA

Implementera:

* manifest
* service worker
* ikoner
* offline-cache

Verifiera:

* installation fungerar
* offline fungerar

---

# 17. Fas 14 – Optimering

Optimera:

* renderingar
* memoisering
* bundle size
* laddningstid

Mål:

* appstart < 1 sekund
* passgenerering < 50 ms

---

# 18. Fas 15 – Sluttest

Genomför komplett testmatris.

Alla kombinationer:

| Träningstid | Intensitet |
| ----------- | ---------- |
| Kortare     | Lugnt      |
| Kortare     | Normalt    |
| Kortare     | Tufft      |
| Standard    | Lugnt      |
| Standard    | Normalt    |
| Standard    | Tufft      |
| Längre      | Lugnt      |
| Längre      | Normalt    |
| Längre      | Tufft      |

Kontrollera:

* korrekt längd
* korrekt intensitet
* korrekt övningsordning
* timer
* paus
* avslut
* ljud
* offline

---

# 19. Leverabler per fas

Efter varje fas ska Claude Code redovisa:

* vilka filer som skapats
* vilka filer som ändrats
* vad som implementerats
* hur funktionen testas
* eventuella begränsningar

Ingen fas anses klar utan denna redovisning.

---

# 20. Claude Code-arbetsflöde

Inför varje fas ska Claude Code:

1. Läsa relevanta dokument.
2. Sammanfatta uppgiften.
3. Identifiera eventuella oklarheter.
4. Föreslå implementation.
5. Vänta på godkännande om specifikationen är oklar.

Efter implementation ska Claude Code:

1. Bygga projektet.
2. Åtgärda fel.
3. Sammanfatta ändringarna.
4. Beskriva hur resultatet testas.

---

# 21. Definition av färdig MVP

Version 1.0 är färdig när användaren kan:

* öppna appen
* välja träningstid
* välja intensitet
* starta ett pass
* genomföra huvudpass
* pausa
* avsluta
* köra appen offline
* installera appen som PWA

utan konto, internet eller instruktioner.

---

# 22. Arbetsregel

Claude Code ska **aldrig hoppa över steg i utvecklingsplanen**.

Om en senare funktion kräver att en tidigare fas ändras ska den tidigare fasen uppdateras först.

Målet är en stabil, testbar och långsiktigt hållbar kodbas – inte att skriva mest möjlig kod på kortast tid.
