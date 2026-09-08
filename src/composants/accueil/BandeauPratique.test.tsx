import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BandeauPratique } from "./BandeauPratique";

describe("le bandeau des informations pratiques", () => {
  it("donne l'adresse sans qu'on ait à la chercher", () => {
    render(<BandeauPratique />);
    expect(screen.getByText(/12 rue des Vignes/)).toBeInTheDocument();
    expect(screen.getByText(/44120 Vertou/)).toBeInTheDocument();
  });

  it("affiche les horaires corrigés par le client le 21/09", () => {
    render(<BandeauPratique />);
    const boutique = screen.getByText("Boutique").parentElement;
    expect(boutique).toHaveTextContent("vendredi 16 h – 19 h");
    expect(boutique).toHaveTextContent("samedi 10 h – 13 h et 14 h 30 – 19 h");
  });

  /**
   * Correction 9, de Julien : c'est la question qu'on lui pose le plus souvent.
   * Les gens croient devoir réserver une visite pour acheter une bouteille.
   */
  it("dit que la boutique est ouverte à tous", () => {
    render(<BandeauPratique />);
    expect(
      screen.getByText(/ouverte à tous, sans réservation ni visite/i),
    ).toBeInTheDocument();
  });

  it("affiche le numéro de téléphone, cliquable, sorti de la fiction le 08/09/2026", () => {
    const { container } = render(<BandeauPratique />);
    const lien = container.querySelector('a[href^="tel:"]');
    expect(lien).not.toBeNull();
    expect(lien).toHaveAttribute("href", "tel:+33261910412");
    expect(lien).toHaveTextContent("02 61 91 04 12");
  });
});
