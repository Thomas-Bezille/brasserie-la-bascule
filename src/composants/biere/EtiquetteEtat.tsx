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
 *
 * **Le libellé n'est plus à la couleur de la bière** (31/08/2026). À 11 px, il
 * lui faudrait 4,5:1, et aucun fond de la charte ne le donne à toute la gamme :
 * La Rouquine et Le Renard échouent même sur leur meilleur fond. La couleur
 * revient par la pastille, qui ne porte aucune information et n'a donc pas de
 * seuil à tenir. Voir `lib/contraste.test.ts`, qui garde la preuve chiffrée.
 */

export function EtiquetteEtat({ etat }: { etat: EtatBiere }) {
  return (
    <span className="text-papier border-trait mt-3.5 inline-flex items-center gap-2 border px-2.5 py-1 text-[11px] font-medium tracking-[0.07em] uppercase">
      <span
        aria-hidden
        className="ring-papier/25 inline-block size-2 rounded-full ring-1"
        style={{ backgroundColor: "var(--biere)" }}
      />
      {DISPONIBILITE[etat].etiquette}
    </span>
  );
}
