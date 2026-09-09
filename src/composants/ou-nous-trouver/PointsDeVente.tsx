import { Surtitre } from "@/composants/ui/Surtitre";
import { ouLaBoire, pointsDeVente, type PointDeVente } from "@/donnees/points-de-vente";
import { CartePointsDeVente } from "@/composants/ou-nous-trouver/CartePointsDeVente";

/**
 * Les bars et cavistes partenaires, et le restaurant où boire la Rouquine au
 * verre, avec leur carte.
 *
 * **La liste est arrêtée** (`donnees/points-de-vente.ts`) : d'où elle vient et
 * ce qu'elle doit à Julien y est expliqué. Ici, on ne fait qu'afficher.
 *
 * Une seule couleur de marqueur sur la carte, celle du papier : le site
 * réserve la couleur aux fiches de bière (règle de Sophie), la carte n'en
 * introduit pas une nouvelle. La distinction acheter / boire se lit dans les
 * deux listes, pas sur la carte.
 */
function LignePoint({ point }: { point: PointDeVente }) {
  return (
    <li className="border-trait border-t py-3.5 first:border-t-0">
      <p className="text-[16px] font-medium">{point.nom}</p>
      <p className="text-papier/60 mt-1 text-[14.5px]">
        {point.adresse}, {point.codePostal} {point.commune}
      </p>
      {point.note && <p className="text-papier/45 mt-1 text-[13.5px]">{point.note}</p>}
    </li>
  );
}

export function PointsDeVente() {
  const bars = pointsDeVente.filter((p) => p.categorie === "bar");
  const cavistes = pointsDeVente.filter((p) => p.categorie === "caviste");
  const tousLesPoints = [...pointsDeVente, ...ouLaBoire];

  return (
    <section className="px-marge border-trait border-t py-[clamp(56px,9vw,110px)]">
      <div className="mx-auto max-w-[1240px]">
        <Surtitre className="text-papier/55">Bars et cavistes</Surtitre>
        <h2 className="mt-5 max-w-[22ch] text-[clamp(30px,4.5vw,52px)]">
          Où trouver nos bières ailleurs.
        </h2>
        <p className="text-papier/60 mt-6 max-w-[56ch] text-[19px] leading-[1.55]">
          {pointsDeVente.length} bars et cavistes servent ou vendent nos bières autour de
          Vertou, Nantes et Clisson.
        </p>

        <div className="mt-10 grid gap-[clamp(28px,4vw,56px)] lg:grid-cols-[1fr_1.1fr]">
          <div>
            <CartePointsDeVente points={tousLesPoints} />
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <Surtitre as="h3" className="text-papier/55">
                Où l&apos;acheter · bars
              </Surtitre>
              <ul className="mt-2">
                {bars.map((p) => (
                  <LignePoint key={p.nom} point={p} />
                ))}
              </ul>
            </div>

            <div>
              <Surtitre as="h3" className="text-papier/55">
                Où l&apos;acheter · cavistes
              </Surtitre>
              <ul className="mt-2">
                {cavistes.map((p) => (
                  <LignePoint key={p.nom} point={p} />
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <Surtitre as="h3" className="text-papier/55">
            Où la boire
          </Surtitre>
          <p className="text-papier/60 mt-3 max-w-[54ch] text-[15px] leading-[1.55]">
            Un verre sur place plutôt qu&apos;une bouteille à emporter.
          </p>
          <ul className="mt-2 max-w-[420px]">
            {ouLaBoire.map((p) => (
              <LignePoint key={p.nom} point={p} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
