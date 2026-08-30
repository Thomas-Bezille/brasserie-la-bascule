import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Garde-fou légal, pendant du garde-fou de charte.
 *
 * La publicité pour une boisson alcoolisée est limitée par la loi Evin à des
 * mentions objectives : degré, origine, composition, mode de production. Toute
 * incitation à l'achat est interdite, et la responsabilité en revient à
 * l'annonceur, donc au client.
 *
 * Le sujet est arrivé par la remise de 10 % accordée le jour de la visite, que
 * le client affichait et qu'il a retirée du périmètre le 21/09/2026. Le risque
 * n'est pas qu'on la remette sciemment : c'est qu'une formule commerciale entre
 * un jour dans une page, écrite de bonne foi, et que personne ne la relise avec
 * la loi en tête. Ce test la refuse à la compilation de la CI.
 *
 * Les commentaires sont retirés avant l'analyse : le code a le droit d'expliquer
 * pourquoi une mention est interdite, c'est même souhaitable. Les fichiers de
 * test le sont aussi, pour la même raison.
 *
 * **Faux positif ?** Reformuler le contenu avant de toucher à cette liste. Si
 * la mention est vraiment licite et objective, l'écarter ici en une ligne
 * commentée, jamais en supprimant un motif.
 */

const MENTIONS_INTERDITES = [
  /\bremises?\b/i,
  /\bpromo/i,
  /\br[ée]ductions?\b/i,
  /\bgratuit/i,
  /\boffert/i,
  /\bbon plan\b/i,
  /\bprofitez\b/i,
];

const sansCommentaires = (source: string) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

const fichiersDuSite = () =>
  readdirSync("src", { recursive: true, encoding: "utf-8" })
    .filter((chemin) => /\.tsx?$/.test(chemin) && !chemin.endsWith(".test.ts"))
    .map((chemin) => join("src", chemin));

describe("loi Evin", () => {
  it("ne laisse aucune mention promotionnelle dans le site", () => {
    const fautes = fichiersDuSite().flatMap((fichier) => {
      const code = sansCommentaires(readFileSync(fichier, "utf-8"));
      return MENTIONS_INTERDITES.filter((motif) => motif.test(code)).map(
        (motif) => `${fichier} : ${motif}`,
      );
    });

    expect(fautes, "mention promotionnelle interdite par la loi Evin").toEqual([]);
  });

  it("surveille bien des fichiers", () => {
    // Sans quoi le test passerait au vert le jour où le parcours se casse.
    expect(fichiersDuSite().length).toBeGreaterThan(0);
  });
});
