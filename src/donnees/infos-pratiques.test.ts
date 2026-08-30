import { describe, expect, it } from "vitest";
import {
  boutique,
  marche,
  prixBouteilles,
  stationnement,
  visites,
} from "./infos-pratiques";

/**
 * Ce test est la contrepartie d'un engagement pris au client : les dix données
 * publiées ont été vérifiées et arrêtées par écrit le 21/09/2026, après que six
 * d'entre elles se sont révélées fausses. Il les fige ici, une bonne fois, pour
 * qu'une modification de confort ne les fasse pas dériver sans qu'on s'en
 * aperçoive. Les faire évoluer demande de changer ce test, donc de le vouloir.
 */

const creneaux = (jour: string) => {
  const ouverture = boutique.horaires.find((h) => h.jour === jour);
  if (!ouverture) throw new Error(`jour d'ouverture absent : ${jour}`);
  return ouverture.creneaux;
};

const formule = (nom: string) => {
  const trouvee = visites.find((v) => v.nom === nom);
  if (!trouvee) throw new Error(`formule absente : ${nom}`);
  return trouvee;
};

describe("les horaires de la boutique", () => {
  it("ferme le vendredi à 19 h, et non à 19 h 30", () => {
    expect(creneaux("vendredi")).toEqual([{ ouverture: "16:00", fermeture: "19:00" }]);
  });

  it("rouvre le samedi à 14 h 30, et non à 15 h", () => {
    expect(creneaux("samedi")).toEqual([
      { ouverture: "10:00", fermeture: "13:00" },
      { ouverture: "14:30", fermeture: "19:00" },
    ]);
  });

  it("n'ouvre que le vendredi et le samedi", () => {
    expect(boutique.horaires.map((h) => h.jour)).toEqual(["vendredi", "samedi"]);
  });

  it("garde la mention réclamée par le client : la boutique est ouverte à tous", () => {
    expect(boutique.ouverteATous).toBe(true);
  });
});

describe("le marché", () => {
  it("est celui de Vertou, le dimanche matin", () => {
    expect(marche).toEqual({ commune: "Vertou", jour: "dimanche", moment: "matin" });
  });
});

describe("les prix de bouteille", () => {
  it("sont ceux de la hausse de juin 2026", () => {
    expect(prixBouteilles.format33cl).toBe(3.5);
    expect(prixBouteilles.format75cl).toBe(6.9);
  });
});

describe("les formules de visite", () => {
  it("tient la découverte à 15 € pour 6 à 10 personnes, en 1 h 30", () => {
    expect(formule("Visite découverte")).toMatchObject({
      prixParPersonne: 15,
      effectifMin: 6,
      effectifMax: 10,
      dureeMinutes: 90,
    });
  });

  it("tient l'entreprise à 25 € pour 15 à 20 personnes, en 2 h 30", () => {
    // Durée corrigée le 21/09 : elle n'a jamais été tenue en 2 h.
    expect(formule("Visite entreprise")).toMatchObject({
      prixParPersonne: 25,
      effectifMin: 15,
      effectifMax: 20,
      dureeMinutes: 150,
    });
  });
});

describe("le stationnement", () => {
  it("annonce 12 places, et non les 20 annoncées à tort", () => {
    expect(stationnement.places).toBe(12);
  });
});
