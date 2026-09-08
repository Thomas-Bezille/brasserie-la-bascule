import { Surtitre } from "@/composants/ui/Surtitre";
import { adresse, boutique, contact, marche } from "@/donnees/infos-pratiques";
import { formaterCreneaux, telephoneHref } from "@/lib/formats";

/**
 * Le bloc que le cahier des charges veut « immédiatement visible » : où c'est,
 * et quand c'est ouvert. Le client cite lui-même comme repoussoirs les sites où
 * il faut cliquer quinze fois pour trouver l'adresse.
 *
 * **Correction 5, de Sophie :** sur le gris béton et non sur le crème. La bande
 * claire attirait l'œil avant le titre.
 *
 * **Correction 9, de Julien :** la mention « la boutique est ouverte à tous ».
 * C'est la question qu'on lui pose le plus souvent, et les visiteurs croient
 * devoir réserver une visite pour acheter une bouteille.
 *
 * **Quatrième colonne, « nous appeler », posée le 08/09/2026** : la maquette la
 * prévoyait, il manquait un numéro public. Voir `donnees/infos-pratiques.ts`.
 */
export function BandeauPratique() {
  return (
    <section className="bg-beton border-trait px-marge border-y">
      <dl className="mx-auto grid max-w-[1240px] gap-px sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-trait py-9 sm:border-r sm:pr-8">
          <Surtitre as="dt" className="text-papier/55">
            L&apos;atelier et la boutique
          </Surtitre>
          <dd className="mt-3 text-[15px]">
            {adresse.voie}
            <br />
            {adresse.codePostal} {adresse.commune}
          </dd>
        </div>

        <div className="border-trait py-9 lg:border-r lg:px-8">
          <Surtitre as="dt" className="text-papier/55">
            Boutique
          </Surtitre>
          <dd className="mt-3 text-[15px]">
            {boutique.horaires.map(({ jour, creneaux }) => (
              <span key={jour} className="block first-letter:uppercase">
                {jour} {formaterCreneaux(creneaux)}
              </span>
            ))}
            {boutique.ouverteATous && (
              <span className="text-papier/55 mt-2 block text-[13px]">
                Ouverte à tous, sans réservation ni visite
              </span>
            )}
          </dd>
        </div>

        <div className="border-trait py-9 sm:border-r sm:pr-8 lg:border-r lg:px-8">
          <Surtitre as="dt" className="text-papier/55">
            Marché de {marche.commune}
          </Surtitre>
          <dd className="mt-3 text-[15px] first-letter:uppercase">
            {marche.jour}, le {marche.moment}
          </dd>
        </div>

        <div className="py-9 lg:pl-8">
          <Surtitre as="dt" className="text-papier/55">
            Nous appeler
          </Surtitre>
          <dd className="mt-3 text-[15px]">
            <a href={telephoneHref(contact.telephone)} className="hover:text-papier/70">
              {contact.telephone}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
