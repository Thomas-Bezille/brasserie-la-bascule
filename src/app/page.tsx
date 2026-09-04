import { ApercuGamme } from "@/composants/accueil/ApercuGamme";
import { BandeauPortesOuvertes } from "@/composants/accueil/BandeauPortesOuvertes";
import { BandeauPratique } from "@/composants/accueil/BandeauPratique";
import { BlocVisites } from "@/composants/accueil/BlocVisites";
import { HeroAccueil } from "@/composants/accueil/HeroAccueil";
import { NoteGoogle } from "@/composants/accueil/NoteGoogle";

export default function Accueil() {
  return (
    <main className="grow">
      <HeroAccueil />
      <BandeauPratique />
      <BandeauPortesOuvertes />
      <ApercuGamme />
      <BlocVisites />
      <NoteGoogle />
    </main>
  );
}
