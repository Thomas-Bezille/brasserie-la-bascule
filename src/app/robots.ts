import type { MetadataRoute } from "next";

/**
 * Tant que le site n'est pas publié, rien n'est indexable.
 * Deuxième barrière après l'en-tête `X-Robots-Tag` posé par le proxy : un
 * robot qui ignorerait l'un devrait aussi ignorer l'autre.
 *
 * Évalué à chaque requête, et non au build. C'est délibéré, et c'est la seule
 * page du site dans ce cas : `SITE_PUBLIE` est lue dans Vercel, où modifier une
 * variable d'environnement ne redéploie rien. Générée au build, cette page
 * continuerait d'interdire l'indexation après l'ouverture du site, jusqu'au
 * prochain déploiement. Un robots.txt qui ment coûte des semaines de
 * référencement, une fonction pour servir deux lignes ne coûte rien.
 */
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_PUBLIE !== "oui") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return { rules: { userAgent: "*", allow: "/" } };
}
