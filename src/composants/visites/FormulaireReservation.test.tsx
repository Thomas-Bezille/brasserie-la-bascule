import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { visites } from "@/donnees/infos-pratiques";
import { FormulaireReservation } from "@/composants/visites/FormulaireReservation";
import type { Creneau } from "@/lib/reservation/types";

vi.mock("@/app/visites-et-degustations/actions", () => ({
  demanderUneReservation: vi.fn(),
  FORMULAIRE_VIERGE: { statut: "vierge" },
}));

const decouverte = visites.find((f) => f.nom === "Visite découverte")!;

const creneaux: readonly Creneau[] = [
  {
    debut: "2026-10-09T15:00:00.000Z",
    fin: "2026-10-09T16:30:00.000Z",
    placesRestantes: 6,
  },
  {
    debut: "2026-10-10T08:00:00.000Z",
    fin: "2026-10-10T09:30:00.000Z",
    placesRestantes: 10,
  },
];

const rendre = (avecCreneaux = true) =>
  render(
    <FormulaireReservation
      formules={visites}
      creneauxParFormule={
        avecCreneaux ? { [decouverte.nom]: creneaux } : { [decouverte.nom]: [] }
      }
    />,
  );

describe("le formulaire de réservation", () => {
  it("propose les créneaux avec le nombre de places restantes", () => {
    rendre();

    const liste = screen.getByLabelText("Le créneau");
    expect(liste).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /6 places/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /10 places/ })).toBeInTheDocument();
  });

  it("empêche d'envoyer quand aucun créneau n'est ouvert", () => {
    rendre(false);

    expect(screen.getByText(/Aucun créneau n'est ouvert/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Réserver/ })).toBeDisabled();
  });

  /**
   * La décision du 31/08/2026, et elle va contre la maquette. Le traitement de
   * ces coordonnées est nécessaire à l'exécution de la prestation demandée : sa
   * base légale est contractuelle, pas le consentement. Une case obligatoire
   * laisserait croire à un choix qui n'existe pas, puisque sans coordonnées il
   * n'y a pas de réservation. Ce qui est dû, c'est l'information.
   */
  it("informe sur l'usage des données sans faire cocher un faux consentement", () => {
    const { container } = rendre();

    expect(container.querySelector('input[type="checkbox"]')).toBeNull();
    expect(
      screen.getByText(/servent uniquement à traiter cette réservation/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Politique de confidentialité/ }),
    ).toHaveAttribute("href", "/politique-de-confidentialite");
  });

  it("annonce les bornes d'effectif de la formule choisie", () => {
    rendre();

    expect(
      screen.getByText(
        new RegExp(`De ${decouverte.effectifMin} à ${decouverte.effectifMax} personnes`),
      ),
    ).toBeInTheDocument();
  });
});
