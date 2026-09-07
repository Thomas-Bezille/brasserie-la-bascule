import { PORTES_OUVERTES_PUBLIEES } from "@/donnees/portes-ouvertes";

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
  { libelle: "Visites et dégustations", href: "/visites-et-degustations", livree: true },
  { libelle: "Où nous trouver", href: "/ou-nous-trouver", livree: false },
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
  { libelle: "Mentions légales", href: "/mentions-legales", livree: false },
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
