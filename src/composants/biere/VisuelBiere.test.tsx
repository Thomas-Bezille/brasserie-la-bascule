import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VisuelBiere } from "@/composants/biere/VisuelBiere";
import { bieres } from "@/donnees/bieres";

const corbeau = bieres.find((b) => b.slug === "le-corbeau")!;
const renard = bieres.find((b) => b.slug === "le-renard")!;

// La structure est : conteneur de test > div (enveloppe flex) > div (le cadre).
const cadreDe = (element: HTMLElement) =>
  element.querySelector("div > div > div")!.className;

describe("le cadre du visuel", () => {
  /**
   * Changement du 04/09/2026 : une étiquette n'a plus de cadre du tout. Elle
   * porte déjà son propre fond ardoise, quasi noir ; une boîte crème derrière
   * doublait le contraste et « agressait les yeux ». Le cadre papier/béton ne
   * vaut donc plus que pour le repli typographique, testé plus bas.
   */
  it("n'a aucun fond ni bordure quand la bière a son étiquette", () => {
    const { container } = render(<VisuelBiere biere={corbeau} surPapier />);
    const cadre = cadreDe(container);

    expect(cadre).not.toContain("bg-papier");
    expect(cadre).not.toContain("bg-beton");
    expect(cadre).not.toMatch(/\bborder\b/);
  });

  /**
   * Correction de Sophie du 27/09 : sur le papier, pas de trait. « Un rectangle
   * clair cerné d'un trait au milieu d'une page sombre, on dirait une erreur de
   * chargement. »
   */
  it("perd sa bordure quand le repli passe sur le papier", () => {
    const { container } = render(
      <VisuelBiere biere={{ ...corbeau, etiquette: undefined }} surPapier />,
    );
    const cadre = cadreDe(container);

    expect(cadre).toContain("bg-papier");
    expect(cadre).not.toMatch(/\bborder\b/);
  });

  it("garde le cadre validé en maquette quand le repli reste sur le béton", () => {
    const { container } = render(
      <VisuelBiere biere={{ ...renard, etiquette: undefined }} />,
    );
    const cadre = cadreDe(container);

    expect(cadre).toContain("bg-beton");
    expect(cadre).toMatch(/\bborder\b/);
  });

  it("laisse au nom la même respiration qu'en grand écran", () => {
    const { container } = render(
      <VisuelBiere biere={{ ...corbeau, etiquette: undefined }} surPapier />,
    );
    const cadre = cadreDe(container);

    // Seconde correction du 27/09 : « Le Corbeau » touchait presque le bord sur
    // téléphone. La marge horizontale est plus grande que la verticale.
    expect(cadre).toContain("px-[clamp(34px,9vw,64px)]");
  });

  /**
   * Toutes les permanentes ont désormais leur étiquette, mais le repli
   * typographique reste un état permanent du site : une bière de saison sans
   * dessin doit s'afficher sans attendre Sophie.
   */
  it("bascule sur le repli typographique quand la bière n'a pas d'étiquette", () => {
    render(<VisuelBiere biere={{ ...renard, etiquette: undefined }} surPapier />);
    expect(screen.getByText(renard.nom)).toBeInTheDocument();
  });
});
