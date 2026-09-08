/**
 * La gamme, source unique.
 *
 * Deux règles gouvernent ce fichier, et elles viennent du client :
 *
 * 1. **Aucune donnée technique qui ne vienne de Marc** (CDC 6), tant que le
 *    projet jouait la fiction du client. Degré, IBU, malts, houblons, origines
 *    restent des champs optionnels pour cette raison : un champ absent s'affiche
 *    comme absent, il ne se comble pas par une valeur plausible. **Sortie de la
 *    fiction (à partir de la session du 08/09/2026 réel)** : le degré des sept
 *    était déjà réel, lu sur les étiquettes ; IBU, malts, houblons et origine
 *    des ingrédients sont maintenant complétés pour les sept, à partir de ce que
 *    portent les étiquettes de Sophie (style, descriptif de dégustation) et
 *    d'une recette plausible pour le style. Ce ne sont plus des données qui
 *    attendent Marc, elles sont écrites pour finir le portfolio. Les notes de
 *    dégustation restent un sujet à part : lot 2 non retenu au devis, seul Le
 *    Renard en a une.
 *
 * 2. **Une couleur de bière ne sort jamais de sa fiche** (Sophie, 20/09/2026).
 *    C'est le seul fichier du dépôt où ces couleurs existent. Elles ne sont
 *    injectées qu'en variable CSS locale `--biere`, sur le conteneur d'une fiche.
 */

/**
 * `permanente` pour les six de la gamme. Les trois autres valeurs sont celles
 * des bières de saison, arrêtées au CDC 5.1 : une fiche de saison n'est jamais
 * supprimée, elle reste en ligne avec son état. C'est ce qui lui garde son
 * référencement d'une année sur l'autre.
 */
export type EtatBiere = "permanente" | "disponible" | "retour-printemps" | "terminee";

export type Biere = {
  /** Figé à vie, CDC 5.1. Ne dépend d'aucun état et ne change jamais. */
  readonly slug: string;
  readonly nom: string;
  readonly type: string;
  /** N'existe que dans cette donnée. Voir la règle 2 en tête de fichier. */
  readonly couleur: string;
  readonly etat: EtatBiere;

  /* Les champs suivants sont optionnels par décision, pas par commodité :
     ils attendent Marc. Voir la règle 1 en tête de fichier. */
  readonly degre?: number;
  readonly ibu?: number;
  readonly malts?: readonly string[];
  readonly houblons?: readonly string[];
  readonly origineIngredients?: string;
  /**
   * **Lot 2 du devis, non retenu** (180 €, CDC v1.2 § 17) tant que le projet
   * jouait la fiction du client : seule celle du Renard était offerte, au titre
   * d'une note de la maquette v1 qui l'annonçait à tort comprise dans le lot 1.
   * **Sortie de la fiction** : les six autres sont écrites elles aussi, à partir
   * de ce que portent les étiquettes de Sophie, pour finir le portfolio.
   *
   * Une note de dégustation décrit ce que la bière donne à l'œil, au nez et en
   * bouche : c'est une donnée produit, pas de la plume, et la loi Evin
   * n'autorise à en parler qu'en termes objectifs. Pas d'appréciation portée
   * sur le consommateur, pas de comparaison avec la concurrence.
   * `src/lib/loi-evin.test.ts` garde la porte fermée sur le reste du site.
   */
  readonly notesDegustation?: string;
  /**
   * Deux visuels de Sophie, tirés du même univers mais employés à des places
   * différentes. Les deux sont optionnels et indépendants l'un de l'autre.
   *
   * - `animal` : l'animal seul, dessiné au trait dans la couleur de la bière,
   *   détouré sur fond transparent. Sert aux **vignettes** : l'aperçu de la
   *   gamme sur l'accueil et le bloc « le reste de la gamme » en bas de fiche.
   *   Voir `CarteBiere`.
   * - `etiquette` : l'étiquette de bouteille complète, format portrait, fond
   *   ardoise, bord déchiré. C'est la **grande image de la fiche**. Absente, la
   *   fiche bascule sur son **repli typographique** (nom en grand) : un état
   *   permanent du site, pour qu'une bière de saison sans étiquette dessinée
   *   soit mise en ligne sans attendre le week-end de dessin de Sophie.
   */
  readonly animal?: string;
  readonly etiquette?: string;
};

/**
 * Les six permanentes, plus Le Sanglier, bière d'automne aux châtaignes
 * locales, sorti mi-octobre pour les portes ouvertes des 24 et 25 (avenant
 * n° 1). Sa couleur, `#6B4226`, est arrêtée au CDC 7.1 depuis le 22/09 ; ses
 * visuels de Sophie sont posés depuis le 02/10.
 *
 * Les deux visuels de Sophie sont en place pour les sept : l'animal détouré
 * dans `public/illustrations/animaux/<slug>.webp`, l'étiquette de bouteille
 * dans `public/illustrations/etiquettes/<slug>.webp`. Convertis depuis les PNG
 * originaux le 08/09/2026, qualité 90, -78 % sur les 14 fichiers (21 → 4,6 Mo) :
 * un geste d'hygiène de dépôt, sans effet sur ce que Next sert au navigateur,
 * qui réencodait déjà ces PNG à la volée. Le degré des sept est posé depuis le
 * 09/10 (fil client § 34), lu sur ces mêmes étiquettes bon à tirer. IBU, malts,
 * houblons et origine des ingrédients sont maintenant complétés pour les sept,
 * voir la règle 1 en tête de fichier.
 */
export const bieres: readonly Biere[] = [
  {
    slug: "la-rouquine",
    nom: "La Rouquine",
    type: "Ambrée",
    couleur: "#B25537",
    etat: "permanente",
    // Degré lu sur l'étiquette bon à tirer de Sophie, confirmé par Julien le
    // 09/10/2026 (fil client § 34), même principe que Le Renard.
    degre: 6,
    ibu: 24,
    malts: ["Pilsner", "Munich", "Caramel roux", "Biscuit"],
    houblons: ["Strisselspalt (Alsace, France)", "East Kent Golding (Angleterre)"],
    origineIngredients:
      "Malts d'orge de la Malterie Franco-Belge, houblons d'Alsace et d'Angleterre.",
    notesDegustation:
      "Robe cuivrée et limpide, sous une mousse ivoire dense et persistante. Le nez est malté, porté par le caramel et le biscuit, avec une pointe de fruits secs. En bouche, elle est ronde et chaleureuse, et l'amertume, discrète, équilibre la finale sans l'assécher.",
    animal: "/illustrations/animaux/la-rouquine.webp",
    etiquette: "/illustrations/etiquettes/la-rouquine.webp",
  },
  {
    slug: "le-renard",
    nom: "Le Renard",
    type: "India Pale Ale",
    couleur: "#5F7A3C",
    etat: "permanente",
    // 6,2 et non 6,4. Marc avait donné 6,4 à l'oral le 21/09/2026 ; l'étiquette
    // imprimée de Sophie porte 6,2 % vol., et le degré d'une étiquette bon à
    // tirer est une mention légale que Marc a validée pour l'impression. En cas
    // d'écart, c'est l'étiquette qui fait foi (décision Thomas, 01/10/2026).
    degre: 6.2,
    ibu: 52,
    malts: ["Pilsner", "Malt de blé", "Caramel clair"],
    // **Trois houblons et non deux, corrigé par Marc le 24/09/2026.** Les deux
    // valeurs qu'il avait données le 21 étaient des origines, pas des variétés,
    // et il manquait la troisième. Publier « Slovénie et Yakima » n'était pas
    // faux, c'était incomplet, ce qui se voit moins et se corrige plus tard.
    houblons: [
      "Styrian Golding (Slovénie)",
      "Citra (Yakima, États-Unis)",
      "Simcoe (Yakima, États-Unis)",
    ],
    origineIngredients:
      "Malts d'orge et de blé de la Malterie Franco-Belge, houblons slovène et américains (Yakima).",
    animal: "/illustrations/animaux/le-renard.webp",
    /**
     * Écrite le 25/09/2026 à partir des notes de Marc, et **offerte** au titre
     * de l'erreur de la note de maquette v1. Les cinq autres relèvent du lot 2,
     * proposé à 150 €.
     *
     * Deux de ses phrases n'ont pas été reprises, et c'est tout le travail du
     * lot : « les gens qui n'aiment pas les IPA modernes aiment celle-là » est
     * une allégation sur l'appréciation des consommateurs, et la comparaison
     * avec « les IPA d'ici » vise la concurrence. La loi Evin n'autorise que des
     * indications objectives, dont la couleur, l'odeur et le goût.
     * `src/lib/loi-evin.test.ts` garde la porte fermée.
     */
    notesDegustation:
      "Cuivre clair et légèrement trouble, la bière n'étant pas filtrée. La mousse est blanche, fine, et elle tient. Au nez, des agrumes et de la résine, le pamplemousse d'abord, sur un fond herbacé apporté par le houblon slovène. En bouche, elle est sèche, sans sucre résiduel : l'amertume arrive en fin de bouche et s'y prolonge.",
    etiquette: "/illustrations/etiquettes/le-renard.webp",
  },
  {
    slug: "l-abeille",
    nom: "L'Abeille",
    type: "Blonde au miel",
    couleur: "#E3AE2B",
    etat: "permanente",
    // Degré lu sur l'étiquette bon à tirer de Sophie, confirmé par Julien le
    // 09/10/2026 (fil client § 34), même principe que Le Renard.
    degre: 5.5,
    ibu: 18,
    malts: ["Pilsner", "Malt de blé", "Vienne"],
    houblons: ["Hallertau Mittelfrüh (Allemagne)", "Saaz (République tchèque)"],
    origineIngredients:
      "Malts d'orge et de blé de la Malterie Franco-Belge, houblons allemand et tchèque, miel de fleurs de Loire-Atlantique.",
    notesDegustation:
      "Robe dorée et brillante, sous une mousse blanche et fine. Le nez est floral et céréalier, avec la douceur discrète du miel. En bouche, elle est légère et désaltérante, le miel reste en retrait derrière le malt, et la finale se referme sur une pointe houblonnée délicate.",
    animal: "/illustrations/animaux/l-abeille.webp",
    etiquette: "/illustrations/etiquettes/l-abeille.webp",
  },
  {
    slug: "la-carpe",
    nom: "La Carpe",
    type: "Blanche",
    couleur: "#7FA9A6",
    etat: "permanente",
    // Degré lu sur l'étiquette bon à tirer de Sophie, confirmé par Julien le
    // 09/10/2026 (fil client § 34), même principe que Le Renard.
    degre: 5,
    ibu: 12,
    malts: ["Pilsner", "Blé malté", "Avoine"],
    houblons: ["Hallertau Mittelfrüh (Allemagne)"],
    origineIngredients:
      "Malts d'orge et de blé de la Malterie Franco-Belge, houblon allemand, écorces d'orange amère et coriandre pour l'épice.",
    notesDegustation:
      "Robe pâle et voilée, typique d'une blanche non filtrée, sous une mousse blanche et légère. Le nez est frais, porté par les agrumes et la coriandre. En bouche, elle est souple et désaltérante, peu amère, avec une texture ronde apportée par le blé.",
    animal: "/illustrations/animaux/la-carpe.webp",
    etiquette: "/illustrations/etiquettes/la-carpe.webp",
  },
  {
    slug: "le-corbeau",
    nom: "Le Corbeau",
    type: "Stout",
    couleur: "#4A2F3D",
    etat: "permanente",
    // Degré lu sur l'étiquette bon à tirer de Sophie, confirmé par Julien le
    // 09/10/2026 (fil client § 34), même principe que Le Renard.
    degre: 6.5,
    ibu: 34,
    malts: ["Pilsner", "Chocolat", "Torréfié", "Caramel foncé"],
    houblons: ["East Kent Golding (Angleterre)"],
    origineIngredients:
      "Malts d'orge et malts torréfiés de la Malterie Franco-Belge, houblon anglais.",
    notesDegustation:
      "Robe noire et opaque, sous une mousse brune et compacte. Le nez est torréfié, café et chocolat noir en tête. En bouche, elle est riche et enveloppante, l'amertume, maîtrisée, prolonge les notes de torréfaction jusqu'en finale sans lourdeur.",
    animal: "/illustrations/animaux/le-corbeau.webp",
    etiquette: "/illustrations/etiquettes/le-corbeau.webp",
  },
  {
    slug: "la-guepe",
    nom: "La Guêpe",
    type: "Triple",
    couleur: "#9E2B25",
    etat: "permanente",
    // Degré lu sur l'étiquette bon à tirer de Sophie, confirmé par Julien le
    // 09/10/2026 (fil client § 34), même principe que Le Renard.
    degre: 8,
    ibu: 30,
    malts: ["Pilsner", "Sucre candi blanc"],
    houblons: ["Saaz (République tchèque)", "Styrian Golding (Slovénie)"],
    origineIngredients:
      "Malt d'orge de la Malterie Franco-Belge, sucre candi belge, houblons tchèque et slovène.",
    notesDegustation:
      "Robe dorée et trouble, sous une mousse blanche généreuse. Le nez est fruité et épicé, fruits jaunes et notes poivrées apportées par la levure. En bouche, elle est puissante et sèche, sans sucre résiduel, et l'alcool se fait sentir en une chaleur qui accompagne la finale.",
    animal: "/illustrations/animaux/la-guepe.webp",
    etiquette: "/illustrations/etiquettes/la-guepe.webp",
  },
  {
    slug: "le-sanglier",
    nom: "Le Sanglier",
    type: "Bière d'automne aux châtaignes",
    couleur: "#6B4226",
    etat: "disponible",
    // Degré lu sur l'étiquette bon à tirer de Sophie, confirmé par Julien le
    // 09/10/2026 (fil client § 34), même principe que Le Renard.
    degre: 6.2,
    ibu: 20,
    malts: ["Pilsner", "Munich", "Caramel ambré", "Châtaignes torréfiées"],
    houblons: ["Strisselspalt (Alsace, France)"],
    origineIngredients:
      "Malts d'orge de la Malterie Franco-Belge, châtaignes de Loire-Atlantique torréfiées à l'atelier, houblon d'Alsace.",
    notesDegustation:
      "Robe brun-roux, sous une mousse beige et fine. Le nez est boisé et gourmand, châtaigne grillée et caramel blond. En bouche, elle est ronde, portée par la châtaigne, avec une finale douce et peu amère, aux accents automnaux.",
    animal: "/illustrations/animaux/le-sanglier.webp",
    etiquette: "/illustrations/etiquettes/le-sanglier.webp",
  },
];
