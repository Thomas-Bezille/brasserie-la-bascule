import type { Metadata } from "next";
import { Coffrets } from "@/composants/ou-nous-trouver/Coffrets";
import { PointsDeVente } from "@/composants/ou-nous-trouver/PointsDeVente";
import { Surtitre } from "@/composants/ui/Surtitre";
import { adresse, boutique, marche, stationnement } from "@/donnees/infos-pratiques";
import { formaterCreneaux } from "@/lib/formats";

/**
 * La page « Où nous trouver ».
 *
 * L'atelier, la boutique et le marché viennent de la source unique
 * `donnees/infos-pratiques.ts`, vérifiée par le client le 21/09. Le bloc « Nos
 * coffrets » ne s'affiche qu'à sa publication, fin octobre. La carte des bars et
 * cavistes partenaires attend la liste d'adresses du client (fil § 31-32).
 *
 * **Pas de fond de carte Google.** Le cahier des charges (5.2) impose un fond
 * libre pour ne pas dépendre d'un compte de facturation au nom de la SAS. Ce
 * fond arrivera avec les points de vente, il n'a pas de valeur avec le seul
 * point de l'atelier.
 */
export const metadata: Metadata = {
  title: "Où nous trouver",
  description:
    "L'atelier et la boutique de la Brasserie La Bascule, 12 rue des Vignes à Vertou : accès, horaires, marché du dimanche et points de vente partenaires.",
  alternates: { canonical: "/ou-nous-trouver" },
};

export default function Page() {
  return (
    <main className="grow">
      <section className="px-marge py-[clamp(48px,7vw,96px)]">
        <div className="mx-auto max-w-[1240px]">
          <Surtitre className="text-papier/55">Où nous trouver</Surtitre>
          <h1 className="mt-5 max-w-[16ch] text-[clamp(40px,6.5vw,80px)]">
            L&apos;atelier est à Vertou.
          </h1>

          <div className="mt-12 grid gap-[clamp(28px,5vw,72px)] lg:grid-cols-2">
            <div>
              <Surtitre as="h2" className="text-papier/55">
                L&apos;atelier et la boutique
              </Surtitre>
              <p className="mt-4 text-[19px] leading-[1.5]">
                {adresse.voie}
                <br />
                {adresse.codePostal} {adresse.commune}
              </p>
              <p className="text-papier/60 mt-6 max-w-[46ch] leading-[1.55]">
                À la sortie de Vertou, fléché depuis la départementale. Un parking de{" "}
                {stationnement.places} places devant l&apos;atelier, les cars déposent
                devant le portail. L&apos;atelier et la salle de dégustation sont de
                plain-pied.
              </p>
            </div>

            <div>
              <Surtitre as="h2" className="text-papier/55">
                Horaires de la boutique
              </Surtitre>
              <ul className="mt-4 text-[19px] leading-[1.7]">
                {boutique.horaires.map(({ jour, creneaux }) => (
                  <li key={jour} className="first-letter:uppercase">
                    {jour} · {formaterCreneaux(creneaux)}
                  </li>
                ))}
              </ul>
              {boutique.ouverteATous && (
                <p className="text-papier/60 mt-4 max-w-[42ch] leading-[1.55]">
                  La boutique est ouverte à tous, sans réservation ni visite. On peut y
                  passer simplement acheter quelques bouteilles.
                </p>
              )}
              <p className="text-papier/60 mt-6 max-w-[42ch] leading-[1.55]">
                Et sur le marché de {marche.commune}, le {marche.jour} {marche.moment}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Coffrets />
      <PointsDeVente />
    </main>
  );
}
