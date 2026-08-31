import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormuleVisite } from "@/composants/visites/FormuleVisite";
import { visites } from "@/donnees/infos-pratiques";

const decouverte = visites.find((f) => f.nom === "Visite découverte")!;
const entreprise = visites.find((f) => f.nom === "Visite entreprise")!;

describe("une formule de visite", () => {
  it("affiche les valeurs vérifiées par le client, et non celles de la maquette", () => {
    render(<FormuleVisite formule={entreprise} />);

    expect(screen.getByText("25 €")).toBeInTheDocument();
    expect(screen.getByText(/De 15 à 20 personnes/)).toBeInTheDocument();
    // La maquette annonçait 2 h, jamais tenues. Corrigé par Marc le 21/09/2026.
    expect(screen.getByText(/2 h 30/)).toBeInTheDocument();
    expect(screen.queryByText(/\b2 h\b(?! 30)/)).not.toBeInTheDocument();
  });

  it("n'annonce aucune remise, la loi Evin l'interdisant", () => {
    render(<FormuleVisite formule={decouverte} />);

    const carte = screen.getByRole("article");
    expect(
      within(carte).queryByText(/10 %|remise|offert|gratuit/i),
    ).not.toBeInTheDocument();
  });

  it("distingue la formule mise en avant sans recourir à une couleur", () => {
    const { container, unmount } = render(<FormuleVisite formule={entreprise} />);
    const mise = container.firstElementChild!.className;
    unmount();

    const { container: c2 } = render(<FormuleVisite formule={decouverte} />);
    const normale = c2.firstElementChild!.className;

    // Correction 6 de Sophie, et sa correction 1 : plus aucune couleur d'accent.
    expect(mise).not.toBe(normale);
    expect(mise).not.toMatch(/text-\[#|bg-\[#/);
  });
});
