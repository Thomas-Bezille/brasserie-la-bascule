/**
 * Le contenu de la politique de confidentialité, structuré.
 *
 * **Pourquoi une donnée et pas du texte dans la page.** Trois raisons.
 *
 * 1. Les durées de conservation et la base légale sont les mêmes valeurs qu'un
 *    registre des traitements devrait porter : les tenir en un tableau les rend
 *    relisables d'un coup, par le client comme par un juriste.
 * 2. Certains sous-traitants ne sont pas encore arrêtés (`aConfirmer`). Le
 *    marquer dans la donnée, plutôt que dans la tournure d'une phrase, permet à
 *    un test d'empêcher la mise en ligne tant qu'ils portent ce drapeau.
 *    Meetergo l'a porté à tort après son intégration : levé le 09/09/2026.
 *    L'outil de mesure d'audience (Vercel Web Analytics, choisi le 11/09/2026)
 *    n'a jamais eu besoin d'une ligne à lui : il tourne chez l'hébergeur déjà
 *    listé, son rôle est venu s'ajouter à l'entrée Vercel Inc. Reste le service
 *    d'e-mails.
 * 3. Les mentions légales rediront l'hébergeur et le siège : autant lire la même
 *    source.
 *
 * Le texte reste à faire relire par un juriste, comme les CGV : la page n'invente
 * pas de garantie, elle décrit ce que le site fait réellement.
 */

/** Fixée précisément à la mise en ligne du 9 octobre 2026. */
export const derniereMiseAJour = "octobre 2026";

export type Traitement = {
  /** Sert d'ancre : `#reservation`, `#contact`… */
  readonly id: string;
  readonly titre: string;
  /** Ce que le formulaire ou le site collecte, en clair. */
  readonly donnees: string;
  readonly finalite: string;
  readonly baseLegale: string;
  readonly destinataires: string;
  readonly conservation: string;
};

export const traitements: readonly Traitement[] = [
  {
    id: "reservation",
    titre: "Réservation d'une visite",
    donnees:
      "Nom, adresse électronique, téléphone, nombre de participants, et si vous les renseignez le nom de votre entreprise et un message. Ce formulaire sert aussi aux demandes liées aux portes ouvertes.",
    finalite:
      "Traiter votre demande, organiser la visite, vous joindre à son sujet et vous envoyer une confirmation.",
    baseLegale:
      "L'exécution de mesures précontractuelles prises à votre demande, puis l'exécution de la prestation (article 6.1.b du RGPD). Ces informations sont nécessaires : sans elles, la réservation ne peut pas être traitée. Il n'y a donc pas de case de consentement à cocher, elle laisserait croire à un choix qui n'existe pas.",
    destinataires:
      "Les gérants de la Brasserie La Bascule, le prestataire d'agenda qui enregistre les créneaux, et le service qui achemine les courriers électroniques.",
    conservation:
      "13 mois après la date de la visite, puis suppression. Les pièces comptables d'une visite facturée sont conservées selon les durées légales applicables.",
  },
  {
    id: "contact",
    titre: "Formulaire de contact",
    donnees:
      "Nom, adresse électronique et message, et si vous les renseignez votre téléphone, le nom de votre entreprise et le motif de votre demande.",
    finalite: "Répondre à votre demande.",
    baseLegale:
      "L'intérêt légitime de la brasserie à répondre aux personnes qui la sollicitent (article 6.1.f du RGPD).",
    destinataires:
      "Les gérants de la Brasserie La Bascule et le service qui achemine les courriers électroniques.",
    conservation: "12 mois après le dernier échange, puis suppression.",
  },
  {
    id: "audience",
    titre: "Mesure d'audience",
    donnees:
      "Des statistiques agrégées et anonymes : nombre de pages vues, pages les plus consultées, type d'appareil, pays, site d'origine. Elles ne permettent pas de vous identifier.",
    finalite: "Comprendre comment le site est utilisé pour l'améliorer.",
    baseLegale:
      "L'intérêt légitime de la brasserie à mesurer l'audience de son site (article 6.1.f du RGPD). Réalisée sans traceur et sans donnée identifiante, cette mesure est exemptée de consentement conformément aux recommandations de la CNIL.",
    destinataires:
      "Les gérants de la Brasserie La Bascule et l'outil de mesure d'audience.",
    conservation: "25 mois au maximum.",
  },
  {
    id: "journaux",
    titre: "Journaux techniques",
    donnees:
      "Des journaux de connexion produits par l'hébergement : adresse IP, date et heure, page demandée.",
    finalite: "Assurer la sécurité du site et diagnostiquer les incidents.",
    baseLegale:
      "L'intérêt légitime de la brasserie à sécuriser son site (article 6.1.f du RGPD).",
    destinataires:
      "L'hébergeur du site et, en cas d'incident, les gérants de la brasserie.",
    conservation: "6 mois.",
  },
];

export type SousTraitant = {
  readonly nom: string;
  readonly role: string;
  readonly hebergement: string;
  /**
   * Vrai tant que le prestataire n'est pas arrêté. La page affiche « (à
   * confirmer) », et `politique-confidentialite.test.ts` interdit de mettre le
   * site en ligne tant qu'un de ces drapeaux subsiste.
   */
  readonly aConfirmer?: boolean;
};

export const sousTraitants: readonly SousTraitant[] = [
  {
    nom: "Vercel Inc.",
    role: "Hébergement du site et mesure d'audience sans cookie (Vercel Web Analytics)",
    hebergement:
      "États-Unis, avec un encadrement par les clauses contractuelles types de la Commission européenne",
  },
  {
    nom: "meetergo GmbH",
    role: "Agenda et enregistrement des réservations",
    hebergement: "Allemagne",
  },
  {
    nom: "Service d'acheminement des courriers électroniques",
    role: "Transmission des demandes vers la brasserie",
    hebergement: "Union européenne",
    aConfirmer: true,
  },
];

/** Les six droits de la personne concernée, formulés pour la phrase de la page. */
export const droits = [
  "d'accès",
  "de rectification",
  "d'effacement",
  "de limitation du traitement",
  "d'opposition",
  "de portabilité",
] as const;

export const cnil = {
  nom: "Commission nationale de l'informatique et des libertés (CNIL)",
  adresse: "3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07",
  site: "www.cnil.fr",
} as const;
