import { describe, expect, it } from "vitest";
import { ouLaBoire, pointsDeVente } from "./points-de-vente";

/**
 * La cohérence de la donnée, pas son exactitude géographique : personne ne
 * revérifiera 19 adresses à la main. Ce test attrape les fautes de structure
 * qui casseraient la carte ou dupliqueraient un point.
 */

const tous = [...pointsDeVente, ...ouLaBoire];

describe("les points de vente", () => {
  it("ne contiennent pas les quatre retraits du § 32", () => {
    const noms = tous.map((p) => p.nom);
    for (const retire of [
      "L'Alambic",
      "Le Café de Clisson",
      "tabac-presse",
      "Distrib'Ouest",
    ]) {
      expect(noms.some((n) => n.includes(retire))).toBe(false);
    }
  });

  it("gardent le bar du camping, avec sa mention saisonnière", () => {
    const camping = pointsDeVente.find((p) => p.nom.includes("camping"));
    expect(camping).toBeDefined();
    expect(camping?.note).toMatch(/été/i);
  });

  it("sortent Le Pressoir de « où l'acheter » vers « où la boire »", () => {
    expect(pointsDeVente.some((p) => p.nom === "Le Pressoir")).toBe(false);
    expect(ouLaBoire.some((p) => p.nom === "Le Pressoir")).toBe(true);
    expect(ouLaBoire[0].categorie).toBe("restaurant");
  });

  it("n'ont pas de nom en double", () => {
    const noms = tous.map((p) => p.nom);
    expect(new Set(noms).size).toBe(noms.length);
  });

  it("portent chacun une adresse, un code postal à cinq chiffres et une commune", () => {
    for (const p of tous) {
      expect(p.adresse.trim().length, `${p.nom} sans adresse`).toBeGreaterThan(0);
      expect(p.codePostal, `${p.nom} code postal invalide`).toMatch(/^\d{5}$/);
      expect(p.commune.trim().length, `${p.nom} sans commune`).toBeGreaterThan(0);
    }
  });

  /** Loire-Atlantique et ses environs immédiats, large marge. */
  it("placent chaque point dans une zone plausible autour de Nantes", () => {
    for (const p of tous) {
      expect(p.latitude, `${p.nom} latitude`).toBeGreaterThan(46.9);
      expect(p.latitude, `${p.nom} latitude`).toBeLessThan(47.4);
      expect(p.longitude, `${p.nom} longitude`).toBeGreaterThan(-1.8);
      expect(p.longitude, `${p.nom} longitude`).toBeLessThan(-1.1);
    }
  });

  it("comptent dix-huit points à l'achat et un seul où la boire", () => {
    expect(pointsDeVente).toHaveLength(18);
    expect(ouLaBoire).toHaveLength(1);
  });
});
