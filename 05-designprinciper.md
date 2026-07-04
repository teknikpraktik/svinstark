# svinstark – Designprinciper

**Version:** 1.0
**Status:** Arbetsdokument

---

# 1. Syfte

Detta dokument beskriver de principer som ska genomsyra hela svinstark.

När flera lösningar är möjliga ska utvecklingen alltid välja den lösning som bäst följer dessa principer.

---

# 2. Kärnvärden

svinstark ska upplevas som:

* Enkel
* Snabb
* Lugn
* Funktionell
* Modern
* Genomtänkt

Inte som:

* Teknisk
* Komplicerad
* Stressig
* Lekfull
* Tävlingsinriktad

---

# 3. Designfilosofi

svinstark bygger på principen:

**Så få beslut som möjligt.**

Appen ska ta hand om planeringen.

Användaren ska träna.

---

# 4. Ett beslut per skärm

Varje skärm ska ha ett tydligt syfte.

## Startsidan

Två beslut:

* träningstid
* intensitet

Sedan:

**STARTA PASS**

---

## Passkärmen

Inga beslut.

Endast träning.

---

## Färdigskärmen

Ett beslut:

Till start.

---

# 5. Fokus

Skärmen ska alltid domineras av det viktigaste.

Under pass:

1. Timer
2. Övning
3. Instruktion

Allt annat är sekundärt.

---

# 6. Informationshierarki

Visa aldrig mer information än användaren behöver just nu.

Visa därför inte:

* nästa övning
* hela passlistan
* statistik
* kalorier
* puls
* grafer
* historik

---

# 7. Minimalism

Om en funktion inte gör träningen enklare ska den inte finnas.

Varje knapp ska motiveras.

Varje text ska ha ett syfte.

---

# 8. Konsekvens

Liknande saker ska alltid fungera likadant.

Exempel:

* alla övningar är 60 sekunder
* samma timer överallt
* samma ljudsignaler
* samma uppvärmning
* samma avslut

Det ska skapa igenkänning.

---

# 9. Lugn

Appen ska hjälpa användaren att fokusera.

Undvik:

* blinkande element
* onödiga animationer
* starka färger
* popups
* avbrott

---

# 10. Typografi

Text ska vara lätt att läsa.

Prioritet:

1. Timer
2. Övningsnamn
3. Instruktion

Slogans och dekoration ska aldrig konkurrera med träningen.

---

# 11. Färg

Färger används sparsamt.

Syfte:

* skapa kontrast
* visa val
* markera aktiv knapp

Inte:

* dekorera
* underhålla

---

# 12. Knappar

Alla knappar ska vara stora.

Minsta rekommenderade tryckyta:

44 × 44 px.

---

# 13. Animationer

Animationer används endast när de hjälper användaren att förstå vad som händer.

Exempel:

* mjuk övergång mellan övningar
* knapptryckning

Inte:

* konfetti
* studsande element
* långa övergångar

---

# 14. Ljud

Ljud ska:

* vara korta
* vara diskreta
* förstärka timern

Ljud får aldrig upplevas som stressande.

---

# 15. Språk

Språket ska vara:

* kort
* tydligt
* vänligt
* rakt

Exempel:

Bra:

* Armhävningar
* Håll kroppen rak.
* Klart.

Undvik:

* långa instruktioner
* träningsjargong
* tekniska termer

---

# 16. Tillgänglighet

Appen ska fungera för så många som möjligt.

Prioritera:

* hög kontrast
* stora knappar
* tydliga texter
* enkel navigering

---

# 17. Prestanda

Appen ska kännas omedelbar.

Mål:

* start på under en sekund
* direkt respons vid knapptryckning
* inga laddningsskärmar

---

# 18. Offline först

När appen väl är installerad ska den fungera utan internet.

Ingen funktion i MVP ska kräva uppkoppling.

---

# 19. Produktidentitet

svinstark ska uppfattas som:

> "Appen som tar bort alla ursäkter."

Den ska aldrig försöka imponera.

Den ska hjälpa användaren att träna.

---

# 20. Ledstjärna

Vid varje design- eller utvecklingsbeslut ska följande fråga ställas:

**Blir det enklare för användaren att komma igång och genomföra ett bra pass?**

Om svaret är nej ska lösningen omprövas.
