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
 * est encore chez le comptable, le numéro d'entrepositaire agréé chez Marc : les
 * pages qui en ont besoin les afficheront quand ils seront connus, ou signaleront
 * l'attente, jamais une valeur approchante.
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
  siege: adresse,
  email: contact.email,
} as const;
