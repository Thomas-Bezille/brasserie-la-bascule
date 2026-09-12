import Link from "next/link";
import { Surtitre } from "@/composants/ui/Surtitre";
import { navigationPrincipale } from "@/donnees/navigation";

/**
 * La page 404, trouvée manquante le 12/09/2026 en reprenant la checklist de
 * recette : sans ce fichier, Next.js sert sa page par défaut, en anglais et
 * hors charte. Le statut HTTP 404 reste celui de Next.js, seul le contenu
 * change.
 */

export const metadata = {
  title: "Page introuvable",
};

export default function NotFound() {
  return (
    <main className="px-marge mx-auto flex w-full max-w-[1240px] grow flex-col justify-center py-[clamp(48px,7vw,96px)]">
      <Surtitre className="text-papier/55">404</Surtitre>
      <h1 className="mt-5 max-w-[20ch] text-[clamp(38px,6vw,68px)]">
        Cette page-là n&apos;existe pas.
      </h1>
      <p className="text-papier/70 mt-6 max-w-[52ch] text-[17px] leading-[1.6]">
        L&apos;adresse est fausse, ou la page a changé de nom. Voici où trouver ce que
        vous cherchiez :
      </p>

      <nav aria-label="Pages du site" className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="border-trait hover:border-papier border px-4 py-2.5 text-[15px]"
        >
          Accueil
        </Link>
        {navigationPrincipale
          .filter((lien) => lien.livree)
          .map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="border-trait hover:border-papier border px-4 py-2.5 text-[15px]"
            >
              {lien.libelle}
            </Link>
          ))}
      </nav>
    </main>
  );
}
