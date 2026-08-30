import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PiedDePage } from "./PiedDePage";

describe("la mention sanitaire", () => {
  /**
   * Obligation légale, article L. 3323-4 du code de la santé publique. Elle est
   * portée par le pied, donc par toutes les pages du site. Ce test est le seul
   * endroit du dépôt qui l'exige : sans lui, elle disparaîtrait un jour dans un
   * remaniement de mise en page sans que personne ne s'en aperçoive.
   */
  it("est présente sur toutes les pages, puisqu'elle est dans le pied", () => {
    render(<PiedDePage />);
    expect(
      screen.getByText(/l'abus d'alcool est dangereux pour la santé/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/interdite aux mineurs de moins de 18 ans/i),
    ).toBeInTheDocument();
  });
});

describe("les horaires", () => {
  it("sont ceux de la source unique, et non ceux de la maquette", () => {
    render(<PiedDePage />);

    // 19 h 30 le vendredi et 15 h le samedi étaient les valeurs fausses,
    // corrigées par le client le 21/09/2026.
    expect(screen.getByText(/vendredi/i)).toHaveTextContent("16 h – 19 h");
    expect(screen.getByText(/samedi/i)).toHaveTextContent(
      "10 h – 13 h et 14 h 30 – 19 h",
    );
  });

  it("annonce le marché du dimanche", () => {
    render(<PiedDePage />);
    expect(screen.getByText(/dimanche/i)).toHaveTextContent("marché de Vertou");
  });
});

describe("l'allègement demandé par Sophie", () => {
  /**
   * Correction 7 du 20/09/2026 : « pied de page allégé de moitié ». La colonne
   * qui recopiait le menu principal a sauté. Ce test empêche qu'elle revienne
   * par habitude, un pied de page appelant naturellement une liste de liens.
   */
  it("ne recopie pas le menu principal", () => {
    render(<PiedDePage />);
    expect(screen.queryByRole("link", { name: "Visites et dégustations" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Nos bières" })).toBeNull();
  });

  it("garde les liens légaux", () => {
    render(<PiedDePage />);
    expect(screen.getByRole("link", { name: "Mentions légales" })).toHaveAttribute(
      "href",
      "/mentions-legales",
    );
  });
});
