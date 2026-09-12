import type { Messagerie } from "@/lib/contact/types";

/**
 * Le choix du service de messagerie, au seul endroit du module de contact qui
 * connaît des noms de services.
 *
 * **Le comportement par défaut est fermé**, comme celui de `src/lib/reservation`
 * et de `src/proxy.ts` : sans configuration complète, il n'y a pas de service,
 * donc pas de formulaire, et la page le dit au visiteur. Le contraire, un
 * formulaire qui s'affiche et remercie sans rien transmettre, est précisément ce
 * qui a coûté dix-neuf demandes de contact à ce client entre 2023 et 2026.
 *
 * Quatre variables :
 *
 * - `MESSAGERIE_FOURNISSEUR` : `resend`, ou `simulation` en développement
 * - `MAIL_API_KEY` : la clé, qui ne quitte jamais le serveur
 * - `MAIL_TO` : l'adresse de la brasserie qui reçoit les demandes
 * - `MAIL_FROM` : l'expéditeur vérifié sur le domaine
 *
 * L'adaptateur `resend` est écrit (`messagerie-resend.ts`). Faute de domaine
 * personnalisé pour ce projet fictif (décision du 09/09/2026), il envoie depuis
 * le domaine bac à sable de Resend : `MAIL_FROM` = `onboarding@resend.dev` et
 * `MAIL_TO` = l'adresse exacte du compte Resend, seule destination livrée. Le
 * jour d'un vrai domaine, ces deux variables changent, pas le code.
 * `simulation` reste là pour développer en local sans compte.
 */

type NomDeService = "resend" | "simulation";

const SERVICES_CONNUS: readonly NomDeService[] = ["resend", "simulation"];

/**
 * `simulation` sert à développer et à démontrer le parcours sans compte. Elle
 * n'a rien à faire sur un site ouvert au public : la fabrique la refuse dès que
 * `SITE_PUBLIE` vaut `oui`, et `messagerie.test.ts` fait échouer la CI si cette
 * garde disparaît.
 */
const RESERVE_AU_DEVELOPPEMENT: readonly NomDeService[] = ["simulation"];

/**
 * Ce qu'on lit de l'environnement, et rien de plus. Volontairement pas
 * `NodeJS.ProcessEnv` : un type plus étroit permet aux tests de passer
 * exactement le cas qu'ils décrivent.
 */
export type Environnement = Readonly<Partial<Record<string, string>>>;

export type EtatMessagerie =
  | { readonly configure: true; readonly fournisseur: NomDeService }
  | { readonly configure: false; readonly motif: string };

export function etatDeLaMessagerie(env: Environnement = process.env): EtatMessagerie {
  const fournisseur = env.MESSAGERIE_FOURNISSEUR?.trim().toLowerCase();
  const cle = env.MAIL_API_KEY?.trim();
  const destinataire = env.MAIL_TO?.trim();
  const expediteur = env.MAIL_FROM?.trim();
  const sitePublie = env.SITE_PUBLIE?.trim().toLowerCase() === "oui";

  if (!fournisseur)
    return { configure: false, motif: "MESSAGERIE_FOURNISSEUR n'est pas défini" };

  if (!SERVICES_CONNUS.includes(fournisseur as NomDeService))
    return { configure: false, motif: `service inconnu : ${fournisseur}` };

  const nom = fournisseur as NomDeService;

  if (sitePublie && RESERVE_AU_DEVELOPPEMENT.includes(nom))
    return {
      configure: false,
      motif: `${nom} est réservé au développement et ne peut pas servir un site publié`,
    };

  if (nom !== "simulation") {
    if (!cle) return { configure: false, motif: "MAIL_API_KEY n'est pas définie" };
    if (!destinataire) return { configure: false, motif: "MAIL_TO n'est pas définie" };
    if (!expediteur) return { configure: false, motif: "MAIL_FROM n'est pas définie" };
  }

  return { configure: true, fournisseur: nom };
}

/**
 * Le service de messagerie du site, ou `null` s'il n'y en a pas.
 *
 * Renvoyer `null` plutôt que de lever : l'absence de service est un état prévu
 * du site tant qu'il n'est pas en ligne, pas une panne. La page de contact
 * l'affiche comme tel.
 */
export async function messagerieDuSite(
  env: Environnement = process.env,
): Promise<Messagerie | null> {
  const etat = etatDeLaMessagerie(env);
  if (!etat.configure) return null;

  switch (etat.fournisseur) {
    case "simulation": {
      const { messagerieDeSimulation } =
        await import("@/lib/contact/messagerie-simulation");
      return messagerieDeSimulation();
    }
    case "resend": {
      const { messagerieDeResend } = await import("@/lib/contact/messagerie-resend");
      return messagerieDeResend(env);
    }
  }
}
