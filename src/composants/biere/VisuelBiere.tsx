import Image from "next/image";
import type { Biere } from "@/donnees/bieres";
import { complementDuNom } from "@/lib/formats";

/**
 * Le visuel d'une fiche, dans ses **deux états**. C'est la correction 3 de
 * Sophie, et la seule qu'elle a demandé à voir fonctionner avant le reste.
 *
 * - **étiquette présente** : l'étiquette de bouteille de Sophie, un PNG au
 *   format portrait, fond ardoise, bord déchiré. Un objet fini qui porte son
 *   propre fond, quasi noir, très proche du fond de la page : **pas de cadre
 *   du tout**. Une boîte crème derrière une étiquette déjà sombre doublait le
 *   contraste et mangeait la place ; posée à même la page, elle se détache
 *   naturellement par son propre déchiré, et peut être bien plus grande
 *   (changement du 04/09, décision Thomas : « ça agresse trop les yeux »).
 * - **étiquette absente** : le **repli typographique**. Le nom en grand dans
 *   Fraunces, à la couleur de la bière, rien d'autre.
 *
 * **Le fond du cadre est décidé par `FicheBiere`** et arrive en `surPapier`,
 * mais **ne vaut plus que pour le repli** : la couleur d'une bière ne se lit
 * que là-bas, ce composant n'a pas à la connaître. Le repli suit le calcul de
 * contraste de `lib/contraste` : trois des sept couleurs n'atteignent pas le
 * seuil de lisibilité sur le gris béton et basculent sur le papier, où elles
 * passent largement. La couleur de Sophie n'est jamais modifiée : c'est le
 * cadre qui s'adapte à la bière.
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
  if (biere.etiquette) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex min-h-[min(60vh,520px)] grow items-center justify-center px-[clamp(12px,3vw,28px)] py-[clamp(16px,3vw,32px)]">
          {/*
            Deux correctifs de l'audit Lighthouse du 08/09/2026, sur les
            vraies étiquettes de Sophie (les précédentes mesures dataient
            d'un visuel provisoire de 991 octets).

            `fetchPriority="high"` : le seul `priority` de Next ne suffisait
            pas, l'image de LCP restait servie en priorité réseau « Low »
            malgré le préchargement. Chrome la traite maintenant en haute
            priorité, ce qui mange directement dans le budget de LCP.

            `aspect-[866/1817]` remplace `h-auto` : combiné à `max-h` dans ce
            conteneur flex, `h-auto` laissait le navigateur découvrir la
            hauteur réelle à l'arrivée de l'image, d'où un CLS de 0,038
            (« Media element lacking an explicit size »). L'aspect-ratio
            explicite, connu dès le HTML, réserve la bonne place tout de
            suite.
          */}
          <Image
            src={biere.etiquette}
            alt={`Étiquette ${complementDuNom(biere.nom)}`}
            width={866}
            height={1817}
            priority
            fetchPriority="high"
            sizes="(min-width: 1024px) 440px, 88vw"
            className="aspect-[866/1817] max-h-[min(84vh,800px)] w-auto"
          />
        </div>
      </div>
    );
  }

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
      </div>
    </div>
  );
}
