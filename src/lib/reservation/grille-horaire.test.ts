import { describe, expect, it } from "vitest";
import { visites } from "@/donnees/infos-pratiques";
import {
  estUnCreneauOuvert,
  filtrerSurLesHorairesDeVisite,
  jourEtHeureAVertou,
} from "@/lib/reservation/grille-horaire";
import type { Creneau } from "@/lib/reservation/types";

const decouverte = visites.find((f) => f.nom === "Visite découverte")!.nom;

// Vendredi 9 octobre 2026, 16 h 30 à Vertou (Europe/Paris, encore en heure d'été).
const VENDREDI_16H30 = "2026-10-09T14:30:00.000Z";
// Même vendredi, 17 h à Vertou : pas un horaire publié.
const VENDREDI_17H = "2026-10-09T15:00:00.000Z";
// Samedi 10 octobre 2026, 10 h à Vertou.
const SAMEDI_10H = "2026-10-10T08:00:00.000Z";

describe("jourEtHeureAVertou", () => {
  it("lit le jour et l'heure dans le fuseau de Vertou, pas celui du serveur", () => {
    expect(jourEtHeureAVertou(VENDREDI_16H30)).toEqual({
      jour: "vendredi",
      heure: "16:30",
    });
    expect(jourEtHeureAVertou(SAMEDI_10H)).toEqual({ jour: "samedi", heure: "10:00" });
  });
});

describe("estUnCreneauOuvert", () => {
  it("accepte les quatre créneaux publiés", () => {
    expect(estUnCreneauOuvert(VENDREDI_16H30)).toBe(true);
    expect(estUnCreneauOuvert(SAMEDI_10H)).toBe(true);
  });

  it("refuse un horaire qui n'est pas publié, même un jour ouvert", () => {
    expect(estUnCreneauOuvert(VENDREDI_17H)).toBe(false);
  });

  it("refuse un jour qui n'est pas ouvert à la visite", () => {
    // Dimanche 11 octobre 2026, 10 h à Vertou.
    expect(estUnCreneauOuvert("2026-10-11T08:00:00.000Z")).toBe(false);
  });
});

describe("filtrerSurLesHorairesDeVisite", () => {
  it("ne garde que les créneaux dont l'horaire est publié", () => {
    const creneaux: Creneau[] = [
      { debut: VENDREDI_16H30, fin: "2026-10-09T16:00:00.000Z", placesRestantes: 3 },
      { debut: VENDREDI_17H, fin: "2026-10-09T16:30:00.000Z", placesRestantes: 3 },
    ];

    expect(filtrerSurLesHorairesDeVisite(creneaux, decouverte)).toEqual([
      { debut: VENDREDI_16H30, fin: "2026-10-09T16:00:00.000Z", placesRestantes: 3 },
    ]);
  });

  /**
   * Un fournisseur mal réglé (le `spots` d'un type de rendez-vous Meetergo,
   * par exemple) ne doit jamais faire annoncer plus de places que ce que le
   * cahier des charges vend pour cette formule.
   */
  it("plafonne les places restantes à l'effectif maximum de la formule", () => {
    const creneaux: Creneau[] = [
      { debut: VENDREDI_16H30, fin: "2026-10-09T16:00:00.000Z", placesRestantes: 999 },
    ];

    expect(filtrerSurLesHorairesDeVisite(creneaux, decouverte)).toEqual([
      { debut: VENDREDI_16H30, fin: "2026-10-09T16:00:00.000Z", placesRestantes: 10 },
    ]);
  });
});
