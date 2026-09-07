import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BandeauPortesOuvertes } from "@/composants/chrome/BandeauPortesOuvertes";

const CLE_FERMETURE = "portes-ouvertes-bandeau-ferme";

const cheminCourant = vi.hoisted(() => ({ valeur: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => cheminCourant.valeur }));

describe("le bandeau sticky Portes ouvertes", () => {
  beforeEach(() => {
    window.localStorage.clear();
    cheminCourant.valeur = "/";
  });

  it("ne rend rien tant qu'il n'est pas publié", () => {
    const { container } = render(<BandeauPortesOuvertes publie={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("s'affiche une fois publié, sans avoir été fermé", () => {
    render(<BandeauPortesOuvertes publie />);
    expect(screen.getByRole("region", { name: /Portes ouvertes/ })).toBeInTheDocument();
  });

  /**
   * Un bandeau qui réapparaît à chaque page se comporte comme un bandeau de
   * consentement, ce que ce site n'a justement pas.
   */
  it("reste caché si déjà fermé sur ce navigateur", () => {
    window.localStorage.setItem(CLE_FERMETURE, "1");
    render(<BandeauPortesOuvertes publie />);
    expect(screen.queryByRole("region", { name: /Portes ouvertes/ })).toBeNull();
  });

  it("se ferme au clic sur la croix et mémorise la fermeture", async () => {
    const utilisateur = userEvent.setup();
    render(<BandeauPortesOuvertes publie />);

    await utilisateur.click(screen.getByRole("button", { name: "Fermer" }));

    expect(screen.queryByRole("region", { name: /Portes ouvertes/ })).toBeNull();
    expect(window.localStorage.getItem(CLE_FERMETURE)).toBe("1");
  });

  it("renvoie vers la page du programme", () => {
    render(<BandeauPortesOuvertes publie />);
    expect(screen.getByRole("link", { name: "Le programme" })).toHaveAttribute(
      "href",
      "/portes-ouvertes",
    );
  });

  /**
   * Ancienne v2, texte seul, faute de visuel à montrer. Le sanglier de Sophie
   * est posé depuis (session 16), le bandeau doit le porter.
   */
  it("porte l'animal du Sanglier", () => {
    render(<BandeauPortesOuvertes publie />);
    const image = screen
      .getByRole("region", { name: /Portes ouvertes/ })
      .querySelector("img");
    expect(image).toHaveAttribute("src", expect.stringContaining("le-sanglier"));
  });

  /**
   * Proposer « Voir le programme » à quelqu'un qui regarde déjà cette page
   * n'a pas de sens.
   */
  it("ne s'affiche pas sur la page qu'il annonce", () => {
    cheminCourant.valeur = "/portes-ouvertes";
    render(<BandeauPortesOuvertes publie />);
    expect(screen.queryByRole("region", { name: /Portes ouvertes/ })).toBeNull();
  });
});
