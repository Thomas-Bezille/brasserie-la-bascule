import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { visites } from "@/donnees/infos-pratiques";
import {
  VARIABLE_DE_TYPE_PAR_FORMULE,
  agendaDeMeetergo,
  configDeMeetergo,
  valeurDEnvironnement,
} from "@/lib/reservation/agenda-meetergo";
import type { DemandeDeReservation } from "@/lib/reservation/types";

const decouverte = visites.find((f) => f.nom === "Visite découverte")!;
const entreprise = visites.find((f) => f.nom === "Visite entreprise")!;

const ENV = {
  AGENDA_CLE_API: "rgo-test",
  AGENDA_MEETERGO_TYPE_DECOUVERTE: "type-decouverte",
  AGENDA_MEETERGO_TYPE_ENTREPRISE: "type-entreprise",
  AGENDA_MEETERGO_URL_BASE: "https://api.exemple.test/v4",
} as const;

const demande = (
  modifications: Partial<DemandeDeReservation> = {},
): DemandeDeReservation => ({
  creneauDebut: "2026-10-09T15:00:00.000Z",
  formule: decouverte.nom,
  nombreDePersonnes: 8,
  nom: "Camille Rouaud",
  email: "camille@exemple.fr",
  telephone: "06 12 34 56 78",
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

/** Un `fetch` de test qui répond selon l'URL et retient les appels reçus. */
function poser(routes: {
  meetingType?: ReponseFausse | "jette";
  disponibilite?: ReponseFausse | "jette";
  booking?: ReponseFausse | ((corps: CorpsRecu) => ReponseFausse) | "jette";
}) {
  const appels: { url: string; methode: string; corps?: CorpsRecu }[] = [];

  const faux = vi.fn(async (url: string | URL, init?: RequestInit) => {
    const href = url.toString();
    const methode = init?.method ?? "GET";
    const corps = init?.body ? (JSON.parse(String(init.body)) as CorpsRecu) : undefined;
    appels.push({ url: href, methode, corps });

    if (href.includes("/meeting-type/")) {
      if (routes.meetingType === "jette") throw new Error("réseau");
      return reponse(routes.meetingType ?? { corps: { userId: "hote-1" } });
    }
    if (href.includes("/booking-availability")) {
      if (routes.disponibilite === "jette") throw new Error("réseau");
      return reponse(routes.disponibilite ?? { corps: { dates: [] } });
    }
    if (href.includes("/booking")) {
      if (routes.booking === "jette") throw new Error("réseau");
      const choix =
        typeof routes.booking === "function"
          ? routes.booking(corps ?? {})
          : (routes.booking ?? { corps: { appointmentId: "rdv-123" } });
      return reponse(choix);
    }
    throw new Error(`URL non routée : ${href}`);
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

describe("la configuration Meetergo", () => {
  it("n'existe pas sans clé d'API", () => {
    expect(configDeMeetergo({})).toBeNull();
  });

  it("se lit avec la clé seule, sans aucun type de rendez-vous", () => {
    const config = configDeMeetergo({ AGENDA_CLE_API: "rgo-x" });
    expect(config).not.toBeNull();
    expect(config!.cle).toBe("rgo-x");
    expect(config!.urlBase).toBe("https://api.meetergo.com/v4");
    expect(config!.typeParFormule.size).toBe(0);
  });

  it("associe chaque formule à son type de rendez-vous", () => {
    const config = configDeMeetergo(ENV)!;
    expect(config.typeParFormule.get("Visite découverte")).toBe("type-decouverte");
    expect(config.typeParFormule.get("Visite entreprise")).toBe("type-entreprise");
  });

  /**
   * La correspondance formule -> variable d'environnement ne se relit pas, elle
   * se vérifie : renommer ou ajouter une formule sans déclarer sa variable ici
   * casse la CI plutôt que de laisser une visite sans agenda en silence.
   */
  it("couvre exactement les formules publiées", () => {
    expect(Object.keys(VARIABLE_DE_TYPE_PAR_FORMULE).sort()).toEqual(
      visites.map((f) => f.nom).sort(),
    );
  });

  /**
   * Un identifiant de type de rendez-vous collé entre guillemets dans un tableau
   * de bord d'hébergeur avait produit une URL `.../meeting-type/%22...%22` et un
   * 500 de Meetergo, sans autre symptôme qu'une liste de créneaux vide.
   */
  it("retire les guillemets parasites autour des valeurs d'environnement", () => {
    const config = configDeMeetergo({
      AGENDA_CLE_API: '"rgo-x"',
      AGENDA_MEETERGO_TYPE_DECOUVERTE: "'type-decouverte'",
      AGENDA_MEETERGO_TYPE_ENTREPRISE: '  "type-entreprise"  ',
    })!;
    expect(config.cle).toBe("rgo-x");
    expect(config.typeParFormule.get("Visite découverte")).toBe("type-decouverte");
    expect(config.typeParFormule.get("Visite entreprise")).toBe("type-entreprise");
  });
});

describe("valeurDEnvironnement", () => {
  it("laisse une valeur propre intacte", () => {
    expect(valeurDEnvironnement("rgo-abc")).toBe("rgo-abc");
  });

  it("retire les espaces et une paire de guillemets qui entoure la valeur", () => {
    expect(valeurDEnvironnement('  "rgo-abc"  ')).toBe("rgo-abc");
    expect(valeurDEnvironnement("'2253549e-b637'")).toBe("2253549e-b637");
  });

  it("ne touche pas aux guillemets internes", () => {
    expect(valeurDEnvironnement('rgo-"abc"-def')).toBe('rgo-"abc"-def');
  });

  it("rend undefined pour vide, absent ou guillemets seuls", () => {
    expect(valeurDEnvironnement(undefined)).toBeUndefined();
    expect(valeurDEnvironnement("   ")).toBeUndefined();
    expect(valeurDEnvironnement('""')).toBeUndefined();
  });
});

describe("la fabrique de l'agenda Meetergo", () => {
  it("ne rend aucun agenda sans configuration", () => {
    expect(agendaDeMeetergo({})).toBeNull();
  });

  it("ne rend aucun agenda si aucune formule n'a de type de rendez-vous", () => {
    expect(agendaDeMeetergo({ AGENDA_CLE_API: "rgo-x" })).toBeNull();
  });

  it("rend un agenda dès qu'une formule est configurée", () => {
    const agenda = agendaDeMeetergo(ENV);
    expect(agenda).not.toBeNull();
    expect(agenda!.fournisseur).toBe("meetergo");
  });
});

describe("les créneaux", () => {
  const depuis = new Date("2026-10-09T00:00:00.000Z");
  const jusqua = new Date("2026-10-20T00:00:00.000Z");

  it("ne garde que les créneaux libres et à venir, et calcule leur fin", async () => {
    const { appels } = poser({
      disponibilite: {
        corps: {
          dates: [
            {
              spots: [
                { startTime: "2026-10-01T10:00:00.000Z" }, // passé
                { startTime: "2026-10-09T15:00:00.000Z" }, // libre
                {
                  startTime: "2026-10-09T17:00:00.000Z",
                  unavailabilityEvents: [{ type: "appointment" }],
                }, // bloqué
                {
                  startTime: "2026-10-10T10:00:00.000Z",
                  appointment: { totalSpots: 1, takenSpots: 1 },
                }, // complet
                {
                  startTime: "2026-10-10T14:00:00.000Z",
                  appointment: { totalSpots: 2, takenSpots: 1 },
                }, // une place
              ],
            },
          ],
        },
      },
    });

    const agenda = agendaDeMeetergo(ENV)!;
    const creneaux = await agenda.creneaux(decouverte.nom, depuis, jusqua);

    expect(creneaux).toEqual([
      {
        debut: "2026-10-09T15:00:00.000Z",
        fin: "2026-10-09T16:30:00.000Z",
        placesRestantes: 1,
      },
      {
        debut: "2026-10-10T14:00:00.000Z",
        fin: "2026-10-10T15:30:00.000Z",
        placesRestantes: 1,
      },
    ]);

    const url = appels.find((a) => a.url.includes("/booking-availability"))!.url;
    expect(url).toContain("meetingTypeId=type-decouverte");
    expect(url).toContain("timezone=Europe%2FParis");
    // Meetergo refuse la requête sans hôte : il est résolu puis transmis.
    expect(url).toContain("hostIds=hote-1");
  });

  it("interroge le bon type de rendez-vous selon la formule", async () => {
    const { appels } = poser({ disponibilite: { corps: { dates: [] } } });
    const agenda = agendaDeMeetergo(ENV)!;

    await agenda.creneaux(entreprise.nom, depuis, jusqua);

    const url = appels.find((a) => a.url.includes("/booking-availability"))!.url;
    expect(url).toContain("meetingTypeId=type-entreprise");
  });

  it("ne rend rien quand l'hôte du type de rendez-vous est introuvable", async () => {
    const { faux } = poser({ meetingType: { ok: false, status: 500 } });
    const agenda = agendaDeMeetergo(ENV)!;

    expect(await agenda.creneaux(decouverte.nom, depuis, jusqua)).toEqual([]);
    // La requête de créneaux n'est pas tentée sans hôte.
    expect(
      faux.mock.calls.some((c) => String(c[0]).includes("/booking-availability")),
    ).toBe(false);
  });

  it("ne rend rien et n'appelle rien pour une formule sans type configuré", async () => {
    const { faux } = poser({});
    const agenda = agendaDeMeetergo({
      AGENDA_CLE_API: "rgo-x",
      AGENDA_MEETERGO_TYPE_DECOUVERTE: "type-decouverte",
      AGENDA_MEETERGO_URL_BASE: ENV.AGENDA_MEETERGO_URL_BASE,
    })!;

    expect(await agenda.creneaux(entreprise.nom, depuis, jusqua)).toEqual([]);
    expect(faux).not.toHaveBeenCalled();
  });

  it("rend une liste vide quand l'API répond en erreur", async () => {
    poser({ disponibilite: { ok: false, status: 500 } });
    const agenda = agendaDeMeetergo(ENV)!;
    expect(await agenda.creneaux(decouverte.nom, depuis, jusqua)).toEqual([]);
  });

  it("rend une liste vide quand l'appel échoue", async () => {
    poser({ disponibilite: "jette" });
    const agenda = agendaDeMeetergo(ENV)!;
    expect(await agenda.creneaux(decouverte.nom, depuis, jusqua)).toEqual([]);
  });
});

describe("la réservation", () => {
  it("refuse une demande invalide sans rien appeler", async () => {
    const { faux } = poser({});
    const agenda = agendaDeMeetergo(ENV)!;

    const resultat = await agenda.reserver(demande({ nombreDePersonnes: 2 }));

    expect(resultat.etat).toBe("refusee");
    expect(faux).not.toHaveBeenCalled();
  });

  it("confirme et rend la référence de Meetergo", async () => {
    const { appels } = poser({
      booking: { status: 201, corps: { appointmentId: "rdv-123" } },
    });
    const agenda = agendaDeMeetergo(ENV)!;

    const resultat = await agenda.reserver(demande());

    expect(resultat).toEqual({ etat: "confirmee", reference: "rdv-123" });

    const post = appels.find((a) => a.methode === "POST")!;
    expect(post.corps).toMatchObject({
      meetingTypeId: "type-decouverte",
      start: "2026-10-09T15:00:00.000Z",
      hostIds: ["hote-1"],
    });
    const attendee = post.corps!.attendee as Record<string, unknown>;
    expect(attendee.email).toBe("camille@exemple.fr");
    expect(attendee.notes).toEqual({ "Nombre de personnes": "8" });
    expect(attendee.dataPolicyAccepted).toBe(true);
  });

  it("porte l'entreprise et le message dans les notes du participant", async () => {
    const { appels } = poser({
      booking: { status: 201, corps: { appointmentId: "rdv-9" } },
    });
    const agenda = agendaDeMeetergo(ENV)!;

    await agenda.reserver(
      demande({
        formule: entreprise.nom,
        nombreDePersonnes: 16,
        entreprise: "ACME",
        message: "On vient à 16.",
      }),
    );

    const post = appels.find((a) => a.methode === "POST")!;
    const attendee = post.corps!.attendee as Record<string, unknown>;
    expect(attendee.notes).toEqual({
      "Nombre de personnes": "16",
      Entreprise: "ACME",
      Message: "On vient à 16.",
    });
  });

  it("ne réserve pas quand l'hôte du type de rendez-vous est introuvable", async () => {
    const { appels } = poser({
      meetingType: { ok: false, status: 500 },
      booking: { status: 201, corps: { appointmentId: "rdv-1" } },
    });
    const agenda = agendaDeMeetergo(ENV)!;

    const resultat = await agenda.reserver(demande());

    expect(resultat.etat).toBe("indisponible");
    expect(appels.some((a) => a.methode === "POST")).toBe(false);
  });

  it("rend « créneau complet » quand l'API signale un créneau déjà pris", async () => {
    poser({
      booking: {
        ok: false,
        status: 400,
        corps: { statusCode: 400, errorCode: "slot-occupied", message: "slot-occupied" },
      },
    });
    const agenda = agendaDeMeetergo(ENV)!;

    expect((await agenda.reserver(demande())).etat).toBe("creneau-complet");
  });

  it("rend « indisponible » sur une erreur 400 qui ne parle pas de créneau", async () => {
    poser({
      booking: {
        ok: false,
        status: 400,
        corps: { statusCode: 400, message: "validation failed" },
      },
    });
    const agenda = agendaDeMeetergo(ENV)!;

    expect((await agenda.reserver(demande())).etat).toBe("indisponible");
  });

  it("rend « indisponible » sur un refus d'authentification ou un dépassement de débit", async () => {
    for (const status of [401, 403, 429]) {
      poser({ booking: { ok: false, status } });
      const agenda = agendaDeMeetergo(ENV)!;
      expect((await agenda.reserver(demande())).etat).toBe("indisponible");
      vi.unstubAllGlobals();
    }
  });

  it("ne remercie jamais quand la confirmation n'est pas immédiate", async () => {
    poser({
      booking: {
        status: 201,
        corps: { bookingType: "requireHostConfirmation", provisionalBookingId: "prov-1" },
      },
    });
    const agenda = agendaDeMeetergo(ENV)!;

    const resultat = await agenda.reserver(demande());
    expect(resultat.etat).toBe("refusee");
  });

  it("rend « refusée » si la réponse n'a pas de référence de rendez-vous", async () => {
    poser({ booking: { status: 201, corps: {} } });
    const agenda = agendaDeMeetergo(ENV)!;

    expect((await agenda.reserver(demande())).etat).toBe("refusee");
  });

  it("rend « refusée » si la réponse d'un succès est illisible", async () => {
    poser({ booking: { status: 201, illisible: true } });
    const agenda = agendaDeMeetergo(ENV)!;

    expect((await agenda.reserver(demande())).etat).toBe("refusee");
  });

  it("rend « créneau complet » sur un 409 qui parle de créneau pris", async () => {
    poser({
      booking: { ok: false, status: 409, corps: { message: "slot-occupied" } },
    });
    const agenda = agendaDeMeetergo(ENV)!;

    expect((await agenda.reserver(demande())).etat).toBe("creneau-complet");
  });

  it("rend « indisponible » quand l'appel de réservation échoue", async () => {
    poser({ booking: "jette" });
    const agenda = agendaDeMeetergo(ENV)!;

    expect((await agenda.reserver(demande())).etat).toBe("indisponible");
  });
});
