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

  it("nomme le transfert hors UE, un par sous-traitant américain, avec son encadrement", () => {
    const horsUE = sousTraitants.filter((s) => /États-Unis/.test(s.hebergement));
    expect(horsUE.map((s) => s.nom)).toEqual([
      "Vercel Inc.",
      "Resend (Plus Five Five, Inc.)",
    ]);
    for (const s of horsUE) {
      expect(s.hebergement, `${s.nom} sans encadrement du transfert`).toMatch(
        /clauses contractuelles types/,
      );
    }
  });

  /**
   * Meetergo est choisi et intégré depuis la session 12 : son drapeau est levé
   * le 09/09/2026, oubli corrigé. La mesure d'audience (Vercel Web Analytics)
   * et le service d'e-mails (Resend) n'ont jamais porté de drapeau à eux, tous
   * les deux le 11/09/2026 : la mesure d'audience a rejoint l'entrée Vercel
   * Inc. déjà arrêtée, Resend était déjà branché côté code depuis la session 19
   * sans que la donnée le nomme. Ce test suit cette liste : quand un
   * sous-traitant est choisi, on retire son drapeau ici comme dans la donnée,
   * donc on le veut vide.
   */
  it("ne gardent plus aucun drapeau « à confirmer »", () => {
    const ouverts = sousTraitants.filter((s) => s.aConfirmer).map((s) => s.nom);
    expect(ouverts).toEqual([]);
  });
});
