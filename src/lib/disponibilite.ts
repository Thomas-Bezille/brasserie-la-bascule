import type { EtatBiere } from "@/donnees/bieres";

/**
 * Les quatre états publiables d'une bière, cahier des charges 5.1.
 *
 * Chaque état s'écrit de deux façons : l'`etiquette` sous le titre de la fiche,
 * qui s'adresse au lecteur, et la `ligne` du tableau technique, qui nomme la
 * donnée. Les deux formulations sont réunies ici pour qu'on ne puisse pas
 * corriger l'une en oubliant l'autre.
 */
export const DISPONIBILITE: Record<EtatBiere, { etiquette: string; ligne: string }> = {
  permanente: { etiquette: "Disponible toute l'année", ligne: "Permanente" },
  disponible: { etiquette: "Disponible", ligne: "De saison, en vente" },
  "retour-printemps": {
    etiquette: "De retour au printemps",
    ligne: "De saison, de retour au printemps",
  },
  terminee: { etiquette: "Cuvée terminée", ligne: "De saison, cuvée terminée" },
};
