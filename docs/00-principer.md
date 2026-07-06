# svinstark – Arbetsprinciper för Claude Code

**Filnamn:** `00-principer.md`
**Version:** 1.1
**Status:** Styrande dokument

---

# 1. Syfte

Detta dokument anger hur Claude Code ska arbeta med projektet svinstark.

Dokumentet ska läsas först.

Övriga dokument i `docs/` utgör projektets specifikation.

---

# 2. Dokumentordning

Claude Code ska läsa dokumenten i denna ordning:

1. `00-principer.md`
2. `01-produktspecifikation.md`
3. `02-teknisk-specifikation.md`
4. `03-exercise-library-specification.md`
5. `04-utvecklingsplan.md`
6. `05-designprinciper.md`
7. `06-roadmap.md`
8. `07-generator-specifikation.md`
9. `99-ai-instructions.md`

---

# 3. Single source of truth

Dokumenten i `docs/` är projektets källa till sanning.

Claude Code ska inte göra egna produkt-, design- eller arkitekturval som avviker från dokumentationen.

Om dokumenten är otydliga eller motsäger varandra ska Claude Code:

1. Stoppa.
2. Lista oklarheten.
3. Föreslå en lösning.
4. Vänta på beslut innan implementation.

---

# 4. Vald teknisk stack

svinstark ska byggas med:

* Next.js
* React
* TypeScript
* CSS Modules eller vanlig global CSS
* PWA-stöd
* Deployment på Vercel

Next.js är ett ramverk ovanpå React och JavaScript/TypeScript. Vanliga `.ts` och `.tsx`-filer används i projektet.

---

# 5. Implementera stegvis

Claude Code ska inte bygga hela appen på en gång.

Implementering ska ske enligt `04-utvecklingsplan.md`.

Ordning:

1. Skapa Next.js-projekt
2. Skapa grundstruktur
3. Bygg statisk startsida
4. Implementera timer
5. Skapa övningsbibliotek
6. Implementera passgenerator
7. Koppla ihop UI, timer och generator
8. Lägg till ljud
9. Lägg till PWA-stöd
10. Testa manuellt

---

# 6. Ramverk och bibliotek

Tillåtet:

* Next.js
* React
* TypeScript

Inte tillåtet utan uttryckligt godkännande:

* externa UI-bibliotek
* externa state management-bibliotek
* externa träningsbibliotek
* externa API:er
* databaser
* autentiseringstjänster
* analysverktyg
* reklam- eller tracking-script

Exempel på sådant som inte ska läggas till i MVP utan beslut:

* Tailwind
* Bootstrap
* Material UI
* Zustand
* Redux
* Firebase
* Supabase
* Prisma
* Auth.js
* Google Analytics

---

# 7. Ingen backend i MVP

MVP ska inte ha:

* egen serverlogik
* databas
* konto
* inloggning
* molnsynk
* extern lagring

All träningslogik ska köras lokalt i webbläsaren.

Next.js används för struktur, rendering och PWA-publicering, inte för backendlogik i MVP.

---

# 8. Kodprinciper

Koden ska vara:

* enkel
* modulär
* läsbar
* tydligt namngiven
* lätt att ändra
* typad med TypeScript
* utan onödig abstraktion

Hellre tydlig kod än smart kod.

---

# 9. Filansvar

Filer och mappar ska ha tydligt ansvar.

Exempel:

## `src/data/exercises.ts`

Endast övningsdata.

## `src/lib/generator.ts`

Endast passgenerering och sekvensregler.

## `src/lib/timer.ts` eller timer-hook

Timerlogik.

## `src/components/`

React-komponenter.

## `src/app/`

Next.js App Router-struktur.

## `src/types/`

TypeScript-typer.

---

# 10. Kommentarer

Kommentarer ska användas sparsamt men tydligt.

Kommentera:

* passgeneratorns regler
* specialfall
* fallbacklogik
* PWA/service worker-delar

Kommentera inte uppenbar kod.

---

# 11. Övningsbibliotek

Övningsbiblioteket ska följa `03-exercise-library-specification.md`.

Varje övning ska ha komplett metadata.

Tillåten utrustning:

* `bodyweight`
* `floor`
* `pullup_bar`
* `chair`

Ingen övning får kräva annan utrustning.

---

# 12. Generator

Passgeneratorn ska följa reglerna i `02-teknisk-specifikation.md`.

Den ska:

* filtrera på intensitet
* filtrera på utrustning
* använda passmallar
* respektera `avoidAdjacent`
* undvika dåliga sekvenser
* returnera komplett pass med samtliga övningar

---

# 13. UI-principer

UI ska följa `05-designprinciper.md`.

Viktigt:

* ingen nästa övning visas
* ingen historik
* ingen statistik
* inga kalorier
* inga bilder
* inga animationer i MVP
* inga sociala funktioner

Under passet visas endast:

* fas
* timer
* aktuell övning
* instruktion
* paus
* avsluta

---

# 14. Design

Designen ska vara mobil först.

Prioritera:

* stor timer
* stora knappar
* hög läsbarhet
* mycket luft
* tydlig kontrast

Undvik:

* plottrighet
* många färger
* dekorativa element
* gamification

---

# 15. Testning

Efter varje implementationsteg ska Claude Code beskriva:

1. Vad som ändrats.
2. Vilka filer som ändrats.
3. Hur det kan testas manuellt.
4. Eventuella kända begränsningar.

---

# 16. Vid fel eller osäkerhet

Claude Code ska inte gissa.

Vid osäkerhet:

* stoppa
* beskriv problemet
* föreslå alternativ
* invänta beslut

---

# 17. MVP-gräns

Följande ska inte byggas i MVP:

* konto
* historik
* statistik
* betalning
* reklam
* AI
* video
* bilder
* animationer
* social delning
* pushnotiser
* molnsynk
* externa träningsprogram
* wearable-integration

---

# 18. Slutmål

MVP är klar när användaren kan:

1. Öppna appen.
2. Välja träningstid.
3. Välja intensitet.
4. Starta passet.
5. Följa aktuell övning på skärmen.
6. Pausa vid behov.
7. Avsluta vid behov.
8. Genomföra hela passet offline efter första laddning.

---

# 19. Ledstjärna

Vid varje beslut ska Claude Code prioritera:

**Enkelhet, tydlighet och genomförbarhet.**

Om en lösning gör appen mer komplex utan att göra träningen enklare ska den inte implementeras.
