import { describe, expect, it } from "vitest";
import type { Biere } from "@/donnees/bieres";
import { bieres } from "@/donnees/bieres";
import { joursPortesOuvertes } from "@/donnees/portes-ouvertes";
import {
  donneesBiere,
  donneesBrasserie,
  donneesPortesOuvertes,
  IMAGE_PAR_DEFAUT,
} from "./seo";

const biere = (slug: string) => {
  const trouvee = bieres.find((b) => b.slug === slug);
  if (!trouvee) throw new Error(`bière introuvable : ${slug}`);
  return trouvee;
};

/**
 * Les sept bières réelles ont toutes leur degré depuis le 09/10/2026 (fil
 * client § 34, lu sur les étiquettes). Une bière fictive, sans aucun champ
 * optionnel, est ce qu'il faut pour tester l'absence de balisage du reste.
 */
const biereSansDonnees: Biere = {
  slug: "biere-de-test",
  nom: "Bière de test",
  type: "Test",
  couleur: "#000000",
  etat: "disponible",
};

describe("la fiche d'entreprise", () => {
  it("publie les horaires de la source unique, en jours lisibles par un moteur", () => {
    expect(donneesBrasserie().openingHoursSpecification).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "16:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "13:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "14:30",
        closes: "19:00",
      },
    ]);
  });

  /**
   * Le balisage d'avis qu'on a soi-même collectés ailleurs n'est pas reconnu par
   * Google, qui ne l'affiche pas et le compte comme un signal douteux. La note
   * reste affichée à l'humain, avec son lien vers la fiche, et c'est la fiche
   * Google qui la porte pour les moteurs.
   */
  it("ne balise pas la note Google", () => {
    expect(JSON.stringify(donneesBrasserie())).not.toMatch(/aggregateRating|ratingValue/);
  });
});

describe("une bière en donnée structurée", () => {
  it("balise le degré quand Marc l'a fourni", () => {
    expect(donneesBiere(biere("le-renard"))).toMatchObject({
      additionalProperty: { name: "Degré d'alcool", value: "6.2 % vol." },
    });
  });

  /**
   * La règle du cahier des charges 6 vaut aussi pour ce que lisent les moteurs :
   * une donnée qu'on n'a pas ne s'invente pas plus pour Google que pour un
   * client.
   */
  it("ne balise rien quand la donnée manque", () => {
    expect(donneesBiere(biereSansDonnees)).not.toHaveProperty("additionalProperty");
  });

  it("annonce une vente en boutique et non en ligne", () => {
    expect(donneesBiere(biere("le-renard")).offers).toMatchObject({
      price: 3.5,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStoreOnly",
    });
  });

  it("nomme la bouteille en bon français", () => {
    expect(donneesBiere(biere("le-corbeau")).offers.itemOffered.name).toBe(
      "Bouteille 33 cl du Corbeau",
    );
  });

  it("balise l'image quand l'étiquette de Sophie existe", () => {
    expect(donneesBiere(biere("le-renard")).image).toBe(
      "https://labascule.fr/illustrations/etiquettes/le-renard.webp",
    );
  });

  it("ne balise pas d'image sur un repli typographique", () => {
    expect(donneesBiere(biereSansDonnees)).not.toHaveProperty("image");
  });
});

describe("l'image de partage par défaut", () => {
  it("pointe vers un chemin public, carrée et nommée", () => {
    expect(IMAGE_PAR_DEFAUT.url).toBe("/illustrations/bascule.png");
    expect(IMAGE_PAR_DEFAUT.width).toBe(IMAGE_PAR_DEFAUT.height);
    expect(IMAGE_PAR_DEFAUT.alt).not.toBe("");
  });
});

describe("les portes ouvertes en donnée structurée", () => {
  it("donne un `Event` par jour, un pour chaque date de `joursPortesOuvertes`", () => {
    expect(donneesPortesOuvertes()).toHaveLength(joursPortesOuvertes.length);
  });

  /**
   * Un seul `Event` du samedi matin au dimanche soir couvrirait une nuit où
   * l'atelier est fermé : chaque jour a ses propres horaires de début et de fin.
   */
  it("borne chaque jour à ses propres horaires, sans déborder sur la nuit", () => {
    const [samedi, dimanche] = donneesPortesOuvertes();
    expect(samedi).toMatchObject({
      startDate: "2026-10-24T10:00:00",
      endDate: "2026-10-24T19:00:00",
    });
    expect(dimanche).toMatchObject({
      startDate: "2026-10-25T10:00:00",
      endDate: "2026-10-25T19:00:00",
    });
  });

  it("annonce l'entrée libre par le champ prévu par schema.org, pas par du texte", () => {
    for (const evenement of donneesPortesOuvertes()) {
      expect(evenement.isAccessibleForFree).toBe(true);
    }
  });
});
