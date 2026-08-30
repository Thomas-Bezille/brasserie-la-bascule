import Image from "next/image";
import type { Biere } from "@/donnees/bieres";
import { complementDuNom } from "@/lib/formats";

/**
 * Le visuel d'une fiche, dans ses **deux états**. C'est la correction 3 de
 * Sophie, et la seule qu'elle a demandé à voir fonctionner avant le reste.
 *
 * - **illustration présente** : le dessin, à taille normale ou réduite selon la
 *   donnée. La Carpe et Le Corbeau sont des scans de 2022 qui montrent le grain
 *   du papier au-delà d'une vingtaine de centimètres.
 * - **illustration absente** : le **repli typographique**. Le nom en grand dans
 *   Fraunces, à la couleur de la bière, rien d'autre.
 *
 * Le repli n'est pas un pis-aller d'attente, c'est un état permanent du site.
 * Une étiquette demande quinze à vingt heures à Sophie, qui dessine le week-end,
 * quand une bière de saison se décide trois semaines avant sa sortie. Sans lui,
 * l'autrice de l'identité deviendrait le point de blocage de chaque mise en
 * ligne. « Prévoyez-le maintenant, pas en mars. »
 */
export function VisuelBiere({ biere }: { biere: Biere }) {
  const hauteur = biere.tailleVisuel === "reduite" ? "max-h-[240px]" : "max-h-[340px]";

  return (
    <div>
      <div className="bg-beton border-trait flex min-h-[min(60vh,520px)] items-center justify-center border p-[clamp(30px,5vw,64px)]">
        {biere.illustration ? (
          <Image
            src={biere.illustration}
            alt={`Étiquette ${complementDuNom(biere.nom)}`}
            width={400}
            height={400}
            priority
            className={`${hauteur} h-auto w-auto`}
          />
        ) : (
          <p
            className="font-titre text-center text-[clamp(40px,7vw,72px)] leading-[1.05] font-semibold"
            style={{
              color: "var(--biere)",
              fontVariationSettings: '"SOFT" 60, "WONK" 1',
            }}
          >
            {biere.nom}
          </p>
        )}
      </div>

      {biere.illustrationProvisoire && (
        <p className="text-papier/40 mt-3.5 text-right text-[13px] italic">
          Illustration provisoire, à remplacer par l&apos;étiquette de Sophie
        </p>
      )}
    </div>
  );
}
