import { FormulaireContact } from "@/composants/contact/FormulaireContact";
import { etatDeLaMessagerie, messagerieDuSite } from "@/lib/contact/messagerie";

/**
 * Le module de contact : le formulaire, ou l'explication de son absence.
 *
 * **Deux états, et le premier est celui qui compte.** Sans service de messagerie
 * configuré, la section le dit et n'affiche aucun champ. Un formulaire qui
 * s'affiche sans destination est exactement ce qui a fait disparaître dix-neuf
 * demandes de contact chez ce client entre 2023 et 2026.
 *
 * **En simulation, un bandeau le dit en clair.** La préproduction sert à montrer
 * le parcours avant que le service ne soit branché ; personne ne doit croire
 * qu'un message envoyé là est transmis. Le bandeau disparaît de lui-même avec le
 * vrai service, et la recette refuse la mention « ouvrira avec le site » sur un
 * site publié.
 *
 * **La configuration est lue au build.** La mise en ligne du 9 octobre est un
 * redéploiement (passage de `SITE_PUBLIE` à `oui`), la valeur est donc à jour à
 * ce moment-là. Ce composant n'a pas de donnée sensible au temps, contrairement
 * au module de réservation et à ses créneaux.
 */
export async function ModuleContact() {
  const etat = etatDeLaMessagerie();
  const messagerie = await messagerieDuSite();

  if (!messagerie) {
    return (
      <p className="text-papier/60 mt-6 max-w-[58ch] text-[19px] leading-[1.55]">
        Le formulaire de contact ouvrira avec le site. En attendant, écrivez-nous
        directement à l&apos;adresse ci-dessus : nous préférons vous le dire plutôt que de
        vous laisser remplir un formulaire qui n&apos;enverrait rien.
        {!etat.configure && (
          <span className="sr-only"> Motif technique : {etat.motif}.</span>
        )}
      </p>
    );
  }

  return (
    <>
      {messagerie.fournisseur === "simulation" && (
        <p className="border-papier/30 mt-7 border-l-2 pl-4 text-[15px]">
          <strong className="text-papier">Démonstration.</strong> Le service d&apos;envoi
          n&apos;est pas encore branché : aucun message envoyé depuis ce formulaire
          n&apos;est transmis.
        </p>
      )}

      <div className="mt-10">
        <FormulaireContact />
      </div>
    </>
  );
}
