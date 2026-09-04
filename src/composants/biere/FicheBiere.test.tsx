import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FicheBiere } from "@/composants/biere/FicheBiere";
import { bieres } from "@/donnees/bieres";

const corbeau = bieres.find((b) => b.slug === "le-corbeau")!;
const renard = bieres.find((b) => b.slug === "le-renard")!;

describe("le fond du visuel d'une fiche", () => {
  /**
   * Changement du 04/09/2026 : une fiche qui a son étiquette n'a plus aucun
   * cadre. L'étiquette de Sophie porte son propre fond ardoise, quasi noir,
   * déjà très proche du fond de la page ; une boîte crème derrière doublait le
   * contraste et « agressait les yeux ». Le papier ne sert plus qu'au repli.
   */
  it("n'a ni papier ni béton dès que la bière a son étiquette", () => {
    for (const biere of [corbeau, renard]) {
      expect(biere.etiquette).toBeDefined();
      const { container } = render(<FicheBiere biere={biere} />);
      // Scopé à la colonne du visuel : les boutons plus bas dans la fiche
      // portent eux aussi `bg-papier`, sans rapport avec le cadre.
      const colonneVisuel = container.querySelector(".grid > div:first-child")!;
      expect(colonneVisuel.querySelector(".bg-papier")).toBeNull();
      expect(colonneVisuel.querySelector(".bg-beton")).toBeNull();
    }
  });

  /**
   * Sans étiquette, le repli typographique suit le calcul de contraste : le vert
   * du Renard passe le seuil du très grand texte sur le béton, il y reste, avec
   * la colonne collante des autres fiches.
   */
  it("garde le béton et la colonne collante pour un repli dont la couleur passe le seuil", () => {
    const { container } = render(
      <FicheBiere biere={{ ...renard, etiquette: undefined }} />,
    );
    expect(container.querySelector(".bg-beton")).not.toBeNull();
    expect(container.querySelector(".lg\\:sticky")).not.toBeNull();
  });

  /**
   * Le cadre pleine hauteur et statique de Sophie ne vaut que pour le repli
   * typographique. Une fiche illustrée, sans cadre du tout depuis le
   * 04/09/2026, garde la colonne collante comme les autres : la gêne du
   * « rectangle posé là » ne valait que pour une boîte vide.
   */
  it("garde la colonne collante sur une fiche avec étiquette", () => {
    const { container } = render(<FicheBiere biere={corbeau} />);
    expect(container.querySelector(".lg\\:sticky")).not.toBeNull();
    expect(container.querySelector(".items-stretch")).toBeNull();
  });

  it("étire le cadre et retire le collant pour le repli typographique sur papier", () => {
    const { container } = render(
      <FicheBiere biere={{ ...corbeau, etiquette: undefined }} />,
    );
    expect(container.querySelector(".lg\\:sticky")).toBeNull();
    expect(container.querySelector(".items-stretch")).not.toBeNull();
  });
});
