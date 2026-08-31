import { visites } from "@/donnees/infos-pratiques";
import type { DemandeDeReservation } from "@/lib/reservation/types";

/**
 * Ce qu'on vérifie avant d'appeler le moindre service extérieur.
 *
 * Les effectifs ne sont pas inventés ici : ils viennent de `visites`, source
 * unique, vérifiée par le client le 21/09/2026. Une visite découverte accueille
 * 6 à 10 personnes, une visite entreprise 15 à 20. **Un formulaire qui laisse
 * demander une visite pour trois personnes crée un appel téléphonique, pas une
 * réservation.**
 */

export type Anomalie = { readonly champ: string; readonly message: string };

/** Volontairement permissif : refuser une adresse valide coûte plus qu'accepter une fausse. */
const FORME_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Chiffres, espaces, points, tirets et un éventuel indicatif international. */
const FORME_TELEPHONE = /^\+?[\d\s.\-()]{9,20}$/;

export function validerDemande(demande: DemandeDeReservation): readonly Anomalie[] {
  const anomalies: Anomalie[] = [];
  const ajouter = (champ: string, message: string) => anomalies.push({ champ, message });

  const formule = visites.find((f) => f.nom === demande.formule);
  if (!formule) {
    ajouter("formule", "Choisissez une formule de visite.");
  } else if (
    demande.nombreDePersonnes < formule.effectifMin ||
    demande.nombreDePersonnes > formule.effectifMax
  ) {
    ajouter(
      "nombreDePersonnes",
      `La ${formule.nom.toLowerCase()} accueille de ${formule.effectifMin} à ${formule.effectifMax} personnes.`,
    );
  }

  if (demande.nom.trim().length < 2) ajouter("nom", "Indiquez votre nom.");
  if (!FORME_EMAIL.test(demande.email))
    ajouter(
      "email",
      "Cette adresse ne semble pas valide, la confirmation y sera envoyée.",
    );
  if (!FORME_TELEPHONE.test(demande.telephone))
    ajouter("telephone", "Indiquez un numéro où vous joindre le jour de la visite.");

  if (!Number.isFinite(Date.parse(demande.creneauDebut)))
    ajouter("creneauDebut", "Choisissez un créneau.");

  return anomalies;
}
