import { describe, expect, it } from "vitest";
import { entreprise } from "./entreprise";
import { adresse } from "./infos-pratiques";

/**
 * L'identité légale est citée dans le devis, les CGV et le contrat de
 * maintenance : ces valeurs doivent rester les mêmes des deux côtés. Ce test les
 * fige, et fige aussi ce qui n'est pas encore connu, pour qu'une valeur
 * approchante ne se glisse jamais à la place.
 */
describe("l'identité de la société", () => {
  it("porte la raison sociale et la forme de la SAS", () => {
    expect(entreprise.raisonSociale).toBe("Brasserie La Bascule");
    expect(entreprise.formeJuridique).toContain("SAS");
    expect(entreprise.capitalEuros).toBe(15_000);
  });

  it("porte le SIRET communiqué par le client le 08/09/2026", () => {
    expect(entreprise.siret).toBe("911 283 745 00022");
  });

  it("laisse la TVA intracommunautaire vide tant qu'elle n'est pas connue", () => {
    // Chez le comptable. Une page qui en a besoin signale l'attente, elle
    // n'invente pas un numéro.
    expect(entreprise.tvaIntracommunautaire).toBeUndefined();
  });

  it("laisse le numéro d'entrepositaire agréé vide tant que Marc ne l'a pas donné", () => {
    expect(entreprise.numeroEntrepositaireAgree).toBeUndefined();
  });

  it("nomme Julien Mercier directeur de publication, tranché le 08/09/2026", () => {
    expect(entreprise.directeurPublication).toBe(
      "Julien Mercier, Président de la société.",
    );
  });

  it("prend l'adresse publiée pour siège, sans la redéfinir", () => {
    expect(entreprise.siege).toBe(adresse);
  });
});
