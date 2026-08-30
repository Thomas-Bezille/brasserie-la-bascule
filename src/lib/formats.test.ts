import { describe, expect, it } from "vitest";
import { formaterCreneaux, formaterHeure } from "./formats";

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
