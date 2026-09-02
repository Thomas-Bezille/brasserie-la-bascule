import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Coffrets } from "@/composants/ou-nous-trouver/Coffrets";
import { coffrets } from "@/donnees/coffrets";

describe("le bloc Nos coffrets", () => {
  it("ne rend rien tant qu'il n'est pas publié", () => {
    const { container } = render(<Coffrets publies={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("liste les trois coffrets avec leur prix une fois publié", () => {
    render(<Coffrets publies />);

    for (const c of coffrets) {
      expect(screen.getByRole("heading", { name: c.nom })).toBeInTheDocument();
    }
    expect(screen.getByText(/14\s*€/)).toBeInTheDocument();
    expect(
      screen.getByText(/en vente à la boutique et pendant les portes ouvertes/i),
    ).toBeInTheDocument();
  });
});
