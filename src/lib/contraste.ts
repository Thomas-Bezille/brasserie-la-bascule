/**
 * Le contraste des couleurs de bière, calculé et non estimé.
 *
 * **D'où vient ce fichier.** Le premier audit Lighthouse du projet, le
 * 25/09/2026, a relevé un contraste de 3,88:1 sur la fiche du Renard, sous le
 * seuil AA de 4,5 vendu à la section 9 du cahier des charges. Le test de charte
 * existant ne pouvait pas le voir : il lit la feuille de style, alors qu'une
 * couleur de bière est une donnée, injectée en variable locale sur la fiche.
 *
 * En calculant les sept couleurs, cinq ne peuvent pas porter de petit texte et
 * trois n'atteignent même pas le seuil du très grand texte sur le gris béton.
 * Ce n'est pas un défaut d'une fiche, c'est le rôle donné à la couleur.
 *
 * **Ce que la règle ne touche pas.** Aucune couleur de Sophie n'est modifiée,
 * et la sienne du 20/09 tient : une couleur de bière ne sort pas de sa fiche.
 * C'est le fond du cadre qui s'adapte à la bière, pas la bière au cadre.
 *
 * Le calcul est celui de WCAG 2.1, et il est ici plutôt qu'en donnée pour une
 * raison : Le Sanglier arrive à la mi-octobre et les bières de saison suivront.
 * Une valeur écrite à la main serait juste le jour où on l'écrit.
 */

/** Les trois fonds de la charte. Il n'y en a pas d'autre, c'est la règle n° 1. */
export const FONDS = {
  encre: "#14110F",
  beton: "#2A2724",
  papier: "#F3EDE3",
} as const;

export type NomDeFond = keyof typeof FONDS;

/**
 * Seuils AA de WCAG 2.1, critère 1.4.3. Le très grand texte s'en tient à 3:1,
 * ce qui vaut pour le nom du repli typographique, jamais sous 40 px.
 */
export const SEUIL_TEXTE_NORMAL = 4.5;
export const SEUIL_GRAND_TEXTE = 3;

function canalLineaire(valeur: number): number {
  return valeur <= 0.03928 ? valeur / 12.92 : Math.pow((valeur + 0.055) / 1.055, 2.4);
}

/** Luminance relative, formule WCAG. */
export function luminance(couleur: string): number {
  const hex = couleur.replace("#", "");
  const [r, v, b] = [0, 2, 4].map((i) =>
    canalLineaire(parseInt(hex.slice(i, i + 2), 16) / 255),
  );
  return 0.2126 * r + 0.7152 * v + 0.0722 * b;
}

/** Rapport de contraste entre deux couleurs, de 1 à 21. */
export function rapportContraste(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Le fond du cadre du visuel, choisi pour que le nom de la bière reste lisible
 * quand la fiche est en repli typographique.
 *
 * Le béton est le fond par défaut, celui de la maquette validée. Une couleur
 * trop sombre pour lui bascule sur le papier, où les bières sombres passent
 * largement : Le Corbeau y est à 10,22 contre 1,25 sur le béton.
 */
export function fondDuVisuel(couleurDeBiere: string): NomDeFond {
  return rapportContraste(couleurDeBiere, FONDS.beton) >= SEUIL_GRAND_TEXTE
    ? "beton"
    : "papier";
}
