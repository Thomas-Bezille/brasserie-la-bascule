import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DonneesStructurees } from "@/composants/ui/DonneesStructurees";
import { Surtitre } from "@/composants/ui/Surtitre";
import { jalons, photos } from "@/donnees/histoire";
import { donneesHistoire } from "@/lib/seo";

/**
 * La page « Notre histoire », avenant n° 2 (`AV-2026-002-02`, 350 €).
 *
 * Réintégrée au périmètre à la demande du client après la relecture des
 * maquettes : « c'est très beau mais on ne voit pas que c'est nous ». Elle sert
 * aussi l'objectif n° 1 du site, la visite, en donnant la raison de venir.
 *
 * **Écrite sans l'entretien avec Marc.** Le projet est joué en solo : la page
 * s'appuie sur les faits du rendez-vous de découverte et invente le « pourquoi »
 * dans le même esprit que les autres sorties de fiction. Tout est dans
 * `donnees/histoire.ts`, y compris le raisonnement.
 *
 * **Quatre photos d'illustration** (session 19), pas des images du lieu réel :
 * un bandeau d'atelier, puis trois images calées dans leur section (les vignes,
 * le grain dans les mains, le service au comptoir). Elles disent le métier, pas
 * « voici la Brasserie La Bascule ». Détail et crédits dans `donnees/histoire.ts`.
 *
 * **Reliée au menu et au plan du site** (`navigationPrincipale` dans
 * `donnees/navigation.ts`, `sitemap.ts`). L'article 2 de l'avenant demandait
 * aussi une présence au pied de page : sans objet depuis la correction 7 de
 * Sophie, qui a retiré du pied de page la colonne recopiant le menu, pour
 * toutes les pages. C'est la seule page hors maquette validée à entrer au menu
 * pour de bon.
 */
export const metadata: Metadata = {
  title: "Notre histoire",
  description:
    "La Brasserie La Bascule est née dans un garage à Saint-Sébastien en 2022, avant de s'installer à Vertou en 2024. Trois associés, et une orge qu'on malte en partie soi-même.",
  alternates: { canonical: "/notre-histoire" },
};

/** Une photo dans un cadre au ratio fixe, recouvert. `ratio` est une classe
    Tailwind `aspect-[l/h]` reprise de `donnees/histoire.ts`. */
function Illustration({
  photo,
  ratio,
  sizes,
  priority = false,
  className = "",
}: {
  photo: (typeof photos)[keyof typeof photos];
  ratio: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`bg-beton relative w-full overflow-hidden ${ratio} ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}

export default function Page() {
  return (
    <main className="grow">
      <DonneesStructurees donnees={donneesHistoire()} />

      <section className="px-marge py-[clamp(48px,7vw,96px)]">
        <div className="mx-auto max-w-[1240px]">
          <Surtitre className="text-papier/55">La maison, depuis 2022</Surtitre>
          <h1 className="mt-5 max-w-[16ch] text-[clamp(40px,6.5vw,80px)]">
            On a commencé dans un garage.
          </h1>
          <p className="text-papier/60 mt-8 max-w-[58ch] text-[19px] leading-[1.55]">
            La Bascule, c&apos;est Marc au brassage, Julien au commerce, Sophie aux
            étiquettes. En 2022, on tenait dans un garage de Saint-Sébastien.
            Aujourd&apos;hui on brasse à Vertou, dans un hangar de la rue des Vignes, et
            on malte une partie de l&apos;orge sur place.
          </p>
        </div>
      </section>

      <Illustration
        photo={photos.atelier}
        ratio="aspect-[2400/1139]"
        sizes="100vw"
        priority
        className="max-h-[70vh]"
      />

      <section className="border-trait px-marge border-t py-[clamp(56px,9vw,110px)]">
        <div className="mx-auto max-w-[1240px]">
          <Surtitre className="text-papier/55">Deux dates</Surtitre>
          <h2 className="mt-5 max-w-[20ch] text-[clamp(30px,4.5vw,52px)]">
            Du garage au hangar.
          </h2>

          <div className="mt-12 grid gap-[clamp(20px,3vw,36px)] sm:grid-cols-2">
            {jalons.map((jalon) => (
              <article
                key={jalon.annee}
                className="border-trait border p-[clamp(24px,3.5vw,40px)]"
              >
                <p className="font-titre text-[clamp(38px,4.6vw,58px)] leading-none">
                  {jalon.annee}
                </p>
                <h3 className="mt-4 text-[19px]">{jalon.titre}</h3>
                <p className="text-papier/60 mt-4 text-[15.5px] leading-[1.55]">
                  {jalon.recit}
                </p>
              </article>
            ))}
          </div>

          <Illustration
            photo={photos.vignes}
            ratio="aspect-[1800/864]"
            sizes="(min-width: 1240px) 1240px, 100vw"
            className="mt-[clamp(20px,3vw,36px)]"
          />
        </div>
      </section>

      <section className="border-trait px-marge border-t py-[clamp(56px,9vw,110px)]">
        <div className="mx-auto grid max-w-[1240px] items-start gap-[clamp(28px,5vw,72px)] lg:grid-cols-[1fr_0.82fr]">
          <div>
            <Surtitre className="text-papier/55">Le grain</Surtitre>
            <h2 className="mt-5 max-w-[20ch] text-[clamp(30px,4.5vw,52px)]">
              On malte une partie de notre orge.
            </h2>
            <p className="text-papier/60 mt-6 max-w-[54ch] text-[19px] leading-[1.55]">
              Avant d&apos;être du malt, l&apos;orge est trempée, mise à germer, puis
              séchée. La plupart des brasseries l&apos;achètent déjà maltée. Nous en
              maltons une part nous-mêmes, dans l&apos;atelier, à partir d&apos;orge
              cultivée dans des fermes des environs. C&apos;est encombrant, c&apos;est
              lent, et on est à peu près les seuls à le faire dans le coin. Ce qu&apos;on
              y gagne : savoir exactement d&apos;où vient ce qui entre dans la cuve, et
              une note de pain grillé qu&apos;on retrouve dans La Rouquine comme dans Le
              Corbeau.
            </p>
          </div>
          <Illustration
            photo={photos.grain}
            ratio="aspect-[1200/1500]"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="mx-auto max-w-[420px] lg:mt-2"
          />
        </div>
      </section>

      <section className="border-trait px-marge border-t py-[clamp(56px,9vw,110px)]">
        <div className="mx-auto max-w-[1240px]">
          <Surtitre className="text-papier/55">Le nom</Surtitre>
          <h2 className="mt-5 max-w-[20ch] text-[clamp(30px,4.5vw,52px)]">
            Pourquoi La Bascule.
          </h2>
          <p className="text-papier/60 mt-6 max-w-[58ch] text-[19px] leading-[1.55]">
            À la livraison, les remorques de grain passent sur le pont-bascule : pesée
            pleine, pesée vide, la différence dit ce qu&apos;on a reçu. C&apos;est le
            premier geste de chaque brassin. L&apos;autre sens du mot nous allait aussi,
            celui du moment où l&apos;on quitte un métier pour en apprendre un autre.
            Sophie a dessiné une vieille balance pour le logo, et donné un animal à chaque
            bière, du renard au sanglier de l&apos;automne. Les étiquettes, c&apos;est
            elle, depuis le premier lot.
          </p>
        </div>
      </section>

      <section className="border-trait px-marge border-t py-[clamp(56px,9vw,110px)]">
        <div className="mx-auto grid max-w-[1240px] items-center gap-[clamp(28px,5vw,72px)] lg:grid-cols-2">
          <div>
            <Surtitre className="text-papier/55">Aujourd&apos;hui</Surtitre>
            <h2 className="mt-5 max-w-[20ch] text-[clamp(30px,4.5vw,52px)]">
              Le mieux, c&apos;est de passer.
            </h2>
            <p className="text-papier/60 mt-6 max-w-[52ch] text-[19px] leading-[1.55]">
              On brasse trois cents hectolitres par an, on fournit une quinzaine de bars
              et sept cavistes entre Nantes et Clisson, et la boutique est ouverte le
              vendredi et le samedi. Le reste se raconte mal par écrit : l&apos;atelier se
              visite, avec Marc qui explique du grain à la bouteille et une dégustation à
              la fin.
            </p>
            <Link
              href="/visites-et-degustations"
              className="bg-papier text-encre hover:bg-papier/85 border-papier mt-8 inline-block border px-[22px] py-3 text-[14px] font-medium transition-colors"
            >
              Réserver une visite
            </Link>
          </div>
          <Illustration
            photo={photos.service}
            ratio="aspect-[1400/1167]"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
        </div>
      </section>
    </main>
  );
}
