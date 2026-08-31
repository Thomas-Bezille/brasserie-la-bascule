import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AvantDeVenir } from "@/composants/visites/AvantDeVenir";
import { stationnement } from "@/donnees/infos-pratiques";

describe("le bloc « avant de venir »", () => {
  it("annonce le nombre de places de la source unique, et pas les vingt de la maquette", () => {
    render(<AvantDeVenir />);

    expect(
      screen.getByText(new RegExp(`${stationnement.places} places`)),
    ).toBeInTheDocument();
    expect(screen.queryByText(/20 places/)).not.toBeInTheDocument();
  });

  it("répond sur l'accessibilité sans la promettre partout", () => {
    render(<AvantDeVenir />);

    expect(screen.getByText(/de plain-pied/)).toBeInTheDocument();
    // La passerelle au-dessus des cuves n'est pas accessible : le dire est ce
    // qui rend le reste croyable, et évite une déception sur place.
    expect(screen.getByText(/passerelle/)).toBeInTheDocument();
  });

  it("n'emploie aucun terme que la loi Evin proscrit", () => {
    const { container } = render(<AvantDeVenir />);
    expect(container.textContent).not.toMatch(/gratuit|offert|remise|réduction/i);
  });
});
