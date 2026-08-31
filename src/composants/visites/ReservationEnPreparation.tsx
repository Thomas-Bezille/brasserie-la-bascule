import { Surtitre } from "@/composants/ui/Surtitre";

/**
 * L'emplacement du module de réservation, tant qu'il n'est pas développé.
 *
 * **Ce bloc n'affiche volontairement aucun moyen de contact.** Ni adresse, ni
 * numéro : `contact@labascule.fr` n'est pas encore une boîte aux lettres, elle
 * sera recréée au transfert du domaine, et aucun numéro à publier n'a été
 * arrêté par le client. Publier l'un ou l'autre reviendrait à refaire
 * exactement ce qui a coûté dix-neuf demandes de contact entre 2023 et 2026 :
 * un formulaire qui écrit dans le vide, sans que personne ne s'en aperçoive.
 *
 * **Ce bloc doit disparaître avant la mise en ligne du 9 octobre.** La
 * réservation est vendue 600 € au devis, elle est l'objectif n° 1 du site et le
 * seul appel à l'action de l'en-tête pointe ici. Une page de visites sans
 * réservation n'est pas livrable.
 */
export function ReservationEnPreparation() {
  return (
    <section
      id="reserver"
      className="bg-beton border-trait px-marge border-t py-[clamp(56px,9vw,110px)]"
    >
      <div className="mx-auto max-w-[1240px]">
        <Surtitre className="text-papier/55">Réserver</Surtitre>
        <h2 className="mt-5 max-w-[20ch] text-[clamp(30px,4.5vw,52px)]">
          La réservation en ligne arrive.
        </h2>
        <p className="text-papier/60 mt-6 max-w-[54ch] text-[19px] leading-[1.55]">
          Vous choisirez votre créneau et recevrez la confirmation immédiatement, sans
          attendre qu&apos;on vous rappelle. Cette page est en cours d&apos;installation.
        </p>
      </div>
    </section>
  );
}
