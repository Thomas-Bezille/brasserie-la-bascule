import { render } from "@testing-library/react";
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
   * Correction de Sophie du 27/09 : sur le papier, pas de trait. « Un rectangle
   * clair cerné d'un trait au milieu d'une page sombre, on dirait une erreur de
   * chargement. »
   */
  it("perd sa bordure quand il passe sur le papier", () => {
    const { container } = render(<VisuelBiere biere={corbeau} surPapier />);
    const cadre = cadreDe(container);

    expect(cadre).toContain("bg-papier");
    expect(cadre).not.toMatch(/\bborder\b/);
  });

  it("garde le cadre validé en maquette quand il reste sur le béton", () => {
    const { container } = render(<VisuelBiere biere={renard} />);
    const cadre = cadreDe(container);

    expect(cadre).toContain("bg-beton");
    expect(cadre).toMatch(/\bborder\b/);
  });

  it("laisse au nom la même respiration qu'en grand écran", () => {
    const { container } = render(<VisuelBiere biere={corbeau} surPapier />);
    const cadre = cadreDe(container);

    // Seconde correction du 27/09 : « Le Corbeau » touchait presque le bord sur
    // téléphone. La marge horizontale est plus grande que la verticale.
    expect(cadre).toContain("px-[clamp(34px,9vw,64px)]");
  });
});
