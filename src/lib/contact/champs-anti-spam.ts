/**
 * Noms des deux champs cachés de l'anti-spam.
 *
 * Isolés dans ce module sans dépendance pour que le formulaire client
 * (`composants/contact/FormulaireContact.tsx`) les lise sans embarquer
 * `anti-spam.ts`, qui tire `node:crypto`. La logique de vérification, elle,
 * reste côté serveur.
 */

/** Champ appât : plausible pour un robot, inconnu du remplissage automatique
    des navigateurs (pas un nom de champ standard). Un humain ne le remplit pas. */
export const CHAMP_APPAT = "site_web";

/** Champ caché qui porte le jeton horodaté et signé. */
export const CHAMP_JETON = "jeton";
