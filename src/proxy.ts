import { NextResponse, type NextRequest } from "next/server";
import { identifiantsCorrects } from "@/lib/authentification-preprod";

/**
 * Protection de la préproduction.
 *
 * La checklist de phase 4 de la méthodologie exige une préproduction en ligne,
 * protégée par mot de passe et en `noindex`. La protection par mot de passe de
 * Vercel étant réservée à son offre payante, elle est faite ici, dans le site.
 *
 * Le site s'ouvre au public le jour où `SITE_PUBLIE` vaut `oui`, et pas avant.
 *
 * Le comportement en l'absence de mot de passe est délibérément fermé : sur
 * Vercel, une variable oubliée renvoie un 503 plutôt que d'ouvrir un site qui
 * se croyait protégé. En local, la protection ne s'applique pas.
 */

// Le realm nomme l'espace protégé, pour les gestionnaires de mots de passe.
// Il ne peut porter aucune consigne : les navigateurs ne l'affichent plus, par
// mesure anti-hameçonnage. Ce qu'il faut dire se dit dans le mail qui
// accompagne l'URL. Sans accent, l'en-tête devant rester en ASCII.
const REALM = 'Basic realm="Preproduction Brasserie La Bascule", charset="UTF-8"';

function sansIndexation(reponse: NextResponse): NextResponse {
  reponse.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return reponse;
}

export function proxy(requete: NextRequest) {
  if (process.env.SITE_PUBLIE === "oui") {
    return NextResponse.next();
  }

  const motDePasse = process.env.MOT_DE_PASSE_PREPROD;

  if (!motDePasse) {
    // En local, on développe sans mot de passe.
    if (!process.env.VERCEL_ENV) {
      return sansIndexation(NextResponse.next());
    }
    // En ligne, l'absence de mot de passe est une erreur de configuration.
    // Fermer vaut mieux qu'ouvrir en silence.
    return sansIndexation(
      new NextResponse(
        "Préproduction non configurée : la variable MOT_DE_PASSE_PREPROD est absente.",
        { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } },
      ),
    );
  }

  if (!identifiantsCorrects(requete.headers.get("authorization"), motDePasse)) {
    return sansIndexation(
      new NextResponse("Accès réservé.", {
        status: 401,
        headers: {
          "WWW-Authenticate": REALM,
          "Content-Type": "text/plain; charset=utf-8",
        },
      }),
    );
  }

  return sansIndexation(NextResponse.next());
}

export const config = {
  // Tout est protégé, y compris les images et les fichiers statiques : une
  // préproduction dont les visuels du client restent accessibles n'est pas
  // protégée. Le navigateur renvoie seul les identifiants sur la même origine.
  matcher: "/:chemin*",
};
