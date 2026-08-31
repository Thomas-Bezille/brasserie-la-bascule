import type { Formule } from "@/donnees/infos-pratiques";
import { formaterDuree, formaterPrix } from "@/lib/formats";

/**
 * Une formule de visite.
 *
 * **Correction 6 de Sophie :** la formule entreprise passe devant. Elle est mise
 * en avant par le fond et le trait, pas par une couleur d'accent, qui n'existe
 * plus depuis sa correction 1.
 *
 * Prix, effectifs et durées viennent tous de la source unique, jamais du
 * gabarit : ce sont des valeurs vérifiées par le client le 21/09/2026, et six
 * d'entre elles s'étaient révélées fausses ce jour-là.
 */
export function FormuleVisite({ formule }: { formule: Formule }) {
  const cadre = formule.miseEnAvant ? "bg-beton border-papier/25" : "border-trait";

  return (
    <article className={`${cadre} border p-[clamp(24px,3.5vw,40px)]`}>
      <h3 className="font-titre text-[clamp(24px,3vw,32px)] leading-tight font-semibold">
        {formule.nom}
      </h3>

      <p className="mt-4 text-[26px]">
        {formaterPrix(formule.prixParPersonne)}{" "}
        <span className="text-papier/60 text-[16px]">par personne</span>
      </p>

      <p className="text-papier/60 mt-2 text-[15px]">
        De {formule.effectifMin} à {formule.effectifMax} personnes ·{" "}
        {formaterDuree(formule.dureeMinutes)}
      </p>

      <ul className="mt-6 space-y-2.5 text-[16px] leading-[1.5]">
        {formule.compris.map((ligne) => (
          <li
            key={ligne}
            className="border-trait border-t pt-2.5 first:border-t-0 first:pt-0"
          >
            {ligne}
          </li>
        ))}
      </ul>
    </article>
  );
}
