"use server";

import { messagerieDuSite } from "@/lib/contact/messagerie";
import { MOTIFS, type DemandeDeContact, type Motif } from "@/lib/contact/types";
import { validerDemande } from "@/lib/contact/validation";
import type { EtatDuFormulaireContact } from "./etat-formulaire";

/**
 * L'envoi d'un message depuis le formulaire de contact.
 *
 * **Tout se passe sur le serveur, et la clé du service n'en sort pas.** C'est ce
 * qui permet au site de n'avoir aucun script tiers, donc aucun cookie tiers,
 * donc pas de bandeau de consentement.
 *
 * **Pas de case de consentement, et c'est voulu.** Le traitement repose sur
 * l'intérêt légitime de la brasserie à répondre aux personnes qui la sollicitent
 * (politique de confidentialité, traitement « contact »). Une case laisserait
 * croire à un choix qui n'existe pas : sans réponse possible en cas de refus, ce
 * n'est pas un consentement libre. Le CDC prévoyait une case, la politique de
 * confidentialité a tranché l'inverse, et c'est elle qui fait foi.
 *
 * **Ce fichier ne peut exporter que des fonctions async.** L'état du formulaire
 * et sa valeur initiale sont dans `./etat-formulaire`.
 */

function texte(donnees: FormData, champ: string): string {
  const valeur = donnees.get(champ);
  return typeof valeur === "string" ? valeur.trim() : "";
}

export async function envoyerUnMessage(
  _precedent: EtatDuFormulaireContact,
  donnees: FormData,
): Promise<EtatDuFormulaireContact> {
  const motifBrut = texte(donnees, "motif");
  const demande: DemandeDeContact = {
    nom: texte(donnees, "nom"),
    email: texte(donnees, "email"),
    message: texte(donnees, "message"),
    telephone: texte(donnees, "telephone") || undefined,
    entreprise: texte(donnees, "entreprise") || undefined,
    motif: MOTIFS.includes(motifBrut as Motif) ? (motifBrut as Motif) : undefined,
  };

  const anomalies = validerDemande(demande);
  if (anomalies.length > 0) return { statut: "anomalies", anomalies };

  const messagerie = await messagerieDuSite();

  /**
   * Sans service, on ne fait pas semblant. Le visiteur est prévenu que sa
   * demande n'est pas partie, plutôt que remercié pour rien : c'est ce qui a
   * coûté dix-neuf demandes de contact à ce client entre 2023 et 2026.
   */
  if (!messagerie) return { statut: "indisponible" };

  const resultat = await messagerie.envoyer(demande);

  switch (resultat.etat) {
    case "envoye":
      return { statut: "envoye" };
    case "refuse":
      return {
        statut: "anomalies",
        anomalies: [{ champ: "message", message: resultat.motif }],
      };
    case "indisponible":
      return { statut: "indisponible" };
  }
}
