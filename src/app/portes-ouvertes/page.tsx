import type { Metadata } from "next";
import Link from "next/link";
import { DonneesStructurees } from "@/composants/ui/DonneesStructurees";
import { Surtitre } from "@/composants/ui/Surtitre";
import { adresse, stationnement } from "@/donnees/infos-pratiques";
import { joursPortesOuvertes, programmeCommun } from "@/donnees/portes-ouvertes";
import { formaterHeure } from "@/lib/formats";
import { donneesPortesOuvertes } from "@/lib/seo";

/**
 * La page « Portes ouvertes », avenant n° 1 (`AV-2026-002-01`, 350 €).
 *
 * Contenu fourni par Julien le 30/09/2026 (fil client § 31) : programme,
 * horaires, food-truck le samedi, marché le dimanche, entrée libre. Les
 * visuels et l'affiche de Sophie ne sont pas encore livrés : la page s'écrit
 * sans eux, même principe que le repli typographique d'une fiche de bière
 * (CDC 5.1) — rien à refaire quand ils arriveront.
 *
 * **Pas de second formulaire** (exclusions de l'avenant) : « J'annonce ma
 * venue » renvoie vers le formulaire de contact existant, dont le motif
 * « Portes ouvertes » est déjà proposé (`lib/contact/types.ts`, page Contact).
 *
 * **Pas encore reliée au menu ni au plan du site**, comme « Notre histoire » :
 * ni `navigationPrincipale` ni `liensLegaux` ne la portent. `PORTES_OUVERTES_PUBLIEES`
 * gate le bandeau d'accueil qui y renvoie ; la page elle-même existe et
 * fonctionne dès maintenant, à l'adresse `/portes-ouvertes`, comme « Où nous
 * trouver » avant sa publication.
 */
export const metadata: Metadata = {
  title: "Portes ouvertes 2026",
  description:
    "Portes ouvertes de la Brasserie La Bascule à Vertou, les 24 et 25 octobre 2026 : visites de l'atelier toutes les heures, dégustation du Sanglier en avant-première. Entrée libre.",
  alternates: { canonical: "/portes-ouvertes" },
};

export default function Page() {
  return (
    <main className="grow">
      <DonneesStructurees donnees={donneesPortesOuvertes()} />

      <section className="px-marge py-[clamp(48px,7vw,96px)]">
        <div className="mx-auto max-w-[1240px]">
          <Surtitre className="text-papier/55">24 et 25 octobre 2026</Surtitre>
          <h1 className="mt-5 max-w-[20ch] text-[clamp(40px,6.5vw,80px)]">
            Deux jours portes ouvertes.
          </h1>
          <p className="text-papier/60 mt-8 max-w-[58ch] text-[19px] leading-[1.55]">
            L&apos;atelier s&apos;ouvre en grand pour un week-end : visites toutes les
            heures, dégustation du Sanglier en avant-première, et le marché du dimanche
            juste devant. Entrée libre, sans réservation.
          </p>

          <div className="mt-12 grid gap-[clamp(20px,3vw,36px)] sm:grid-cols-2">
            {joursPortesOuvertes.map((journee) => (
              <article
                key={journee.date}
                className="border-trait border p-[clamp(24px,3.5vw,40px)]"
              >
                <Surtitre as="h2" className="text-papier/55">
                  {journee.jour}
                </Surtitre>
                <p className="mt-3 text-[19px]">
                  {formaterHeure(journee.creneau.ouverture)} –{" "}
                  {formaterHeure(journee.creneau.fermeture)}
                </p>
                <ul className="text-papier/60 mt-5 space-y-2 text-[15.5px] leading-[1.5]">
                  {[...programmeCommun, journee.specifique].map((ligne) => (
                    <li key={ligne}>· {ligne}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-trait px-marge border-t py-[clamp(56px,9vw,110px)]">
        <div className="mx-auto max-w-[1240px]">
          <Surtitre className="text-papier/55">En avant-première</Surtitre>
          <h2 className="mt-5 max-w-[20ch] text-[clamp(30px,4.5vw,52px)]">
            Le Sanglier arrive.
          </h2>
          <p className="text-papier/60 mt-6 max-w-[54ch] text-[19px] leading-[1.55]">
            Notre bière d&apos;automne aux châtaignes locales, brassée cette année, se
            goûte pour la première fois pendant les portes ouvertes.
          </p>
          <Link
            href="/nos-bieres/le-sanglier"
            className="border-papier text-papier hover:bg-papier hover:text-encre mt-6 inline-block border px-[22px] py-3 text-[14px] font-medium transition-colors"
          >
            Voir la fiche du Sanglier
          </Link>
        </div>
      </section>

      <section className="border-trait px-marge border-t py-[clamp(56px,9vw,110px)]">
        <div className="mx-auto max-w-[1240px]">
          <Surtitre className="text-papier/55">Informations pratiques</Surtitre>
          <h2 className="mt-5 max-w-[22ch] text-[clamp(30px,4.5vw,52px)]">
            Venir aux portes ouvertes.
          </h2>
          <p className="text-papier/60 mt-6 max-w-[56ch] text-[19px] leading-[1.55]">
            {adresse.voie}, {adresse.codePostal} {adresse.commune}. Un parking de{" "}
            {stationnement.places} places devant l&apos;atelier. L&apos;atelier et la
            salle de dégustation sont de plain-pied.{" "}
            <Link href="/ou-nous-trouver" className="underline">
              Plan d&apos;accès complet
            </Link>
            .
          </p>

          <div className="border-trait mt-10 border-t pt-8">
            <p className="text-papier/60 max-w-[54ch] text-[19px] leading-[1.55]">
              Entrée libre, sans réservation. Vous pouvez tout de même nous dire que vous
              venez, ça nous aide à préparer les quantités.
            </p>
            <Link
              href="/contact#ecrire"
              className="bg-papier text-encre hover:bg-papier/85 border-papier mt-6 inline-block border px-[22px] py-3 text-[14px] font-medium transition-colors"
            >
              J&apos;annonce ma venue
            </Link>
            <p className="text-papier/55 mt-3 text-[14px]">
              Formulaire de contact, motif « Portes ouvertes ».
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
