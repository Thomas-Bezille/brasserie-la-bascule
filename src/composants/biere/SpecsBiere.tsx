import type { ReactNode } from "react";
import type { Biere } from "@/donnees/bieres";
import { prixBouteilles } from "@/donnees/infos-pratiques";
import { DISPONIBILITE } from "@/lib/disponibilite";
import { formaterDegre, formaterPrix } from "@/lib/formats";

/**
 * Le tableau technique d'une fiche.
 *
 * **Un champ absent s'affiche comme absent.** C'est la règle du cahier des
 * charges 6, née des six erreurs relevées le 21/09/2026 : aucune donnée
 * technique sur les bières qui ne vienne de Marc. Les fiches ont deux semaines
 * de retard, la fiche du 25 aura donc des trous, et c'est prévu. La maquette a
 * fait valider l'emplacement exact de ces mentions, le client les a vues.
 *
 * La mention d'attente est en italique et non en couleur : la maquette la
 * mettait au jaune de L'Abeille, ce que la correction 1 de Sophie a supprimé.
 * Le site n'a plus aucune couleur d'accent.
 */
function Ligne({ intitule, children }: { intitule: string; children: ReactNode }) {
  return (
    <div className="border-trait flex justify-between gap-5 border-b py-4 text-[15.5px]">
      <dt className="text-papier/40 tracking-[0.02em]">{intitule}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}

function EnAttente() {
  return <span className="text-papier/40 text-[14px] italic">en attente de Marc</span>;
}

export function SpecsBiere({ biere }: { biere: Biere }) {
  return (
    <dl className="border-trait mt-10 border-t">
      <Ligne intitule="Type">{biere.type}</Ligne>
      <Ligne intitule="Degré">
        {biere.degre !== undefined ? formaterDegre(biere.degre) : <EnAttente />}
      </Ligne>
      <Ligne intitule="Amertume">
        {biere.ibu !== undefined ? `${biere.ibu} IBU` : <EnAttente />}
      </Ligne>
      <Ligne intitule="Malts">
        {biere.malts ? biere.malts.join(", ") : <EnAttente />}
      </Ligne>
      <Ligne intitule="Houblons">
        {biere.houblons ? biere.houblons.join(", ") : <EnAttente />}
      </Ligne>
      <Ligne intitule="Origine des ingrédients">
        {biere.origineIngredients ?? <EnAttente />}
      </Ligne>
      <Ligne intitule="Prix boutique">
        {formaterPrix(prixBouteilles.format33cl)} la 33 cl ·{" "}
        {formaterPrix(prixBouteilles.format75cl)} la 75 cl
      </Ligne>
      <Ligne intitule="Disponibilité">{DISPONIBILITE[biere.etat].ligne}</Ligne>
    </dl>
  );
}
