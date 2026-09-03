import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FicheBiere } from "@/composants/biere/FicheBiere";
import { bieres } from "@/donnees/bieres";

const corbeau = bieres.find((b) => b.slug === "le-corbeau")!;
const renard = bieres.find((b) => b.slug === "le-renard")!;

describe("le fond du visuel d'une fiche", () => {
  /**
   * Une fiche qui a son étiquette passe toujours sur le papier : l'étiquette de
   * Sophie porte son propre fond ardoise, et les six se posent de la même façon
   * sur le crème, alors qu'elles se fondraient dans le béton du site.
   */
  it("passe sur le papier dès que la bière a son étiquette", () => {
    for (const biere of [corbeau, renard]) {
      expect(biere.etiquette).toBeDefined();
      const { container } = render(<FicheBiere biere={biere} />);
      expect(container.querySelector(".bg-papier")).not.toBeNull();
      expect(container.querySelector(".bg-beton")).toBeNull();
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
   * typographique. Une fiche illustrée, même sur cadre crème, garde la colonne
   * collante comme les autres : la gêne du « rectangle blanc posé là » ne vaut
   * que pour une boîte vide.
   */
  it("garde la colonne collante sur une fiche avec étiquette, même en cadre crème", () => {
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
