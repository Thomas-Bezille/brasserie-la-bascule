/**
 * Les trois coffrets, fournis par Julien le 30/09/2026 (fil client § 31).
 *
 * **Publication différée à fin octobre.** CDC v1.2, correction 12 : le bloc
 * « Nos coffrets » est offert et publié fin octobre, les coffrets sortant pour
 * les portes ouvertes des 24 et 25. `COFFRETS_PUBLIES` reste à `false` jusque-là,
 * la section ne s'affiche pas et n'entre pas dans le plan du site.
 *
 * Les prix sont en euros entiers, tels qu'annoncés. Le tarif professionnel
 * n'apparaît sur aucune page.
 *
 * « offert » qualifie le travail de développement, pas les coffrets : le mot ne
 * doit apparaître nulle part sur la page, la loi Evin interdit toute mention
 * promotionnelle et la recette la refuse.
 */

/** À passer à `true` fin octobre, avec la mise en vente des coffrets. */
export const COFFRETS_PUBLIES = false;

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
