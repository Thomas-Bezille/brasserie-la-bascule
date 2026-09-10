import { PORTES_OUVERTES_PUBLIEES } from "@/donnees/portes-ouvertes";

/**
 * La navigation, source unique.
 *
 * L'en-tête lit cette liste ; le plan du site (`sitemap.ts`) s'en sert pour ne
 * pas indexer une page pas encore écrite. Le pied de page ne la lit plus depuis
 * la correction 7 de Sophie, qui a retiré la colonne « Le site » recopiant le
 * menu : il ne porte que les liens légaux.
 *
 * `livree` distingue les pages écrites de celles qui ne le sont pas encore. Le
 * menu reste complet en préproduction, parce que c'est le menu que le client
 * doit juger, mais une page non livrée affiche son état plutôt qu'une erreur
 * 404. Le champ disparaîtra à la mise en ligne, quand tout sera vrai.
 */

export type Lien = {
  readonly libelle: string;
  /**
   * Libellé raccourci pour le menu de bureau, où l'espace horizontal est
   * compté. Le menu de téléphone et les titres de page gardent le `libelle`
   * complet. Absent quand le libellé complet tient déjà.
   */
  readonly libelleCourt?: string;
  readonly href: string;
  readonly livree: boolean;
};

/**
 * Le menu principal.
 *
 * **« Accueil » n'y est plus** (session 19) : le logo y menait déjà, et la
 * sixième page a rendu la rangée trop dense sur écran moyen. Le plan du site
 * porte désormais l'accueil en propre. Les libellés restent ceux de la maquette
 * validée ; deux sont raccourcis pour le seul menu de bureau (`libelleCourt`).
 *
 * « Notre histoire » est hors maquette, réintégrée par l'avenant n° 2. Elle
 * s'insère avant « Contact », à la place que lui donnait la liste du client au
 * rendez-vous de découverte. L'avenant demandait aussi une présence au pied de
 * page ; sans objet depuis la correction 7 de Sophie, comme pour toutes les
 * autres pages.
 */
export const navigationPrincipale: readonly Lien[] = [
  { libelle: "Nos bières", href: "/nos-bieres", livree: true },
  {
    libelle: "Visites et dégustations",
    libelleCourt: "Visites",
    href: "/visites-et-degustations",
    livree: true,
  },
  {
    libelle: "Où nous trouver",
    libelleCourt: "Nous trouver",
    href: "/ou-nous-trouver",
    livree: true,
  },
  { libelle: "Notre histoire", href: "/notre-histoire", livree: true },
  { libelle: "Contact", href: "/contact", livree: true },
];

/**
 * Sixième lien, hors des cinq pages de la maquette validée : l'avenant n° 1
 * demande une présence au menu « pendant la durée de l'événement ». Comme les
 * autres interrupteurs du site (`COFFRETS_PUBLIES`, `SITE_PUBLIE`), pas de
 * fenêtre de date calculée : `PORTES_OUVERTES_PUBLIEES` est ce qui l'affiche,
 * et c'est Thomas qui le repassera à `false` après le 25/10.
 */
export const lienPortesOuvertes: Lien | null = PORTES_OUVERTES_PUBLIEES
  ? { libelle: "Portes ouvertes", href: "/portes-ouvertes", livree: true }
  : null;

export const liensLegaux: readonly Lien[] = [
  { libelle: "Mentions légales", href: "/mentions-legales", livree: true },
  {
    libelle: "Politique de confidentialité",
    href: "/politique-de-confidentialite",
    livree: true,
  },
];

/** Objectif n° 1 du site, et seul appel à l'action de l'en-tête. */
export const lienReservation = {
  href: "/visites-et-degustations",
  libelleCourt: "Réserver",
  complement: " une visite",
} as const;
