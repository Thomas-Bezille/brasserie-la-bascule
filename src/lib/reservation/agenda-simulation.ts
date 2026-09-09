import { horairesDeVisite, visites } from "@/donnees/infos-pratiques";
import { validerDemande } from "@/lib/reservation/validation";
import type {
  Agenda,
  Creneau,
  DemandeDeReservation,
  ResultatReservation,
} from "@/lib/reservation/types";

/**
 * Un agenda de démonstration, pour développer le parcours sans compte ouvert.
 *
 * **Il ne réserve rien et ne prétend rien réserver ailleurs qu'en mémoire.** Il
 * existe pour deux raisons : écrire et tester le formulaire avant que le
 * fournisseur ne soit choisi, et montrer le parcours complet en revue. La
 * fabrique refuse de le servir dès que `SITE_PUBLIE` vaut `oui`.
 *
 * **Ses créneaux suivent `horairesDeVisite`** (`infos-pratiques.ts`), la grille
 * de visite publiée : il n'invente plus ses propres jours et heures. La même
 * grille est appliquée en filtre à l'agenda Meetergo par
 * `agenda.ts` — un jour, avant cette grille, la démonstration en avait une à
 * elle, calée sur le rythme de la boutique plutôt que sur des horaires de
 * visite jamais arrêtés ; ce n'est plus le cas.
 */

const reservations = new Map<string, number>();

/** L'heure d'un `HoraireDeVisite` (`"16:30"`), posée sur un jour donné. */
function debutDuJour(jour: Date, heure: string): Date {
  const [heures, minutes] = heure.split(":").map(Number);
  const debut = new Date(jour);
  debut.setHours(heures, minutes, 0, 0);
  return debut;
}

function creneauxDeLaPeriode(formule: string, depuis: Date, jusqua: Date): Creneau[] {
  const capacite = visites.find((f) => f.nom === formule)?.effectifMax ?? 0;
  if (capacite === 0) return [];

  const creneaux: Creneau[] = [];
  const duree = visites.find((f) => f.nom === formule)?.dureeMinutes ?? 90;
  const jour = new Date(depuis);
  jour.setHours(0, 0, 0, 0);

  const JOURS_INDEX: Record<string, number> = {
    dimanche: 0,
    lundi: 1,
    mardi: 2,
    mercredi: 3,
    jeudi: 4,
    vendredi: 5,
    samedi: 6,
  };

  while (jour <= jusqua) {
    for (const horaire of horairesDeVisite) {
      if (JOURS_INDEX[horaire.jour] !== jour.getDay()) continue;

      const debut = debutDuJour(jour, horaire.heure);
      if (debut < depuis) continue;

      const fin = new Date(debut.getTime() + duree * 60_000);
      const prises = reservations.get(debut.toISOString()) ?? 0;
      creneaux.push({
        debut: debut.toISOString(),
        fin: fin.toISOString(),
        placesRestantes: Math.max(0, capacite - prises),
      });
    }
    jour.setDate(jour.getDate() + 1);
  }

  return creneaux;
}

export function agendaDeSimulation(): Agenda {
  return {
    fournisseur: "simulation",

    async creneaux(formule, depuis, jusqua) {
      return creneauxDeLaPeriode(formule, depuis, jusqua).filter(
        (c) => c.placesRestantes > 0,
      );
    },

    async reserver(demande: DemandeDeReservation): Promise<ResultatReservation> {
      const anomalies = validerDemande(demande);
      if (anomalies.length > 0) return { etat: "refusee", motif: anomalies[0].message };

      const capacite = visites.find((f) => f.nom === demande.formule)?.effectifMax ?? 0;
      const prises = reservations.get(demande.creneauDebut) ?? 0;
      if (prises + demande.nombreDePersonnes > capacite)
        return { etat: "creneau-complet" };

      reservations.set(demande.creneauDebut, prises + demande.nombreDePersonnes);
      return {
        etat: "confirmee",
        reference: `SIMU-${Date.now().toString(36).toUpperCase()}`,
      };
    },
  };
}

/** Remet la mémoire à zéro. N'existe que pour les tests. */
export function oublierLesReservationsDeSimulation() {
  reservations.clear();
}
