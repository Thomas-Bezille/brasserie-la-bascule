import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * Garde-fou d'architecture sur la règle non négociable de Sophie, 20/09/2026 :
 * « une couleur de bière ne sort jamais de sa fiche ».
 *
 * La règle est tenue en rendant la faute impossible plutôt qu'en comptant sur
 * la vigilance : les couleurs de bière n'existent que dans `donnees/bieres.ts`
 * et ne sont injectées qu'en variable locale sur le conteneur d'une fiche.
 *
 * Ce test échoue si une quatrième couleur apparaît un jour dans la feuille de
 * style globale, quelle qu'elle soit. C'est le seul endroit du dépôt d'où une
 * couleur pourrait contaminer tout le site.
 */

const COULEURS_DU_SITE = ["#14110f", "#f3ede3", "#2a2724"];

describe("charte globale", () => {
  const css = readFileSync("src/app/globals.css", "utf-8");

  it("ne déclare que les trois couleurs du site", () => {
    const hex = [...css.matchAll(/#[0-9a-f]{3,8}\b/gi)].map((m) => m[0].toLowerCase());
    const inattendues = [...new Set(hex)].filter(
      (couleur) => !COULEURS_DU_SITE.includes(couleur),
    );

    expect(inattendues, `couleur hors charte dans globals.css`).toEqual([]);
  });

  it("ne déclare aucune couleur d'accent", () => {
    expect(css).not.toMatch(/--color-accent/);
  });
});
