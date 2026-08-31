/**
 * La gamme, source unique.
 *
 * Deux règles gouvernent ce fichier, et elles viennent du client :
 *
 * 1. **Aucune donnée technique qui ne vienne de Marc** (CDC 6). Degré, IBU, malts,
 *    houblons, origines : les champs optionnels ci-dessous sont optionnels pour
 *    cette raison. Un champ absent s'affiche comme absent, il ne se comble pas
 *    par une valeur plausible. Six valeurs relevées à l'oral se sont révélées
 *    fausses le 21/09/2026, la règle est née de là.
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

/**
 * `reduite` pour les étiquettes scannées en 2022, qui montrent le grain du
 * papier au-delà d'une vingtaine de centimètres. La contrainte est une propriété
 * du fichier fourni, elle a donc sa place dans la donnée et non dans une
 * exception de mise en page : elle disparaît d'elle-même le jour où Sophie les
 * redessine.
 */
export type TailleVisuel = "normale" | "reduite";

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
   * **Lot 2 du devis, non retenu** (180 €, CDC v1.2 § 17). Le champ reste donc
   * vide pour les six : c'est le périmètre, pas un oubli, et il ne se comble pas
   * en attendant. Seule celle du Renard est offerte, au titre d'une note de la
   * maquette v1 qui l'annonçait à tort comprise dans le lot 1 retenu ; erreur
   * signalée au client le 22/09/2026, fil client § 27.
   *
   * Comme les champs techniques ci-dessus, elle attend les mots de Marc. Une
   * note de dégustation décrit ce que la bière donne au nez et en bouche : c'est
   * une donnée produit, pas de la plume, et la loi Evin n'autorise à en parler
   * qu'en termes objectifs.
   */
  readonly notesDegustation?: string;
  /** Absente : la fiche bascule sur son repli typographique. */
  readonly illustration?: string;
  /**
   * Vrai tant que le dessin affiché n'est pas l'étiquette de Sophie. La fiche
   * porte alors la mention en clair, sous le visuel. Le champ disparaît à la
   * livraison de ses fichiers : c'est ce qui empêche un dessin de travail de se
   * retrouver en ligne le 9 octobre sans que personne ne l'ait vu.
   */
  readonly illustrationProvisoire?: boolean;
  readonly tailleVisuel?: TailleVisuel;
};

/**
 * Les six permanentes. Le Sanglier, bière d'automne, n'y figure pas encore :
 * son style n'est pas arrêté par Marc et sa cuvée est embouteillée mi-octobre.
 * Il sera ajouté avec ses données, pas avant.
 *
 * Les fichiers web de Sophie sont attendus le 28/09/2026, soit après la
 * préproduction. Seul Le Renard porte un dessin de travail, pour que la fiche
 * illustrée et le repli typographique soient tous deux visibles en ligne le 25.
 */
export const bieres: readonly Biere[] = [
  {
    slug: "la-rouquine",
    nom: "La Rouquine",
    type: "Ambrée",
    couleur: "#B25537",
    etat: "permanente",
  },
  {
    slug: "le-renard",
    nom: "Le Renard",
    type: "India Pale Ale",
    couleur: "#5F7A3C",
    etat: "permanente",
    // Les deux seules valeurs techniques arrêtées à ce jour, corrigées par
    // Marc lui-même le 21/09/2026. C'est ce qui fait du Renard la fiche de la
    // préproduction du 25.
    degre: 6.4,
    // **Trois houblons et non deux, corrigé par Marc le 24/09/2026.** Les deux
    // valeurs qu'il avait données le 21 étaient des origines, pas des variétés,
    // et il manquait la troisième. Publier « Slovénie et Yakima » n'était pas
    // faux, c'était incomplet, ce qui se voit moins et se corrige plus tard.
    houblons: [
      "Styrian Golding (Slovénie)",
      "Citra (Yakima, États-Unis)",
      "Simcoe (Yakima, États-Unis)",
    ],
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
    // Dessin de travail repris de la maquette, en attendant l'étiquette de
    // Sophie. Il n'est là que pour montrer la fiche illustrée : les cinq autres
    // bières restent sur leur repli typographique, ce qui donne à Sophie les
    // deux états à comparer en vrai, sans code de démonstration à retirer plus
    // tard.
    illustration: "/illustrations/le-renard-provisoire.svg",
    illustrationProvisoire: true,
  },
  {
    slug: "l-abeille",
    nom: "L'Abeille",
    type: "Blonde au miel",
    couleur: "#E3AE2B",
    etat: "permanente",
  },
  {
    slug: "la-carpe",
    nom: "La Carpe",
    type: "Blanche",
    couleur: "#7FA9A6",
    etat: "permanente",
    tailleVisuel: "reduite",
  },
  {
    slug: "le-corbeau",
    nom: "Le Corbeau",
    type: "Stout",
    couleur: "#4A2F3D",
    etat: "permanente",
    tailleVisuel: "reduite",
  },
  {
    slug: "la-guepe",
    nom: "La Guêpe",
    type: "Triple",
    couleur: "#9E2B25",
    etat: "permanente",
  },
];
