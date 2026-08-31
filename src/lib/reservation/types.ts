/**
 * Le vocabulaire du module de réservation, indépendant de tout prestataire.
 *
 * **Aucun nom de fournisseur n'apparaît dans ces types, et c'est délibéré.**
 * Le choix de l'agenda n'est pas arrêté (Meetergo pressenti, Cal.com en repli,
 * voir `03-conception/decision-agenda-reservation.md` du dossier projet), et il
 * pourra changer pendant la vie du site : les deux candidats sont des éditeurs
 * propriétaires de taille modeste, et le client gardera ce site trois à cinq
 * ans. Changer d'agenda doit rester le travail d'une journée, pas une reprise
 * du module.
 */

/** Un créneau proposé au visiteur. Les dates sont en ISO 8601 avec fuseau. */
export type Creneau = {
  readonly debut: string;
  readonly fin: string;
  /**
   * Ce qui reste, et non la capacité totale : c'est cette valeur qui ferme le
   * créneau, exigence du cahier des charges 5.4, « créneaux fermés
   * automatiquement une fois complets ».
   */
  readonly placesRestantes: number;
};

export type DemandeDeReservation = {
  readonly creneauDebut: string;
  /** Le `nom` d'une formule de `donnees/infos-pratiques`, source unique. */
  readonly formule: string;
  readonly nombreDePersonnes: number;
  readonly nom: string;
  readonly email: string;
  readonly telephone: string;
  readonly entreprise?: string;
  readonly message?: string;
};

/**
 * Le résultat d'une tentative, dans ses trois états possibles.
 *
 * **Il n'y a pas d'état « probablement enregistrée ».** Le visiteur ne voit un
 * remerciement que sur `confirmee`. C'est la leçon des dix-neuf demandes perdues
 * entre 2023 et 2026 : un formulaire qui remercie sans avoir rien enregistré ne
 * se remarque qu'au bout de trois ans.
 */
export type ResultatReservation =
  | { readonly etat: "confirmee"; readonly reference: string }
  | { readonly etat: "creneau-complet" }
  | { readonly etat: "refusee"; readonly motif: string }
  | { readonly etat: "indisponible" };

/**
 * Ce que le site attend d'un agenda, et rien de plus. Un fournisseur qui ne
 * saurait pas tenir ces deux méthodes ne convient pas au niveau B vendu.
 */
export interface Agenda {
  /** Nom du fournisseur, pour les traces et la page d'état. Jamais affiché au visiteur. */
  readonly fournisseur: string;
  creneaux(formule: string, depuis: Date, jusqua: Date): Promise<readonly Creneau[]>;
  reserver(demande: DemandeDeReservation): Promise<ResultatReservation>;
}
