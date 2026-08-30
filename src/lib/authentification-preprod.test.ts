import { describe, expect, it } from "vitest";
import { identifiantsCorrects } from "./authentification-preprod";

const entete = (identifiant: string, motDePasse: string) =>
  `Basic ${btoa(`${identifiant}:${motDePasse}`)}`;

describe("identifiantsCorrects", () => {
  it("accepte le bon mot de passe, quel que soit l'identifiant", () => {
    expect(identifiantsCorrects(entete("sophie", "secret"), "secret")).toBe(true);
    expect(identifiantsCorrects(entete("", "secret"), "secret")).toBe(true);
  });

  it("refuse un mauvais mot de passe", () => {
    expect(identifiantsCorrects(entete("sophie", "autre"), "secret")).toBe(false);
  });

  it("refuse une absence d'en-tête", () => {
    expect(identifiantsCorrects(null, "secret")).toBe(false);
    expect(identifiantsCorrects("", "secret")).toBe(false);
  });

  it("refuse un schéma d'authentification différent", () => {
    expect(identifiantsCorrects("Bearer c2VjcmV0", "secret")).toBe(false);
  });

  it("refuse un base64 invalide sans lever d'erreur", () => {
    expect(identifiantsCorrects("Basic pas-du-base64!!", "secret")).toBe(false);
  });

  it("refuse un couple sans séparateur", () => {
    expect(identifiantsCorrects(`Basic ${btoa("secret")}`, "secret")).toBe(false);
  });

  it("garde le mot de passe entier quand il contient des deux-points", () => {
    expect(identifiantsCorrects(entete("sophie", "a:b:c"), "a:b:c")).toBe(true);
  });
});
