/**
 * Les trois coffrets, fournis par Julien le 30/09/2026 (fil client § 31).
 *
 * **Publication avancée le 09/09/2026.** CDC v1.2, correction 12 prévoyait un
 * différé à fin octobre, calé sur la mise en vente réelle des coffrets pour les
 * portes ouvertes. Décision de Thomas, même logique que le reste des sorties de
 * fiction de la session 18 : dans un projet fictif joué en solo, il n'y a pas de
 * vraie mise en vente à attendre, `COFFRETS_PUBLIES` passe donc à `true`
 * directement plutôt que d'attendre une date qui ne change plus rien.
 *
 * Les prix sont en euros entiers, tels qu'annoncés. Le tarif professionnel
 * n'apparaît sur aucune page.
 *
 * « offert » qualifie le travail de développement, pas les coffrets : le mot ne
 * doit apparaître nulle part sur la page, la loi Evin interdit toute mention
 * promotionnelle et la recette la refuse.
 */

export const COFFRETS_PUBLIES = true;

export type Coffret = {
  readonly nom: string;
  readonly contenu: string;
  readonly prixEuros: number;
};

export const coffrets: readonly Coffret[] = [
  { nom: "Le Trio", contenu: "Trois bières de 33 cl", prixEuros: 14 },
  {
    nom: "La Planche",
    contenu: "Six bières de 33 cl et un verre sérigraphié",
    prixEuros: 28,
  },
  {
    nom: "Le Grand Format",
    contenu: "Deux bouteilles de 75 cl dans un coffret bois",
    prixEuros: 22,
  },
];
