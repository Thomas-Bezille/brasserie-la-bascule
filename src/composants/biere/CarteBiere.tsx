import Image from "next/image";
import Link from "next/link";
import type { Biere } from "@/donnees/bieres";

/**
 * La vignette d'une bière, employée par le bloc « le reste de la gamme » en bas
 * de fiche, et par l'aperçu de la gamme sur l'accueil.
 *
 * Elle porte les deux mêmes états que la fiche : le dessin quand il existe, le
 * nom composé sinon.
 *
 * **La vignette n'a aucune couleur de bière.** Quand le dessin existe, c'est lui
 * qui la porte, et c'est tout : ni le texte, ni les bordures. Une vignette
 * s'affiche sur l'accueil et en bas des fiches voisines, donc hors de la fiche
 * de sa bière, là où la règle de Sophie interdit la couleur.
 */
export function CarteBiere({ biere }: { biere: Biere }) {
  return (
    <Link
      href={`/nos-bieres/${biere.slug}`}
      className="bg-encre hover:bg-beton block px-5 py-7 text-center transition-colors"
    >
      <div className="mb-4 flex h-[100px] items-center justify-center">
        {biere.illustration ? (
          <Image
            src={biere.illustration}
            alt=""
            width={120}
            height={150}
            className="h-full w-auto"
          />
        ) : (
          <span
            className="font-titre text-papier/60 text-[26px] leading-none font-semibold"
            style={{ fontVariationSettings: '"SOFT" 60, "WONK" 1' }}
          >
            {biere.nom}
          </span>
        )}
      </div>
      <b className="font-titre block text-[18px] font-medium">{biere.nom}</b>
      <span className="text-papier/40 text-[13px]">{biere.type}</span>
    </Link>
  );
}
