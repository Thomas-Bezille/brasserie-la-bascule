import { validerDemande } from "@/lib/contact/validation";
import type { DemandeDeContact, Messagerie, ResultatEnvoi } from "@/lib/contact/types";

/**
 * Une messagerie de démonstration, pour développer le parcours sans compte
 * ouvert et sans domaine.
 *
 * **Elle n'envoie rien et ne prétend rien envoyer ailleurs qu'en mémoire.** Elle
 * existe pour écrire et tester le formulaire avant que le service ne soit
 * branché, et pour montrer le parcours complet en revue. La fabrique refuse de
 * la servir dès que `SITE_PUBLIE` vaut `oui`.
 */

const envois: DemandeDeContact[] = [];

export function messagerieDeSimulation(): Messagerie {
  return {
    fournisseur: "simulation",

    async envoyer(demande: DemandeDeContact): Promise<ResultatEnvoi> {
      const anomalies = validerDemande(demande);
      if (anomalies.length > 0) return { etat: "refuse", motif: anomalies[0].message };

      envois.push(demande);
      return { etat: "envoye" };
    },
  };
}

/** Les demandes reçues depuis le dernier oubli. N'existe que pour les tests. */
export function messagesDeSimulation(): readonly DemandeDeContact[] {
  return envois;
}

/** Remet la mémoire à zéro. N'existe que pour les tests. */
export function oublierLesMessagesDeSimulation() {
  envois.length = 0;
}
