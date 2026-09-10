/**
 * Le vocabulaire du module de contact, indépendant de tout service d'e-mail.
 *
 * **Aucun nom de fournisseur n'apparaît ici, comme dans `src/lib/reservation`.**
 * L'acheminement des courriers passe par Resend (`messagerie-resend.ts`), sur
 * son domaine bac à sable faute de domaine personnalisé pour ce projet fictif
 * (décision du 09/09/2026). Le client gardera ce site trois à cinq ans, changer
 * de service, ou brancher un vrai domaine, doit rester le travail d'une journée,
 * pas une reprise du module.
 */

/** Les motifs proposés au visiteur, tous facultatifs. Source unique. */
export const MOTIFS = [
  "Une visite ou un groupe",
  "Vente aux bars et cavistes",
  "Presse",
  "Portes ouvertes",
  "Autre",
] as const;

export type Motif = (typeof MOTIFS)[number];

export type DemandeDeContact = {
  readonly nom: string;
  readonly email: string;
  readonly message: string;
  readonly telephone?: string;
  readonly entreprise?: string;
  readonly motif?: Motif;
};

/**
 * Le résultat d'un envoi, dans ses trois états.
 *
 * **Il n'y a pas d'état « probablement partie ».** Le visiteur ne voit un
 * remerciement que sur `envoye`. C'est la leçon des dix-neuf demandes perdues de
 * ce client entre 2023 et 2026 : un formulaire qui remercie sans avoir rien
 * transmis ne se remarque qu'au bout de trois ans.
 */
export type ResultatEnvoi =
  | { readonly etat: "envoye" }
  | { readonly etat: "refuse"; readonly motif: string }
  | { readonly etat: "indisponible" };

/**
 * Ce que le site attend d'un service de messagerie, et rien de plus.
 */
export interface Messagerie {
  /** Nom du service, pour les traces et la page d'état. Jamais affiché au visiteur. */
  readonly fournisseur: string;
  envoyer(demande: DemandeDeContact): Promise<ResultatEnvoi>;
}
