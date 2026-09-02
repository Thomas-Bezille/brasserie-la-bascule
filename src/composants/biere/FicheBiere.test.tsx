import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FicheBiere } from "@/composants/biere/FicheBiere";
import { bieres } from "@/donnees/bieres";

const corbeau = bieres.find((b) => b.slug === "le-corbeau")!;
const renard = bieres.find((b) => b.slug === "le-renard")!;

describe("le fond du visuel d'une fiche", () => {
  /**
   * Le Corbeau a une étiquette, et Sophie la dessine au trait dans le prune de
   * la bière : 1,25:1 sur le béton, invisible. Le cadre doit basculer sur le
   * papier comme il le fait pour le repli typographique.
   */
  it("passe sur le papier quand la couleur est trop sombre, étiquette comprise", () => {
    expect(corbeau.illustration).toBeDefined();
    const { container } = render(<FicheBiere biere={corbeau} />);
    expect(container.querySelector(".bg-papier")).not.toBeNull();
    expect(container.querySelector(".bg-beton")).toBeNull();
  });

  it("reste sur le béton, colonne collante, quand la couleur passe le seuil", () => {
    const { container } = render(<FicheBiere biere={renard} />);
    expect(container.querySelector(".bg-beton")).not.toBeNull();
    expect(container.querySelector(".lg\\:sticky")).not.toBeNull();
  });
});
