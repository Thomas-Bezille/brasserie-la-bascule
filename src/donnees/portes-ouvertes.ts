import type { Creneau } from "@/donnees/infos-pratiques";

/**
 * Les portes ouvertes des 24 et 25 octobre 2026, avenant n° 1
 * (`AV-2026-002-01`, 350 €).
 *
 * Contenu fourni par Julien, fil client § 31 (30/09/2026) : programme, horaires,
 * food-truck le samedi, marché le dimanche comme d'habitude, entrée libre.
 * Sophie fait les visuels et l'affiche, pas encore livrés : la page s'écrit sans
 * eux, même principe que le repli typographique d'une fiche de bière. Aucune
 * couleur de bière n'apparaît ici, CDC 5.1.
 *
 * **Pas de second formulaire** (avenant n° 1, exclusions) : « J'annonce ma
 * venue » renvoie vers le formulaire de contact existant, dont le motif
 * « Portes ouvertes » est déjà proposé (`lib/contact/types.ts`).
 */

export type JourPortesOuvertes = {
  /** `AAAA-MM-JJ`, pour l'affichage calculé et les données structurées `Event`. */
  readonly date: string;
  readonly jour: string;
  readonly creneau: Creneau;
  readonly specifique: string;
};

export const joursPortesOuvertes: readonly JourPortesOuvertes[] = [
  {
    date: "2026-10-24",
    jour: "Samedi 24 octobre",
    creneau: { ouverture: "10:00", fermeture: "19:00" },
    specifique: "Food-truck sur place, le midi",
  },
  {
    date: "2026-10-25",
    jour: "Dimanche 25 octobre",
    creneau: { ouverture: "10:00", fermeture: "19:00" },
    specifique: "Marché de Vertou devant l'atelier, comme chaque dimanche",
  },
];

/** Commun aux deux jours. */
export const programmeCommun = [
  "Visites de l'atelier, toutes les heures",
  "Dégustation du Sanglier, notre bière d'automne aux châtaignes",
] as const;

/**
 * Passe à `true` quand Thomas décide de publier : visuels de Sophie reçus, ou
 * décision assumée de les publier sans eux avant l'échéance du 16/10 (avenant
 * n° 1, § 5). Gate uniquement le bandeau d'accueil : la page elle-même existe
 * et fonctionne, comme « Où nous trouver » avant sa publication.
 */
export const PORTES_OUVERTES_PUBLIEES = false;
