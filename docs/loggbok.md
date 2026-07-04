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
| 2   | Grundläggande komponenter   | ⬜ Ej påbörjad |
| 3   | TypeScript-modeller         | ⬜ Ej påbörjad |
| 4   | Exercise Library            | ⬜ Ej påbörjad |
| 5   | Workout Generator           | ⬜ Ej påbörjad |
| 6   | Timer Engine                | ⬜ Ej påbörjad |
| 7   | React Hooks                 | ⬜ Ej påbörjad |
| 8   | Workout Screen              | ⬜ Ej påbörjad |
| 9   | Signaturuppvärmning         | ⬜ Ej påbörjad |
| 10  | Signaturavslut              | ⬜ Ej påbörjad |
| 11  | Ljud                        | ⬜ Ej påbörjad |
| 12  | Inställningar               | ⬜ Ej påbörjad |
| 13  | PWA                         | ⬜ Ej påbörjad |
| 14  | Optimering                  | ⬜ Ej påbörjad |
| 15  | Sluttest                    | ⬜ Ej påbörjad |

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
