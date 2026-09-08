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

  /**
   * Sortie de la fiction, 08/09/2026 : la clé de contrôle (46) est la vraie
   * formule française appliquée au SIREN 911283745, pas un chiffre au hasard.
   */
  it("porte une TVA intracommunautaire dont la clé de contrôle est juste", () => {
    expect(entreprise.tvaIntracommunautaire).toBe("FR46 911 283 745");

    const sansPrefixe = entreprise.tvaIntracommunautaire.slice(2).replace(/\s/g, "");
    const cle = Number(sansPrefixe.slice(0, 2));
    const siren = Number(sansPrefixe.slice(2));
    expect(cle).toBe((12 + 3 * (siren % 97)) % 97);
  });

  it("porte un numéro d'entrepositaire agréé, sorti de la fiction le 08/09/2026", () => {
    expect(entreprise.numeroEntrepositaireAgree).toBe("FR44 2022 0143");
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
