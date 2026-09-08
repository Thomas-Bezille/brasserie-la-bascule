import Link from "next/link";
import { Surtitre } from "@/composants/ui/Surtitre";
import { entreprise } from "@/donnees/entreprise";

/**
 * Le corps des mentions légales.
 *
 * Séparé de la route pour la même raison que la politique de confidentialité :
 * la page ne porte que ses métadonnées et son gabarit, le contenu se rend et se
 * teste ici.
 *
 * **Ce qui manque ne se comble pas.** TVA intracommunautaire et numéro
 * d'entrepositaire agréé sont encore en attente côté client (voir
 * `donnees/entreprise.ts`) : la page signale l'attente au lieu d'une valeur
 * approchante. Le directeur de publication, lui, est tranché : Julien Mercier,
 * désigné Président le 08/09/2026.
 *
 * **L'adresse de l'hébergeur est la seule donnée de cette page qui ne vient pas
 * du client** : c'est l'adresse que Vercel Inc. publie elle-même dans ses
 * propres mentions légales et celles de ses clients, vérifiée le 08/09/2026.
 */

const hebergeur = {
  nom: "Vercel Inc.",
  adresse: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
} as const;

function EnAttente({ children }: { children: string }) {
  return <span className="text-papier/55 italic">en attente, {children}</span>;
}

export function ContenuMentionsLegales() {
  const capital = entreprise.capitalEuros.toLocaleString("fr-FR");

  return (
    <div className="px-marge mx-auto w-full max-w-[1240px] grow py-[clamp(48px,7vw,96px)]">
      <Surtitre className="text-papier/55">Mentions légales</Surtitre>
      <h1 className="mt-5 max-w-[20ch] text-[clamp(38px,6vw,68px)]">
        Qui édite ce site, et qui l&apos;héberge.
      </h1>

      <div className="mt-14 flex max-w-[68ch] flex-col gap-12 text-[17px] leading-[1.6]">
        <section>
          <h2 className="text-[clamp(22px,3vw,30px)]">1. Éditeur du site</h2>
          <dl className="text-papier/70 mt-4 flex flex-col gap-2">
            <div>
              <dt className="inline font-medium">Raison sociale. </dt>
              <dd className="inline">
                {entreprise.raisonSociale}, {entreprise.formeJuridique} au capital de{" "}
                {capital} €.
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">Siège social. </dt>
              <dd className="inline">
                {entreprise.siege.voie}, {entreprise.siege.codePostal}{" "}
                {entreprise.siege.commune}.
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">SIRET. </dt>
              <dd className="inline">{entreprise.siret}.</dd>
            </div>
            <div>
              <dt className="inline font-medium">TVA intracommunautaire. </dt>
              <dd className="inline">
                {entreprise.tvaIntracommunautaire ?? (
                  <EnAttente>communiquée par notre expert-comptable</EnAttente>
                )}
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">Entrepositaire agréé. </dt>
              <dd className="inline">
                {entreprise.numeroEntrepositaireAgree ?? (
                  <EnAttente>communiqué à l&apos;automne 2026</EnAttente>
                )}
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">Directeur de publication. </dt>
              <dd className="inline">
                {entreprise.directeurPublication ?? (
                  <EnAttente>en cours de désignation</EnAttente>
                )}
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">Contact. </dt>
              <dd className="inline">
                <a href={`mailto:${entreprise.email}`} className="underline">
                  {entreprise.email}
                </a>
                .
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="text-[clamp(22px,3vw,30px)]">2. Hébergement</h2>
          <p className="text-papier/70 mt-4">
            Le site est hébergé par {hebergeur.nom}, {hebergeur.adresse}.
          </p>
        </section>

        <section>
          <h2 className="text-[clamp(22px,3vw,30px)]">3. Propriété intellectuelle</h2>
          <p className="text-papier/70 mt-4">
            L&apos;ensemble de ce site, textes, illustrations, photographies et charte
            graphique, est protégé par le droit d&apos;auteur. Toute reproduction, même
            partielle, est interdite sans autorisation écrite de la{" "}
            {entreprise.raisonSociale}.
          </p>
        </section>

        <section>
          <h2 className="text-[clamp(22px,3vw,30px)]">4. Données personnelles</h2>
          <p className="text-papier/70 mt-4">
            Les données collectées sur ce site sont décrites dans la{" "}
            <Link href="/politique-de-confidentialite" className="underline">
              politique de confidentialité
            </Link>
            , qui précise leur finalité, leur base légale, leur durée de conservation et
            vos droits.
          </p>
        </section>
      </div>
    </div>
  );
}
