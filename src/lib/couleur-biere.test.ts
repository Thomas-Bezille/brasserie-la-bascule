import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Second garde-fou de la règle non négociable de Sophie, 20/09/2026 :
 * « une couleur de bière ne sort jamais de sa fiche ».
 *
 * `charte.test.ts` tient la feuille de style globale, celui-ci tient les
 * composants. Les deux ensemble rendent la faute impossible plutôt que de la
 * confier à la relecture : il n'existe qu'un seul endroit du dépôt où une
 * couleur de bière entre dans le rendu, et c'est le conteneur d'une fiche.
 *
 * La tentation qu'ils empêchent est réelle et arrive par la bande : colorer le
 * nom d'une vignette sur l'accueil, souligner un lien à la couleur de la bière
 * qu'il désigne, teinter une bordure de carte. Chacun de ces gestes est
 * anodin isolément, et tous détruisent le système : le vert doit rester celui
 * du Renard, sans quoi aucune bière ne se reconnaît plus sur une étagère.
 */

const SEUL_INJECTEUR = "src/composants/biere/FicheBiere.tsx";

const fichiersDuSite = () =>
  readdirSync("src", { recursive: true, encoding: "utf-8" })
    .filter((chemin) => /\.tsx?$/.test(chemin) && !/\.test\.tsx?$/.test(chemin))
    .map((chemin) => join("src", chemin));

const contient = (fichier: string, motif: RegExp) =>
  motif.test(readFileSync(fichier, "utf-8"));

describe("la couleur d'une bière", () => {
  it("n'est injectée que sur le conteneur d'une fiche", () => {
    const injecteurs = fichiersDuSite().filter((fichier) =>
      contient(fichier, /"--biere"\s*:/),
    );
    expect(injecteurs).toEqual([SEUL_INJECTEUR]);
  });

  it("n'est lue dans la donnée que par ce même conteneur", () => {
    const lecteurs = fichiersDuSite()
      .filter((fichier) => !fichier.startsWith(join("src", "donnees")))
      .filter((fichier) => contient(fichier, /\.couleur\b/));
    expect(lecteurs).toEqual([SEUL_INJECTEUR]);
  });

  it("n'est employée que par des composants de fiche", () => {
    const utilisateurs = fichiersDuSite().filter((fichier) =>
      contient(fichier, /var\(--biere\)/),
    );
    for (const fichier of utilisateurs) {
      expect(fichier, `${fichier} emploie une couleur de bière`).toContain(
        join("src", "composants", "biere"),
      );
    }
    expect(utilisateurs.length).toBeGreaterThan(0);
  });
});
