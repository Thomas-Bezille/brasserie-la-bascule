"use server";

import { agendaDuSite } from "@/lib/reservation/agenda";
import type { DemandeDeReservation } from "@/lib/reservation/types";
import { validerDemande } from "@/lib/reservation/validation";
import type { EtatDuFormulaire } from "./etat-formulaire";

/**
 * L'envoi d'une demande de réservation.
 *
 * **Tout se passe sur le serveur, et le jeton de l'agenda n'en sort pas.** C'est
 * ce qui permet au site de n'avoir aucun script tiers, donc aucun cookie tiers,
 * donc pas de bandeau de consentement : un engagement pris à la section 9 du
 * cahier des charges et tenu partout ailleurs sur le site.
 *
 * **Ce fichier ne peut exporter que des fonctions async.** L'état du formulaire
 * et sa valeur initiale sont dans `./etat-formulaire`, un module ordinaire :
 * les exporter d'ici lève une erreur à l'exécution de l'action.
 */

function texte(donnees: FormData, champ: string): string {
  const valeur = donnees.get(champ);
  return typeof valeur === "string" ? valeur.trim() : "";
}

export async function demanderUneReservation(
  _precedent: EtatDuFormulaire,
  donnees: FormData,
): Promise<EtatDuFormulaire> {
  const demande: DemandeDeReservation = {
    creneauDebut: texte(donnees, "creneau"),
    formule: texte(donnees, "formule"),
    nombreDePersonnes: Number.parseInt(texte(donnees, "nombreDePersonnes"), 10) || 0,
    nom: texte(donnees, "nom"),
    email: texte(donnees, "email"),
    telephone: texte(donnees, "telephone"),
    entreprise: texte(donnees, "entreprise") || undefined,
    message: texte(donnees, "message") || undefined,
  };

  const anomalies = validerDemande(demande);
  if (anomalies.length > 0) return { statut: "anomalies", anomalies };

  const agenda = await agendaDuSite();

  /**
   * Sans agenda, on ne fait pas semblant. Le visiteur est prévenu que sa
   * demande n'est pas partie, plutôt que remercié pour rien : c'est ce qui a
   * coûté dix-neuf demandes de contact à ce client entre 2023 et 2026.
   */
  if (!agenda) return { statut: "indisponible" };

  const resultat = await agenda.reserver(demande);

  switch (resultat.etat) {
    case "confirmee":
      return { statut: "confirme", reference: resultat.reference };
    case "creneau-complet":
      return { statut: "creneau-complet" };
    case "refusee":
      return {
        statut: "anomalies",
        anomalies: [{ champ: "formule", message: resultat.motif }],
      };
    case "indisponible":
      return { statut: "indisponible" };
  }
}
