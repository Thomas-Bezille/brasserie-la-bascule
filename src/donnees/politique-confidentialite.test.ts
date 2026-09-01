import { describe, expect, it } from "vitest";
import { droits, sousTraitants, traitements } from "./politique-confidentialite";

/**
 * Une politique de confidentialité engage la responsabilité du client. Ce test
 * ne juge pas le fond, un juriste le fera, mais il empêche deux régressions
 * concrètes : un traitement décrit sans base légale ni durée, et un sous-traitant
 * annoncé comme arrêté alors qu'il ne l'est pas.
 */

describe("les traitements décrits", () => {
  it("couvrent la réservation et le formulaire de contact", () => {
    const ids = traitements.map((t) => t.id);
    expect(ids).toContain("reservation");
    expect(ids).toContain("contact");
  });

  it("portent chacun une finalité, une base légale, des destinataires et une durée", () => {
    for (const t of traitements) {
      expect(t.finalite.trim().length, `${t.id} sans finalité`).toBeGreaterThan(0);
      expect(t.destinataires.trim().length, `${t.id} sans destinataires`).toBeGreaterThan(
        0,
      );
      expect(t.conservation.trim().length, `${t.id} sans durée`).toBeGreaterThan(0);
      expect(t.baseLegale, `${t.id} sans article du RGPD`).toMatch(/article 6\.1\./);
    }
  });
});

describe("les droits de la personne", () => {
  it("listent les six droits du RGPD", () => {
    expect(droits).toEqual([
      "d'accès",
      "de rectification",
      "d'effacement",
      "de limitation du traitement",
      "d'opposition",
      "de portabilité",
    ]);
  });
});

describe("les sous-traitants", () => {
  it("nomment l'hébergeur, qui est arrêté", () => {
    const vercel = sousTraitants.find((s) => s.nom.startsWith("Vercel"));
    expect(vercel).toBeDefined();
    expect(vercel?.aConfirmer).toBeFalsy();
  });

  it("nomme le transfert hors UE pour l'hébergeur, et lui seul", () => {
    const horsUE = sousTraitants.filter((s) => /États-Unis/.test(s.hebergement));
    expect(horsUE.map((s) => s.nom)).toEqual(["Vercel Inc."]);
  });

  /**
   * Au 1er septembre 2026, trois prestataires ne sont pas choisis : l'agenda
   * (Meetergo pressenti, compte non ouvert), le service d'e-mails et l'outil de
   * mesure d'audience. Ils portent `aConfirmer`, la page affiche « (à confirmer) »
   * en face, et ils doivent être arrêtés avant la mise en ligne du 9 octobre.
   * Ce test suit cette liste : quand l'un est choisi, on retire son drapeau ici
   * comme dans la donnée, donc on le veut.
   */
  it("gardent le drapeau « à confirmer » sur les trois prestataires encore ouverts", () => {
    const ouverts = sousTraitants.filter((s) => s.aConfirmer).map((s) => s.nom);
    expect(ouverts).toEqual([
      "meetergo GmbH",
      "Service d'acheminement des courriers électroniques",
      "Outil de mesure d'audience sans cookie",
    ]);
  });
});
