import Link from "next/link";
import { Surtitre } from "@/composants/ui/Surtitre";
import { PORTES_OUVERTES_PUBLIEES } from "@/donnees/portes-ouvertes";

/**
 * Le bandeau d'accueil qui renvoie vers la page « Portes ouvertes ».
 *
 * **Publié sans les visuels de Sophie, décision de Thomas (session 15).**
 * Toujours pas livrés (avenant n° 1), mais l'échéance du 16/10 approchait :
 * le bandeau tourne sur son texte en attendant, et se complétera de lui-même
 * quand ils arriveront, sans reprise. `PORTES_OUVERTES_PUBLIEES` porte cette
 * décision.
 *
 * `publie` est une entrée pour que le test voie les deux états sans toucher à
 * la constante, même parti pris que `Coffrets`.
 */
export function BandeauPortesOuvertes({
  publie = PORTES_OUVERTES_PUBLIEES,
}: {
  publie?: boolean;
}) {
  if (!publie) return null;

  return (
    <section className="border-trait px-marge border-t py-[clamp(40px,6vw,64px)]">
      <div className="border-trait mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 border p-[clamp(24px,4vw,40px)]">
        <div>
          <Surtitre className="text-papier/55">24 et 25 octobre</Surtitre>
          <p className="font-titre mt-3 text-[clamp(22px,3vw,32px)] leading-tight font-semibold">
            Portes ouvertes à l&apos;atelier.
          </p>
          <p className="text-papier/60 mt-2 max-w-[52ch]">
            Visites toutes les heures, dégustation du Sanglier en avant-première. Entrée
            libre.
          </p>
        </div>
        <Link
          href="/portes-ouvertes"
          className="border-papier text-papier hover:bg-papier hover:text-encre shrink-0 border px-[22px] py-3 text-[14px] font-medium transition-colors"
        >
          Le programme
        </Link>
      </div>
    </section>
  );
}
