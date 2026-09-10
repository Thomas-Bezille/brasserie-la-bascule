import type { MetadataRoute } from "next";
import { bieres } from "@/donnees/bieres";
import { liensLegaux, navigationPrincipale } from "@/donnees/navigation";
import { PORTES_OUVERTES_PUBLIEES } from "@/donnees/portes-ouvertes";
import { URL_SITE } from "@/lib/seo";

/**
 * Le plan du site ne liste que les pages **réellement écrites**, d'où le champ
 * `livree` de la navigation. Une page d'attente proposée à l'indexation est un
 * mauvais signal envoyé à Google et une mauvaise première impression pour qui
 * arrive dessus depuis un résultat de recherche.
 *
 * **L'accueil est ajouté en propre** : il a quitté `navigationPrincipale` avec
 * le retrait de « Accueil » du menu (session 19), mais il reste la page la plus
 * importante à indexer.
 *
 * Les fiches de bières y sont toutes : elles existent, et leur adresse ne
 * changera plus.
 *
 * « Portes ouvertes » n'est pas dans `navigationPrincipale` (hors des pages de
 * la maquette validée, voir `lienPortesOuvertes`) : elle suit son propre
 * interrupteur, `PORTES_OUVERTES_PUBLIEES`, plutôt que `livree`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const accueil = { url: `${URL_SITE}/` };

  const pages = [...navigationPrincipale, ...liensLegaux]
    .filter(({ livree }) => livree)
    .map(({ href }) => ({ url: `${URL_SITE}${href}` }));

  const fiches = bieres.map(({ slug }) => ({ url: `${URL_SITE}/nos-bieres/${slug}` }));

  const portesOuvertes = PORTES_OUVERTES_PUBLIEES
    ? [{ url: `${URL_SITE}/portes-ouvertes` }]
    : [];

  return [accueil, ...pages, ...fiches, ...portesOuvertes];
}
