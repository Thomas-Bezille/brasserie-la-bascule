import { Surtitre } from "@/composants/ui/Surtitre";

export default function Accueil() {
  return (
    <main className="px-marge mx-auto w-full max-w-[1240px] grow py-24">
      <Surtitre className="text-papier/40">
        Vertou · Loire-Atlantique · depuis 2022
      </Surtitre>
      <h1 className="mt-6 text-[clamp(46px,8.5vw,104px)]">
        On brasse
        <br />
        à deux pas
        <br />
        de la Sèvre.
      </h1>
      <p className="text-papier/60 mt-8 max-w-[62ch]">
        En-tête et pied de page en place. L’accueil est écrit au lot 5.
      </p>
    </main>
  );
}
