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

    expect(screen.getByRole("group", { name: "Le créneau" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /6 places/ })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /10 places/ })).toBeInTheDocument();
  });

  /**
   * Correctif du 08/09/2026 : une liste `<select>` plate de plus de quinze
   * lignes toutes au format « jour date à heure · places » était illisible,
   * rien ne distinguait un jour du suivant. Regroupés, chaque jour n'apparaît
   * qu'une fois, et l'heure seule suffit sur chaque créneau.
   */
  it("regroupe les créneaux par jour plutôt qu'une liste plate", () => {
    rendre();

    const jour = new Date(creneaux[0]!.debut).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    expect(screen.getAllByText(new RegExp(jour, "i")).length).toBeGreaterThan(0);
  });

  it("oublie le créneau choisi quand on change de formule", () => {
    const entreprise = visites.find((f) => f.nom === "Visite entreprise")!;
    const creneauEntreprise: Creneau = {
      debut: "2026-10-09T17:00:00.000Z",
      fin: "2026-10-09T19:30:00.000Z",
      placesRestantes: 4,
    };

    render(
      <FormulaireReservation
        formules={visites}
        creneauxParFormule={{
          [decouverte.nom]: creneaux,
          [entreprise.nom]: [creneauEntreprise],
        }}
      />,
    );

    const premierCreneau = screen.getByRole("radio", { name: /6 places/ });
    premierCreneau.click();
    expect(premierCreneau).toBeChecked();

    screen.getByRole("radio", { name: "Visite entreprise" }).click();
    expect(screen.getByRole("radio", { name: /4 places/ })).not.toBeChecked();
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
