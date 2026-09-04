/**
 * Le lettrage manuscrit de Sophie n'est pas encore livré : son SVG fait partie
 * des fichiers web attendus le 28/09. En attendant, le logo est composé en
 * Fraunces, avec les axes qui s'en approchent le plus. C'est le même principe
 * que le repli typographique des fiches de bière : la page existe sans le
 * dessin, et le dessin la remplace sans que rien ne soit refait.
 */
export function Logo({ taille = 23 }: { taille?: number }) {
  return (
    <span className="font-titre block leading-none font-semibold tracking-[-0.01em]">
      <span
        className="whitespace-nowrap"
        style={{ fontSize: `${taille}px`, fontVariationSettings: '"SOFT" 60, "WONK" 1' }}
      >
        La Bascule
      </span>
      {/*
        Espacement des majuscules divisé par deux, correction 7 de Sophie.
        Pas de `whitespace-nowrap` ici : sur les téléphones les plus étroits,
        avec le bouton de réservation et le menu à côté dans l'en-tête, la
        ligne forcée poussait le en-tête plus large que l'écran et provoquait
        un défilement horizontal sur toute la page.
      */}
      <span className="text-papier/55 font-texte mt-[5px] block text-[9.5px] font-medium tracking-[0.16em] uppercase">
        Brasserie artisanale · Vertou
      </span>
    </span>
  );
}
