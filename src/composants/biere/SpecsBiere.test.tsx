import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Biere } from "@/donnees/bieres";
import { bieres } from "@/donnees/bieres";
import { SpecsBiere } from "./SpecsBiere";

const biere = (slug: string) => {
  const trouvee = bieres.find((b) => b.slug === slug);
  if (!trouvee) throw new Error(`bière introuvable : ${slug}`);
  return trouvee;
};

/**
 * Les sept bières réelles ont toutes leur degré depuis le 09/10/2026 (fil
 * client § 34, lu sur les étiquettes). Une bière fictive, sans aucun champ
 * optionnel, est ce qu'il faut pour tester l'attente de Marc sur le reste.
 */
const biereSansDonnees: Biere = {
  slug: "biere-de-test",
  nom: "Bière de test",
  type: "Test",
  couleur: "#000000",
  etat: "disponible",
};

const ligne = (intitule: string) => screen.getByText(intitule).parentElement;

describe("les champs que Marc n'a pas fournis", () => {
  /**
   * Règle du cahier des charges 6 : un champ absent s'affiche comme absent, il
   * ne se comble jamais par une valeur plausible. La maquette a fait valider
   * l'emplacement exact de ces mentions, le client les a vues, et la fiche du
   * 25 septembre est livrée avec ses trous en connaissance de cause.
   */
  it("affichent leur attente au lieu d'un chiffre inventé sur une bière sans données", () => {
    render(<SpecsBiere biere={biereSansDonnees} />);

    expect(ligne("Amertume")).toHaveTextContent("en attente de Marc");
    expect(ligne("Malts")).toHaveTextContent("en attente de Marc");
    expect(ligne("Origine des ingrédients")).toHaveTextContent("en attente de Marc");
  });

  it("affichent les specs complètes du Renard, sortie de la fiction oblige", () => {
    render(<SpecsBiere biere={biere("le-renard")} />);

    expect(ligne("Degré")).toHaveTextContent("6,2 % vol.");
    expect(ligne("Amertume")).toHaveTextContent("52 IBU");
    expect(ligne("Malts")).toHaveTextContent("Pilsner, Malt de blé, Caramel clair");
    // Trois variétés depuis le 24/09/2026 : ce que Marc avait donné le 21
    // étaient des origines, et il en manquait une.
    expect(ligne("Houblons")).toHaveTextContent(
      "Styrian Golding (Slovénie), Citra (Yakima, États-Unis), Simcoe (Yakima, États-Unis)",
    );
    expect(ligne("Origine des ingrédients")).toHaveTextContent(
      "Malts d'orge et de blé de la Malterie Franco-Belge, houblons slovène et américains (Yakima).",
    );
  });

  it("attendent tout d'une bière dont rien n'est arrêté", () => {
    render(<SpecsBiere biere={biereSansDonnees} />);
    expect(ligne("Degré")).toHaveTextContent("en attente de Marc");
  });
});

describe("le prix boutique", () => {
  it("vient de la source unique, aux tarifs corrigés le 21/09", () => {
    render(<SpecsBiere biere={biere("le-renard")} />);
    expect(ligne("Prix boutique")).toHaveTextContent("3,50 € la 33 cl · 6,90 € la 75 cl");
  });
});

describe("la disponibilité", () => {
  it("nomme l'état de la bière", () => {
    render(<SpecsBiere biere={biere("le-renard")} />);
    expect(ligne("Disponibilité")).toHaveTextContent("Permanente");
  });
});
