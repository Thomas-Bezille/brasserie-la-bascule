import type { Creneau, Heure } from "@/donnees/infos-pratiques";

/**
 * Mise en forme française des données stockées en format machine.
 *
 * Les heures et les durées sont enregistrées une seule fois, en `"14:30"`, parce
 * que l'affichage et le JSON-LD des moteurs sont deux lectures de la même
 * donnée. Ce fichier porte la lecture humaine.
 *
 * Les espaces qui suivent un nombre sont **insécables** : une heure coupée en
 * fin de ligne, « 16 » d'un côté et « h » de l'autre, est une faute de
 * composition, et elle arrive dès qu'une colonne se resserre sur téléphone.
 */

const INSECABLE = " ";

/** `"16:00"` → `16 h`, `"14:30"` → `14 h 30`. */
export function formaterHeure(heure: Heure): string {
  const [heures, minutes] = heure.split(":");
  const début = `${Number(heures)}${INSECABLE}h`;
  return minutes === "00" ? début : `${début}${INSECABLE}${minutes}`;
}

/** `10 h – 13 h et 14 h 30 – 19 h` */
export function formaterCreneaux(creneaux: readonly Creneau[]): string {
  return creneaux
    .map(
      ({ ouverture, fermeture }) =>
        `${formaterHeure(ouverture)} – ${formaterHeure(fermeture)}`,
    )
    .join(" et ");
}
