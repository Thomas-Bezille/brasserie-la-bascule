import { adresse, contact } from "@/donnees/infos-pratiques";

/**
 * L'identité légale de la société, source unique.
 *
 * Ces mentions servent la politique de confidentialité et serviront les mentions
 * légales : deux pages qui citeront la même raison sociale, le même SIRET et le
 * même siège. Les recopier des deux côtés, c'est en corriger un seul le jour où
 * le client change quelque chose.
 *
 * **Ce qui manque est laissé à `undefined`, pas inventé.** Le SIRET a été
 * communiqué par le client le 08/09/2026. Le numéro de TVA intracommunautaire
 * est encore chez le comptable, le numéro d'entrepositaire agréé chez Marc
 * (annoncé pour octobre, fil client). Les pages qui en ont besoin les
 * afficheront quand ils seront connus, ou signaleront l'attente, jamais une
 * valeur approchante.
 *
 * **Directeur de publication : Julien Mercier, Président.** Julien et Marc
 * restaient tous deux « co-gérants » dans les échanges, sans qu'aucun des deux
 * ne soit désigné représentant légal de la SAS. Tranché par Thomas le
 * 08/09/2026 : Julien, déjà l'interlocuteur unique décisionnaire du projet,
 * porte le titre.
 *
 * Le siège social est l'adresse publiée, même bâtiment : elle reste définie une
 * seule fois, dans `infos-pratiques.ts`.
 */
export const entreprise = {
  raisonSociale: "Brasserie La Bascule",
  formeJuridique: "société par actions simplifiée (SAS)",
  capitalEuros: 15_000,
  siret: "911 283 745 00022",
  tvaIntracommunautaire: undefined as string | undefined,
  numeroEntrepositaireAgree: undefined as string | undefined,
  directeurPublication: "Julien Mercier, Président de la société.",
  siege: adresse,
  email: contact.email,
} as const;
