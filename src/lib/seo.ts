import type { Biere } from "@/donnees/bieres";
import {
  adresse,
  boutique,
  contact,
  prixBouteilles,
  visites,
} from "@/donnees/infos-pratiques";
import { joursPortesOuvertes } from "@/donnees/portes-ouvertes";
import { complementDuNom } from "@/lib/formats";

/**
 * Les données structurées du site.
 *
 * Elles décrivent aux moteurs ce que la page dit déjà à l'humain : l'adresse,
 * les horaires, les prix. Elles ne sont pas une couche de promesses à part, et
 * elles lisent donc les mêmes données que les pages, jamais des valeurs
 * recopiées.
 *
 * **Ce qu'on n'y met pas, volontairement : la note Google.** Le balisage
 * `aggregateRating` d'avis qu'on a soi-même collectés ailleurs n'est pas
 * reconnu par Google, qui ne l'affiche pas et le compte comme un signal
 * douteux. La note reste affichée à l'humain, avec son lien vers la fiche, et
 * c'est la fiche Google elle-même qui la porte pour les moteurs.
 */

/**
 * L'adresse publique du site, telle qu'elle entre dans les adresses canoniques,
 * le plan du site et les données structurées.
 *
 * **Une variable vide ou mal remplie ne doit pas faire tomber le build.** Elle
 * l'a fait : `new URL("")` lève, et le déploiement échoue sur les onze pages à
 * la fois, avec pour seul message « Invalid URL ». Une valeur d'hébergeur se
 * saisit à la main dans une interface, souvent sans le `https://`, et il ne
 * faut pas plus qu'un espace en trop pour rendre le site indéployable un
 * vendredi soir.
 *
 * Le repli est donc le domaine cible, qui est de toute façon la bonne valeur en
 * production. Une adresse fausse en préproduction n'a aucune conséquence : tout
 * y est en `noindex`.
 */
const URL_FOURNIE = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const URL_SITE =
  URL_FOURNIE && /^https?:\/\/[^\s]+$/.test(URL_FOURNIE)
    ? URL_FOURNIE.replace(/\/+$/, "")
    : "https://labascule.fr";

const JOURS_SCHEMA: Record<string, string> = {
  lundi: "Monday",
  mardi: "Tuesday",
  mercredi: "Wednesday",
  jeudi: "Thursday",
  vendredi: "Friday",
  samedi: "Saturday",
  dimanche: "Sunday",
};

/**
 * `Brewery` plutôt que `LocalBusiness` : le type existe dans schema.org, il
 * hérite de tout ce que porte un commerce local, et il dit ce que l'entreprise
 * est. La catégorie « Brasserie » est aussi celle qui a été retenue pour la
 * reprise de la fiche Google, les deux doivent se répondre.
 */
export function donneesBrasserie() {
  return {
    "@context": "https://schema.org",
    "@type": "Brewery",
    "@id": `${URL_SITE}/#brasserie`,
    name: "Brasserie La Bascule",
    description:
      "Microbrasserie artisanale à Vertou, près de Nantes. Six bières permanentes, boutique, marché du dimanche et visites de l'atelier avec dégustation.",
    url: URL_SITE,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: adresse.voie,
      postalCode: adresse.codePostal,
      addressLocality: adresse.commune,
      addressCountry: "FR",
    },
    openingHoursSpecification: boutique.horaires.flatMap(({ jour, creneaux }) =>
      creneaux.map(({ ouverture, fermeture }) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: JOURS_SCHEMA[jour],
        opens: ouverture,
        closes: fermeture,
      })),
    ),
    makesOffer: visites.map((formule) => ({
      "@type": "Offer",
      name: formule.nom,
      price: formule.prixParPersonne,
      priceCurrency: "EUR",
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: formule.effectifMin,
        maxValue: formule.effectifMax,
        unitText: "personnes",
      },
    })),
  };
}

/**
 * Une bière en `Product`.
 *
 * Les champs techniques absents ne sont pas balisés : la règle du cahier des
 * charges 6 vaut aussi pour ce que lisent les moteurs. Une donnée qu'on n'a pas
 * ne s'invente pas plus pour Google que pour un client.
 *
 * L'offre est marquée `InStoreOnly` : la bière est vendue à la boutique et chez
 * les partenaires, il n'y a pas de vente en ligne, et un moteur qui promettrait
 * l'achat au clic tromperait le visiteur.
 */
export function donneesBiere(biere: Biere) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: biere.nom,
    category: biere.type,
    description: `${biere.nom}, ${biere.type} brassée à Vertou par la Brasserie La Bascule.`,
    url: `${URL_SITE}/nos-bieres/${biere.slug}`,
    brand: { "@type": "Brand", name: "Brasserie La Bascule" },
    ...(biere.degre !== undefined && {
      additionalProperty: {
        "@type": "PropertyValue",
        name: "Degré d'alcool",
        value: `${biere.degre} % vol.`,
      },
    }),
    offers: {
      "@type": "Offer",
      price: prixBouteilles.format33cl,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStoreOnly",
      itemOffered: {
        "@type": "Product",
        name: `Bouteille 33 cl ${complementDuNom(biere.nom)}`,
      },
    },
  };
}

/**
 * Les portes ouvertes, en `Event`, un par jour : `startDate`/`endDate` d'un
 * même `Event` couvriraient la nuit du samedi au dimanche, ce qui n'existe pas,
 * l'atelier fermant chaque soir. `isAccessibleForFree` porte l'entrée libre,
 * annoncée par Julien (fil client § 31) : ni promotionnel ni un prix à zéro
 * euros, c'est le champ que schema.org prévoit pour ça.
 */
export function donneesPortesOuvertes() {
  return joursPortesOuvertes.map(({ date, jour, creneau }) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Portes ouvertes La Bascule · ${jour}`,
    description:
      "Visites de l'atelier toutes les heures et dégustation du Sanglier, notre bière d'automne aux châtaignes. Entrée libre.",
    startDate: `${date}T${creneau.ouverture}:00`,
    endDate: `${date}T${creneau.fermeture}:00`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    isAccessibleForFree: true,
    location: {
      "@type": "Place",
      name: "Brasserie La Bascule",
      address: {
        "@type": "PostalAddress",
        streetAddress: adresse.voie,
        postalCode: adresse.codePostal,
        addressLocality: adresse.commune,
        addressCountry: "FR",
      },
    },
    organizer: { "@type": "Brewery", name: "Brasserie La Bascule", url: URL_SITE },
  }));
}
