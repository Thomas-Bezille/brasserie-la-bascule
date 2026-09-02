import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { proxy } from "@/proxy";

const AUTH_OK = `Basic ${btoa("x:secret")}`;

function requete(chemin: string, entetes: Record<string, string> = {}): NextRequest {
  return new NextRequest(`https://preprod.example${chemin}`, { headers: entetes });
}

afterEach(() => vi.unstubAllEnvs());

describe("la protection de la préproduction", () => {
  it("refuse une page sans mot de passe", () => {
    vi.stubEnv("SITE_PUBLIE", "non");
    vi.stubEnv("MOT_DE_PASSE_PREPROD", "secret");

    const r = proxy(requete("/nos-bieres/le-renard", { "user-agent": "Mozilla/5.0" }));
    expect(r.status).toBe(401);
    expect(r.headers.get("www-authenticate")).toContain("Basic realm");
  });

  it("laisse passer une page avec le bon mot de passe", () => {
    vi.stubEnv("SITE_PUBLIE", "non");
    vi.stubEnv("MOT_DE_PASSE_PREPROD", "secret");

    const r = proxy(
      requete("/nos-bieres/le-renard", {
        "user-agent": "Mozilla/5.0",
        authorization: AUTH_OK,
      }),
    );
    expect(r.status).not.toBe(401);
    expect(r.headers.get("x-robots-tag")).toContain("noindex");
  });

  /**
   * L'optimiseur d'images de Next va chercher le PNG source par une requête
   * serveur à serveur sans en-tête. Sans cette exception, `<Image>` échoue sur
   * « received null » en préproduction, là où le mot de passe est actif.
   */
  it("laisse passer la requête interne de l'optimiseur d'images", () => {
    vi.stubEnv("SITE_PUBLIE", "non");
    vi.stubEnv("MOT_DE_PASSE_PREPROD", "secret");

    const r = proxy(requete("/illustrations/le-renard.png"));
    expect(r.status).not.toBe(401);
    expect(r.headers.get("x-robots-tag")).toContain("noindex");
  });

  it("garde l'image au mot de passe pour un navigateur qui la vise en direct", () => {
    vi.stubEnv("SITE_PUBLIE", "non");
    vi.stubEnv("MOT_DE_PASSE_PREPROD", "secret");

    const r = proxy(
      requete("/illustrations/le-renard.png", { "user-agent": "Mozilla/5.0" }),
    );
    expect(r.status).toBe(401);
  });

  it("n'ouvre pas les pages via l'exception : une route sans en-tête reste fermée", () => {
    vi.stubEnv("SITE_PUBLIE", "non");
    vi.stubEnv("MOT_DE_PASSE_PREPROD", "secret");

    const r = proxy(requete("/politique-de-confidentialite"));
    expect(r.status).toBe(401);
  });

  it("ouvre tout, sans noindex, quand le site est publié", () => {
    vi.stubEnv("SITE_PUBLIE", "oui");

    const r = proxy(requete("/", { "user-agent": "Mozilla/5.0" }));
    expect(r.status).not.toBe(401);
    expect(r.headers.get("x-robots-tag")).toBeNull();
  });
});
