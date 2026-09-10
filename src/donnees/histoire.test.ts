import { describe, expect, it } from "vitest";
import { anneeCreation, jalons } from "./histoire";

/**
 * La page « Notre histoire » lit ces jalons dans l'ordre du tableau. Ce test
 * fige cet ordre, chronologique, et interdit qu'une année se répète : deux
 * jalons « 2022 » passeraient inaperçus à la relecture et casseraient le récit.
 */
describe("le fil de Notre histoire", () => {
  it("va du plus ancien au plus récent, sans année répétée", () => {
    const annees = jalons.map(({ annee }) => annee);
    expect(annees).toEqual([...annees].sort((a, b) => a - b));
    expect(new Set(annees).size).toBe(annees.length);
  });

  it("commence l'année de la création", () => {
    expect(jalons[0].annee).toBe(anneeCreation);
  });

  it("donne un titre et un récit à chaque jalon", () => {
    for (const jalon of jalons) {
      expect(jalon.titre.trim().length).toBeGreaterThan(0);
      expect(jalon.recit.trim().length).toBeGreaterThan(40);
    }
  });
});
