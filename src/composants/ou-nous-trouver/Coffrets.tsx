import { Surtitre } from "@/composants/ui/Surtitre";
import { COFFRETS_PUBLIES, coffrets } from "@/donnees/coffrets";
import { formaterPrix } from "@/lib/formats";

/**
 * Le bloc « Nos coffrets ».
 *
 * **Il ne s'affiche pas avant fin octobre.** Les coffrets sortent pour les
 * portes ouvertes, la publication est différée (CDC v1.2, correction 12). Le
 * contenu est prêt, il attend `COFFRETS_PUBLIES`.
 *
 * `publies` est une entrée pour que le test puisse voir les deux états sans
 * toucher à la constante ; en vrai la page ne passe rien et c'est la constante
 * qui décide.
 */
export function Coffrets({ publies = COFFRETS_PUBLIES }: { publies?: boolean }) {
  if (!publies) return null;

  return (
    <section className="px-marge border-trait border-t py-[clamp(56px,9vw,110px)]">
      <div className="mx-auto max-w-[1240px]">
        <Surtitre className="text-papier/55">Nos coffrets</Surtitre>
        <h2 className="mt-5 max-w-[20ch] text-[clamp(30px,4.5vw,52px)]">
          À offrir ou à emporter.
        </h2>
        <p className="text-papier/60 mt-6 max-w-[54ch] text-[19px] leading-[1.55]">
          En vente à la boutique et pendant les portes ouvertes.
        </p>

        <div className="mt-10 grid gap-[clamp(20px,3vw,36px)] sm:grid-cols-3">
          {coffrets.map((coffret) => (
            <article
              key={coffret.nom}
              className="border-trait border p-[clamp(24px,3.5vw,40px)]"
            >
              <h3 className="font-titre text-[clamp(22px,2.6vw,30px)] leading-tight font-semibold">
                {coffret.nom}
              </h3>
              <p className="text-papier/60 mt-4 max-w-[28ch] leading-[1.5]">
                {coffret.contenu}
              </p>
              <p className="mt-6 text-[22px]">{formaterPrix(coffret.prixEuros)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
