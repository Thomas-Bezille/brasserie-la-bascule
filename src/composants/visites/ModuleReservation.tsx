import { connection } from "next/server";
import { Surtitre } from "@/composants/ui/Surtitre";
import { FormulaireReservation } from "@/composants/visites/FormulaireReservation";
import { visites } from "@/donnees/infos-pratiques";
import { agendaDuSite, etatDeLAgenda } from "@/lib/reservation/agenda";
import type { Creneau } from "@/lib/reservation/types";

/**
 * Le module de réservation, niveau B du devis, vendu 600 €.
 *
 * C'est l'objectif n° 1 du site : deux à trois demandes de visite se perdaient
 * chaque mois faute de réponse, et le seul appel à l'action de l'en-tête mène
 * ici.
 *
 * **Trois états, et le premier est celui qui compte.** Sans agenda configuré,
 * la section le dit et n'affiche aucun champ. Un formulaire qui s'affiche sans
 * destination est exactement ce qui a fait disparaître dix-neuf demandes de
 * contact chez ce client entre 2023 et 2026.
 *
 * **Ce bloc se rend à la requête et non au build**, d'où l'appel à `connection()`.
 * Sans lui, les créneaux affichés seraient ceux du jour du déploiement : ils
 * vieilliraient en silence, et le site proposerait des dates passées. Le reste
 * de la page demeure statique, il est enveloppé d'un `Suspense`.
 *
 * **En simulation, un bandeau le dit en clair.** La préproduction sert à montrer
 * le parcours à la graphiste et au client avant que le compte de l'agenda ne
 * soit ouvert ; personne ne doit croire qu'une réservation faite là est
 * enregistrée quelque part. Le bandeau disparaît de lui-même avec le vrai
 * fournisseur, et la recette refuse sa présence sur un site publié.
 */

/** Trois semaines : assez pour choisir, assez court pour que Marc s'y retrouve. */
const HORIZON_JOURS = 21;

export async function ModuleReservation() {
  // Marque ce composant comme rendu à la requête : les créneaux ne se figent pas au build.
  await connection();

  const etat = etatDeLAgenda();
  const agenda = await agendaDuSite();

  const depuis = new Date();
  const jusqua = new Date(depuis.getTime() + HORIZON_JOURS * 24 * 60 * 60 * 1000);

  const creneauxParFormule: Record<string, readonly Creneau[]> = {};
  if (agenda) {
    for (const formule of visites) {
      creneauxParFormule[formule.nom] = await agenda.creneaux(
        formule.nom,
        depuis,
        jusqua,
      );
    }
  }

  return (
    <section
      id="reserver"
      className="bg-beton border-trait px-marge border-t py-[clamp(56px,9vw,110px)]"
    >
      <div className="mx-auto max-w-[1240px]">
        <Surtitre className="text-papier/55">Réserver</Surtitre>
        <h2 className="mt-5 max-w-[20ch] text-[clamp(30px,4.5vw,52px)]">
          Choisissez votre créneau.
        </h2>

        {agenda ? (
          <>
            <p className="text-papier/60 mt-6 max-w-[54ch] text-[19px] leading-[1.55]">
              Vous recevez la confirmation immédiatement, et un rappel la veille. Pas de
              demande à traiter, pas d&apos;attente.
            </p>

            {agenda.fournisseur === "simulation" && (
              <p className="border-papier/30 mt-7 border-l-2 pl-4 text-[15px]">
                <strong className="text-papier">Démonstration.</strong> L&apos;agenda
                définitif n&apos;est pas encore branché : les créneaux ci-dessous sont des
                exemples et aucune réservation faite ici n&apos;est enregistrée.
              </p>
            )}

            <div className="mt-10">
              <FormulaireReservation
                formules={visites}
                creneauxParFormule={creneauxParFormule}
              />
            </div>
          </>
        ) : (
          <p className="text-papier/60 mt-6 max-w-[56ch] text-[19px] leading-[1.55]">
            La réservation en ligne est en cours d&apos;installation. Elle ouvrira avec le
            site : en attendant, aucune demande ne peut être envoyée depuis cette page, et
            nous préférons vous le dire plutôt que de vous laisser écrire dans le vide.
            {!etat.configure && (
              <span className="sr-only"> Motif technique : {etat.motif}.</span>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
