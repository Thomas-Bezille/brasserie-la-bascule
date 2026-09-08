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
    // 6,2 vient de l'étiquette imprimée, qui fait foi sur le degré face au 6,4
    // donné à l'oral le 21/09 (décision Thomas, 01/10/2026).
    expect(renard.degre).toBe(6.2);

    // Corrigé le 24/09/2026 : Marc avait donné deux origines le 21, il y a
    // trois variétés. La donnée publiée était incomplète, pas fausse.
    expect(renard.houblons).toEqual([
      "Styrian Golding (Slovénie)",
      "Citra (Yakima, États-Unis)",
      "Simcoe (Yakima, États-Unis)",
    ]);
  });

  it("donnent à chacune des sept un IBU, des malts, des houblons, une origine et une note", () => {
    // Sortie de la fiction : ces champs restent typés optionnels (règle n° 1 de
    // `bieres.ts`, utile pour une future bière sans specs), mais les sept
    // permanentes et de saison actuelles les portent toutes désormais, notes de
    // dégustation comprises (le lot 2 ne restreint plus que la fiction du devis).
    for (const biere of bieres) {
      expect(biere.ibu, `IBU manquant pour ${biere.nom}`).toBeDefined();
      expect(biere.malts, `malts manquants pour ${biere.nom}`).toBeDefined();
      expect(biere.houblons, `houblons manquants pour ${biere.nom}`).toBeDefined();
      expect(
        biere.origineIngredients,
        `origine manquante pour ${biere.nom}`,
      ).toBeDefined();
      expect(
        biere.notesDegustation,
        `note de dégustation manquante pour ${biere.nom}`,
      ).toBeDefined();
    }
  });
});

describe("les illustrations", () => {
  it("donnent à chaque permanente son animal et son étiquette dans public/illustrations", () => {
    for (const biere of bieres.filter((b) => b.etat === "permanente")) {
      expect(biere.animal, `${biere.nom} sans animal`).toBe(
        `/illustrations/animaux/${biere.slug}.png`,
      );
      expect(biere.etiquette, `${biere.nom} sans étiquette`).toBe(
        `/illustrations/etiquettes/${biere.slug}.png`,
      );
    }
  });

  /**
   * Le dessin de travail du Renard, seule illustration provisoire de la
   * préproduction, a été remplacé par les visuels de Sophie. Ce test empêche
   * qu'un `-provisoire` revienne dans une adresse.
   */
  it("ne pointent vers aucun dessin de travail", () => {
    for (const biere of bieres) {
      for (const chemin of [biere.animal, biere.etiquette]) {
        if (chemin) expect(chemin).not.toMatch(/provisoire/i);
      }
    }
  });
});

describe("la gamme", () => {
  it("compte les six permanentes", () => {
    expect(bieres.filter((b) => b.etat === "permanente")).toHaveLength(6);
  });
});
