import Image from "next/image";
import Link from "next/link";
import { Surtitre } from "@/composants/ui/Surtitre";

/**
 * L'ouverture de l'accueil.
 *
 * **Correction 2, de Sophie.** Ses dessins sont faits à la main, à bords
 * irréguliers, et pensés pour être coupés par le bord de l'étiquette. Ils
 * doivent donc **déborder du cadre** : toucher le bord de l'écran, dépasser en
 * haut, ne jamais être vus entièrement. Posé au centre d'un rectangle avec de
 * la marge tout autour, le dessin devient un logo d'entreprise et perd ce qui
 * fait l'identité.
 *
 * Le dépassement est coupé par la section (`overflow-x-clip`) et non par la
 * fenêtre : une page qui défile horizontalement sur téléphone serait un défaut,
 * pas un parti pris.
 *
 * > **Le piège du plan est arbitré ici.** L'en-tête est en `position: sticky`,
 * > et le dessin dépasse en haut : il passe donc dessous. C'est le fond
 * > translucide et le flou de l'en-tête qui rendent la superposition lisible,
 * > plutôt qu'un en-tête devenu opaque au défilement, qui aurait alourdi le haut
 * > de page sur toutes les autres pages du site pour ce seul écran.
 *
 * Le renard est un dessin de travail, celui de la maquette. Julien voudrait le
 * garder ; Sophie a demandé qu'on ne lui réponde pas là-dessus et s'en occupe
 * elle-même.
 */
export function HeroAccueil() {
  return (
    <section className="relative overflow-x-clip">
      <div className="px-marge mx-auto grid max-w-[1240px] items-center gap-10 py-[clamp(48px,8vw,110px)] lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Surtitre className="text-papier/40">
            Vertou · Loire-Atlantique · depuis 2022
          </Surtitre>

          <h1 className="mt-6 text-[clamp(46px,8.5vw,104px)]">
            On brasse
            <br />à deux pas
            <br />
            de la Sèvre.
          </h1>

          <p className="text-papier/60 mt-8 max-w-[52ch] text-[19px] leading-[1.55]">
            Six bières permanentes, une par saison, brassées dans un atelier de 250
            hectolitres que l&apos;on peut visiter le vendredi, le samedi, ou quand ça
            vous arrange.
          </p>

          <p className="mt-9 flex flex-wrap gap-2.5">
            <Link
              href="/visites-et-degustations"
              className="bg-papier text-encre hover:bg-papier/85 border-papier border px-[22px] py-3 text-[14px] font-medium transition-colors"
            >
              Réserver une visite
            </Link>
            <Link
              href="/nos-bieres"
              className="border-papier text-papier hover:bg-papier hover:text-encre border px-[22px] py-3 text-[14px] font-medium transition-colors"
            >
              Voir la gamme
            </Link>
          </p>
        </div>

        <div className="-mr-marge">
          <Image
            src="/illustrations/hero-renard-provisoire.svg"
            alt=""
            width={400}
            height={400}
            priority
            className="ml-auto w-[80%] max-w-[420px] lg:-mt-[14%] lg:w-[124%] lg:max-w-none"
          />
          <p className="text-papier/40 mt-3 text-right text-[13px] italic">
            Illustration provisoire, à remplacer par le dessin de Sophie
          </p>
        </div>
      </div>
    </section>
  );
}
