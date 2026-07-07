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

        <p className={styles.intro}>Kroppen svarar på signaler, inte på träningstid.</p>
        <p>
          Den minsta effektiva dosen: korta, balanserade helkroppspass som ger kroppen tydlig
          träningsstimulans.
        </p>

        <h3>Träning ska vara enkel</h3>
        <p>
          Svinstark bygger på en enkel idé: den bästa träningen är den som faktiskt blir av.
        </p>
        <p>
          Många träningsprogram misslyckas därför att de kräver för mycket planering. Man ska
          välja övningar, räkna set och repetitioner, hålla reda på vilotider och fundera på
          vilket pass som passar bäst idag.
        </p>
        <p>Svinstark gör tvärtom.</p>
        <p>
          Du väljer hur länge du vill träna, hur tufft passet ska vara och vilken utrustning du
          har. Sedan skapar appen ett färdigt träningspass åt dig. Det enda du behöver göra är
          att trycka på Start.
        </p>

        <h3>Den minsta effektiva dosen</h3>
        <p>
          Du behöver inte träna i en timme för att bli starkare, må bättre eller förbättra din
          kondition.
        </p>
        <p>
          Även korta träningspass kan ge god effekt när de genomförs regelbundet och med
          tillräcklig intensitet.
        </p>
        <p>Därför finns tre passlängder:</p>
        <ul>
          <li>7 minuter</li>
          <li>14 minuter</li>
          <li>21 minuter</li>
        </ul>
        <p>Välj den längd som passar din dag. Ett kort pass är alltid bättre än inget pass alls.</p>

        <h3>Anpassat efter dig</h3>
        <p>Svinstark tar hänsyn till vilken utrustning du har tillgänglig.</p>
        <p>Du kan exempelvis ange om du har:</p>
        <ul>
          <li>chinsstång</li>
          <li>stol eller pall</li>
          <li>fria vikter</li>
        </ul>
        <p>Med fria vikter menas exempelvis hantlar eller kettlebells.</p>
        <p>Appen väljer då övningar som faktiskt går att genomföra hemma med den utrustning du har.</p>

        <h3>Variation utan krångel</h3>
        <p>Varje pass sätts ihop automatiskt ur ett bibliotek av övningar.</p>
        <p>
          Målet är att ge variation samtidigt som hela kroppen tränas över tid. Du slipper
          fundera på vad du ska göra och minskar risken att fastna i exakt samma träningspass
          vecka efter vecka.
        </p>

        <h3>Intensitet efter dagsform</h3>
        <p>Alla dagar är inte likadana.</p>
        <p>Därför kan du välja mellan:</p>
        <ul>
          <li>Lätt</li>
          <li>Normal</li>
          <li>Tuff</li>
        </ul>
        <p>
          Det viktigaste är inte att varje pass är maximalt jobbigt. Det viktigaste är att du
          tränar regelbundet.
        </p>

        <h3>Du bestämmer tempot</h3>
        <p>Svinstark innehåller ingen tvingande uppvärmning eller nedvarvning.</p>
        <p>Om du vill värma upp först gör du det i din egen takt och startar passet när du är redo.</p>
        <p>Samma sak gäller efter passet. Vill du promenera, stretcha eller bara gå vidare med dagen är det upp till dig.</p>

        <h3>För vem är appen?</h3>
        <p>Svinstark passar dig som:</p>
        <ul>
          <li>vill träna hemma</li>
          <li>har ont om tid</li>
          <li>vill slippa planera träningspass</li>
          <li>vill bli starkare och få bättre kondition</li>
          <li>uppskattar enkelhet framför avancerade träningsprogram</li>
        </ul>

        <h3>Filosofin bakom Svinstark</h3>
        <p>Svinstark försöker inte vara den mest avancerade träningsappen.</p>
        <p>Den försöker vara den app som du faktiskt använder.</p>
        <p>Om det tar tio minuter att planera ett träningspass innan träningen ens börjar har tröskeln redan blivit för hög.</p>
        <p>Svinstark tar bort besluten.</p>
        <p>Du väljer några få inställningar.</p>
        <p>Sedan börjar du träna.</p>
        <p>Så enkelt ska det vara.</p>
        <p className={styles.tagline}>Mindre planering. Mer träning.</p>
      </div>

      <PrimaryButton onClick={onClose}>Stäng</PrimaryButton>
    </Modal>
  );
}
