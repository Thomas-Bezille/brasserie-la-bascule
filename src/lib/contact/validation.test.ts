import { describe, expect, it } from "vitest";
import { validerDemande } from "@/lib/contact/validation";
import type { DemandeDeContact } from "@/lib/contact/types";

const demande = (modifications: Partial<DemandeDeContact> = {}): DemandeDeContact => ({
  nom: "Camille Rouaud",
  email: "camille@exemple.fr",
  message: "Bonjour, je souhaite organiser une visite pour mon comité d'entreprise.",
  ...modifications,
});

describe("la validation d'un message de contact", () => {
  it("accepte une demande où seuls les trois champs dus sont remplis", () => {
    expect(validerDemande(demande())).toEqual([]);
  });

  it("exige le nom, l'adresse et un message d'au moins quelques mots", () => {
    const vide = validerDemande({ nom: " ", email: "pas-une-adresse", message: "court" });
    expect(vide.map((a) => a.champ).sort()).toEqual(["email", "message", "nom"]);
  });

  it("ne contrôle le téléphone que s'il est renseigné", () => {
    expect(validerDemande(demande({ telephone: undefined }))).toEqual([]);
    expect(validerDemande(demande({ telephone: "06 12 34 56 78" }))).toEqual([]);
    expect(validerDemande(demande({ telephone: "12" })).map((a) => a.champ)).toContain(
      "telephone",
    );
  });

  it("n'impose pas d'entreprise ni de motif", () => {
    expect(validerDemande(demande({ entreprise: undefined, motif: undefined }))).toEqual(
      [],
    );
  });

  it("refuse un motif hors de la liste", () => {
    expect(
      validerDemande(demande({ motif: "Autre chose" as never })).map((a) => a.champ),
    ).toContain("motif");
  });
});
