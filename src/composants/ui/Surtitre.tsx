import type { ElementType, ReactNode } from "react";

/**
 * Les petites majuscules espacées de la charte.
 *
 * Leur interlettrage a été **divisé par deux** le 20/09 : c'est la correction 7
 * de Sophie, qui trouvait la maquette trop écartée. Le réglage vit ici et nulle
 * part ailleurs, pour qu'il n'y ait qu'un endroit à changer si elle revient
 * dessus.
 */
export function Surtitre({
  as: Balise = "p",
  children,
  className = "",
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Balise
      className={`font-texte text-[11.5px] font-medium tracking-[0.11em] uppercase ${className}`}
    >
      {children}
    </Balise>
  );
}
