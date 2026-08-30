/**
 * La navigation, source unique.
 *
 * L'en-tête et le pied de page lisent la même liste : une page ajoutée ne peut
 * pas apparaître à un seul des deux endroits.
 *
 * `livree` distingue les pages écrites de celles qui ne le sont pas encore. Le
 * menu reste complet en préproduction, parce que c'est le menu que le client
 * doit juger, mais une page non livrée affiche son état plutôt qu'une erreur
 * 404. Le champ disparaîtra à la mise en ligne, quand tout sera vrai.
 */

export type Lien = {
  readonly libelle: string;
  readonly href: string;
  readonly livree: boolean;
};

/** Les cinq pages du menu principal, dans l'ordre de la maquette validée. */
export const navigationPrincipale: readonly Lien[] = [
  { libelle: "Accueil", href: "/", livree: true },
  { libelle: "Nos bières", href: "/nos-bieres", livree: false },
  { libelle: "Visites et dégustations", href: "/visites-et-degustations", livree: false },
  { libelle: "Où nous trouver", href: "/ou-nous-trouver", livree: false },
  { libelle: "Contact", href: "/contact", livree: false },
];

export const liensLegaux: readonly Lien[] = [
  { libelle: "Mentions légales", href: "/mentions-legales", livree: false },
  {
    libelle: "Politique de confidentialité",
    href: "/politique-de-confidentialite",
    livree: false,
  },
];

/** Objectif n° 1 du site, et seul appel à l'action de l'en-tête. */
export const lienReservation = {
  href: "/visites-et-degustations",
  libelleCourt: "Réserver",
  complement: " une visite",
} as const;
