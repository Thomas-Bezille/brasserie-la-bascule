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
 * Ce test échoue si une couleur non prévue apparaît un jour dans la feuille de
 * style globale. C'est le seul endroit du dépôt d'où une couleur pourrait
 * contaminer tout le site.
 *
 * **Une quatrième couleur existe depuis le 12/09/2026** : `--color-erreur`,
 * réservée aux erreurs de validation des formulaires, jamais à du contenu ou
 * de la décoration (ADR 0006). Ce n'est pas un assouplissement de la règle de
 * Sophie, qui ne parlait que des couleurs de bière : c'est la liste des
 * couleurs autorisées qui s'allonge d'une unité, toujours fermée et vérifiée
 * ici.
 */

const COULEURS_DU_SITE = ["#14110f", "#f3ede3", "#2a2724", "#e0674f"];

describe("charte globale", () => {
  const css = readFileSync("src/app/globals.css", "utf-8");

  it("ne déclare que les couleurs autorisées du site", () => {
    const hex = [...css.matchAll(/#[0-9a-f]{3,8}\b/gi)].map((m) => m[0].toLowerCase());
    const inattendues = [...new Set(hex)].filter(
      (couleur) => !COULEURS_DU_SITE.includes(couleur),
    );

    expect(inattendues, `couleur hors charte dans globals.css`).toEqual([]);
  });

  it("ne déclare aucune couleur d'accent décorative", () => {
    expect(css).not.toMatch(/--color-accent/);
  });
});
