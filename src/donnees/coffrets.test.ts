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
   * Publication différée à fin octobre, CDC v1.2 correction 12 : le bloc ne doit
   * pas apparaître à la mise en ligne du 9. Le test garde l'intention, quand on
   * passe le drapeau à `true` on le fait ici aussi.
   */
  it("ne sont pas publiés avant leur mise en vente de fin octobre", () => {
    expect(COFFRETS_PUBLIES).toBe(false);
  });

  it("ne portent aucune mention promotionnelle (loi Evin)", () => {
    const texte = coffrets.map((c) => `${c.nom} ${c.contenu}`).join(" ");
    expect(texte).not.toMatch(/gratuit|offert|remise|promo|réduction/i);
  });
});
