import { afterEach, describe, expect, it, vi } from "vitest";
import { visites } from "@/donnees/infos-pratiques";
import { oublierLesReservationsDeSimulation } from "@/lib/reservation/agenda-simulation";
import { demanderUneReservation, FORMULAIRE_VIERGE } from "./actions";

const decouverte = visites.find((f) => f.nom === "Visite découverte")!;

function formulaire(modifications: Record<string, string> = {}) {
  const donnees = new FormData();
  const champs: Record<string, string> = {
    creneau: "2026-10-09T17:00:00.000Z",
    formule: decouverte.nom,
    nombreDePersonnes: "8",
    nom: "Camille Rouaud",
    email: "camille@exemple.fr",
    telephone: "06 12 34 56 78",
    ...modifications,
  };
  for (const [nom, valeur] of Object.entries(champs)) donnees.set(nom, valeur);
  return donnees;
}

afterEach(() => {
  vi.unstubAllEnvs();
  oublierLesReservationsDeSimulation();
});

describe("l'envoi d'une demande de réservation", () => {
  /**
   * Le test le plus important du module. Sans agenda, le visiteur doit
   * apprendre que sa demande n'est pas partie. Le contraire, un remerciement
   * sans destinataire, est ce qui a fait disparaître dix-neuf demandes de
   * contact chez ce client entre 2023 et 2026.
   */
  it("ne remercie jamais quand il n'y a pas d'agenda", async () => {
    vi.stubEnv("AGENDA_FOURNISSEUR", "");
    vi.stubEnv("AGENDA_CLE_API", "");

    const etat = await demanderUneReservation(FORMULAIRE_VIERGE, formulaire());
    expect(etat.statut).toBe("indisponible");
  });

  it("refuse une demande invalide sans appeler l'agenda", async () => {
    vi.stubEnv("AGENDA_FOURNISSEUR", "simulation");

    const etat = await demanderUneReservation(
      FORMULAIRE_VIERGE,
      formulaire({ email: "x" }),
    );
    expect(etat.statut).toBe("anomalies");
    expect(etat.statut === "anomalies" && etat.anomalies[0].champ).toBe("email");
  });

  it("confirme une demande valide et rend une référence", async () => {
    vi.stubEnv("AGENDA_FOURNISSEUR", "simulation");

    const etat = await demanderUneReservation(FORMULAIRE_VIERGE, formulaire());
    expect(etat.statut).toBe("confirme");
    expect(etat.statut === "confirme" && etat.reference.length).toBeGreaterThan(0);
  });

  it("refuse un effectif hors des bornes vendues", async () => {
    vi.stubEnv("AGENDA_FOURNISSEUR", "simulation");

    const etat = await demanderUneReservation(
      FORMULAIRE_VIERGE,
      formulaire({ nombreDePersonnes: "2" }),
    );
    expect(etat.statut).toBe("anomalies");
  });
});
