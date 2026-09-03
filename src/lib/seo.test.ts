import { describe, expect, it } from "vitest";
import { bieres } from "@/donnees/bieres";
import { donneesBiere, donneesBrasserie } from "./seo";

const biere = (slug: string) => {
  const trouvee = bieres.find((b) => b.slug === slug);
  if (!trouvee) throw new Error(`bière introuvable : ${slug}`);
  return trouvee;
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
    expect(donneesBiere(biere("la-guepe"))).not.toHaveProperty("additionalProperty");
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
});
