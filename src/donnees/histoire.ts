/**
 * Le fil de « Notre histoire », source unique de la page du même nom.
 *
 * **Contenu écrit hors fiction (session 19, 10/09/2026).** L'avenant n° 2
 * (`AV-2026-002-02`) chiffrait un entretien de trente minutes avec Marc comme
 * matière de la page. Le projet étant joué en solo, cet entretien n'a pas lieu :
 * Thomas a choisi d'écrire la page à partir des faits déjà établis au rendez-vous
 * de découverte du 02/09 — garage à Saint-Sébastien en 2022, installation à
 * Vertou en 2024, les trois associés, le maltage d'une partie de l'orge — et
 * d'inventer le « pourquoi » dans le même esprit que les autres sorties de
 * fiction des sessions 17 et 18. Version retenue : Marc, brasseur amateur qui
 * travaillait dans la filière céréalière ; Julien, son beau-frère, au commerce ;
 * Sophie aux étiquettes. Le nom vient du pont-bascule qui pèse le grain, et du
 * moment où les trois basculent d'un métier à l'autre.
 *
 * **Photos ajoutées en session 19 (10/09/2026).** L'article 6 de l'avenant
 * prévoyait la page en version typographique faute de photo d'archive ; « de
 * vrais visuels pourront venir plus tard ». Ce sont des photos d'illustration
 * prises sur Unsplash (licence Unsplash), pas des images du lieu réel : elles
 * disent le métier et la matière, pas « voici la Brasserie La Bascule ». Le
 * fonds ancien de 2022 reste absent, comme prévu. Recadrées et converties en
 * WebP dans `public/photos/histoire/`, créditées aux mentions légales via
 * `AUTEURS_PHOTOS`.
 *
 * **Faits à valider par la brasserie avant publication** (avenant, article 6) :
 * dates, lieux et volumes. Ici, ils sont tenus pour acquis par Thomas.
 */

/** La commune des débuts, avant l'installation à Vertou. */
export const communeOrigine = "Saint-Sébastien-sur-Loire";

/** L'année du premier brassin et de la création de la SAS. */
export const anneeCreation = 2022;

export type Jalon = {
  readonly annee: number;
  readonly titre: string;
  readonly recit: string;
};

/**
 * Les deux moments datés de l'histoire, du plus ancien au plus récent. La page
 * les affiche dans cet ordre ; `histoire.test.ts` refuse qu'il s'inverse ou
 * qu'une année se répète.
 */
export const jalons: readonly Jalon[] = [
  {
    annee: 2022,
    titre: "Un garage à Saint-Sébastien",
    recit:
      "Marc brassait chez lui depuis une dizaine d'années, entre deux tournées pour la coopérative céréalière où il travaillait. Julien, son beau-frère, vendait autre chose, ailleurs. Sophie dessinait des étiquettes le soir, pour voir à quoi ça ressemblerait. Un automne, ils ont loué une cuve, vidé le garage de Marc et brassé le premier lot. Il s'est vendu sur le marché de Vertou, un dimanche matin, sur une table pliante.",
  },
  {
    annee: 2024,
    titre: "Le hangar de la rue des Vignes",
    recit:
      "En deux ans, le garage a été dépassé. L'atelier s'installe à Vertou, au 12 rue des Vignes, dans un ancien bâtiment agricole. Une rue des Vignes pour une brasserie, au milieu du vignoble nantais : le hasard nous a plu. C'est là qu'on brasse, qu'on malte, qu'il y a la boutique, et c'est là qu'on reçoit les visites.",
  },
];

export type Photo = {
  readonly src: string;
  readonly alt: string;
  readonly largeur: number;
  readonly hauteur: number;
  /** Auteur de la photo, repris aux mentions légales (`AUTEURS_PHOTOS`). */
  readonly auteur: string;
};

/**
 * Les quatre photos de la page, déjà recadrées et en WebP. `alt` décrit ce que
 * montre l'image sans prétendre que c'est le lieu réel : ce sont des photos
 * d'illustration, voir le raisonnement en tête de fichier.
 */
export const photos = {
  atelier: {
    src: "/photos/histoire/atelier.webp",
    alt: "Intérieur d'un atelier de brassage : charpente en bois, suspensions industrielles, cuves en inox derrière une paroi vitrée.",
    largeur: 2400,
    hauteur: 1139,
    auteur: "Carlos Blanco",
  },
  vignes: {
    src: "/photos/histoire/vignes.webp",
    alt: "Des rangs de vigne au premier plan, un bâtiment de brique aux fenêtres en arc derrière.",
    largeur: 1800,
    hauteur: 864,
    auteur: "T.",
  },
  grain: {
    src: "/photos/histoire/grain.webp",
    alt: "Deux mains tatouées tiennent une poignée d'orge maltée dorée au-dessus d'un sac ouvert.",
    largeur: 1200,
    hauteur: 1500,
    auteur: "Ryan Cuerden",
  },
  service: {
    src: "/photos/histoire/service.webp",
    alt: "Au comptoir, une main tire une bière à la pression, le verre se remplit sous les becs.",
    largeur: 1400,
    hauteur: 1167,
    auteur: "Louis Hansel",
  },
} as const satisfies Record<string, Photo>;

/**
 * Les auteurs des photos, dans leur ordre d'apparition sur la page, pour le
 * bloc « Photographies » des mentions légales. Toutes viennent d'Unsplash.
 */
export const AUTEURS_PHOTOS: readonly string[] = [
  photos.atelier.auteur,
  photos.vignes.auteur,
  photos.grain.auteur,
  photos.service.auteur,
];
