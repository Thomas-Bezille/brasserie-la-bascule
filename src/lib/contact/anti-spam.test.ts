import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CHAMP_APPAT,
  CHAMP_JETON,
  DELAI_MINIMAL_MS,
  DUREE_DE_VIE_MS,
  jetonAntiSpam,
  verifierAntiSpam,
} from "@/lib/contact/anti-spam";

const SECRET = { CONTACT_FORM_SECRET: "secret-de-test" };

/** Un envoi crédible : appât vide, jeton d'âge choisi. */
function envoi(
  ageMs: number,
  { secret = true, appat = "" }: { secret?: boolean; appat?: string } = {},
) {
  const donnees = new FormData();
  const emis = Date.now() - ageMs;
  donnees.set(CHAMP_JETON, jetonAntiSpam(emis, secret ? SECRET : {}));
  if (appat) donnees.set(CHAMP_APPAT, appat);
  return donnees;
}

afterEach(() => vi.unstubAllEnvs());

describe("le jeton anti-spam", () => {
  it("est signé quand le secret est là, réduit à l'horodatage sinon", () => {
    expect(jetonAntiSpam(1_000, SECRET)).toMatch(/^1000\.[A-Za-z0-9_-]+$/);
    expect(jetonAntiSpam(1_000, {})).toBe("1000");
  });
});

describe("la vérification anti-spam", () => {
  const env = SECRET;

  it("laisse passer un envoi humain crédible", () => {
    expect(verifierAntiSpam(envoi(10_000), Date.now(), env)).toEqual({ ok: true });
  });

  it("rejette quand le champ appât est rempli", () => {
    expect(
      verifierAntiSpam(envoi(10_000, { appat: "http://spam.example" }), Date.now(), env),
    ).toEqual({ ok: false, motif: "appat" });
  });

  it("rejette un envoi plus rapide qu'un humain", () => {
    expect(verifierAntiSpam(envoi(DELAI_MINIMAL_MS - 500), Date.now(), env).ok).toBe(
      false,
    );
    expect(verifierAntiSpam(envoi(DELAI_MINIMAL_MS - 500), Date.now(), env)).toEqual({
      ok: false,
      motif: "trop-rapide",
    });
  });

  it("rejette un jeton périmé", () => {
    expect(verifierAntiSpam(envoi(DUREE_DE_VIE_MS + 60_000), Date.now(), env)).toEqual({
      ok: false,
      motif: "perime",
    });
  });

  it("rejette un jeton absent ou illisible", () => {
    expect(verifierAntiSpam(new FormData(), Date.now(), env)).toEqual({
      ok: false,
      motif: "jeton-invalide",
    });

    const brut = new FormData();
    brut.set(CHAMP_JETON, "pas-un-nombre.zzz");
    expect(verifierAntiSpam(brut, Date.now(), env)).toEqual({
      ok: false,
      motif: "jeton-invalide",
    });
  });

  it("rejette un jeton dont la signature ne colle pas", () => {
    const trafique = new FormData();
    // Horodatage recent, mais signé avec un autre secret.
    trafique.set(
      CHAMP_JETON,
      jetonAntiSpam(Date.now() - 10_000, { CONTACT_FORM_SECRET: "autre" }),
    );
    expect(verifierAntiSpam(trafique, Date.now(), env)).toEqual({
      ok: false,
      motif: "jeton-invalide",
    });
  });

  it("rejette un jeton daté du futur", () => {
    expect(verifierAntiSpam(envoi(-60_000), Date.now(), env)).toEqual({
      ok: false,
      motif: "jeton-invalide",
    });
  });

  it("sans secret, ne vérifie que la fenêtre de temps", () => {
    const sansSecret = envoi(10_000, { secret: false });
    expect(verifierAntiSpam(sansSecret, Date.now(), {})).toEqual({ ok: true });

    // Un horodatage nu et récent suffit : c'est la dégradation assumée.
    const nu = new FormData();
    nu.set(CHAMP_JETON, String(Date.now() - 10_000));
    expect(verifierAntiSpam(nu, Date.now(), {})).toEqual({ ok: true });
  });
});
