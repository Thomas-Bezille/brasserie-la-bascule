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

  /**
   * L'accueil a quitté `navigationPrincipale` avec le retrait de « Accueil » du
   * menu (session 19) : le plan du site doit continuer de le porter, en propre.
   */
  it("propose l'accueil et les six fiches de bières", () => {
    expect(adresses()).toContain("/");
    expect([...navigationPrincipale].some(({ href }) => href === "/")).toBe(false);
    for (const { slug } of bieres) {
      expect(adresses()).toContain(`/nos-bieres/${slug}`);
    }
  });

  /**
   * Réintégrée au périmètre par l'avenant n° 2, qui demande sa présence au plan
   * du site. Elle est `livree`, elle doit donc y figurer comme les cinq autres.
   */
  it("propose Notre histoire", () => {
    expect(adresses()).toContain("/notre-histoire");
  });

  /**
   * Hors de `navigationPrincipale` (pas une des cinq pages de la maquette
   * validée), elle suit son propre interrupteur, `PORTES_OUVERTES_PUBLIEES`.
   */
  it("propose Portes ouvertes tant qu'elle est publiée", () => {
    expect(adresses()).toContain("/portes-ouvertes");
  });
});
