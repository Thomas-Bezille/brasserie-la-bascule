/**
 * Les données publiées, source unique.
 *
 * Horaires, prix, durées, effectifs, stationnement : ici, et nulle part ailleurs.
 *
 * **Pourquoi cette règle a un fichier à elle.** Ces valeurs avaient été relevées
 * à l'oral au rendez-vous du 02/09/2026 et six d'entre elles étaient fausses ou
 * périmées. Le client les a arrêtées par écrit le 21/09/2026 et elles font foi.
 * Recopiées à deux endroits, la prochaine correction en oubliera une.
 *
 * Les heures et les durées sont stockées en format machine. L'affichage en
 * français et le JSON-LD des moteurs sont deux mises en forme de la même donnée,
 * ils la lisent ici tous les deux plutôt que d'en tenir chacun une version.
 *
 * **La remise de 10 % le jour de la visite ne figure pas dans ce fichier, et ne
 * doit apparaître sur aucune page.** C'est une mention promotionnelle sur une
 * boisson alcoolisée : la loi Evin l'interdit, et le client l'a retirée le
 * 21/09/2026. Elle n'a pas été oubliée, elle est exclue.
 */

/** Heure en 24 h, `"14:30"`. */
export type Heure = string;

export type Creneau = {
  readonly ouverture: Heure;
  readonly fermeture: Heure;
};

export type JourOuverture = {
  readonly jour: string;
  readonly creneaux: readonly Creneau[];
};

export type Formule = {
  readonly nom: string;
  readonly prixParPersonne: number;
  readonly effectifMin: number;
  readonly effectifMax: number;
  readonly dureeMinutes: number;

  /** Ce que la formule comprend, tel que la maquette relue par le client
      l'annonce. La remise de 10 % qui figurait ici n'y est plus : loi Evin,
      correction 10 du 21/09/2026. */
  readonly compris: readonly string[];
  /** Correction 6 de Sophie : la colonne Entreprise passe devant Découverte.
      C'est une décision de présentation, mais elle vient du client, donc elle
      vit dans la donnée et non dans une exception de mise en page. */
  readonly miseEnAvant?: boolean;
};

export const adresse = {
  voie: "12 rue des Vignes",
  codePostal: "44120",
  commune: "Vertou",
} as const;

/**
 * L'adresse `contact@labascule.fr` est créée avec le transfert du domaine, en
 * cours. Elle est donc affichée avant d'être active : le site n'ouvre au public
 * que le 9 octobre, après l'aboutissement du transfert.
 *
 * **Numéro de téléphone, sorti de la fiction le 08/09/2026.** Le cahier des
 * charges fait du téléphone caché un repoussoir cité par le client lui-même, et
 * prévoit un numéro cliquable dans le parcours du particulier — mais dans la
 * fiction, seuls les portables personnels des deux gérants étaient connus, et
 * ce n'était pas au prestataire de décider lequel publier. Pour finir le
 * portfolio, Thomas a choisi un numéro fictif plutôt qu'un blanc permanent :
 * `02 61 91` est l'un des préfixes que l'ARCEP réserve aux œuvres de fiction
 * (article 2.5.12 de sa décision sur le plan de numérotation), donc garanti à
 * vie sans abonné réel derrière, quels que soient les quatre derniers chiffres.
 */
export const contact = {
  email: "contact@labascule.fr",
  telephone: "02 61 91 04 12",
} as const;

export const boutique = {
  /** Correction du 21/09 : le vendredi ferme à 19 h et non 19 h 30, le samedi
      après-midi ouvre à 14 h 30 et non 15 h. */
  horaires: [
    { jour: "vendredi", creneaux: [{ ouverture: "16:00", fermeture: "19:00" }] },
    {
      jour: "samedi",
      creneaux: [
        { ouverture: "10:00", fermeture: "13:00" },
        { ouverture: "14:30", fermeture: "19:00" },
      ],
    },
  ] as readonly JourOuverture[],

  /** Demande n° 9 de Julien : c'est la question qu'on lui pose le plus. À dire
      sur l'accueil et en tête de « Où nous trouver », sans réservation ni visite. */
  ouverteATous: true,
} as const;

export const marche = {
  commune: "Vertou",
  jour: "dimanche",
  moment: "matin",
} as const;

/** Hausse de juin 2026, le malt ayant pris 18 %. Communs à toute la gamme, ils
    sont donc ici et non dans `bieres.ts`. Le tarif professionnel n'apparaît sur
    aucune page. */
export const prixBouteilles = {
  format33cl: 3.5,
  format75cl: 6.9,
} as const;

/** Durée de la formule entreprise corrigée le 21/09 : 2 h 30, jamais tenue en 2 h. */
export const visites: readonly Formule[] = [
  {
    nom: "Visite découverte",
    prixParPersonne: 15,
    effectifMin: 6,
    effectifMax: 10,
    dureeMinutes: 90,
    compris: ["Visite complète de l'atelier", "Dégustation des six bières permanentes"],
  },
  {
    nom: "Visite entreprise",
    prixParPersonne: 25,
    effectifMin: 15,
    effectifMax: 20,
    dureeMinutes: 150,
    compris: [
      "Atelier privatisé",
      "Dégustation commentée par le brasseur",
      "Planche de produits du vignoble",
      "Devis, facture et horaires adaptés",
    ],
    miseEnAvant: true,
  },
];

/**
 * La note Google, vendue au socle : la note et le nombre d'avis sur l'accueil et
 * sur la page Visites, avec un lien vers la fiche. C'est un actif de réassurance
 * sur la page Visites, où le visiteur s'apprête à engager un groupe et une date.
 *
 * **Le chiffre est tenu à la main**, dans le cadre du forfait de maintenance.
 * C'est le niveau simple, retenu par défaut au cahier des charges 5.6, et ce
 * n'est pas une question de budget : la remontée automatique afficherait aussi
 * l'avis à deux étoiles du jour où il arrive.
 *
 * Ces 47 avis sont ceux de la fiche de Vertou. La fiche en doublon de
 * Saint-Sébastien en porte 23 autres, et la fusion demandée les réunira : le
 * chiffre bougera, c'est prévu.
 *
 * `url` reste vide tant que l'adresse de la fiche n'a pas été relevée. Le lien
 * ne s'affiche pas sans elle, plutôt que de pointer dans le vide.
 */
export const avisGoogle = {
  note: 4.8,
  nombre: 47,
  url: undefined as string | undefined,
} as const;

/** 20 places étaient annoncées à tort. Le client préfère en annoncer 12. */
export const stationnement = {
  places: 12,
} as const;
