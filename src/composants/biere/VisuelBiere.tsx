import Image from "next/image";
import type { Biere } from "@/donnees/bieres";
import { complementDuNom } from "@/lib/formats";

/**
 * Le visuel d'une fiche, dans ses **deux états**. C'est la correction 3 de
 * Sophie, et la seule qu'elle a demandé à voir fonctionner avant le reste.
 *
 * - **illustration présente** : l'étiquette de Sophie, un PNG détouré carré.
 * - **illustration absente** : le **repli typographique**. Le nom en grand dans
 *   Fraunces, à la couleur de la bière, rien d'autre.
 *
 * **Le fond du cadre suit la bière quand elle est en repli** (31/08/2026). Trois
 * des sept couleurs n'atteignent pas le seuil de lisibilité sur le gris béton :
 * Le Corbeau y est à 1,25:1. Elles basculent sur le papier, où elles passent
 * largement, plutôt que d'être retouchées. Le calcul est dans `lib/contraste`,
 * la couleur de Sophie n'est pas modifiée d'un octet, et sa règle du 20/09 tient
 * toujours : c'est le cadre qui s'adapte à la bière, jamais l'inverse.
 *
 * Le fond ne change que dans l'état de repli. Une illustration n'a pas de
 * problème de contraste, et le cadre validé en maquette reste le sien.
 *
 * Le choix arrive en `surPapier`, décidé par `FicheBiere` : la couleur d'une
 * bière ne se lit que là-bas, et ce composant n'a pas à la connaître.
 *
 * Le repli n'est pas un pis-aller d'attente, c'est un état permanent du site.
 * Une étiquette demande quinze à vingt heures à Sophie, qui dessine le week-end,
 * quand une bière de saison se décide trois semaines avant sa sortie. Sans lui,
 * l'autrice de l'identité deviendrait le point de blocage de chaque mise en
 * ligne. « Prévoyez-le maintenant, pas en mars. »
 */
export function VisuelBiere({
  biere,
  surPapier = false,
}: {
  biere: Biere;
  surPapier?: boolean;
}) {
  /**
   * **Correction de Sophie du 27/09 :** sur le papier, pas de trait, et le fond
   * descend jusqu'en bas du bloc. Un rectangle clair cerné d'un trait au milieu
   * d'une page sombre « ressemble à une erreur de chargement » ; le même aplat,
   * pleine hauteur et sans bordure, se lit comme un panneau voulu.
   */
  const cadre = surPapier ? "bg-papier" : "bg-beton border-trait border";

  return (
    <div className="flex h-full flex-col">
      <div
        className={`${cadre} flex min-h-[min(60vh,520px)] grow items-center justify-center px-[clamp(34px,9vw,64px)] py-[clamp(30px,5vw,64px)]`}
      >
        {biere.illustration ? (
          <Image
            src={biere.illustration}
            alt={`Étiquette ${complementDuNom(biere.nom)}`}
            width={1200}
            height={1200}
            priority
            sizes="(min-width: 1024px) 520px, 60vw"
            className="h-auto max-h-[340px] w-auto"
          />
        ) : (
          <p
            /* Le nom respire autant sur téléphone qu'en grand écran, seconde
               correction de Sophie du 27/09 : « Le Corbeau », le mot le plus
               long de la gamme, touchait presque le bord. La marge horizontale
               du cadre monte à 9vw et la taille du nom part de plus bas. */
            className="font-titre text-center text-[clamp(34px,6.4vw,72px)] leading-[1.05] font-semibold text-balance"
            style={{
              color: "var(--biere)",
              fontVariationSettings: '"SOFT" 60, "WONK" 1',
            }}
          >
            {biere.nom}
          </p>
        )}
      </div>
    </div>
  );
}
