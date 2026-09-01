import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContenuPolitiqueConfidentialite } from "@/composants/legal/ContenuPolitiqueConfidentialite";
import { entreprise } from "@/donnees/entreprise";
import { sousTraitants, traitements } from "@/donnees/politique-confidentialite";

describe("la politique de confidentialité", () => {
  it("n'a qu'un seul titre de niveau 1", () => {
    render(<ContenuPolitiqueConfidentialite />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("décrit chaque traitement listé dans la donnée", () => {
    render(<ContenuPolitiqueConfidentialite />);
    for (const t of traitements) {
      expect(screen.getByRole("heading", { name: t.titre })).toBeInTheDocument();
    }
  });

  it("affirme qu'aucun cookie n'est déposé", () => {
    render(<ContenuPolitiqueConfidentialite />);
    expect(screen.getByText(/ne dépose aucun cookie/i)).toBeInTheDocument();
  });

  it("marque « à confirmer » les prestataires non arrêtés, et eux seuls", () => {
    const { container } = render(<ContenuPolitiqueConfidentialite />);
    const attendus = sousTraitants.filter((s) => s.aConfirmer).length;
    expect(container.textContent?.match(/\(à confirmer\)/g) ?? []).toHaveLength(attendus);
  });

  it("nomme l'hébergeur américain et l'encadrement du transfert", () => {
    render(<ContenuPolitiqueConfidentialite />);
    const section = screen
      .getByRole("heading", { name: /Transferts hors de l'Union européenne/ })
      .closest("section") as HTMLElement;
    expect(within(section).getByText(/Vercel Inc\./)).toBeInTheDocument();
    expect(within(section).getByText(/clauses contractuelles types/)).toBeInTheDocument();
  });

  it("donne un moyen d'exercer ses droits et cite la CNIL", () => {
    const { container } = render(<ContenuPolitiqueConfidentialite />);
    const liens = screen.getAllByRole("link", { name: entreprise.email });
    expect(liens[0]).toHaveAttribute("href", `mailto:${entreprise.email}`);
    expect(container.textContent).toMatch(
      /adresser une réclamation à la Commission nationale de l'informatique/,
    );
  });
});
