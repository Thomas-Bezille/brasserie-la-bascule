import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { bieres } from "@/donnees/bieres";
import { ApercuGamme } from "./ApercuGamme";

describe("l'aperçu de la gamme", () => {
  it("présente les six permanentes", () => {
    render(<ApercuGamme />);
    for (const biere of bieres) {
      expect(
        screen.getByRole("link", { name: new RegExp(biere.nom, "i") }),
      ).toHaveAttribute("href", `/nos-bieres/${biere.slug}`);
    }
  });

  /**
   * Règle non négociable de Sophie : une couleur de bière ne sort jamais de sa
   * fiche. L'accueil est le premier endroit où la tentation se présente, six
   * vignettes côte à côte appelant six couleurs.
   */
  it("n'emploie aucune couleur de bière", () => {
    const { container } = render(<ApercuGamme />);
    const rendu = container.innerHTML.toLowerCase();
    for (const { couleur } of bieres) {
      expect(rendu, `${couleur} ne doit pas sortir de sa fiche`).not.toContain(
        couleur.toLowerCase(),
      );
    }
  });
});
