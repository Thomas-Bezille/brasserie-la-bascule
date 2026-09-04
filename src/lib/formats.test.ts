import { describe, expect, it } from "vitest";
import {
  complementDuNom,
  formaterCreneaux,
  formaterDegre,
  formaterDuree,
  formaterHeure,
  formaterPrix,
} from "./formats";

const INSECABLE = " ";

describe("formaterHeure", () => {
  it("écrit une heure ronde sans ses minutes", () => {
    expect(formaterHeure("16:00")).toBe(`16${INSECABLE}h`);
  });

  it("garde les minutes quand il y en a", () => {
    expect(formaterHeure("14:30")).toBe(`14${INSECABLE}h${INSECABLE}30`);
  });

  it("retire le zéro initial des heures", () => {
    expect(formaterHeure("09:00")).toBe(`9${INSECABLE}h`);
  });

  it("n'emploie que des espaces insécables", () => {
    expect(formaterHeure("14:30")).not.toMatch(/ /);
  });
});

describe("formaterCreneaux", () => {
  it("relie les deux services du samedi", () => {
    expect(
      formaterCreneaux([
        { ouverture: "10:00", fermeture: "13:00" },
        { ouverture: "14:30", fermeture: "19:00" },
      ]),
    ).toBe(
      `10${INSECABLE}h – 13${INSECABLE}h et 14${INSECABLE}h${INSECABLE}30 – 19${INSECABLE}h`,
    );
  });
});

describe("formaterPrix", () => {
  it("écrit les prix de bouteille avec la virgule décimale", () => {
    expect(formaterPrix(3.5)).toBe(`3,50${INSECABLE}€`);
    expect(formaterPrix(6.9)).toBe(`6,90${INSECABLE}€`);
  });

  it("écrit un prix entier sans décimale", () => {
    expect(formaterPrix(15)).toBe(`15${INSECABLE}€`);
  });
});

describe("formaterDegre", () => {
  it("écrit le degré du Renard tel que le porte son étiquette", () => {
    expect(formaterDegre(6.2)).toBe(`6,2${INSECABLE}%${INSECABLE}vol.`);
  });
});

describe("complementDuNom", () => {
  it("contracte l'article des noms de la gamme", () => {
    expect(complementDuNom("Le Renard")).toBe("du Renard");
    expect(complementDuNom("La Carpe")).toBe("de la Carpe");
    expect(complementDuNom("L'Abeille")).toBe("de l'Abeille");
  });

  it("laisse un nom sans article se présenter seul", () => {
    expect(complementDuNom("Sanglier")).toBe("de Sanglier");
  });
});

describe("formaterDuree", () => {
  it("écrit les durées des deux formules de visite", () => {
    expect(formaterDuree(90)).toBe(`1${INSECABLE}h${INSECABLE}30`);
    // 2 h 30 et non 2 h : la durée de la formule entreprise a été corrigée le
    // 21/09, elle n'a jamais été tenue en deux heures.
    expect(formaterDuree(150)).toBe(`2${INSECABLE}h${INSECABLE}30`);
  });

  it("écrit une durée ronde sans ses minutes", () => {
    expect(formaterDuree(120)).toBe(`2${INSECABLE}h`);
  });
});
