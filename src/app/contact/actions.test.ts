import { afterEach, describe, expect, it, vi } from "vitest";
import { oublierLesMessagesDeSimulation } from "@/lib/contact/messagerie-simulation";
import { envoyerUnMessage } from "./actions";
import { FORMULAIRE_CONTACT_VIERGE } from "./etat-formulaire";

function formulaire(modifications: Record<string, string> = {}) {
  const donnees = new FormData();
  const champs: Record<string, string> = {
    nom: "Camille Rouaud",
    email: "camille@exemple.fr",
    message: "Bonjour, je souhaite organiser une visite pour mon comité d'entreprise.",
    ...modifications,
  };
  for (const [nom, valeur] of Object.entries(champs)) donnees.set(nom, valeur);
  return donnees;
}

afterEach(() => {
  vi.unstubAllEnvs();
  oublierLesMessagesDeSimulation();
});

describe("le module d'actions", () => {
  /**
   * Un fichier `"use server"` ne peut exporter que des fonctions async. Une
   * valeur y passe le build et les tests unitaires, puis lève un 500 à la
   * première soumission réelle. Ce test attrape la régression ici. Voir le
   * module de réservation, 29/09.
   */
  it("n'expose que des fonctions", async () => {
    const exportes = await import("./actions");
    for (const [nom, valeur] of Object.entries(exportes)) {
      expect(typeof valeur, `export « ${nom} »`).toBe("function");
    }
  });
});

describe("l'envoi d'un message de contact", () => {
  it("ne remercie jamais quand aucun service n'est configuré", async () => {
    vi.stubEnv("MESSAGERIE_FOURNISSEUR", "");

    const etat = await envoyerUnMessage(FORMULAIRE_CONTACT_VIERGE, formulaire());
    expect(etat.statut).toBe("indisponible");
  });

  it("refuse une demande invalide sans appeler le service", async () => {
    vi.stubEnv("MESSAGERIE_FOURNISSEUR", "simulation");

    const etat = await envoyerUnMessage(
      FORMULAIRE_CONTACT_VIERGE,
      formulaire({ email: "x" }),
    );
    expect(etat.statut).toBe("anomalies");
    expect(etat.statut === "anomalies" && etat.anomalies[0].champ).toBe("email");
  });

  it("confirme l'envoi d'une demande valide", async () => {
    vi.stubEnv("MESSAGERIE_FOURNISSEUR", "simulation");

    const etat = await envoyerUnMessage(FORMULAIRE_CONTACT_VIERGE, formulaire());
    expect(etat.statut).toBe("envoye");
  });

  it("ignore un motif hors liste plutôt que d'échouer dessus", async () => {
    vi.stubEnv("MESSAGERIE_FOURNISSEUR", "simulation");

    const etat = await envoyerUnMessage(
      FORMULAIRE_CONTACT_VIERGE,
      formulaire({ motif: "n'importe quoi" }),
    );
    expect(etat.statut).toBe("envoye");
  });
});
