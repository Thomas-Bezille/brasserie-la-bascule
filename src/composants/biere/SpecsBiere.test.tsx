import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { bieres } from "@/donnees/bieres";
import { SpecsBiere } from "./SpecsBiere";

const biere = (slug: string) => {
  const trouvee = bieres.find((b) => b.slug === slug);
  if (!trouvee) throw new Error(`bière introuvable : ${slug}`);
  return trouvee;
};

const ligne = (intitule: string) => screen.getByText(intitule).parentElement;

describe("les champs que Marc n'a pas fournis", () => {
  /**
   * Règle du cahier des charges 6 : un champ absent s'affiche comme absent, il
   * ne se comble jamais par une valeur plausible. La maquette a fait valider
   * l'emplacement exact de ces mentions, le client les a vues, et la fiche du
   * 25 septembre est livrée avec ses trous en connaissance de cause.
   */
  it("affichent leur attente au lieu d'un chiffre inventé", () => {
    render(<SpecsBiere biere={biere("le-renard")} />);

    expect(ligne("Amertume")).toHaveTextContent("en attente de Marc");
    expect(ligne("Malts")).toHaveTextContent("en attente de Marc");
    expect(ligne("Origine des ingrédients")).toHaveTextContent("en attente de Marc");
  });

  it("laissent la place aux deux valeurs que Marc a bien corrigées", () => {
    render(<SpecsBiere biere={biere("le-renard")} />);

    expect(ligne("Degré")).toHaveTextContent("6,4 % vol.");
    // Trois variétés depuis le 24/09/2026 : ce que Marc avait donné le 21
    // étaient des origines, et il en manquait une.
    expect(ligne("Houblons")).toHaveTextContent(
      "Styrian Golding (Slovénie), Citra (Yakima, États-Unis), Simcoe (Yakima, États-Unis)",
    );
  });

  it("attendent tout d'une bière dont rien n'est arrêté", () => {
    render(<SpecsBiere biere={biere("la-guepe")} />);
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
