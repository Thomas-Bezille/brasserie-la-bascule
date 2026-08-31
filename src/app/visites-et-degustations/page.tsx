import type { Metadata } from "next";
import { Suspense } from "react";
import { NoteGoogle } from "@/composants/accueil/NoteGoogle";
import { Surtitre } from "@/composants/ui/Surtitre";
import { AvantDeVenir } from "@/composants/visites/AvantDeVenir";
import { FormuleVisite } from "@/composants/visites/FormuleVisite";
import { ModuleReservation } from "@/composants/visites/ModuleReservation";
import { visites } from "@/donnees/infos-pratiques";

/**
 * La page la plus importante du site.
 *
 * Deux à trois demandes de visite se perdaient chaque mois faute de réponse :
 * c'est le problème économique que le projet vient résoudre. Tout ce qui est ici
 * sert à conduire à la réservation, et rien d'autre.
 *
 * **La note Google y figure au titre du socle** (CDC 5.6). Elle est à sa place
 * ici plus qu'ailleurs : le visiteur s'apprête à engager un groupe et une date.
 *
 * L'ordre des formules vient de la donnée, la formule entreprise passant devant
 * au titre de la correction 6 de Sophie.
 */
export const metadata: Metadata = {
  title: "Visites et dégustations",
  description:
    "Visitez l'atelier de la Brasserie La Bascule à Vertou, du grain concassé à la bouteille, avec une dégustation de la gamme. De 6 à 20 personnes, en semaine et le samedi.",
  alternates: { canonical: "/visites-et-degustations" },
};

/**
 * Le temps que les créneaux arrivent. Il occupe la même hauteur que le module
 * pour que rien ne saute sous les yeux du visiteur : le décalage cumulé de mise
 * en page est mesuré à zéro et le cahier des charges l'engage.
 */
function ReservationEnChargement() {
  return (
    <section
      id="reserver"
      aria-busy="true"
      className="bg-beton border-trait px-marge border-t py-[clamp(56px,9vw,110px)]"
    >
      <div className="mx-auto max-w-[1240px]">
        <p className="text-papier/55">Chargement des créneaux…</p>
      </div>
    </section>
  );
}

export default function Page() {
  const formules = [...visites].sort(
    (a, b) => Number(b.miseEnAvant ?? false) - Number(a.miseEnAvant ?? false),
  );

  return (
    <>
      <section className="px-marge py-[clamp(48px,7vw,96px)]">
        <div className="mx-auto max-w-[1240px]">
          <Surtitre className="text-papier/55">Visites et dégustations</Surtitre>
          <h1 className="mt-5 max-w-[16ch] text-[clamp(40px,6.5vw,80px)]">
            Une heure trente dans l&apos;atelier.
          </h1>
          <p className="text-papier/60 mt-8 max-w-[58ch] text-[19px] leading-[1.55]">
            Marc ouvre l&apos;atelier aux groupes de six à vingt personnes. On voit le
            concassage, la cuve, la fermentation et l&apos;embouteillage, on goûte les six
            bières, et on repart avec ce qu&apos;on veut.
          </p>

          <div className="mt-12 grid items-start gap-[clamp(20px,3vw,36px)] lg:grid-cols-2">
            {formules.map((formule) => (
              <FormuleVisite key={formule.nom} formule={formule} />
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<ReservationEnChargement />}>
        <ModuleReservation />
      </Suspense>
      <NoteGoogle />
      <AvantDeVenir />
    </>
  );
}
