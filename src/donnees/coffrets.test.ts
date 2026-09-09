import { describe, expect, it } from "vitest";
import { COFFRETS_PUBLIES, coffrets } from "./coffrets";

describe("les coffrets", () => {
  it("sont les trois annoncés par le client, avec un prix entier", () => {
    expect(coffrets.map((c) => c.nom)).toEqual([
      "Le Trio",
      "La Planche",
      "Le Grand Format",
    ]);
    for (const c of coffrets) {
      expect(c.contenu.trim().length, `${c.nom} sans contenu`).toBeGreaterThan(0);
      expect(c.prixEuros, `${c.nom} sans prix`).toBeGreaterThan(0);
      expect(Number.isInteger(c.prixEuros), `${c.nom} prix non entier`).toBe(true);
    }
  });

  /**
   * Publication avancée le 09/09/2026 (décision de Thomas, session 18) : plus de
   * date à attendre dans un projet fictif joué en solo.
   */
  it("sont publiés", () => {
    expect(COFFRETS_PUBLIES).toBe(true);
  });

  it("ne portent aucune mention promotionnelle (loi Evin)", () => {
    const texte = coffrets.map((c) => `${c.nom} ${c.contenu}`).join(" ");
    expect(texte).not.toMatch(/gratuit|offert|remise|promo|réduction/i);
  });
});
