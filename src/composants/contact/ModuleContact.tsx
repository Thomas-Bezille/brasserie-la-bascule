import { connection } from "next/server";
import { FormulaireContact } from "@/composants/contact/FormulaireContact";
import { jetonAntiSpam } from "@/lib/contact/anti-spam";
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
 * **Rendu à la requête** (`connection()`), pour poser à chaque visiteur un jeton
 * anti-spam frais (`jetonAntiSpam`, `lib/contact/anti-spam.ts`). C'est la seule
 * donnée sensible au temps de la page ; `/contact` est déclarée dynamique dans
 * `scripts/recette.mjs`, comme la page des visites.
 */
export async function ModuleContact() {
  await connection();

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
        <FormulaireContact jeton={jetonAntiSpam()} />
      </div>
    </>
  );
}
