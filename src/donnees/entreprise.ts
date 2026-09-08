import { adresse, contact } from "@/donnees/infos-pratiques";

/**
 * L'identité légale de la société, source unique.
 *
 * Ces mentions servent la politique de confidentialité et serviront les mentions
 * légales : deux pages qui citeront la même raison sociale, le même SIRET et le
 * même siège. Les recopier des deux côtés, c'est en corriger un seul le jour où
 * le client change quelque chose.
 *
 * **Directeur de publication : Julien Mercier, Président.** Julien et Marc
 * restaient tous deux « co-gérants » dans les échanges, sans qu'aucun des deux
 * ne soit désigné représentant légal de la SAS. Tranché par Thomas le
 * 08/09/2026 : Julien, déjà l'interlocuteur unique décisionnaire du projet,
 * porte le titre.
 *
 * **TVA intracommunautaire et numéro d'entrepositaire agréé, sortis de la
 * fiction le 08/09/2026.** Le devis les portait « en attente » (chez le
 * comptable, chez Marc) tant que le projet jouait le client fictif ; pour
 * finir la page des mentions légales du portfolio, Thomas a choisi des
 * valeurs fictives mais plausibles plutôt que de laisser un blanc permanent.
 * La TVA suit la vraie formule de clé de contrôle française sur le SIREN
 * ci-dessous : `(12 + 3 × (SIREN mod 97)) mod 97`, soit 46.
 *
 * Le siège social est l'adresse publiée, même bâtiment : elle reste définie une
 * seule fois, dans `infos-pratiques.ts`.
 */
export const entreprise = {
  raisonSociale: "Brasserie La Bascule",
  formeJuridique: "société par actions simplifiée (SAS)",
  capitalEuros: 15_000,
  siret: "911 283 745 00022",
  tvaIntracommunautaire: "FR46 911 283 745",
  numeroEntrepositaireAgree: "FR44 2022 0143",
  directeurPublication: "Julien Mercier, Président de la société.",
  siege: adresse,
  email: contact.email,
} as const;
