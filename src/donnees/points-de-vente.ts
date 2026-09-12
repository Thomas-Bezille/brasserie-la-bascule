/**
 * Les points de vente, source unique de la page « Où nous trouver ».
 *
 * **D'où vient cette liste.** Julien a envoyé une liste brute le 30/09/2026
 * (fil client § 31), reconstituée de mémoire à partir de ses factures. Elle a
 * été triée le 01/10 (§ 32) : quatre lignes retirées (fermé, ne commande plus,
 * un dépannage ponctuel, le grossiste plutôt qu'un point de vente), deux
 * renvoyées à son arbitrage. Julien n'a jamais eu le temps de reprendre les
 * adresses une par une malgré deux relances (§ 33-34) ; les factures promises
 * en pièce jointe (§ 34) ne sont jamais arrivées dans le fil.
 *
 * **Sortie de fiction le 09/09/2026, décision de Thomas, même logique que le
 * reste de la session 18** (téléphone, domaine, horaires de visite) : plutôt
 * que de laisser la page bloquée indéfiniment sur des factures qui
 * n'arriveront jamais dans un projet fictif joué en solo, les deux points
 * encore « à trancher » sont tranchés ici, et les adresses manquantes sont
 * complétées par des adresses plausibles et vérifiables (rues réelles de
 * Nantes, Vertou, Rezé, Clisson, Saint-Sébastien-sur-Loire et Monnières),
 * numéro de porte mis à part qui reste inventé comme le reste.
 *
 * **Ce qui vient mot pour mot de Julien, donc fiable** : la place Viarme (Le
 * Chat Noir), la rue Saint-Blaise (Cave de la Sèvre) et la rue de Verdun (La
 * Part des Anges). Tout le reste est une reconstitution plausible.
 *
 * **Les deux points arbitrés ici :**
 * - *Le bar du camping de la Ramée* : gardé, avec la mention saisonnière que
 *   Thomas avait proposée en option plutôt que de le retirer purement.
 * - *Le Pressoir* : c'est un restaurant qui sert la Rouquine à la carte à
 *   l'année, pas un point de vente à emporter. Sorti de « où l'acheter »,
 *   comme Thomas l'avait proposé au § 32, dans une rubrique séparée
 *   « où la boire ».
 */

type CategorieDePointDeVente = "bar" | "caviste" | "restaurant";

export type PointDeVente = {
  readonly nom: string;
  readonly categorie: CategorieDePointDeVente;
  readonly adresse: string;
  readonly codePostal: string;
  readonly commune: string;
  readonly latitude: number;
  readonly longitude: number;
  /** Précision libre : saisonnalité, ou pourquoi il figure ici. */
  readonly note?: string;
};

/**
 * Où acheter une bouteille : les bars et cavistes partenaires. Les quatre
 * retraits du § 32 (L'Alambic fermé, le Café de Clisson qui ne commande
 * plus, le tabac-presse d'un dépannage ponctuel, Distrib'Ouest qui est le
 * grossiste et non un point de vente) n'y figurent pas.
 */
export const pointsDeVente: readonly PointDeVente[] = [
  {
    nom: "Le Chat Noir",
    categorie: "bar",
    adresse: "3 place Viarme",
    codePostal: "44000",
    commune: "Nantes",
    latitude: 47.2209,
    longitude: -1.5622,
  },
  {
    nom: "La Civelle",
    categorie: "bar",
    adresse: "12 quai Marcel Boissard",
    codePostal: "44400",
    commune: "Rezé (Trentemoult)",
    latitude: 47.1952,
    longitude: -1.5816,
  },
  {
    nom: "Bar de la Mairie",
    categorie: "bar",
    adresse: "2 place Saint-Martin",
    codePostal: "44120",
    commune: "Vertou",
    latitude: 47.1684,
    longitude: -1.4728,
  },
  {
    nom: "L'Embellie",
    categorie: "bar",
    adresse: "18 rue de la Bourgeonnière",
    codePostal: "44100",
    commune: "Nantes (Chantenay)",
    latitude: 47.208,
    longitude: -1.585,
  },
  {
    nom: "Le Vertigo",
    categorie: "bar",
    adresse: "5 rue Talensac",
    codePostal: "44000",
    commune: "Nantes",
    latitude: 47.2213,
    longitude: -1.5595,
  },
  {
    nom: "Chez Gégène",
    categorie: "bar",
    adresse: "6 place du Beau Verger",
    codePostal: "44120",
    commune: "Vertou",
    latitude: 47.1693,
    longitude: -1.4731,
  },
  {
    nom: "Le Café des Sports",
    categorie: "bar",
    adresse: "14 rue de la Cinquième République",
    codePostal: "44230",
    commune: "Saint-Sébastien-sur-Loire",
    latitude: 47.2006,
    longitude: -1.4881,
  },
  {
    nom: "L'Atelier",
    categorie: "bar",
    adresse: "3 rue du Château",
    codePostal: "44190",
    commune: "Clisson",
    latitude: 47.0869,
    longitude: -1.2817,
  },
  {
    nom: "Le Zinc",
    categorie: "bar",
    adresse: "1 place du Bouffay",
    codePostal: "44000",
    commune: "Nantes",
    latitude: 47.2148,
    longitude: -1.5534,
  },
  {
    nom: "Le Comptoir des Halles",
    categorie: "bar",
    adresse: "4 rue du Docteur Boissard",
    codePostal: "44400",
    commune: "Rezé (Pont-Rousseau)",
    latitude: 47.19,
    longitude: -1.5478,
    note: "Julien hésitait entre Nantes et Rezé, tranché ici pour Rezé.",
  },
  {
    nom: "Le bar du camping de la Ramée",
    categorie: "bar",
    adresse: "Chemin de la Sèvre",
    codePostal: "44120",
    commune: "Vertou",
    latitude: 47.163,
    longitude: -1.4675,
    note: "Ouvert l'été uniquement.",
  },
  {
    nom: "Cave de la Sèvre",
    categorie: "caviste",
    adresse: "5 rue Saint-Blaise",
    codePostal: "44120",
    commune: "Vertou",
    latitude: 47.1675,
    longitude: -1.4715,
  },
  {
    nom: "La Cave d'à Côté",
    categorie: "caviste",
    adresse: "22 boulevard Émile Zola",
    codePostal: "44100",
    commune: "Nantes",
    latitude: 47.2033,
    longitude: -1.5778,
  },
  {
    nom: "Vins & Cie",
    categorie: "caviste",
    adresse: "8 rue de la Bastille",
    codePostal: "44190",
    commune: "Clisson",
    latitude: 47.086,
    longitude: -1.2822,
  },
  {
    nom: "Le Verre Bouteille",
    categorie: "caviste",
    adresse: "6 rue Franklin Roosevelt",
    codePostal: "44230",
    commune: "Saint-Sébastien-sur-Loire",
    latitude: 47.2,
    longitude: -1.4888,
  },
  {
    nom: "L'Épicerie Fine",
    categorie: "caviste",
    adresse: "Le Bourg",
    codePostal: "44690",
    commune: "Monnières",
    latitude: 47.1319,
    longitude: -1.3559,
  },
  {
    nom: "La Part des Anges",
    categorie: "caviste",
    adresse: "9 rue de Verdun",
    codePostal: "44000",
    commune: "Nantes",
    latitude: 47.215,
    longitude: -1.556,
  },
  {
    nom: "Le Cellier vertavien",
    categorie: "caviste",
    adresse: "10 rue de la République",
    codePostal: "44120",
    commune: "Vertou",
    latitude: 47.1688,
    longitude: -1.4719,
  },
];

/**
 * Où la boire sans l'acheter : un restaurant qui la sert au verre, distinct
 * des points de vente à emporter (proposition de Thomas au § 32).
 */
export const ouLaBoire: readonly PointDeVente[] = [
  {
    nom: "Le Pressoir",
    categorie: "restaurant",
    adresse: "2 rue de la Distillerie",
    codePostal: "44120",
    commune: "Vertou",
    latitude: 47.1697,
    longitude: -1.4708,
    note: "La Rouquine à la carte à l'année.",
  },
];
