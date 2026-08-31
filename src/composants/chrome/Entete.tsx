"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/composants/ui/Logo";
import { lienReservation, navigationPrincipale } from "@/donnees/navigation";

/**
 * En-tête du site.
 *
 * **Correction 8, demandée par Marc :** le bouton « Réserver une visite » reste
 * visible en permanence sur téléphone. La maquette le cachait sous 960 px,
 * derrière le menu, alors qu'il porte l'objectif n° 1 du site. Il passe donc en
 * version compacte à côté du menu plutôt qu'en barre fixe en bas d'écran :
 * pas de recouvrement du contenu, et pas de conflit avec le formulaire de
 * réservation qui viendra plus tard.
 *
 * **Correction 1, non négociable, de Sophie :** le lien de la page courante se
 * signale par la couleur crème et un soulignement, jamais par une couleur
 * d'accent. Il n'y en a plus aucune dans le site.
 *
 * Le composant est rendu côté client, pour la page courante et l'ouverture du
 * menu. Le reste du site est en génération statique.
 *
 * > Le fond translucide et le flou tiennent le dépassement des illustrations
 * > prévu par la correction 2 : une illustration qui déborde en haut passe sous
 * > l'en-tête sans le rendre illisible. À confirmer en écrivant le hero.
 */
export function Entete() {
  const cheminCourant = usePathname();
  const [menuOuvert, setMenuOuvert] = useState(false);
  // Un menu ouvert ne doit pas survivre à une navigation. La fermeture se fait
  // au clic, et non par un effet sur la page courante : React 19 refuse un
  // `setState` dans un effet, et le clic est de toute façon l'évènement réel.
  const fermerMenu = () => setMenuOuvert(false);

  useEffect(() => {
    if (!menuOuvert) return;
    const fermerAEchap = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape") setMenuOuvert(false);
    };
    document.addEventListener("keydown", fermerAEchap);
    return () => document.removeEventListener("keydown", fermerAEchap);
  }, [menuOuvert]);

  const estCourante = (href: string) =>
    href === "/" ? cheminCourant === "/" : cheminCourant.startsWith(href);

  return (
    <header className="bg-encre/92 border-trait sticky top-0 z-50 border-b backdrop-blur-[10px]">
      <div className="px-marge mx-auto flex max-w-[1240px] items-center justify-between gap-6 py-4">
        {/* Pas d'aria-label ici : il remplacerait le texte visible du logo par un autre
            libellé, ce que le critère WCAG 2.5.3 interdit. Le complément se dit dans un
            texte réservé aux lecteurs d'écran, qui s'ajoute au nom au lieu de l'écraser. */}
        <Link href="/" onClick={fermerMenu}>
          <Logo />
          <span className="sr-only">, retour à l’accueil</span>
        </Link>

        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-[30px] lg:flex"
        >
          {navigationPrincipale.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              aria-current={estCourante(lien.href) ? "page" : undefined}
              className={`border-b py-1 text-[14px] tracking-[0.04em] transition-colors ${
                estCourante(lien.href)
                  ? "text-papier border-papier"
                  : "text-papier/60 hover:text-papier border-transparent"
              }`}
            >
              {lien.libelle}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Jamais de `hidden` sans préfixe d'écran sur ce lien : ce serait
              rétablir exactement ce que la correction 8 a fait retirer. */}
          <Link
            href={lienReservation.href}
            onClick={fermerMenu}
            className="bg-papier text-encre hover:bg-papier/85 border-papier border px-4 py-3 text-[13px] font-medium tracking-[0.02em] whitespace-nowrap transition-colors sm:px-[22px] sm:text-[14px]"
          >
            {lienReservation.libelleCourt}
            <span className="hidden sm:inline">{lienReservation.complement}</span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOuvert((ouvert) => !ouvert)}
            aria-expanded={menuOuvert}
            aria-controls="menu-mobile"
            aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
            className="text-papier p-2 text-[22px] leading-none lg:hidden"
          >
            {menuOuvert ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <nav
        id="menu-mobile"
        aria-label="Navigation principale, téléphone"
        hidden={!menuOuvert}
        className="bg-encre border-trait px-marge border-b pb-6 lg:hidden"
      >
        {navigationPrincipale.map((lien) => (
          <Link
            key={lien.href}
            href={lien.href}
            aria-current={estCourante(lien.href) ? "page" : undefined}
            onClick={fermerMenu}
            className={`border-trait block border-b py-[14px] text-[15px] ${
              estCourante(lien.href) ? "text-papier" : "text-papier/60"
            }`}
          >
            {lien.libelle}
          </Link>
        ))}
      </nav>
    </header>
  );
}
