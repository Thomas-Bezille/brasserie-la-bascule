"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { bieres } from "@/donnees/bieres";
import { PORTES_OUVERTES_PUBLIEES } from "@/donnees/portes-ouvertes";

const sanglier = bieres.find((biere) => biere.slug === "le-sanglier");

/**
 * Le bandeau sticky « Portes ouvertes », collé en bas de l'écran, sur tout le
 * site.
 *
 * **Deuxième reprise, sur retour de Thomas.** La v1 était une section dans le
 * flux de l'accueil (session 15, PR #33) : « pas beau du tout ». Celle-ci
 * quitte le flux de la page pour un bandeau fixe et fermable, présent partout
 * plutôt que sur le seul accueil — un visiteur peut arriver par n'importe
 * quelle page. Fond crème, texte encre : l'inversion des deux seules couleurs
 * de texte du site, sans qu'aucune couleur d'accent n'entre en jeu, pour que
 * le bandeau se voie comme une bande d'action plutôt qu'un bloc de contenu de
 * plus.
 *
 * **La fermeture est mémorisée dans `localStorage`, pour de bon.** Un
 * visiteur qui ferme la croix ne le revoit plus sur ce navigateur : un
 * bandeau qui réapparaît à chaque page, ou à chaque visite, se comporte comme
 * un bandeau de consentement, ce que ce site n'a justement pas — sa politique
 * de confidentialité l'annonce, « aucun cookie assumé ».
 *
 * **Ne s'affiche pas sur la page qu'il annonce** : proposer « Voir le
 * programme » à quelqu'un qui le regarde déjà n'a pas de sens.
 *
 * **Troisième reprise : l'animal du Sanglier, dès qu'il a existé (session 16).**
 * Le bandeau v2 (ci-dessus) était un pis-aller texte, faute de visuel à
 * montrer. Il porte maintenant le sanglier de Sophie, tiré de `bieres.ts`
 * comme `CarteBiere` : c'est la seule source, il n'est pas dupliqué ici.
 * Comme `CarteBiere`, **aucune couleur de bière n'entre dans le code du
 * bandeau** — le dessin la porte, pas une variable CSS, la règle de Sophie
 * s'applique aussi hors d'une fiche.
 *
 * **Lu via `useSyncExternalStore`, pas un `useEffect` qui appellerait
 * `setState`.** `localStorage` est un système externe à React : c'est
 * exactement ce que ce hook sert à lire, sans le rendu supplémentaire d'un
 * effet, et son troisième argument tranche l'hydratation proprement — le
 * serveur ne peut pas savoir ce qu'un navigateur a mémorisé, donc le rendu
 * serveur est toujours vide, et le bandeau n'apparaît qu'une fois cette
 * lecture faite côté client.
 */

const CLE_FERMETURE = "portes-ouvertes-bandeau-ferme";

/** Rien à écouter : la fermeture ne change que par notre propre bouton. */
const sAbonner = () => () => {};

function estFerme() {
  try {
    return window.localStorage.getItem(CLE_FERMETURE) === "1";
  } catch {
    // Stockage inaccessible (navigation privée, permissions bloquées) : tant
    // pis pour la mémorisation, mais rien n'empêche d'afficher le bandeau.
    return false;
  }
}

export function BandeauPortesOuvertes({
  publie = PORTES_OUVERTES_PUBLIEES,
}: {
  publie?: boolean;
}) {
  const chemin = usePathname();
  const fermeAuChargement = useSyncExternalStore(sAbonner, estFerme, () => true);
  const [fermeParLeVisiteur, setFermeParLeVisiteur] = useState(false);

  const fermer = () => {
    setFermeParLeVisiteur(true);
    try {
      window.localStorage.setItem(CLE_FERMETURE, "1");
    } catch {
      // Rien à faire : le bandeau reviendra à la prochaine page, tant pis.
    }
  };

  if (!publie || fermeAuChargement || fermeParLeVisiteur || chemin === "/portes-ouvertes")
    return null;

  return (
    <div
      role="region"
      aria-label="Portes ouvertes, 24 et 25 octobre"
      className="bg-papier text-encre border-encre/15 fixed inset-x-0 bottom-0 z-40 border-t"
    >
      <div className="px-marge mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-5 gap-y-3 py-3">
        {sanglier?.animal && (
          <Image
            src={sanglier.animal}
            alt=""
            width={1254}
            height={1254}
            sizes="48px"
            className="h-12 w-auto shrink-0"
          />
        )}
        <p className="min-w-[220px] flex-1 text-[14.5px] leading-snug">
          <strong className="font-semibold">24–25 octobre</strong> · Portes ouvertes à
          l&apos;atelier, dégustation du Sanglier en avant-première. Entrée libre.
        </p>

        <div className="flex shrink-0 items-center gap-4">
          <Link
            href="/portes-ouvertes"
            className="border-encre hover:bg-encre hover:text-papier border px-[18px] py-2.5 text-[14px] font-medium transition-colors"
          >
            Le programme
          </Link>
          <button
            type="button"
            onClick={fermer}
            aria-label="Fermer"
            className="hover:text-encre/60 p-1 text-[20px] leading-none transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
