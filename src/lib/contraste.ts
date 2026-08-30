/**
 * Calcul de contraste, WCAG 2.1.
 *
 * Le cahier des charges 10 engage le site sur l'accessibilité, et Sophie a bâti
 * sa charte sur un seul couple de couleurs. Tout le reste du site est donc du
 * crème à différentes opacités sur deux fonds sombres, ce qui déplace la
 * question du choix des couleurs vers celui des opacités : c'est là que le
 * contraste se perd, sans que rien ne le signale à l'écran d'un voyant.
 */

type Rvb = [number, number, number];

const enRvb = (hex: string): Rvb => {
  const valeur = hex.replace("#", "");
  return [0, 2, 4].map((i) => Number.parseInt(valeur.slice(i, i + 2), 16)) as Rvb;
};

/** La couleur réellement affichée quand un texte translucide est posé sur un fond opaque. */
export function melanger(couleur: string, fond: string, opacite: number): Rvb {
  const [r1, v1, b1] = enRvb(couleur);
  const [r2, v2, b2] = enRvb(fond);
  return [
    r1 * opacite + r2 * (1 - opacite),
    v1 * opacite + v2 * (1 - opacite),
    b1 * opacite + b2 * (1 - opacite),
  ];
}

const luminance = ([r, v, b]: Rvb): number => {
  const canal = (valeur: number) => {
    const proportion = valeur / 255;
    return proportion <= 0.03928
      ? proportion / 12.92
      : ((proportion + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(v) + 0.0722 * canal(b);
};

/** Le rapport de contraste entre deux couleurs, de 1 (identiques) à 21 (noir sur blanc). */
export function contraste(premiere: Rvb | string, seconde: Rvb | string): number {
  const [claire, sombre] = [premiere, seconde]
    .map((couleur) => luminance(typeof couleur === "string" ? enRvb(couleur) : couleur))
    .sort((a, b) => b - a);
  return (claire + 0.05) / (sombre + 0.05);
}

/** Seuil WCAG AA pour un texte de taille courante. */
export const SEUIL_AA = 4.5;
