import { visites } from "@/donnees/infos-pratiques";
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
 * Ses créneaux ne sont pas les vrais et ne peuvent pas l'être : **les créneaux
 * de visite réels n'ont jamais été validés par le client.** Ceux de la maquette
 * (« vendredi 17 h, samedi 10 h 30 ») ne figurent pas dans les dix données
 * arrêtées du cahier des charges, section 6. Ils sont donc générés ici, sur le
 * rythme d'ouverture de la boutique, et ils seront remplacés par ceux que Julien
 * et Marc auront confirmés.
 */

/** Vendredi et samedi, les deux jours où la boutique est ouverte. */
const JOURS_OUVERTS = [5, 6];

const reservations = new Map<string, number>();

function creneauxDeLaPeriode(formule: string, depuis: Date, jusqua: Date): Creneau[] {
  const capacite = visites.find((f) => f.nom === formule)?.effectifMax ?? 0;
  if (capacite === 0) return [];

  const creneaux: Creneau[] = [];
  const duree = visites.find((f) => f.nom === formule)?.dureeMinutes ?? 90;
  const jour = new Date(depuis);
  jour.setHours(0, 0, 0, 0);

  while (jour <= jusqua) {
    if (JOURS_OUVERTS.includes(jour.getDay())) {
      for (const heure of [10, 17]) {
        const debut = new Date(jour);
        debut.setHours(heure, 0, 0, 0);
        if (debut < depuis) continue;

        const fin = new Date(debut.getTime() + duree * 60_000);
        const prises = reservations.get(debut.toISOString()) ?? 0;
        creneaux.push({
          debut: debut.toISOString(),
          fin: fin.toISOString(),
          placesRestantes: Math.max(0, capacite - prises),
        });
      }
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
