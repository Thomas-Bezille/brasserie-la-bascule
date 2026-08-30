import type { MetadataRoute } from "next";
import { bieres } from "@/donnees/bieres";
import { liensLegaux, navigationPrincipale } from "@/donnees/navigation";
import { URL_SITE } from "@/lib/seo";

/**
 * Le plan du site ne liste que les pages **réellement écrites**, d'où le champ
 * `livree` de la navigation. Une page d'attente proposée à l'indexation est un
 * mauvais signal envoyé à Google et une mauvaise première impression pour qui
 * arrive dessus depuis un résultat de recherche.
 *
 * Les fiches de bières y sont toutes : elles existent, et leur adresse ne
 * changera plus.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [...navigationPrincipale, ...liensLegaux]
    .filter(({ livree }) => livree)
    .map(({ href }) => ({ url: `${URL_SITE}${href}` }));

  const fiches = bieres.map(({ slug }) => ({ url: `${URL_SITE}/nos-bieres/${slug}` }));

  return [...pages, ...fiches];
}
