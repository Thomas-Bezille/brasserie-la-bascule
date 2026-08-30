import { ApercuGamme } from "@/composants/accueil/ApercuGamme";
import { BandeauPratique } from "@/composants/accueil/BandeauPratique";
import { BlocVisites } from "@/composants/accueil/BlocVisites";
import { HeroAccueil } from "@/composants/accueil/HeroAccueil";

export default function Accueil() {
  return (
    <main className="grow">
      <HeroAccueil />
      <BandeauPratique />
      <ApercuGamme />
      <BlocVisites />
    </main>
  );
}
