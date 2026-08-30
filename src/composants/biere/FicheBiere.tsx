import Link from "next/link";
import type { CSSProperties } from "react";
import { EtiquetteEtat } from "@/composants/biere/EtiquetteEtat";
import { SpecsBiere } from "@/composants/biere/SpecsBiere";
import { VisuelBiere } from "@/composants/biere/VisuelBiere";
import { Surtitre } from "@/composants/ui/Surtitre";
import type { Biere } from "@/donnees/bieres";

/**
 * La fiche d'une bière.
 *
 * **C'est le seul endroit du site où une couleur de bière existe**, injectée en
 * variable locale `--biere` sur le conteneur ci-dessous. La règle non
 * négociable de Sophie du 20/09/2026 est ainsi tenue par l'architecture et non
 * par la vigilance : hors de cet article, aucune couleur de bière n'est
 * atteignable, il n'y a rien à discipliner. Le cuivre n'apparaît que sur la page
 * de La Rouquine, le vert que sur celle du Renard, et c'est ce qui permet de
 * reconnaître une bière de la gamme sur une étagère de caviste.
 */
export function FicheBiere({ biere }: { biere: Biere }) {
  return (
    <article style={{ "--biere": biere.couleur } as CSSProperties}>
      <Surtitre className="text-papier/55">
        <Link href="/nos-bieres" className="hover:text-papier">
          Nos bières
        </Link>{" "}
        · {biere.type}
      </Surtitre>

      <div className="mt-8 grid items-start gap-[clamp(30px,5vw,80px)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-[132px]">
          <VisuelBiere biere={biere} />
        </div>

        <div>
          <h1 className="text-[clamp(44px,6.5vw,80px)]">{biere.nom}</h1>
          <EtiquetteEtat etat={biere.etat} />

          {biere.notesDegustation && (
            <p className="text-papier/60 mt-7 max-w-[54ch] text-[19px] leading-[1.55]">
              {biere.notesDegustation}
            </p>
          )}

          <SpecsBiere biere={biere} />

          <p className="mt-9 flex flex-wrap gap-2.5">
            <Link
              href="/ou-nous-trouver"
              className="bg-papier text-encre hover:bg-papier/85 border-papier border px-[22px] py-3 text-[14px] font-medium transition-colors"
            >
              Où l&apos;acheter
            </Link>
            <Link
              href="/visites-et-degustations"
              className="border-papier text-papier hover:bg-papier hover:text-encre border px-[22px] py-3 text-[14px] font-medium transition-colors"
            >
              La goûter sur place
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
