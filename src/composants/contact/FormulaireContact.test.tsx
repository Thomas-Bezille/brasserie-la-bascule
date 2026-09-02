import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FormulaireContact } from "@/composants/contact/FormulaireContact";

vi.mock("@/app/contact/actions", () => ({
  envoyerUnMessage: vi.fn(),
}));

describe("le formulaire de contact", () => {
  it("rend obligatoires le nom, le courriel et le message, pas le reste", () => {
    render(<FormulaireContact />);

    expect(screen.getByLabelText("Votre nom")).toBeRequired();
    expect(screen.getByLabelText("Courriel")).toBeRequired();
    expect(screen.getByLabelText("Votre message")).toBeRequired();
    expect(screen.getByLabelText("Téléphone (facultatif)")).not.toBeRequired();
    expect(screen.getByLabelText("Entreprise (facultatif)")).not.toBeRequired();
  });

  /**
   * Le CDC prévoyait une case de consentement. La politique de confidentialité,
   * écrite ensuite, fonde ce traitement sur l'intérêt légitime : une case
   * laisserait croire à un choix qui n'existe pas, puisque refuser rend la
   * réponse impossible. Ce qui est dû, c'est l'information.
   */
  it("informe sur l'usage des données sans faire cocher un faux consentement", () => {
    const { container } = render(<FormulaireContact />);

    expect(container.querySelector('input[type="checkbox"]')).toBeNull();
    expect(
      screen.getByText(/servent uniquement à répondre à votre message/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Politique de confidentialité/ }),
    ).toHaveAttribute("href", "/politique-de-confidentialite");
  });

  it("propose les motifs, mais laisse le champ sans réponse par défaut", () => {
    render(<FormulaireContact />);

    const motif = screen.getByLabelText(/Votre demande concerne/);
    expect(motif).toHaveValue("");
    expect(
      screen.getByRole("option", { name: "Vente aux bars et cavistes" }),
    ).toBeInTheDocument();
  });
});
