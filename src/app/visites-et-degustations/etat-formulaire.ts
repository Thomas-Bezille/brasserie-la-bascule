import type { Anomalie } from "@/lib/reservation/validation";

/**
 * L'état du formulaire de réservation, partagé par l'action serveur
 * (`actions.ts`) et le composant client (`FormulaireReservation.tsx`).
 *
 * **Ce fichier ne porte pas `"use server"`, et c'est la raison de son
 * existence.** Un module d'actions ne peut exporter que des fonctions async :
 * y exporter `FORMULAIRE_VIERGE`, qui est un objet, compile et passe les tests
 * unitaires, mais lève « A "use server" file can only export async functions »
 * à la première invocation réelle de l'action. La valeur et son type vivent
 * donc ici.
 */

export type EtatDuFormulaire =
  | { readonly statut: "vierge" }
  | { readonly statut: "anomalies"; readonly anomalies: readonly Anomalie[] }
  | { readonly statut: "creneau-complet" }
  | { readonly statut: "indisponible" }
  | { readonly statut: "confirme"; readonly reference: string };

export const FORMULAIRE_VIERGE: EtatDuFormulaire = { statut: "vierge" };
