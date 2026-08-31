import { beforeEach, describe, expect, it } from "vitest";
import { visites } from "@/donnees/infos-pratiques";
import { agendaDuSite, etatDeLAgenda } from "@/lib/reservation/agenda";
import { oublierLesReservationsDeSimulation } from "@/lib/reservation/agenda-simulation";
import { validerDemande } from "@/lib/reservation/validation";
import type { DemandeDeReservation } from "@/lib/reservation/types";

const decouverte = visites.find((f) => f.nom === "Visite découverte")!;

const demande = (
  modifications: Partial<DemandeDeReservation> = {},
): DemandeDeReservation => ({
  creneauDebut: "2026-10-09T17:00:00.000Z",
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
