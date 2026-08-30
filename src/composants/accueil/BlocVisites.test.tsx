import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlocVisites } from "./BlocVisites";

describe("les formules de visite", () => {
  it("affichent les prix et les effectifs arrêtés par le client", () => {
    render(<BlocVisites />);

    const decouverte = screen.getByText("Visite découverte").parentElement;
    expect(decouverte).toHaveTextContent("15 € / personne");
    expect(decouverte).toHaveTextContent("De 6 à 10 personnes");

    const entreprise = screen.getByText("Visite entreprise").parentElement;
    expect(entreprise).toHaveTextContent("25 € / personne");
    expect(entreprise).toHaveTextContent("De 15 à 20 personnes");
  });

  it("annonce la formule entreprise en 2 h 30, durée corrigée le 21/09", () => {
    render(<BlocVisites />);
    // La maquette annonçait 2 h, qui n'ont jamais été tenues.
    expect(screen.getByText("Visite entreprise").parentElement).toHaveTextContent(
      "2 h 30",
    );
  });
});

describe("la remise du jour de la visite", () => {
  /**
   * La maquette l'affichait ici même, en troisième ligne de la formule
   * découverte : « 10 % sur la boutique le jour même ». Elle est retirée du site
   * depuis le 21/09, la loi Evin interdisant toute mention promotionnelle sur
   * une boisson alcoolisée.
   */
  it("n'apparaît nulle part dans le bloc", () => {
    const { container } = render(<BlocVisites />);
    expect(container.textContent).not.toMatch(/10\s*%/);
    expect(container.textContent).not.toMatch(/remise/i);
  });
});
