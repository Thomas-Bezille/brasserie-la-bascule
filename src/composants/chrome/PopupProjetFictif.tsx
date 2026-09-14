"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * Popup d'avertissement : le site est désormais public et indexé, sans quoi
 * il se présente comme une vraie brasserie (adresse, téléphone, formulaires
 * fonctionnels) sans aucune indication qu'il s'agit d'un projet fictif à but
 * portfolio. Demandé par Thomas le 14/09/2026, après avoir constaté qu'aucune
 * mention de ce type n'existait plus nulle part sur le site en ligne.
 *
 * **Mémorisée dans `localStorage`, une fois par visiteur** — même logique que
 * `BandeauPortesOuvertes` : lue via `useSyncExternalStore` pour éviter le
 * décalage d'hydratation (le serveur ne peut pas savoir ce qu'un navigateur a
 * déjà mémorisé), jamais un `useEffect` qui déclencherait un rendu de plus.
 *
 * **Pas de couleur d'accent** : fond et texte reprennent les deux seules
 * couleurs de texte du site (papier sur encre), comme le reste de la charte.
 */

const CLE_FERMETURE = "popup-projet-fictif-ferme";

/** Rien à écouter : la fermeture ne change que par notre propre bouton. */
const sAbonner = () => () => {};

function estFerme() {
  try {
    return window.localStorage.getItem(CLE_FERMETURE) === "1";
  } catch {
    // Stockage inaccessible (navigation privée, permissions bloquées) : tant
    // pis pour la mémorisation, mais rien n'empêche d'afficher la popup.
    return false;
  }
}

export function PopupProjetFictif() {
  const fermeeAuChargement = useSyncExternalStore(sAbonner, estFerme, () => true);
  const [fermeeParLeVisiteur, setFermeeParLeVisiteur] = useState(false);
  const boutonFermerRef = useRef<HTMLButtonElement>(null);

  const visible = !fermeeAuChargement && !fermeeParLeVisiteur;

  const fermer = () => {
    setFermeeParLeVisiteur(true);
    try {
      window.localStorage.setItem(CLE_FERMETURE, "1");
    } catch {
      // Rien à faire : la popup reviendra à la prochaine page, tant pis.
    }
  };

  useEffect(() => {
    if (!visible) return;

    boutonFermerRef.current?.focus();

    const surEchap = (evenement: KeyboardEvent) => {
      if (evenement.key === "Escape") fermer();
    };
    window.addEventListener("keydown", surEchap);
    return () => window.removeEventListener("keydown", surEchap);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="bg-encre/80 px-marge fixed inset-0 z-50 flex items-center justify-center"
      onClick={fermer}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titre-popup-projet-fictif"
        onClick={(evenement) => evenement.stopPropagation()}
        className="bg-beton border-trait max-w-[480px] border p-8"
      >
        <h2 id="titre-popup-projet-fictif" className="font-titre text-[22px] font-medium">
          Projet de démonstration
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed">
          Ce site est un projet de démonstration à but portfolio. La Bascule est une
          entreprise fictive : aucune commande ni réservation réelle n&apos;est traitée.
        </p>
        <button
          ref={boutonFermerRef}
          type="button"
          onClick={fermer}
          className="border-papier hover:bg-papier hover:text-encre mt-6 border px-6 py-2.5 text-[14px] font-medium transition-colors"
        >
          Compris
        </button>
      </div>
    </div>
  );
}
