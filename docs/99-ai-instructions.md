# 99 – AI Instructions

**Filnamn:** `99-ai-instructions.md`  
**Version:** 1.0  
**Status:** Styrande dokument

---

# Syfte

Detta dokument beskriver hur AI-assistenter (Claude Code, ChatGPT eller motsvarande) ska arbeta i projektet **Svinstark**.

Målet är att säkerställa hög kodkvalitet, konsekvent arkitektur och ett strukturerat utvecklingsflöde.

---

# 1. Läs dokumentationen först

Innan någon kod skrivs ska samtliga dokument i `docs/` läsas igenom.

Dokumenten utgör projektets **Single Source of Truth**.

Läs dem i följande ordning:

1. `00-principer.md`
2. `01-produktspecifikation.md`
3. `02-teknisk-specifikation.md`
4. `03-exercise-library-specification.md`
5. `04-utvecklingsplan.md`
6. `05-designprinciper.md`
7. `06-roadmap.md`
8. `07-generator-specifikation.md`

Ingen implementation får påbörjas innan dokumentationen förståtts.

---

# 2. Dokumentationen styr projektet

AI ska aldrig ändra produktens beteende, arkitektur eller design på eget initiativ.

Om dokumentationen innehåller:

- motsägelser
- oklarheter
- saknade regler
- förbättringsmöjligheter

ska AI:

1. beskriva problemet,
2. föreslå en lösning,
3. invänta beslut.

AI får inte själv ändra dokumentationen.

---

# 3. Följ utvecklingsplanen

Utvecklingen ska ske exakt enligt `04-utvecklingsplan.md`.

Hoppa aldrig över en fas.

Implementera endast den fas användaren har bett om.

---

# 4. Implementera stegvis

Efter varje fas ska AI:

- beskriva vad som byggts,
- lista vilka filer som skapats eller ändrats,
- beskriva hur funktionen testas,
- invänta godkännande innan nästa fas.

---

# 5. Affärslogik

Affärslogik får aldrig implementeras i React-komponenter.

React ansvarar endast för:

- presentation,
- användarinteraktion,
- rendering.

Generatorn, timern och övrig logik ska vara helt frikopplade från användargränssnittet.

---

# 6. Kodprinciper

Koden ska vara:

- enkel,
- tydlig,
- modulär,
- testbar,
- typad med TypeScript.

Föredra tydlighet framför smarta lösningar.

Undvik onödig abstraktion.

---

# 7. Namngivning

Använd engelska namn i koden.

Exempel:

- Workout
- Exercise
- WorkoutGenerator
- TimerState
- WorkoutScreen

Använd svenska endast i användargränssnittet.

---

# 8. Arkitektur

Respektera projektets arkitektur.

Data, affärslogik och presentation ska hållas separerade.

Business logic must never depend on UI.

---

# 9. Om osäkerhet uppstår

Om AI är osäker ska den:

- stoppa implementationen,
- beskriva problemet,
- föreslå alternativ,
- invänta beslut.

Gissa aldrig.

---

# 10. Kodkvalitet

All kod ska:

- bygga utan fel,
- följa TypeScript-regler,
- vara konsekvent formaterad,
- följa projektets namngivningsstandard.

---

# 11. Förbättringsförslag

AI uppmuntras att identifiera:

- bättre arkitekturlösningar,
- enklare implementationer,
- potentiella buggar,
- prestandaproblem,
- framtida underhållsproblem.

Förslag ska alltid presenteras innan implementation.

AI får aldrig göra sådana ändringar på eget initiativ.

---

# 12. Projektets mål

Målet är inte att skriva mest kod.

Målet är att skapa en produkt som är:

- enkel,
- snabb,
- robust,
- lätt att vidareutveckla,
- lätt att förstå.

Vid tveksamhet ska enkelhet alltid prioriteras.

---

# 13. Slutregel

Om dokumentationen och användarens instruktioner skulle skilja sig åt gäller den **senaste uttryckliga instruktionen från användaren**.

I övrigt är dokumentationen projektets styrande källa.