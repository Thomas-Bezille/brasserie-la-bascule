import { Surtitre } from "@/composants/ui/Surtitre";
import { entreprise } from "@/donnees/entreprise";
import {
  cnil,
  derniereMiseAJour,
  droits,
  sousTraitants,
  traitements,
} from "@/donnees/politique-confidentialite";

/**
 * Le corps de la politique de confidentialité.
 *
 * Séparé de la route pour la même raison que les autres pages : la page ne porte
 * que ses métadonnées et son gabarit, le contenu se rend et se teste ici.
 *
 * **Ce que la page décrit, le site le fait vraiment.** Pas de cookie, pas de
 * script tiers dans le navigateur, formulaires traités côté serveur : ces phrases
 * ne sont pas des intentions, ce sont les mêmes choix qu'on retrouve dans
 * `src/proxy.ts`, `agenda.ts` et le formulaire de réservation. Le jour où l'un
 * change, cette page change avec lui.
 */

function enumerer(elements: readonly string[]): string {
  if (elements.length < 2) return elements.join("");
  return `${elements.slice(0, -1).join(", ")} et ${elements[elements.length - 1]}`;
}

export function ContenuPolitiqueConfidentialite() {
  const capital = entreprise.capitalEuros.toLocaleString("fr-FR");

  return (
    <div className="px-marge mx-auto w-full max-w-[1240px] grow py-[clamp(48px,7vw,96px)]">
      <Surtitre className="text-papier/55">Politique de confidentialité</Surtitre>
      <h1 className="mt-5 max-w-[20ch] text-[clamp(38px,6vw,68px)]">
        Ce que ce site collecte, et pourquoi.
      </h1>
      <p className="text-papier/55 mt-6 text-[15px]">
        Dernière mise à jour : {derniereMiseAJour}
      </p>

      <div className="mt-14 flex max-w-[68ch] flex-col gap-12 text-[17px] leading-[1.6]">
        <section>
          <h2 className="text-[clamp(22px,3vw,30px)]">1. Responsable du traitement</h2>
          <p className="text-papier/70 mt-4">
            Le responsable du traitement des données collectées sur ce site est la{" "}
            <strong className="font-medium">{entreprise.raisonSociale}</strong>,{" "}
            {entreprise.formeJuridique} au capital de {capital} €, dont le siège est situé{" "}
            {entreprise.siege.voie}, {entreprise.siege.codePostal}{" "}
            {entreprise.siege.commune}, immatriculée sous le SIRET {entreprise.siret}.
          </p>
          <p className="text-papier/70 mt-3">
            Pour toute question relative à vos données :{" "}
            <a href={`mailto:${entreprise.email}`} className="underline">
              {entreprise.email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-[clamp(22px,3vw,30px)]">
            2. Données collectées et finalités
          </h2>
          <div className="mt-6 flex flex-col gap-8">
            {traitements.map((t) => (
              <div key={t.id} id={t.id} className="border-trait border-t pt-5">
                <h3 className="text-[19px] font-medium">{t.titre}</h3>
                <p className="text-papier/70 mt-3">{t.donnees}</p>
                <dl className="text-papier/70 mt-4 flex flex-col gap-2">
                  <div>
                    <dt className="inline font-medium">Finalité. </dt>
                    <dd className="inline">{t.finalite}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Base légale. </dt>
                    <dd className="inline">{t.baseLegale}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Destinataires. </dt>
                    <dd className="inline">{t.destinataires}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium">Conservation. </dt>
                    <dd className="inline">{t.conservation}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[clamp(22px,3vw,30px)]">3. Cookies</h2>
          <p className="text-papier/70 mt-4">
            <strong className="font-medium">Ce site ne dépose aucun cookie.</strong> La
            mesure d&apos;audience fonctionne sans cookie, et le formulaire de réservation
            comme le formulaire de contact ne comportent aucun traceur. Aucune bannière de
            consentement n&apos;est donc nécessaire, et aucun choix ne vous est demandé
            sur ce point.
          </p>
        </section>

        <section>
          <h2 className="text-[clamp(22px,3vw,30px)]">
            4. Destinataires et sous-traitants
          </h2>
          <p className="text-papier/70 mt-4">
            Vos données ne sont ni vendues, ni échangées, ni utilisées à des fins
            publicitaires. Elles sont traitées par la {entreprise.raisonSociale} et par
            les sous-traitants suivants, chacun engagé par contrat à ne les utiliser que
            pour la prestation confiée.
          </p>
          <ul className="text-papier/70 mt-5 flex flex-col gap-4">
            {sousTraitants.map((s) => (
              <li key={s.nom} className="border-trait border-t pt-4">
                <span className="font-medium">{s.nom}</span>
                {s.aConfirmer ? (
                  <span className="text-papier/55"> (à confirmer)</span>
                ) : null}
                <span className="text-papier/70"> — {s.role}.</span>
                <span className="text-papier/55"> Hébergement : {s.hebergement}.</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-[clamp(22px,3vw,30px)]">
            5. Transferts hors de l&apos;Union européenne
          </h2>
          <p className="text-papier/70 mt-4">
            L&apos;hébergeur du site, Vercel Inc., est une société établie aux États-Unis.
            Les données qui transitent par le site peuvent donc être traitées en dehors de
            l&apos;Union européenne. Ce transfert est encadré par les clauses
            contractuelles types adoptées par la Commission européenne, qui imposent au
            sous-traitant un niveau de protection équivalent à celui du RGPD. Les autres
            sous-traitants hébergent les données dans l&apos;Union européenne.
          </p>
        </section>

        <section>
          <h2 className="text-[clamp(22px,3vw,30px)]">6. Vos droits</h2>
          <p className="text-papier/70 mt-4">
            Vous disposez, sur vos données, des droits {enumerer(droits)}.
          </p>
          <p className="text-papier/70 mt-3">
            Pour les exercer, écrivez à{" "}
            <a href={`mailto:${entreprise.email}`} className="underline">
              {entreprise.email}
            </a>
            . Une réponse vous sera apportée dans un délai d&apos;un mois.
          </p>
          <p className="text-papier/70 mt-3">
            Si vous estimez, après nous avoir contactés, que vos droits ne sont pas
            respectés, vous pouvez adresser une réclamation à la {cnil.nom},{" "}
            {cnil.adresse}, {cnil.site}.
          </p>
        </section>

        <section>
          <h2 className="text-[clamp(22px,3vw,30px)]">7. Sécurité</h2>
          <p className="text-papier/70 mt-4">
            Le site est servi exclusivement en HTTPS. Les données des formulaires sont
            transmises au serveur, puis au service d&apos;acheminement, sans passer par
            des scripts tiers dans votre navigateur. L&apos;accès aux demandes reçues est
            limité aux gérants de la brasserie.
          </p>
        </section>

        <section>
          <h2 className="text-[clamp(22px,3vw,30px)]">8. Modifications</h2>
          <p className="text-papier/70 mt-4">
            Cette politique peut être modifiée pour suivre l&apos;évolution du site ou de
            la réglementation. La version en vigueur est celle publiée sur cette page,
            datée en tête de document.
          </p>
        </section>
      </div>
    </div>
  );
}
