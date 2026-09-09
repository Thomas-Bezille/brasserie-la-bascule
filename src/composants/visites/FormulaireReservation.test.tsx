import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { visites } from "@/donnees/infos-pratiques";
import { FormulaireReservation } from "@/composants/visites/FormulaireReservation";
import type { Creneau } from "@/lib/reservation/types";

vi.mock("@/app/visites-et-degustations/actions", () => ({
  demanderUneReservation: vi.fn(),
  FORMULAIRE_VIERGE: { statut: "vierge" },
}));

const decouverte = visites.find((f) => f.nom === "Visite découverte")!;

// Vendredi 9 (17 h) et samedi 10 (10 h) à Vertou : deux jours, deux heures.
const creneaux: readonly Creneau[] = [
  {
    debut: "2026-10-09T15:00:00.000Z",
    fin: "2026-10-09T16:30:00.000Z",
    placesRestantes: 1,
  },
  {
    debut: "2026-10-10T08:00:00.000Z",
    fin: "2026-10-10T09:30:00.000Z",
    placesRestantes: 1,
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
  /**
   * Correctif du 08/09/2026 : la liste `<select>` plate, plus de quinze lignes
   * sur une fenêtre de huit semaines toutes au format « jour date à heure ·
   * places », a été signalée illisible. Remplacée par un calendrier mensuel :
   * jour disponible cliquable, jour sans créneau grisé, les horaires se
   * déplient sous le jour cliqué.
   */
  it("affiche le calendrier avec les jours disponibles cliquables, le reste grisé", () => {
    rendre();

    const vendredi9 = screen.getByRole("button", { name: "9" });
    const samedi10 = screen.getByRole("button", { name: "10" });
    expect(vendredi9).toBeEnabled();
    expect(samedi10).toBeEnabled();

    // Le 8 octobre 2026 est un jeudi, fermé : même traitement qu'un jour
    // complet, aucune distinction, voir la règle en tête du composant.
    expect(screen.getByRole("button", { name: "8" })).toBeDisabled();
  });

  it("déplie les horaires du jour cliqué, et un seul jour à la fois", () => {
    rendre();

    // Vendredi 9 (17 h) et samedi 10 (10 h) : deux heures distinctes de la fixture.
    fireEvent.click(screen.getByRole("button", { name: "9" }));
    expect(screen.getByRole("radio", { name: /17\sh/ })).toBeInTheDocument();
    expect(screen.queryByRole("radio", { name: /10\sh/ })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "10" }));
    expect(screen.queryByRole("radio", { name: /17\sh/ })).not.toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /10\sh/ })).toBeInTheDocument();
  });

  it("oublie le créneau choisi quand on change de formule", () => {
    const entreprise = visites.find((f) => f.nom === "Visite entreprise")!;
    const creneauEntreprise: Creneau = {
      debut: "2026-10-09T17:00:00.000Z",
      fin: "2026-10-09T19:30:00.000Z",
      placesRestantes: 1,
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

    // Le vendredi 9 a un créneau à 17 h en découverte, un autre à 19 h en entreprise.
    fireEvent.click(screen.getByRole("button", { name: "9" }));
    const premierCreneau = screen.getByRole("radio", { name: /17\sh/ });
    fireEvent.click(premierCreneau);
    expect(premierCreneau).toBeChecked();

    fireEvent.click(screen.getByRole("radio", { name: "Visite entreprise" }));
    fireEvent.click(screen.getByRole("button", { name: "9" }));
    expect(screen.getByRole("radio", { name: /19\sh/ })).not.toBeChecked();
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
