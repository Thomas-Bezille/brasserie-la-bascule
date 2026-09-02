import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PointsDeVente } from "@/composants/ou-nous-trouver/PointsDeVente";

describe("le bloc bars et cavistes", () => {
  /**
   * La phrase « la carte de nos points de vente est en préparation » est aussi
   * un marqueur de la recette : elle fait échouer la mise en ligne tant que la
   * liste d'adresses du client n'est pas intégrée.
   */
  it("annonce que la carte est en préparation", () => {
    render(<PointsDeVente />);
    expect(
      screen.getByText(/carte de nos points de vente est en préparation/i),
    ).toBeInTheDocument();
  });
});
