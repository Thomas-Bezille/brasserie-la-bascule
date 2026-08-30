import Link from "next/link";
import { Surtitre } from "@/composants/ui/Surtitre";
import { visites } from "@/donnees/infos-pratiques";
import { formaterDuree, formaterPrix } from "@/lib/formats";

/**
 * L'appel vers les visites, objectif n° 1 du site.
 *
 * Deux à trois demandes de visite par mois se perdaient faute de réponse : c'est
 * le problème économique que le projet vient résoudre, et non un bloc de
 * présentation parmi d'autres.
 *
 * Les prix, les effectifs et les durées viennent de la source unique. La durée
 * de la formule entreprise y est passée à 2 h 30, la maquette annonçait 2 h,
 * qui n'ont jamais été tenues.
 *
 * **Ce que ce bloc n'écrit pas :** la remise de 10 % le jour de la visite, que
 * la maquette affichait ici même. Elle est retirée du site depuis le 21/09, la
 * loi Evin interdisant toute mention promotionnelle sur une boisson alcoolisée.
 * `src/lib/loi-evin.test.ts` en interdit le retour.
 */
export function BlocVisites() {
  return (
    <section className="bg-beton border-trait px-marge border-t py-[clamp(56px,9vw,120px)]">
      <div className="mx-auto grid max-w-[1240px] items-center gap-[clamp(30px,5vw,90px)] lg:grid-cols-2">
        <div>
          <Surtitre className="text-papier/40">Ce qu&apos;on fait le mieux</Surtitre>
          <h2 className="mt-5 text-[clamp(32px,5vw,58px)]">
            Venez voir
            <br />
            comment c&apos;est fait.
          </h2>
          <p className="text-papier/60 mt-7 max-w-[46ch] text-[19px] leading-[1.55]">
            Une heure trente dans l&apos;atelier, du grain concassé à la bouteille, avec
            Marc qui explique et une dégustation de la gamme à la fin.
          </p>
          <p className="text-papier/60 mt-5 max-w-[46ch]">
            Pour un groupe d&apos;amis, un anniversaire, ou pour vos équipes. Nous
            recevons de six à vingt personnes, en semaine comme le samedi.
          </p>
          <p className="mt-8">
            <Link
              href="/visites-et-degustations"
              className="bg-papier text-encre hover:bg-papier/85 border-papier inline-block border px-[22px] py-3 text-[14px] font-medium transition-colors"
            >
              Voir les créneaux disponibles
            </Link>
          </p>
        </div>

        <div className="border-trait bg-trait grid gap-px border sm:grid-cols-2">
          {visites.map((formule) => (
            <div key={formule.nom} className="bg-encre p-[clamp(24px,3vw,40px)]">
              <Surtitre className="text-papier/40">{formule.nom}</Surtitre>
              <p className="font-titre mt-4 text-[clamp(38px,4.6vw,58px)] leading-none">
                {formaterPrix(formule.prixParPersonne)}
                <small className="font-texte text-papier/40 text-[15px]">
                  {" "}
                  / personne
                </small>
              </p>
              <p className="text-papier/60 mt-3 text-[14.5px]">
                De {formule.effectifMin} à {formule.effectifMax} personnes
              </p>
              <p className="border-trait text-papier/60 mt-5 border-t pt-4 text-[15px]">
                Visite de l&apos;atelier, {formaterDuree(formule.dureeMinutes)},
                dégustation comprise.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
