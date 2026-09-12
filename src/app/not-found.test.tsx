import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "@/app/not-found";
import { navigationPrincipale } from "@/donnees/navigation";

describe("la page 404", () => {
  it("porte un titre de niveau 1 et un lien vers chaque page livrée", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Accueil" })).toHaveAttribute("href", "/");
    for (const lien of navigationPrincipale.filter((l) => l.livree)) {
      expect(screen.getByRole("link", { name: lien.libelle })).toHaveAttribute(
        "href",
        lien.href,
      );
    }
  });
});
