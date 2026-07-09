import Modal from "@/components/Modal";
import PrimaryButton from "@/components/PrimaryButton";
import styles from "./AboutModal.module.css";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.text}>
        <h2 className={styles.title}>Om Svinstark</h2>

        <p className={styles.intro}>Kroppen svarar på stimulans, inte på hur länge du tränar.</p>
        <p>Det är den enkla idén som Svinstark bygger på.</p>
        <p>
          För att bli starkare, förbättra konditionen och må bättre behöver de flesta inte träna
          längre. De behöver träna oftare. Därför är Svinstark utvecklad för att göra tröskeln
          till träning så låg som möjligt. Ju enklare det är att komma igång, desto större är
          chansen att träningen faktiskt blir av.
        </p>
        <p>Allt i appen bygger på den filosofin.</p>

        <h3>Tre val – sedan inga fler beslut</h3>
        <p>När du öppnar Svinstark väljer du tre saker:</p>
        <ul>
          <li>Hur länge vill du träna?</li>
          <li>Hur tufft ska passet vara?</li>
          <li>Vilken utrustning har du?</li>
        </ul>
        <p>Sedan skapar appen ett färdigt träningspass.</p>
        <p>
          Du behöver inte fundera på övningar, set, repetitioner eller vilotider. All energi kan
          läggas på själva träningen.
        </p>

        <h3>Den minsta effektiva dosen</h3>
        <p>
          Svinstark bygger på principen om den minsta effektiva dosen – precis tillräckligt med
          träning för att ge kroppen en tydlig signal att utvecklas.
        </p>
        <p>Du väljer mellan tre passlängder:</p>
        <ul>
          <li>7 minuter</li>
          <li>14 minuter</li>
          <li>21 minuter</li>
        </ul>
        <p>Korta pass med rätt intensitet, genomförda ofta, ger bättre resultat än långa pass – för de allra flesta.</p>
        <p>Ett sju minuter långt pass är bättre än ett trettio minuter långt pass som aldrig blir av.</p>

        <h3>Träna efter dagsformen</h3>
        <p>Ingen känner sig lika stark varje dag. Därför finns tre intensitetsnivåer:</p>
        <ul>
          <li>
            <strong>Lätt</strong> – enklare övningsvarianter och lugnare tempo. För dagar när
            kroppen behöver rörelse utan hög belastning.
          </li>
          <li>
            <strong>Normal</strong> – standardnivån för de flesta pass.
          </li>
          <li>
            <strong>Tuff</strong> – mer krävande övningsvarianter för dagar när du vill utmana dig
            själv.
          </li>
        </ul>
        <p>
          Det viktiga är inte att varje pass är maximalt ansträngande. Det viktiga är att du kan
          träna ofta och hålla fast vid rutinen över tid.
        </p>

        <h3>Anpassad efter din utrustning</h3>
        <p>Svinstark utgår från den utrustning du har tillgång till.</p>
        <p>Du anger om du har:</p>
        <ul>
          <li>chinsstång</li>
          <li>stol eller pall</li>
          <li>fria vikter</li>
        </ul>
        <p>Med fria vikter menas exempelvis hantlar eller kettlebells.</p>
        <p>Appen väljer automatiskt övningar som fungerar med din utrustning.</p>

        <h3>En minut i taget</h3>
        <p>Varje övning pågår i exakt en minut.</p>
        <p>
          Du arbetar i ditt eget tempo tills signalen ljuder och går sedan vidare till nästa
          övning. Du slipper räkna repetitioner och hålla reda på tiden.
        </p>
        <p>
          Progressionen sköter sig själv: när du blir starkare hinner du fler repetitioner på
          samma minut. Din egen dagsform sätter belastningen, varje gång.
        </p>

        <h3>Hela kroppen – varje pass</h3>
        <p>
          Varje träningspass sätts ihop automatiskt ur ett bibliotek av övningar och innehåller
          alltid hela kroppen: ben, press, drag, bål, balans och puls.
        </p>
        <p>Pulsövningarna gör att även konditionen får sin signal – inte bara musklerna.</p>
        <p>
          Du behöver inte planera träningssplitar eller fundera på vilken muskelgrupp som står på
          schemat. Missar du ett pass fortsätter du bara där du är, nästa pass tränar hela kroppen
          igen. Och eftersom övningarna varieras automatiskt blir inga pass exakt likadana.
        </p>

        <h3>För vem är Svinstark?</h3>
        <p>Svinstark passar dig som:</p>
        <ul>
          <li>vill träna hemma eller där du råkar vara</li>
          <li>har ont om tid</li>
          <li>vill bli starkare och förbättra konditionen</li>
          <li>uppskattar enkla lösningar framför komplicerade träningsprogram</li>
          <li>vill bygga en hållbar träningsvana</li>
        </ul>
        <h3>Den goda kicken</h3>
        <p>
          Kroppen svarar på stimulans, inte på tid. Sju minuter idag slår trettio minuter någon
          annan gång. Välj dina inställningar. Tryck på Start. Njut av dagens pass!
        </p>

        <h3>Feedback</h3>
        <p>
          Svinstark utvecklas löpande. Har du synpunkter, hittat en bugg eller vill du bara
          säga vad du tycker?{" "}
          <a className={styles.link} href="mailto:per.a.bjorkman@gmail.com">
            Mejla mig
          </a>
          .
        </p>
      </div>

      <PrimaryButton onClick={onClose}>Stäng</PrimaryButton>
    </Modal>
  );
}
