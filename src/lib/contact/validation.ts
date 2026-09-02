import { MOTIFS, type DemandeDeContact, type Motif } from "@/lib/contact/types";

/**
 * Ce qu'on vérifie avant d'appeler le moindre service extérieur.
 *
 * Trois champs sont dus (nom, adresse, message), les autres ne sont contrôlés
 * que s'ils sont remplis : un formulaire de contact qui force le téléphone ou
 * l'entreprise perd des messages, et la base légale du traitement, l'intérêt
 * légitime à répondre, ne les réclame pas.
 */

export type Anomalie = { readonly champ: string; readonly message: string };

/** Volontairement permissif : refuser une adresse valide coûte plus qu'accepter une fausse. */
const FORME_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Chiffres, espaces, points, tirets et un éventuel indicatif international. */
const FORME_TELEPHONE = /^\+?[\d\s.\-()]{9,20}$/;

export function validerDemande(demande: DemandeDeContact): readonly Anomalie[] {
  const anomalies: Anomalie[] = [];
  const ajouter = (champ: string, message: string) => anomalies.push({ champ, message });

  if (demande.nom.trim().length < 2) ajouter("nom", "Indiquez votre nom.");

  if (!FORME_EMAIL.test(demande.email))
    ajouter("email", "Cette adresse ne semble pas valide, la réponse y sera envoyée.");

  if (demande.message.trim().length < 10)
    ajouter("message", "Écrivez votre message, quelques mots suffisent.");

  if (demande.telephone && !FORME_TELEPHONE.test(demande.telephone))
    ajouter("telephone", "Ce numéro ne semble pas valide.");

  if (demande.motif && !MOTIFS.includes(demande.motif as Motif))
    ajouter("motif", "Choisissez un motif dans la liste.");

  return anomalies;
}
