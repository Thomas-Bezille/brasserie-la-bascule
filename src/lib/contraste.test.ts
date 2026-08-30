import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contraste, melanger, SEUIL_AA } from "./contraste";

/**
 * Garde-fou d'accessibilité, exigence du cahier des charges 10.
 *
 * La charte de Sophie n'a qu'un couple de couleurs, crème sur noir chaud. Tout
 * le reste du site est du crème à différentes opacités, et c'est là que le
 * contraste se perd : `text-papier/55` se lit très bien sur l'écran de celui qui
 * l'écrit, et tombe à 3,5:1, sous le seuil, pour tout le monde.
 *
 * Le test ne vérifie pas une liste d'opacités écrite à la main, qui vieillirait
 * mal. Il relève **celles réellement employées dans le dépôt** et les mesure sur
 * les deux fonds du site. Une opacité trop basse ajoutée demain fait échouer la
 * CI le jour où elle est écrite.
 */

const ENCRE = "#14110F";
const PAPIER = "#F3EDE3";
const BETON = "#2A2724";

const fichiersDuSite = () =>
  readdirSync("src", { recursive: true, encoding: "utf-8" })
    .filter((chemin) => /\.tsx?$/.test(chemin) && !/\.test\.tsx?$/.test(chemin))
    .map((chemin) => join("src", chemin));

/** Les `text-papier/NN` écrits dans le dépôt, sans doublon. */
const opacitesEmployees = (): number[] => {
  const trouvees = new Set<number>();
  for (const fichier of fichiersDuSite()) {
    const source = readFileSync(fichier, "utf-8");
    for (const [, valeur] of source.matchAll(/text-papier\/(\d{1,3})\b/g)) {
      trouvees.add(Number(valeur) / 100);
    }
  }
  return [...trouvees].sort((a, b) => a - b);
};

describe("le texte secondaire", () => {
  it("est employé quelque part, sans quoi ce test ne vérifierait rien", () => {
    expect(opacitesEmployees().length).toBeGreaterThan(0);
  });

  it.each([
    ["l'encre", ENCRE],
    ["le béton", BETON],
  ])("reste lisible sur %s", (_nom, fond) => {
    for (const opacite of opacitesEmployees()) {
      const mesure = contraste(melanger(PAPIER, fond, opacite), fond);
      expect(
        Number(mesure.toFixed(2)),
        `text-papier/${opacite * 100} tombe à ${mesure.toFixed(2)}:1`,
      ).toBeGreaterThanOrEqual(SEUIL_AA);
    }
  });
});

describe("le couple de base de la charte", () => {
  it("dépasse largement le seuil, sur les deux fonds", () => {
    expect(contraste(PAPIER, ENCRE)).toBeGreaterThan(15);
    expect(contraste(PAPIER, BETON)).toBeGreaterThan(12);
  });
});
