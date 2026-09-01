import { visites } from "@/donnees/infos-pratiques";
import { validerDemande } from "@/lib/reservation/validation";
import type {
  Agenda,
  Creneau,
  DemandeDeReservation,
  ResultatReservation,
} from "@/lib/reservation/types";

/**
 * L'agenda réel : Meetergo, par son API v4.
 *
 * **Le fournisseur ne remonte nulle part dans le site.** Ce fichier est le seul,
 * avec la fabrique de `agenda.ts`, à connaître son nom : le reste du module ne
 * voit que l'interface `Agenda`. Changer de prestataire reste le travail d'une
 * journée, décision de `03-conception/decision-agenda-reservation.md`, section 6 ter.
 *
 * **Deux appels portent le service**, un troisième les rend possibles (référence
 * complète dans
 * `mimir/livrables/projet-web-perso/2026-08-26-brasserie-la-bascule/04-developpement/integration-meetergo.md`) :
 *
 * - `GET /v4/booking-availability` pour lister les créneaux d'un type de rendez-vous ;
 * - `POST /v4/booking` pour poser une réservation. La réponse porte un
 *   `appointmentId` : c'est la référence de confirmation rendue au visiteur ;
 * - `GET /v4/meeting-type/{id}` pour lire l'hôte du type de rendez-vous, lu une
 *   fois puis gardé en mémoire. Les deux autres appels le réclament : Meetergo
 *   refuse `booking-availability` comme `booking` sans `hostIds`.
 *
 * **Les questions métier (effectif, entreprise, message) passent dans
 * `attendee.notes`**, un dictionnaire `clé -> texte` prévu pour ça. Le site n'a
 * pas besoin d'un formulaire personnalisé côté Meetergo.
 *
 * **Authentification : un seul en-tête.** Le jeton est un Personal Access Token
 * `rgo-...`, qui agit au nom de son propriétaire ; `x-meetergo-api-user-id` est
 * réservé aux Platform API Keys et n'a pas à être envoyé ici.
 *
 * **Comportement fermé par défaut, comme partout dans ce module.** Toute panne
 * de l'API (réseau, 4xx, 5xx, corps illisible) se traduit par une absence de
 * créneaux ou un état `indisponible`, jamais par un faux remerciement : c'est la
 * leçon des dix-neuf demandes perdues de ce client entre 2023 et 2026.
 */

const URL_BASE_PAR_DEFAUT = "https://api.meetergo.com/v4";

/** Toutes les visites ont lieu à Vertou. Passé explicitement pour ne pas dépendre
    du fuseau réglé sur le compte Meetergo. */
const FUSEAU = "Europe/Paris";

/** Un appel qui traîne bloque une action serveur : on coupe au-delà. */
const DELAI_MS = 10_000;

/**
 * Le type de rendez-vous Meetergo de chaque formule publiée, par variable
 * d'environnement.
 *
 * Les clés sont les noms exacts de `visites`, source unique. Le test
 * `agenda-meetergo.test.ts` fait échouer la CI si une formule est renommée ou
 * ajoutée sans que sa variable soit déclarée ici : la correspondance ne se
 * relit pas, elle se vérifie.
 */
export const VARIABLE_DE_TYPE_PAR_FORMULE: Readonly<Record<string, string>> = {
  "Visite découverte": "AGENDA_MEETERGO_TYPE_DECOUVERTE",
  "Visite entreprise": "AGENDA_MEETERGO_TYPE_ENTREPRISE",
};

export type EnvironnementMeetergo = Readonly<Partial<Record<string, string>>>;

export type ConfigMeetergo = {
  readonly cle: string;
  readonly urlBase: string;
  /** L'identifiant du type de rendez-vous Meetergo pour chaque formule configurée. */
  readonly typeParFormule: ReadonlyMap<string, string>;
};

/**
 * Nettoie une valeur d'environnement : espaces, puis une éventuelle paire de
 * guillemets autour de la valeur.
 *
 * Une variable d'environnement n'a jamais de guillemets légitimes, mais il est
 * facile d'en coller dans un tableau de bord d'hébergeur. Un identifiant de type
 * de rendez-vous entre guillemets a produit une URL `.../meeting-type/%22...%22`
 * et un 500 de Meetergo, sans autre symptôme qu'une liste de créneaux vide.
 */
export function valeurDEnvironnement(brut: string | undefined): string | undefined {
  const sansEspaces = brut?.trim();
  if (!sansEspaces) return undefined;
  const sansGuillemets = sansEspaces.replace(/^(["'])([\s\S]*)\1$/, "$2").trim();
  return sansGuillemets || undefined;
}

/**
 * Lit la configuration Meetergo de l'environnement. Renvoie `null` sans clé :
 * `etatDeLAgenda` l'exige déjà, c'est une seconde barrière.
 */
export function configDeMeetergo(env: EnvironnementMeetergo): ConfigMeetergo | null {
  const cle = valeurDEnvironnement(env.AGENDA_CLE_API);
  if (!cle) return null;

  const typeParFormule = new Map<string, string>();
  for (const [formule, variable] of Object.entries(VARIABLE_DE_TYPE_PAR_FORMULE)) {
    const valeur = valeurDEnvironnement(env[variable]);
    if (valeur) typeParFormule.set(formule, valeur);
  }

  return {
    cle,
    urlBase: valeurDEnvironnement(env.AGENDA_MEETERGO_URL_BASE) ?? URL_BASE_PAR_DEFAUT,
    typeParFormule,
  };
}

type SpotDisponibilite = {
  readonly startTime?: string;
  readonly unavailabilityEvents?: readonly unknown[];
  readonly appointment?: {
    readonly totalSpots?: number;
    readonly takenSpots?: number;
  };
};

type ReponseDisponibilite = {
  readonly dates?: readonly {
    readonly spots?: readonly SpotDisponibilite[];
  }[];
};

type ReponseReservation = {
  readonly appointmentId?: string;
  readonly bookingType?: "doubleOptIn" | "requireHostConfirmation";
};

/** Ce qui, dans une erreur de l'API, désigne un créneau qui vient d'être pris. */
const CRENEAU_DEJA_PRIS =
  /slot[-\s]?occupied|no longer available|already booked|fully booked|créneau|creneau|indisponible|unavailable|complet/i;

function journaliser(action: string, detail: unknown): void {
  console.error(`[agenda-meetergo] échec ${action} :`, detail);
}

function evoqueUnCreneauPris(corps: unknown): boolean {
  try {
    return CRENEAU_DEJA_PRIS.test(JSON.stringify(corps) ?? "");
  } catch {
    return false;
  }
}

function dureeDeLaFormule(formule: string): number {
  return visites.find((f) => f.nom === formule)?.dureeMinutes ?? 90;
}

/**
 * L'agenda Meetergo, ou `null` si aucune formule n'a de type de rendez-vous
 * configuré : dans ce cas la page de réservation affiche « en cours
 * d'installation » plutôt qu'un formulaire sans créneaux.
 */
export function agendaDeMeetergo(env: EnvironnementMeetergo): Agenda | null {
  const lu = configDeMeetergo(env);
  if (!lu || lu.typeParFormule.size === 0) return null;
  const config: ConfigMeetergo = lu;

  const enTetes = {
    Authorization: `Bearer ${config.cle}`,
    Accept: "application/json",
  } as const;

  /** L'hôte d'un type de rendez-vous, lu une fois puis gardé en mémoire.
      `null` = lecture faite, aucun hôte trouvé : ni les créneaux ni la
      réservation ne peuvent aboutir, Meetergo les refuse sans `hostIds`. */
  const hoteParType = new Map<string, string | null>();

  async function hoteDuType(typeId: string): Promise<string | null> {
    const connu = hoteParType.get(typeId);
    if (connu !== undefined) return connu;

    let hote: string | null = null;
    try {
      const reponse = await fetch(`${config.urlBase}/meeting-type/${typeId}`, {
        headers: enTetes,
        signal: AbortSignal.timeout(DELAI_MS),
      });
      if (reponse.ok) {
        const corps = (await reponse.json()) as { userId?: unknown };
        if (typeof corps.userId === "string" && corps.userId) hote = corps.userId;
      } else {
        journaliser("lecture du type de rendez-vous", reponse.status);
      }
    } catch (erreur) {
      journaliser("lecture du type de rendez-vous", erreur);
    }

    hoteParType.set(typeId, hote);
    return hote;
  }

  return {
    fournisseur: "meetergo",

    async creneaux(formule, depuis, jusqua): Promise<Creneau[]> {
      const typeId = config.typeParFormule.get(formule);
      if (!typeId) return [];

      /**
       * `GET /v4/booking-availability` refuse la requête sans `hostIds` (« Expected
       * hostIds or queueId »), alors que la spec le donne pour facultatif. Nos
       * types de rendez-vous ont un hôte unique : on le résout comme pour la
       * réservation, et sans lui il n'y a pas de créneaux à afficher.
       */
      const hote = await hoteDuType(typeId);
      if (!hote) {
        journaliser(
          "récupération des créneaux",
          `hôte introuvable pour le type ${typeId}`,
        );
        return [];
      }

      const parametres = new URLSearchParams({
        meetingTypeId: typeId,
        start: depuis.toISOString(),
        end: jusqua.toISOString(),
        timezone: FUSEAU,
      });
      parametres.append("hostIds", hote);

      let corps: ReponseDisponibilite;
      try {
        const reponse = await fetch(
          `${config.urlBase}/booking-availability?${parametres}`,
          { headers: enTetes, signal: AbortSignal.timeout(DELAI_MS) },
        );
        if (!reponse.ok) {
          journaliser("récupération des créneaux", reponse.status);
          return [];
        }
        corps = (await reponse.json()) as ReponseDisponibilite;
      } catch (erreur) {
        journaliser("récupération des créneaux", erreur);
        return [];
      }

      const duree = dureeDeLaFormule(formule);
      const creneaux: Creneau[] = [];

      for (const jour of corps.dates ?? []) {
        for (const spot of jour.spots ?? []) {
          if (spot.unavailabilityEvents && spot.unavailabilityEvents.length > 0) continue;
          if (!spot.startTime) continue;

          const debut = new Date(spot.startTime);
          if (Number.isNaN(debut.getTime()) || debut < depuis) continue;

          const placesRestantes = spot.appointment
            ? Math.max(
                0,
                (spot.appointment.totalSpots ?? 0) - (spot.appointment.takenSpots ?? 0),
              )
            : 1;
          if (placesRestantes <= 0) continue;

          creneaux.push({
            debut: spot.startTime,
            fin: new Date(debut.getTime() + duree * 60_000).toISOString(),
            placesRestantes,
          });
        }
      }

      return creneaux;
    },

    async reserver(demande: DemandeDeReservation): Promise<ResultatReservation> {
      const anomalies = validerDemande(demande);
      if (anomalies.length > 0) return { etat: "refusee", motif: anomalies[0].message };

      const typeId = config.typeParFormule.get(demande.formule);
      if (!typeId) {
        journaliser(
          "réservation",
          `aucun type de rendez-vous pour « ${demande.formule} »`,
        );
        return { etat: "indisponible" };
      }

      const hote = await hoteDuType(typeId);
      if (!hote) {
        journaliser("réservation", `hôte introuvable pour le type ${typeId}`);
        return { etat: "indisponible" };
      }

      const notes: Record<string, string> = {
        "Nombre de personnes": String(demande.nombreDePersonnes),
      };
      if (demande.entreprise) notes["Entreprise"] = demande.entreprise;
      if (demande.message) notes["Message"] = demande.message;

      const corpsDemande: Record<string, unknown> = {
        meetingTypeId: typeId,
        start: demande.creneauDebut,
        sourceChannel: "web_widget",
        skipNotifications: false,
        attendee: {
          fullname: demande.nom,
          email: demande.email,
          phone: demande.telephone,
          receiveReminders: true,
          dataPolicyAccepted: true,
          timezone: FUSEAU,
          language: "fr",
          notes,
        },
        hostIds: [hote],
      };

      let reponse: Response;
      try {
        reponse = await fetch(`${config.urlBase}/booking`, {
          method: "POST",
          headers: { ...enTetes, "Content-Type": "application/json" },
          body: JSON.stringify(corpsDemande),
          signal: AbortSignal.timeout(DELAI_MS),
        });
      } catch (erreur) {
        journaliser("réservation", erreur);
        return { etat: "indisponible" };
      }

      let corps: ReponseReservation = {};
      try {
        corps = (await reponse.json()) as ReponseReservation;
      } catch {
        // Corps illisible : le code HTTP tranche ci-dessous.
      }

      if (reponse.ok) {
        if (corps.appointmentId && !corps.bookingType) {
          return { etat: "confirmee", reference: corps.appointmentId };
        }
        /**
         * Ne doit pas arriver : le type de rendez-vous est configuré sans double
         * opt-in ni confirmation par l'hôte, le niveau B vendu étant la
         * confirmation automatique. Si ça arrive, la réservation est en attente
         * quelque part et le visiteur ne doit pas être remercié pour autant.
         */
        journaliser(
          "réservation",
          `réponse sans confirmation ferme (bookingType=${corps.bookingType ?? "?"})`,
        );
        return {
          etat: "refusee",
          motif:
            "Votre demande n'a pas pu être confirmée automatiquement. Écrivez-nous et nous la finaliserons.",
        };
      }

      if (
        (reponse.status === 400 || reponse.status === 409) &&
        evoqueUnCreneauPris(corps)
      ) {
        return { etat: "creneau-complet" };
      }

      journaliser(
        "réservation",
        `${reponse.status} ${JSON.stringify(corps).slice(0, 300)}`,
      );
      return { etat: "indisponible" };
    },
  };
}
