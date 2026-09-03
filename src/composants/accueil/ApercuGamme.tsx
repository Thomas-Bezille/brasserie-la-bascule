import { CarteBiere } from "@/composants/biere/CarteBiere";
import { Surtitre } from "@/composants/ui/Surtitre";
import { bieres } from "@/donnees/bieres";

/**
 * L'aperçu de la gamme. Mêmes vignettes qu'en bas de fiche, un seul composant
 * `CarteBiere` pour les deux emplacements : chacune porte l'animal de Sophie,
 * ce que dit déjà le paragraphe ci-dessous.
 *
 * Aucune couleur de bière n'apparaît ici. Quand l'animal existe, c'est le
 * dessin qui la porte ; le texte reste au crème.
 */
export function ApercuGamme() {
  return (
    <section className="px-marge py-[clamp(56px,9vw,120px)]">
      <div className="mx-auto max-w-[1240px]">
        <Surtitre className="text-papier/55">La gamme</Surtitre>
        <h2 className="mt-5 text-[clamp(32px,5vw,58px)]">
          Six permanentes,
          <br />
          et celle de la saison.
        </h2>
        <p className="text-papier/60 mt-7 max-w-[52ch] text-[19px] leading-[1.55]">
          Chaque bière a son animal, dessiné par Sophie. C&apos;est à ça qu&apos;on nous
          reconnaît sur une étagère de caviste.
        </p>

        <div className="border-trait bg-trait mt-12 grid gap-px border sm:grid-cols-2 lg:grid-cols-3">
          {bieres.map((biere) => (
            <CarteBiere key={biere.slug} biere={biere} />
          ))}
        </div>
      </div>
    </section>
  );
}
