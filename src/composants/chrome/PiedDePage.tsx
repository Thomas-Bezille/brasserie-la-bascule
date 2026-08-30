import Link from "next/link";
import { Logo } from "@/composants/ui/Logo";
import { MessageSanitaire } from "@/composants/ui/MessageSanitaire";
import { Surtitre } from "@/composants/ui/Surtitre";
import { adresse, boutique, contact, marche } from "@/donnees/infos-pratiques";
import { liensLegaux } from "@/donnees/navigation";
import { formaterCreneaux } from "@/lib/formats";

/**
 * Pied de page, **allégé de moitié** : c'est la correction 7 de Sophie.
 *
 * Ce qui a sauté est la colonne « Le site », qui recopiait le menu de l'en-tête.
 * Sur un site de huit pages dont la navigation est visible en permanence, elle
 * ne servait qu'à remplir. Restent les trois choses qu'on vient chercher en bas
 * d'une page : où c'est, quand c'est ouvert, et les mentions légales.
 *
 * Les horaires sont lus dans `donnees/infos-pratiques.ts`. La maquette affichait
 * ici les anciens, faux depuis septembre : c'est précisément le genre d'oubli
 * que la source unique empêche.
 */
export function PiedDePage() {
  return (
    <footer className="bg-beton border-trait px-marge border-t pt-[clamp(50px,6vw,80px)] pb-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <Logo taille={27} />
            <p className="text-papier/60 mt-6 text-[15px]">
              {adresse.voie}
              <br />
              {adresse.codePostal} {adresse.commune}
            </p>
            <p className="mt-3 text-[15px]">
              <a
                href={`mailto:${contact.email}`}
                className="text-papier/60 hover:text-papier"
              >
                {contact.email}
              </a>
            </p>
          </div>

          <div>
            <Surtitre as="h2" className="text-papier/55">
              Horaires de la boutique
            </Surtitre>
            <ul className="text-papier/60 mt-4 text-[15px]">
              {boutique.horaires.map(({ jour, creneaux }) => (
                <li key={jour} className="py-[5px] first-letter:uppercase">
                  {jour} · {formaterCreneaux(creneaux)}
                </li>
              ))}
              <li className="py-[5px] first-letter:uppercase">
                {marche.jour} · marché de {marche.commune}, le {marche.moment}
              </li>
            </ul>

            <Surtitre as="h2" className="text-papier/55 mt-7">
              Légal
            </Surtitre>
            <ul className="text-papier/60 mt-4 text-[15px]">
              {liensLegaux.map((lien) => (
                <li key={lien.href} className="py-[5px]">
                  <Link href={lien.href} className="hover:text-papier">
                    {lien.libelle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <MessageSanitaire />
      </div>
    </footer>
  );
}
