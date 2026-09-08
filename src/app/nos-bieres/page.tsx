import type { Metadata } from "next";
import { CarteBiere } from "@/composants/biere/CarteBiere";
import { Surtitre } from "@/composants/ui/Surtitre";
import { bieres } from "@/donnees/bieres";

/**
 * La page « Nos bières », la gamme au complet.
 *
 * Mêmes vignettes `CarteBiere` que l'aperçu de l'accueil et le bas de fiche :
 * un seul composant pour les trois emplacements, donc aucune couleur de bière
 * à discipliner ici non plus (règle de Sophie, voir `FicheBiere`).
 */
export const metadata: Metadata = {
  title: "Nos bières",
  description:
    "Six bières permanentes et celle de la saison, brassées à Vertou par la Brasserie La Bascule : ambrée, IPA, blonde au miel, blanche, stout, triple.",
  alternates: { canonical: "/nos-bieres" },
};

export default function Page() {
  return (
    <main className="grow">
      <section className="px-marge py-[clamp(48px,7vw,96px)]">
        <div className="mx-auto max-w-[1240px]">
          <Surtitre className="text-papier/55">Nos bières</Surtitre>
          <h1 className="mt-5 text-[clamp(40px,6.5vw,80px)]">
            Six permanentes,
            <br />
            et celle de la saison.
          </h1>
          <p className="text-papier/60 mt-7 max-w-[52ch] text-[19px] leading-[1.55]">
            Chaque bière a son animal, dessiné par Sophie, et sa propre étiquette. Toutes
            sont brassées à Vertou, disponibles à la boutique et chez nos partenaires.
          </p>

          <div className="border-trait bg-trait mt-12 grid gap-px border sm:grid-cols-2 lg:grid-cols-3">
            {bieres.map((biere) => (
              <CarteBiere key={biere.slug} biere={biere} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
