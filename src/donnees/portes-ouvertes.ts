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
 * **Publié sans les visuels de Sophie, décision de Thomas.** Pas encore
 * livrés, mais l'échéance de l'avenant n° 1 (§ 5) approche, et le repli
 * typographique du Sanglier tient exactement ce cas : le bandeau se remplace
 * de lui-même quand ils arrivent, rien à refaire ici.
 */
export const PORTES_OUVERTES_PUBLIEES = true;
