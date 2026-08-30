import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CarteBiere } from "@/composants/biere/CarteBiere";
import { FicheBiere } from "@/composants/biere/FicheBiere";
import { DonneesStructurees } from "@/composants/ui/DonneesStructurees";
import { Surtitre } from "@/composants/ui/Surtitre";
import { bieres } from "@/donnees/bieres";
import { donneesBiere } from "@/lib/seo";

/**
 * Une page par bière, en génération statique.
 *
 * **L'adresse est figée à vie**, cahier des charges 5.1 : elle ne dépend
 * d'aucun état et ne change pas d'une année sur l'autre. Une fiche de saison
 * reste en ligne hors saison plutôt que d'être supprimée puis recréée, ce qui
 * remettrait son référencement à zéro à chaque cuvée.
 */
export function generateStaticParams() {
  return bieres.map(({ slug }) => ({ slug }));
}

const trouverBiere = (slug: string) => bieres.find((biere) => biere.slug === slug);

export async function generateMetadata({
  params,
}: PageProps<"/nos-bieres/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const biere = trouverBiere(slug);
  if (!biere) return {};

  const description = `${biere.nom}, ${biere.type}, brassée à Vertou par la Brasserie La Bascule.`;

  return {
    title: biere.nom,
    description,
    alternates: { canonical: `/nos-bieres/${biere.slug}` },
    openGraph: { title: biere.nom, description, url: `/nos-bieres/${biere.slug}` },
  };
}

export default async function PageBiere({ params }: PageProps<"/nos-bieres/[slug]">) {
  const { slug } = await params;
  const biere = trouverBiere(slug);
  if (!biere) notFound();

  const autres = bieres.filter(({ slug: autre }) => autre !== biere.slug);

  return (
    <main className="grow">
      <DonneesStructurees donnees={donneesBiere(biere)} />
      <section className="px-marge mx-auto max-w-[1240px] py-[clamp(48px,7vw,96px)]">
        <FicheBiere biere={biere} />
      </section>

      <section className="bg-beton px-marge py-[clamp(48px,7vw,96px)]">
        <div className="mx-auto max-w-[1240px]">
          <Surtitre className="text-papier/55">Le reste de la gamme</Surtitre>
          <h2 className="mt-5 text-[clamp(30px,4vw,46px)]">
            Les autres bières brassées à Vertou
          </h2>
          <div className="border-trait bg-trait mt-11 grid gap-px border sm:grid-cols-2 lg:grid-cols-5">
            {autres.map((autre) => (
              <CarteBiere key={autre.slug} biere={autre} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
