import type { Anomalie } from "@/lib/contact/validation";

/**
 * L'état du formulaire de contact, partagé par l'action serveur (`actions.ts`)
 * et le composant client (`FormulaireContact.tsx`).
 *
 * **Ce fichier ne porte pas `"use server"`, et c'est la raison de son
 * existence.** Un module d'actions ne peut exporter que des fonctions async :
 * y placer `FORMULAIRE_CONTACT_VIERGE`, qui est un objet, compile et passe les
 * tests unitaires, mais lève un 500 à la première soumission réelle. C'est
 * arrivé au module de réservation le 29/09, voir le journal de méthodologie.
 */

export type EtatDuFormulaireContact =
  | { readonly statut: "vierge" }
  | { readonly statut: "anomalies"; readonly anomalies: readonly Anomalie[] }
  | { readonly statut: "indisponible" }
  /**
   * Envoi écarté par l'anti-spam (`lib/contact/anti-spam.ts`). `message` porte
   * l'indication utile au rare humain touché : réessayer, ou recharger la page.
   * Comme `indisponible`, ce n'est jamais un faux « message envoyé ».
   */
  | { readonly statut: "rejete"; readonly message: string }
  | { readonly statut: "envoye" };

export const FORMULAIRE_CONTACT_VIERGE: EtatDuFormulaireContact = { statut: "vierge" };
