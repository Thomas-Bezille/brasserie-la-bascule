import { describe, expect, it } from "vitest";
import { bieres, type Biere } from "./bieres";

/**
 * Garde-fous sur la gamme.
 *
 * Le premier verrouille les URLs : le CDC 5.1 engage le client sur des adresses
 * de fiches qui ne changent jamais, y compris hors saison, parce que c'est ce
 * qui garde leur référencement d'une année sur l'autre.
 *
 * Le second verrouille la palette de Sophie : ces sept codes sont ceux qu'elle a
 * convertis pour l'écran, une couleur approchante n'est pas la couleur de la
 * bière.
 */

/** Les sept codes arrêtés par Sophie, CDC 7.1. */
const PALETTE_DES_BIERES = [
  "#B25537", // La Rouquine
  "#5F7A3C", // Le Renard
  "#E3AE2B", // L'Abeille
  "#7FA9A6", // La Carpe
  "#4A2F3D", // Le Corbeau
  "#9E2B25", // La Guêpe
  "#6B4226", // Le Sanglier, pas encore dans la gamme publiée
];

const trouver = (slug: string): Biere => {
  const biere = bieres.find((b) => b.slug === slug);
  if (!biere) throw new Error(`bière introuvable : ${slug}`);
  return biere;
};

describe("les slugs", () => {
  it("sont uniques", () => {
    const slugs = bieres.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("tiennent dans une URL, sans accent ni majuscule", () => {
    for (const { slug } of bieres) {
      expect(slug, `slug non conforme : ${slug}`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });
});

describe("les couleurs", () => {
  it("sortent toutes de la palette de Sophie", () => {
    for (const { nom, couleur } of bieres) {
      expect(PALETTE_DES_BIERES, `couleur hors palette pour ${nom}`).toContain(couleur);
    }
  });

  it("ne sont portées que par une seule bière chacune", () => {
    const couleurs = bieres.map((b) => b.couleur);
    expect(new Set(couleurs).size).toBe(couleurs.length);
  });
});

describe("les données techniques", () => {
  /**
   * Règle du CDC 6, née des six erreurs du 21/09/2026 : rien qui ne vienne de
   * Marc. Un champ absent s'affiche comme absent. Ce test interdit la
   * demi-mesure, un champ présent mais vide, qui afficherait un trou en se
   * faisant passer pour une donnée.
   */
  it("ne contiennent aucune valeur creuse", () => {
    for (const biere of bieres) {
      if (biere.degre !== undefined) expect(biere.degre).toBeGreaterThan(0);
      if (biere.ibu !== undefined) expect(biere.ibu).toBeGreaterThan(0);
      if (biere.malts !== undefined) expect(biere.malts.length).toBeGreaterThan(0);
      if (biere.houblons !== undefined) expect(biere.houblons.length).toBeGreaterThan(0);
      for (const texte of [biere.origineIngredients, biere.notesDegustation]) {
        if (texte !== undefined) expect(texte.trim()).not.toBe("");
      }
    }
  });

  it("donnent au Renard les valeurs corrigées par Marc, houblons compris", () => {
    const renard = trouver("le-renard");
    expect(renard.degre).toBe(6.4);

    // Corrigé le 24/09/2026 : Marc avait donné deux origines le 21, il y a
    // trois variétés. La donnée publiée était incomplète, pas fausse.
    expect(renard.houblons).toEqual([
      "Styrian Golding (Slovénie)",
      "Citra (Yakima, États-Unis)",
      "Simcoe (Yakima, États-Unis)",
    ]);
  });

  it("n'invente aucun IBU, Marc n'ayant pas de quoi le mesurer", () => {
    // « Si vous avez besoin d'un chiffre je ne peux pas vous en donner un, je ne
    // vais pas inventer », 24/09/2026. La fiche affiche l'absence, elle ne la
    // comble pas : c'est la règle n° 1 de `bieres.ts`.
    for (const biere of bieres) expect(biere.ibu).toBeUndefined();
  });
});

describe("les visuels", () => {
  /**
   * La Carpe et Le Corbeau sont des scans de 2022 au format de l'étiquette : ils
   * montrent le grain du papier passé une vingtaine de centimètres. La
   * contrainte est une propriété du fichier, pas une exception de mise en page.
   */
  it("réduisent les deux étiquettes scannées, et elles seules", () => {
    const reduites = bieres
      .filter((b) => b.tailleVisuel === "reduite")
      .map((b) => b.slug);
    expect(reduites.sort()).toEqual(["la-carpe", "le-corbeau"]);
  });
});

describe("la gamme", () => {
  it("compte les six permanentes", () => {
    expect(bieres.filter((b) => b.etat === "permanente")).toHaveLength(6);
  });
});
