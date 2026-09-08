import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContenuMentionsLegales } from "@/composants/legal/ContenuMentionsLegales";
import { entreprise } from "@/donnees/entreprise";

describe("les mentions légales", () => {
  it("n'a qu'un seul titre de niveau 1", () => {
    render(<ContenuMentionsLegales />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("porte la raison sociale, le SIRET et le siège", () => {
    render(<ContenuMentionsLegales />);
    expect(screen.getAllByText(/Brasserie La Bascule/).length).toBeGreaterThan(0);
    expect(screen.getByText(new RegExp(entreprise.siret))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(entreprise.siege.commune))).toBeInTheDocument();
  });

  it("porte la TVA intracommunautaire et le numéro d'entrepositaire agréé", () => {
    render(<ContenuMentionsLegales />);
    expect(
      screen.getByText(new RegExp(entreprise.tvaIntracommunautaire)),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(entreprise.numeroEntrepositaireAgree)),
    ).toBeInTheDocument();
  });

  it("nomme Julien Mercier directeur de publication", () => {
    render(<ContenuMentionsLegales />);
    expect(screen.getByText(/Julien Mercier, Président/)).toBeInTheDocument();
  });

  it("nomme l'hébergeur et son adresse", () => {
    render(<ContenuMentionsLegales />);
    expect(screen.getByText(/Vercel Inc\./)).toBeInTheDocument();
    expect(screen.getByText(/Covina, CA 91723/)).toBeInTheDocument();
  });

  it("renvoie vers la politique de confidentialité", () => {
    render(<ContenuMentionsLegales />);
    expect(
      screen.getByRole("link", { name: /politique de confidentialité/i }),
    ).toHaveAttribute("href", "/politique-de-confidentialite");
  });
});
