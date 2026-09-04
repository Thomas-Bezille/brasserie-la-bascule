import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BandeauPortesOuvertes } from "@/composants/accueil/BandeauPortesOuvertes";

describe("le bandeau Portes ouvertes", () => {
  it("ne rend rien tant qu'il n'est pas publié", () => {
    const { container } = render(<BandeauPortesOuvertes publie={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renvoie vers la page une fois publié", () => {
    render(<BandeauPortesOuvertes publie />);
    expect(screen.getByRole("link", { name: "Le programme" })).toHaveAttribute(
      "href",
      "/portes-ouvertes",
    );
    expect(screen.getByText(/24.*25/)).toBeInTheDocument();
    expect(screen.getByText("Octobre")).toBeInTheDocument();
  });
});
