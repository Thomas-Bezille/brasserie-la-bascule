import { validerDemande } from "@/lib/contact/validation";
import type { DemandeDeContact, Messagerie, ResultatEnvoi } from "@/lib/contact/types";

/**
 * La messagerie réelle : Resend, par son API REST.
 *
 * **Le fournisseur ne remonte nulle part dans le site.** Ce fichier est le seul,
 * avec la fabrique de `messagerie.ts`, à connaître son nom : le reste du module
 * ne voit que l'interface `Messagerie`. Changer de service reste le travail
 * d'une journée.
 *
 * **Un seul appel porte le service :** `POST https://api.resend.com/emails`,
 * authentifié par `Authorization: Bearer re_...`. La demande du visiteur devient
 * un courriel adressé à la brasserie, avec le `reply_to` positionné sur
 * l'adresse du visiteur : la brasserie répond d'un clic sans copier-coller.
 *
 * **Domaine bac à sable, faute de domaine personnalisé.** Ce projet n'a pas de
 * vrai domaine (décision du 09/09/2026). L'envoi passe donc par le domaine
 * partagé de Resend : `MAIL_FROM` vaut `onboarding@resend.dev` et `MAIL_TO` doit
 * être l'adresse exacte du compte Resend, seule destination que le bac à sable
 * accepte de livrer. Le jour d'un vrai domaine, seules ces deux variables
 * changent, pas ce fichier. Voir
 * `mimir/livrables/projet-web-perso/2026-08-26-brasserie-la-bascule/04-developpement/integration-resend.md`.
 *
 * **Comportement fermé par défaut, comme partout dans ce module.** Toute panne
 * de l'API (réseau, 4xx, 5xx, corps illisible) se traduit par un état
 * `indisponible`, jamais par un faux « envoyé » : c'est la leçon des dix-neuf
 * demandes perdues de ce client entre 2023 et 2026.
 */

const URL_BASE_PAR_DEFAUT = "https://api.resend.com";

/** Un appel qui traîne bloque une action serveur : on coupe au-delà. */
const DELAI_MS = 10_000;

export type EnvironnementResend = Readonly<Partial<Record<string, string>>>;

export type ConfigResend = {
  readonly cle: string;
  readonly expediteur: string;
  readonly destinataire: string;
  readonly urlBase: string;
};

/**
 * Nettoie une valeur d'environnement : espaces, puis une éventuelle paire de
 * guillemets qui entoure la valeur.
 *
 * Une variable d'environnement n'a jamais de guillemets légitimes, mais il est
 * facile d'en coller dans un tableau de bord d'hébergeur : côté agenda, un
 * identifiant entre guillemets a produit une URL invalide et un 500 sans autre
 * symptôme qu'une liste de créneaux vide (PR #23).
 */
export function valeurDEnvironnement(brut: string | undefined): string | undefined {
  const sansEspaces = brut?.trim();
  if (!sansEspaces) return undefined;
  const sansGuillemets = sansEspaces.replace(/^(["'])([\s\S]*)\1$/, "$2").trim();
  return sansGuillemets || undefined;
}

/**
 * Lit la configuration Resend de l'environnement. Renvoie `null` s'il manque la
 * clé, l'expéditeur ou le destinataire : `etatDeLaMessagerie` l'exige déjà,
 * c'est une seconde barrière.
 */
export function configDeResend(env: EnvironnementResend): ConfigResend | null {
  const cle = valeurDEnvironnement(env.MAIL_API_KEY);
  const expediteur = valeurDEnvironnement(env.MAIL_FROM);
  const destinataire = valeurDEnvironnement(env.MAIL_TO);
  if (!cle || !expediteur || !destinataire) return null;

  return {
    cle,
    expediteur,
    destinataire,
    urlBase: valeurDEnvironnement(env.MAIL_RESEND_URL_BASE) ?? URL_BASE_PAR_DEFAUT,
  };
}

/** Les champs annexes, dans l'ordre où ils apparaissent en tête du courriel. */
const CHAMPS_ANNEXES: readonly (readonly [keyof DemandeDeContact, string])[] = [
  ["nom", "Nom"],
  ["email", "Adresse"],
  ["telephone", "Téléphone"],
  ["entreprise", "Entreprise"],
  ["motif", "Motif"],
];

function sujetDuMessage(demande: DemandeDeContact): string {
  const motif = demande.motif ? ` — ${demande.motif}` : "";
  return `Message du site${motif} — ${demande.nom}`;
}

function corpsDuMessage(demande: DemandeDeContact): string {
  const entete = CHAMPS_ANNEXES.filter(([champ]) => demande[champ]).map(
    ([champ, libelle]) => `${libelle} : ${demande[champ]}`,
  );
  return [...entete, "", demande.message.trim()].join("\n");
}

function journaliser(detail: unknown): void {
  console.error("[messagerie-resend] échec de l'envoi :", detail);
}

/**
 * La messagerie Resend, ou `null` si la configuration est incomplète : dans ce
 * cas la page de contact affiche l'explication de l'absence de formulaire
 * plutôt que des champs qui n'enverraient rien.
 */
export function messagerieDeResend(env: EnvironnementResend): Messagerie | null {
  const config = configDeResend(env);
  if (!config) return null;

  return {
    fournisseur: "resend",

    async envoyer(demande: DemandeDeContact): Promise<ResultatEnvoi> {
      const anomalies = validerDemande(demande);
      if (anomalies.length > 0) return { etat: "refuse", motif: anomalies[0].message };

      const corps = {
        from: config.expediteur,
        to: [config.destinataire],
        reply_to: demande.email,
        subject: sujetDuMessage(demande),
        text: corpsDuMessage(demande),
      };

      let reponse: Response;
      try {
        reponse = await fetch(`${config.urlBase}/emails`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.cle}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(corps),
          signal: AbortSignal.timeout(DELAI_MS),
        });
      } catch (erreur) {
        journaliser(erreur);
        return { etat: "indisponible" };
      }

      if (reponse.ok) return { etat: "envoye" };

      let detail: unknown = reponse.status;
      try {
        detail = `${reponse.status} ${JSON.stringify(await reponse.json()).slice(0, 300)}`;
      } catch {
        // Corps illisible : le code HTTP suffit à la trace.
      }
      journaliser(detail);
      return { etat: "indisponible" };
    },
  };
}
