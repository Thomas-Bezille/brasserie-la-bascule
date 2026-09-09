import { horairesDeVisite, visites } from "@/donnees/infos-pratiques";
import type { Creneau } from "@/lib/reservation/types";

/**
 * Le filtre qui réduit n'importe quel agenda aux seuls horaires de visite
 * arrêtés dans `donnees/infos-pratiques.ts`.
 *
 * Appliqué une fois, dans `agenda.ts`, à tous les fournisseurs : aucun agenda
 * ne sait plus, par lui-même, quels jours et heures sont ouverts à la visite.
 * Meetergo en particulier reste réglé sur un créneau toutes les 15 min
 * (décision de session 17 de ne plus y toucher) — c'est ce filtre, pas la
 * configuration du fournisseur, qui réduit sa grille fine aux quatre créneaux
 * publiés.
 *
 * Toujours lu à l'heure de Vertou (Europe/Paris), jamais celle du serveur qui
 * exécute ce code : Vercel tourne en UTC.
 */

const FUSEAU = "Europe/Paris";

const FORMATTEUR_JOUR = new Intl.DateTimeFormat("fr-FR", {
  timeZone: FUSEAU,
  weekday: "long",
});

const FORMATTEUR_HEURE = new Intl.DateTimeFormat("fr-FR", {
  timeZone: FUSEAU,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Le jour (`"vendredi"`) et l'heure (`"16:30"`) d'un instant ISO, à Vertou. */
export function jourEtHeureAVertou(iso: string): { jour: string; heure: string } {
  const date = new Date(iso);
  return { jour: FORMATTEUR_JOUR.format(date), heure: FORMATTEUR_HEURE.format(date) };
}

/** Un instant ISO tombe-t-il sur un couple jour/heure publié ? */
export function estUnCreneauOuvert(iso: string): boolean {
  const { jour, heure } = jourEtHeureAVertou(iso);
  return horairesDeVisite.some((h) => h.jour === jour && h.heure === heure);
}

/**
 * Réduit les créneaux d'une formule à ceux ouverts, et plafonne les places
 * restantes à la jauge de la formule : un agenda qui en propose davantage — un
 * mauvais réglage de `spots` chez le fournisseur, par exemple — n'affiche
 * jamais plus que ce que le cahier des charges vend.
 */
export function filtrerSurLesHorairesDeVisite(
  creneaux: readonly Creneau[],
  formule: string,
): readonly Creneau[] {
  const jauge = visites.find((f) => f.nom === formule)?.effectifMax;
  return creneaux
    .filter((c) => estUnCreneauOuvert(c.debut))
    .map((c) =>
      jauge !== undefined
        ? { ...c, placesRestantes: Math.min(c.placesRestantes, jauge) }
        : c,
    );
}
