import { describe, expect, it } from "vitest";
import { bieres } from "@/donnees/bieres";
import {
  FONDS,
  fondDuVisuel,
  luminance,
  rapportContraste,
  SEUIL_GRAND_TEXTE,
  SEUIL_TEXTE_NORMAL,
} from "@/lib/contraste";

/**
 * Ce fichier tient l'engagement d'accessibilité de la section 9 du cahier des
 * charges sur ce que le test de charte ne peut pas voir : les couleurs qui
 * viennent des données. Il parcourt la gamme, donc il couvrira Le Sanglier et
 * les bières de saison sans qu'on y repense.
 *
 * Origine : audit Lighthouse du 25/09/2026, contraste de 3,88:1 relevé sur la
 * fiche du Renard.
 */

describe("le calcul de contraste", () => {
  it("retrouve les valeurs de référence de WCAG", () => {
    expect(rapportContraste("#FFFFFF", "#000000")).toBeCloseTo(21, 1);
    expect(rapportContraste("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 5);
    expect(luminance("#000000")).toBe(0);
    expect(luminance("#FFFFFF")).toBeCloseTo(1, 5);
  });

  it("ne dépend pas de l'ordre des deux couleurs", () => {
    expect(rapportContraste(FONDS.encre, FONDS.papier)).toBeCloseTo(
      rapportContraste(FONDS.papier, FONDS.encre),
      5,
    );
  });
});

describe("le nom de la bière en repli typographique", () => {
  it.each(bieres.map((b) => [b.nom, b.couleur] as const))(
    "%s reste lisible sur le fond que le site lui choisit",
    (_nom, couleur) => {
      const fond = FONDS[fondDuVisuel(couleur)];
      expect(rapportContraste(couleur, fond)).toBeGreaterThanOrEqual(SEUIL_GRAND_TEXTE);
    },
  );

  it("bascule sur le papier les couleurs trop sombres pour le béton", () => {
    const corbeau = bieres.find((b) => b.slug === "le-corbeau");
    expect(corbeau).toBeDefined();
    expect(fondDuVisuel(corbeau!.couleur)).toBe("papier");

    const abeille = bieres.find((b) => b.slug === "l-abeille");
    expect(fondDuVisuel(abeille!.couleur)).toBe("beton");
  });
});

describe("ce que le badge d'état ne peut pas faire", () => {
  /**
   * La preuve chiffrée de la décision du 31/08 : le badge est en petit texte,
   * il lui faut 4,5:1, et aucun fond de la charte ne le donne à toute la gamme.
   * La Rouquine et Le Renard échouent même sur leur meilleur fond. Le badge est
   * donc écrit en papier, la couleur n'y revenant que par une pastille.
   *
   * Si ce test venait à échouer un jour, cela voudrait dire qu'une gamme
   * entièrement lisible existe, et la décision pourrait être revue. Il est là
   * pour ça : il porte le motif, pas seulement la règle.
   */
  /**
   * La réponse chiffrée à la question de Sophie du 27/09 : « à quatre fiches sur
   * huit avec un cadre clair, ce n'est plus une exception, c'est un système,
   * autant le décider maintenant. »
   *
   * Elle a raison, et c'est un système parce qu'il n'y a pas d'alternative :
   * **aucun gris, sur les 256 possibles, ne permet aux sept couleurs
   * d'atteindre le seuil du très grand texte.** Le meilleur, le blanc pur,
   * plafonne à 2,03 sur L'Abeille, et il est de toute façon hors charte. Le
   * fond qui s'adapte à la bière n'est donc pas une préférence, c'est la seule
   * façon de tenir l'engagement d'accessibilité sans retoucher ses couleurs.
   */
  it("n'a aucun fond unique possible, même hors charte", () => {
    const gris = (n: number) =>
      "#" + [n, n, n].map((v) => v.toString(16).padStart(2, "0")).join("");

    const meilleur = Array.from({ length: 256 }, (_, n) => gris(n)).reduce(
      (record, fond) => {
        const pire = Math.min(...bieres.map((b) => rapportContraste(b.couleur, fond)));
        return pire > record ? pire : record;
      },
      0,
    );

    expect(meilleur).toBeLessThan(SEUIL_GRAND_TEXTE);
  });

  it("aucun fond de la charte ne rend toute la gamme lisible en petit texte", () => {
    const gammeLisible = bieres.every((b) =>
      Object.values(FONDS).some(
        (f) => rapportContraste(b.couleur, f) >= SEUIL_TEXTE_NORMAL,
      ),
    );
    expect(gammeLisible).toBe(false);
  });
});
