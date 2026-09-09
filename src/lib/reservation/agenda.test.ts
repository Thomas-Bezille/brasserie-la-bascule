import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { visites } from "@/donnees/infos-pratiques";
import { agendaDuSite, etatDeLAgenda } from "@/lib/reservation/agenda";
import { oublierLesReservationsDeSimulation } from "@/lib/reservation/agenda-simulation";
import { validerDemande } from "@/lib/reservation/validation";
import type { DemandeDeReservation } from "@/lib/reservation/types";

const decouverte = visites.find((f) => f.nom === "Visite découverte")!;

// Vendredi 16 h 30 à Vertou : un des horaires publiés (infos-pratiques.ts).
const demande = (
  modifications: Partial<DemandeDeReservation> = {},
): DemandeDeReservation => ({
  creneauDebut: "2026-10-09T14:30:00.000Z",
  formule: decouverte.nom,
  nombreDePersonnes: 8,
  nom: "Camille Rouaud",
  email: "camille@exemple.fr",
  telephone: "06 12 34 56 78",
  ...modifications,
});

describe("la configuration de l'agenda", () => {
  it("n'existe pas tant que rien n'est configuré", () => {
    expect(etatDeLAgenda({})).toEqual({
      configure: false,
      motif: "AGENDA_FOURNISSEUR n'est pas défini",
    });
  });

  it("refuse un fournisseur qu'elle ne connaît pas", () => {
    const etat = etatDeLAgenda({ AGENDA_FOURNISSEUR: "un-truc", AGENDA_CLE_API: "x" });
    expect(etat.configure).toBe(false);
  });

  it("exige la clé d'un fournisseur réel", () => {
    expect(etatDeLAgenda({ AGENDA_FOURNISSEUR: "meetergo" }).configure).toBe(false);
    expect(
      etatDeLAgenda({ AGENDA_FOURNISSEUR: "meetergo", AGENDA_CLE_API: "jeton" }),
    ).toEqual({
      configure: true,
      fournisseur: "meetergo",
    });
  });

  /**
   * La garde qui compte. Un agenda de démonstration servant un site ouvert
   * accepterait des réservations que personne ne verrait jamais : c'est
   * exactement ce que ce client a vécu de 2023 à 2026, dix-neuf demandes parties
   * vers une adresse qui n'était pas une boîte aux lettres.
   */
  it("refuse la simulation dès que le site est publié", () => {
    expect(etatDeLAgenda({ AGENDA_FOURNISSEUR: "simulation" }).configure).toBe(true);

    const enLigne = etatDeLAgenda({
      AGENDA_FOURNISSEUR: "simulation",
      SITE_PUBLIE: "oui",
    });
    expect(enLigne.configure).toBe(false);
    expect(enLigne.configure === false && enLigne.motif).toMatch(
      /réservé au développement/,
    );
  });

  it("ne rend aucun agenda quand rien n'est configuré, plutôt que de lever", async () => {
    await expect(agendaDuSite({})).resolves.toBeNull();
  });

  it("ne rend aucun agenda Meetergo tant qu'aucun type de rendez-vous n'est fourni", async () => {
    await expect(
      agendaDuSite({ AGENDA_FOURNISSEUR: "meetergo", AGENDA_CLE_API: "rgo-x" }),
    ).resolves.toBeNull();
  });

  it("branche l'agenda Meetergo une fois ses types de rendez-vous configurés", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ dates: [] }) })),
    );

    const agenda = await agendaDuSite({
      AGENDA_FOURNISSEUR: "meetergo",
      AGENDA_CLE_API: "rgo-x",
      AGENDA_MEETERGO_TYPE_DECOUVERTE: "type-decouverte",
      AGENDA_MEETERGO_TYPE_ENTREPRISE: "type-entreprise",
    });

    expect(agenda?.fournisseur).toBe("meetergo");
  });

  /**
   * La règle qui compte pour cette évolution : Meetergo reste réglé sur une
   * grille fine (décision de session 17 de ne plus y toucher), c'est
   * `agendaDuSite` qui la réduit aux horaires publiés, quel que soit ce que le
   * fournisseur renvoie par ailleurs.
   */
  it("réduit les créneaux Meetergo aux seuls horaires de visite publiés", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL) => {
        if (url.toString().includes("/meeting-type/")) {
          return { ok: true, status: 200, json: async () => ({ userId: "hote-1" }) };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            dates: [
              {
                spots: [
                  { startTime: "2026-10-09T14:30:00.000Z" }, // vendredi 16 h 30 à Vertou : publié
                  { startTime: "2026-10-09T15:00:00.000Z" }, // vendredi 17 h à Vertou : pas publié
                ],
              },
            ],
          }),
        };
      }),
    );

    const agenda = await agendaDuSite({
      AGENDA_FOURNISSEUR: "meetergo",
      AGENDA_CLE_API: "rgo-x",
      AGENDA_MEETERGO_TYPE_DECOUVERTE: "type-decouverte",
      AGENDA_MEETERGO_TYPE_ENTREPRISE: "type-entreprise",
    });

    const creneaux = await agenda!.creneaux(
      decouverte.nom,
      new Date("2026-10-01T00:00:00.000Z"),
      new Date("2026-10-20T00:00:00.000Z"),
    );

    expect(creneaux.map((c) => c.debut)).toEqual(["2026-10-09T14:30:00.000Z"]);
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("la validation d'une demande", () => {
  it("accepte une demande complète", () => {
    expect(validerDemande(demande())).toEqual([]);
  });

  it("refuse un effectif hors des bornes vendues", () => {
    const trop_peu = validerDemande(demande({ nombreDePersonnes: 3 }));
    expect(trop_peu.map((a) => a.champ)).toContain("nombreDePersonnes");
    // Le message reprend les bornes de la source unique, pas des valeurs écrites ici.
    expect(trop_peu[0].message).toContain(String(decouverte.effectifMin));
    expect(trop_peu[0].message).toContain(String(decouverte.effectifMax));

    expect(validerDemande(demande({ nombreDePersonnes: 40 })).length).toBeGreaterThan(0);
  });

  it("exige un moyen de joindre la personne le jour de la visite", () => {
    expect(validerDemande(demande({ email: "pas-une-adresse" })).length).toBeGreaterThan(
      0,
    );
    expect(validerDemande(demande({ telephone: "12" })).length).toBeGreaterThan(0);
  });

  it("refuse un créneau hors des horaires de visite publiés", () => {
    // Vendredi 9 octobre 2026, 17 h à Vertou : la grille ne publie que 16 h 30.
    const anomalies = validerDemande(
      demande({ creneauDebut: "2026-10-09T15:00:00.000Z" }),
    );
    expect(anomalies.map((a) => a.champ)).toContain("creneauDebut");
  });
});

describe("l'agenda de simulation", () => {
  beforeEach(() => oublierLesReservationsDeSimulation());

  it("ne propose que des créneaux qui ont encore de la place", async () => {
    const agenda = await agendaDuSite({ AGENDA_FOURNISSEUR: "simulation" });
    expect(agenda).not.toBeNull();

    const depuis = new Date("2026-10-05T00:00:00.000Z");
    const jusqua = new Date("2026-10-18T00:00:00.000Z");
    const creneaux = await agenda!.creneaux(decouverte.nom, depuis, jusqua);

    expect(creneaux.length).toBeGreaterThan(0);
    for (const creneau of creneaux) expect(creneau.placesRestantes).toBeGreaterThan(0);
  });

  it("ferme un créneau une fois complet, comme le niveau B le vend", async () => {
    const agenda = (await agendaDuSite({ AGENDA_FOURNISSEUR: "simulation" }))!;
    const depuis = new Date("2026-10-05T00:00:00.000Z");
    const jusqua = new Date("2026-10-18T00:00:00.000Z");
    const [premier] = await agenda.creneaux(decouverte.nom, depuis, jusqua);

    const plein = await agenda.reserver(
      demande({ creneauDebut: premier.debut, nombreDePersonnes: decouverte.effectifMax }),
    );
    expect(plein.etat).toBe("confirmee");

    const suivante = await agenda.reserver(
      demande({ creneauDebut: premier.debut, nombreDePersonnes: decouverte.effectifMin }),
    );
    expect(suivante.etat).toBe("creneau-complet");

    const restants = await agenda.creneaux(decouverte.nom, depuis, jusqua);
    expect(restants.map((c) => c.debut)).not.toContain(premier.debut);
  });

  it("ne confirme jamais une demande invalide", async () => {
    const agenda = (await agendaDuSite({ AGENDA_FOURNISSEUR: "simulation" }))!;
    const resultat = await agenda.reserver(demande({ nombreDePersonnes: 2 }));

    expect(resultat.etat).toBe("refusee");
  });
});
