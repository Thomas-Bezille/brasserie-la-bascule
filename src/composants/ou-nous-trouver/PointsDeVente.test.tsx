import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PointsDeVente } from "@/composants/ou-nous-trouver/PointsDeVente";
import { ouLaBoire, pointsDeVente } from "@/donnees/points-de-vente";

/**
 * MapLibre dessine sur un `<canvas>` WebGL, absent de jsdom. La carte n'est
 * pas ce que ce test vérifie : la liste texte, qui fait foi, l'est.
 */
vi.mock("maplibre-gl", () => ({
  Map: vi.fn(() => ({ addControl: vi.fn(), remove: vi.fn(), fitBounds: vi.fn() })),
  NavigationControl: vi.fn(),
  Marker: vi.fn(() => ({
    setLngLat: vi.fn().mockReturnThis(),
    setPopup: vi.fn().mockReturnThis(),
    addTo: vi.fn().mockReturnThis(),
  })),
  Popup: vi.fn(() => ({ setHTML: vi.fn().mockReturnThis() })),
  LngLatBounds: vi.fn(() => ({ extend: vi.fn() })),
}));

describe("le bloc bars et cavistes", () => {
  it("n'annonce plus la carte comme en préparation", () => {
    render(<PointsDeVente />);
    expect(screen.queryByText(/en préparation/i)).not.toBeInTheDocument();
  });

  it("liste chaque bar et chaque caviste par son nom et son adresse", () => {
    render(<PointsDeVente />);
    for (const point of pointsDeVente) {
      expect(screen.getByText(point.nom)).toBeInTheDocument();
      expect(
        screen.getByText(`${point.adresse}, ${point.codePostal} ${point.commune}`),
      ).toBeInTheDocument();
    }
  });

  it("sépare « où la boire » des points d'achat", () => {
    render(<PointsDeVente />);
    expect(screen.getByText("Où la boire")).toBeInTheDocument();
    for (const point of ouLaBoire) {
      expect(screen.getByText(point.nom)).toBeInTheDocument();
    }
  });

  it("garde la mention saisonnière du bar du camping", () => {
    render(<PointsDeVente />);
    expect(screen.getByText(/été uniquement/i)).toBeInTheDocument();
  });
});
