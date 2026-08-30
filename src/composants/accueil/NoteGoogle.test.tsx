import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { avisGoogle } from "@/donnees/infos-pratiques";
import { NoteGoogle } from "./NoteGoogle";

describe("la note Google", () => {
  it("affiche la note et le nombre d'avis, comme le devis les a vendus", () => {
    render(<NoteGoogle />);
    expect(screen.getByText("4,8")).toBeInTheDocument();
    expect(screen.getByText(`sur ${avisGoogle.nombre} avis Google`)).toBeInTheDocument();
  });

  it("dit que le chiffre est tenu à la main, tant qu'il n'y a pas de lien vers la fiche", () => {
    render(<NoteGoogle />);
    expect(screen.getByText(/mis à jour chaque mois/i)).toBeInTheDocument();
  });
});
