import type { EtatBiere } from "@/donnees/bieres";
import { DISPONIBILITE } from "@/lib/disponibilite";

/**
 * L'état d'une bière, tel qu'il est arrêté au cahier des charges 5.1.
 *
 * Une fiche de saison n'est jamais dépubliée : hors saison elle reste en ligne
 * avec son état, ce qui lui garde son référencement d'une année sur l'autre
 * plutôt que de le remettre à zéro à chaque cuvée.
 *
 * Le composant s'appelle `EtiquetteEtat` et non `EtatBiere` comme le prévoyait
 * le plan : `EtatBiere` est déjà le nom du type, et les deux se seraient
 * télescopés au premier fichier qui importe l'un et l'autre.
 */

export function EtiquetteEtat({ etat }: { etat: EtatBiere }) {
  return (
    <span
      className="mt-3.5 inline-block border px-2.5 py-1 text-[11px] font-medium tracking-[0.07em] uppercase"
      style={{ color: "var(--biere)" }}
    >
      {DISPONIBILITE[etat].etiquette}
    </span>
  );
}
