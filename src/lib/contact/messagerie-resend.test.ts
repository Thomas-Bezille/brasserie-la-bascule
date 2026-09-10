import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  configDeResend,
  messagerieDeResend,
  valeurDEnvironnement,
} from "@/lib/contact/messagerie-resend";
import type { DemandeDeContact } from "@/lib/contact/types";

const ENV = {
  MAIL_API_KEY: "re_test",
  MAIL_FROM: "onboarding@resend.dev",
  MAIL_TO: "brasserie@exemple.fr",
  MAIL_RESEND_URL_BASE: "https://api.exemple.test",
} as const;

const demande = (modifications: Partial<DemandeDeContact> = {}): DemandeDeContact => ({
  nom: "Camille Rouaud",
  email: "camille@exemple.fr",
  message: "Bonjour, je souhaite organiser une visite pour mon comité d'entreprise.",
  ...modifications,
});

type ReponseFausse = {
  ok?: boolean;
  status?: number;
  corps?: unknown;
  illisible?: boolean;
};

function reponse({
  ok = true,
  status = 200,
  corps = {},
  illisible = false,
}: ReponseFausse): Response {
  return {
    ok,
    status,
    json: async () => {
      if (illisible) throw new SyntaxE("corps non JSON");
      return corps;
    },
  } as unknown as Response;
}
class SyntaxE extends Error {}

type CorpsRecu = Record<string, unknown>;

/** Un `fetch` de test qui retient l'appel reçu et répond ce qu'on lui dit. */
function poser(route: ReponseFausse | "jette" = { corps: { id: "email-123" } }) {
  const appels: {
    url: string;
    methode: string;
    corps?: CorpsRecu;
    enTetes?: Record<string, string>;
  }[] = [];

  const faux = vi.fn(async (url: string | URL, init?: RequestInit) => {
    appels.push({
      url: url.toString(),
      methode: init?.method ?? "GET",
      corps: init?.body ? (JSON.parse(String(init.body)) as CorpsRecu) : undefined,
      enTetes: init?.headers as Record<string, string> | undefined,
    });
    if (route === "jette") throw new Error("réseau");
    return reponse(route);
  });

  vi.stubGlobal("fetch", faux);
  return { faux, appels };
}

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("la configuration Resend", () => {
  it("n'existe pas sans clé, sans expéditeur ou sans destinataire", () => {
    expect(configDeResend({})).toBeNull();
    expect(configDeResend({ ...ENV, MAIL_API_KEY: undefined })).toBeNull();
    expect(configDeResend({ ...ENV, MAIL_FROM: undefined })).toBeNull();
    expect(configDeResend({ ...ENV, MAIL_TO: undefined })).toBeNull();
  });

  it("se lit avec les trois valeurs et se replie sur l'URL publique de Resend", () => {
    const config = configDeResend({
      MAIL_API_KEY: "re_x",
      MAIL_FROM: "onboarding@resend.dev",
      MAIL_TO: "brasserie@exemple.fr",
    })!;
    expect(config.cle).toBe("re_x");
    expect(config.expediteur).toBe("onboarding@resend.dev");
    expect(config.destinataire).toBe("brasserie@exemple.fr");
    expect(config.urlBase).toBe("https://api.resend.com");
  });

  it("retire les guillemets parasites collés autour d'une valeur", () => {
    const config = configDeResend({
      MAIL_API_KEY: '"re_x"',
      MAIL_FROM: "  onboarding@resend.dev  ",
      MAIL_TO: "'brasserie@exemple.fr'",
    })!;
    expect(config.cle).toBe("re_x");
    expect(config.expediteur).toBe("onboarding@resend.dev");
    expect(config.destinataire).toBe("brasserie@exemple.fr");
  });
});

describe("valeurDEnvironnement", () => {
  it("laisse une valeur propre intacte et rend undefined pour du vide", () => {
    expect(valeurDEnvironnement("re_abc")).toBe("re_abc");
    expect(valeurDEnvironnement('  "re_abc"  ')).toBe("re_abc");
    expect(valeurDEnvironnement(undefined)).toBeUndefined();
    expect(valeurDEnvironnement('""')).toBeUndefined();
  });
});

describe("la fabrique de la messagerie Resend", () => {
  it("ne rend aucune messagerie sans configuration", () => {
    expect(messagerieDeResend({})).toBeNull();
  });

  it("rend une messagerie dès que la configuration est complète", () => {
    const messagerie = messagerieDeResend(ENV);
    expect(messagerie?.fournisseur).toBe("resend");
  });
});

describe("l'envoi d'un message", () => {
  it("poste le courriel à Resend et le déclare envoyé", async () => {
    const { appels } = poser();

    const resultat = await messagerieDeResend(ENV)!.envoyer(demande());

    expect(resultat).toEqual({ etat: "envoye" });
    expect(appels).toHaveLength(1);
    expect(appels[0].url).toBe("https://api.exemple.test/emails");
    expect(appels[0].methode).toBe("POST");
    expect(appels[0].enTetes).toMatchObject({
      Authorization: "Bearer re_test",
      "Content-Type": "application/json",
    });
    expect(appels[0].corps).toMatchObject({
      from: "onboarding@resend.dev",
      to: ["brasserie@exemple.fr"],
      reply_to: "camille@exemple.fr",
    });
    expect(String(appels[0].corps!.subject)).toContain("Camille Rouaud");
    expect(String(appels[0].corps!.text)).toContain("je souhaite organiser une visite");
  });

  it("place les champs facultatifs remplis en tête du courriel", async () => {
    const { appels } = poser();

    await messagerieDeResend(ENV)!.envoyer(
      demande({
        telephone: "06 12 34 56 78",
        entreprise: "Rouaud & Filles",
        motif: "Presse",
      }),
    );

    const texte = String(appels[0].corps!.text);
    expect(texte).toContain("Téléphone : 06 12 34 56 78");
    expect(texte).toContain("Entreprise : Rouaud & Filles");
    expect(texte).toContain("Motif : Presse");
    expect(String(appels[0].corps!.subject)).toContain("Presse");
  });

  it("refuse une demande invalide sans appeler Resend", async () => {
    const { faux } = poser();

    const resultat = await messagerieDeResend(ENV)!.envoyer(
      demande({ email: "pas-une-adresse" }),
    );

    expect(resultat.etat).toBe("refuse");
    expect(faux).not.toHaveBeenCalled();
  });

  it("ne remercie jamais quand Resend renvoie une erreur", async () => {
    poser({ ok: false, status: 422, corps: { message: "domaine non vérifié" } });

    const resultat = await messagerieDeResend(ENV)!.envoyer(demande());

    expect(resultat).toEqual({ etat: "indisponible" });
    expect(console.error).toHaveBeenCalled();
  });

  it("reste indisponible même si le corps d'erreur est illisible", async () => {
    poser({ ok: false, status: 500, illisible: true });

    const resultat = await messagerieDeResend(ENV)!.envoyer(demande());

    expect(resultat).toEqual({ etat: "indisponible" });
  });

  it("reste indisponible quand le réseau lâche", async () => {
    poser("jette");

    const resultat = await messagerieDeResend(ENV)!.envoyer(demande());

    expect(resultat).toEqual({ etat: "indisponible" });
    expect(console.error).toHaveBeenCalled();
  });
});
