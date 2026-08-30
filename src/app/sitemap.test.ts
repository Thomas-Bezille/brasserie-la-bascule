import { describe, expect, it } from "vitest";
import { bieres } from "@/donnees/bieres";
import { liensLegaux, navigationPrincipale } from "@/donnees/navigation";
import sitemap from "./sitemap";

const adresses = () => sitemap().map(({ url }) => new URL(url).pathname);

describe("le plan du site", () => {
  /**
   * Une page d'attente proposée à l'indexation est un mauvais signal envoyé à
   * Google, et une mauvaise première impression pour qui arrive dessus depuis un
   * résultat de recherche. Le champ `livree` de la navigation est ce qui les
   * tient dehors, et ce test est ce qui empêche de l'oublier.
   */
  it("ne propose aucune page qui n'est pas encore écrite", () => {
    const enAttente = [...navigationPrincipale, ...liensLegaux]
      .filter(({ livree }) => !livree)
      .map(({ href }) => href);

    for (const href of enAttente) {
      expect(adresses(), `${href} n'est pas écrite`).not.toContain(href);
    }
  });

  it("propose l'accueil et les six fiches de bières", () => {
    expect(adresses()).toContain("/");
    for (const { slug } of bieres) {
      expect(adresses()).toContain(`/nos-bieres/${slug}`);
    }
  });
});
