import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Ce test existe à cause d'un déploiement tombé.
 *
 * `NEXT_PUBLIC_SITE_URL` était renseignée sur l'hébergeur sans son `https://`.
 * `new URL()` a levé, et le build a échoué sur les onze pages à la fois avec
 * pour seul message « Invalid URL ». Une valeur d'hébergeur se saisit à la main
 * dans une interface : elle arrive vide, avec un slash final, ou avec un espace,
 * et aucun de ces cas ne doit rendre le site indéployable.
 */
const REPLI = "https://brasserie-la-bascule.vercel.app";

const chargerUrlSite = async () => {
  vi.resetModules();
  return (await import("./seo")).URL_SITE;
};

const valeurInitiale = process.env.NEXT_PUBLIC_SITE_URL;

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  if (valeurInitiale === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = valeurInitiale;
});

describe("l'adresse du site", () => {
  it("prend l'adresse Vercel par défaut quand la variable est absente", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(await chargerUrlSite()).toBe(REPLI);
  });

  it("se replie sur une variable vide plutôt que de faire tomber le build", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "   ";
    expect(await chargerUrlSite()).toBe(REPLI);
  });

  it("se replie sur une adresse sans protocole, la faute de saisie la plus courante", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "brasserie-la-bascule.vercel.app";
    expect(await chargerUrlSite()).toBe(REPLI);
  });

  it("accepte une adresse valide et lui retire son slash final", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://brasserie-la-bascule.vercel.app/";
    expect(await chargerUrlSite()).toBe("https://brasserie-la-bascule.vercel.app");
  });
});
