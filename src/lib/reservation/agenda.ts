import type { Agenda } from "@/lib/reservation/types";

/**
 * Le choix de l'agenda, au seul endroit du site qui connaît des noms de
 * fournisseurs.
 *
 * **Le comportement par défaut est fermé**, comme celui de `src/proxy.ts` :
 * sans configuration complète, il n'y a pas d'agenda, donc pas de formulaire, et
 * la page le dit au visiteur. Le contraire, un formulaire qui s'affiche et
 * remercie sans rien enregistrer, est précisément ce qui a coûté dix-neuf
 * demandes de contact à ce client entre 2023 et 2026.
 *
 * Deux variables, et les deux sont nécessaires :
 *
 * - `AGENDA_FOURNISSEUR` : `meetergo`, `calcom`, ou `simulation` en développement
 * - `AGENDA_CLE_API` : le jeton, qui ne quitte jamais le serveur
 *
 * L'adaptateur réel s'écrira quand le compte sera ouvert et le premier appel
 * réussi. Voir `03-conception/decision-agenda-reservation.md`, section 6 bis :
 * la page de tarifs de Meetergo et sa documentation ne disent pas la même chose
 * sur l'accès à l'API du plan gratuit, et cela se vérifie en ouvrant un compte,
 * pas en lisant.
 */

export type NomDeFournisseur = "meetergo" | "calcom" | "simulation";

const FOURNISSEURS_CONNUS: readonly NomDeFournisseur[] = [
  "meetergo",
  "calcom",
  "simulation",
];

/**
 * `simulation` sert à développer et à démontrer le parcours sans compte. Elle
 * n'a rien à faire sur un site ouvert au public : la fabrique la refuse dès que
 * `SITE_PUBLIE` vaut `oui`, et `agenda.test.ts` fait échouer la CI si cette
 * garde disparaît.
 */
const RESERVE_AU_DEVELOPPEMENT: readonly NomDeFournisseur[] = ["simulation"];

/**
 * Ce qu'on lit de l'environnement, et rien de plus. Volontairement pas
 * `NodeJS.ProcessEnv` : la fonction n'a besoin que de trois variables, et un
 * type plus étroit permet aux tests de lui passer exactement le cas qu'ils
 * décrivent, sans reconstituer un environnement entier.
 */
export type Environnement = Readonly<Partial<Record<string, string>>>;

export type EtatAgenda =
  | { readonly configure: true; readonly fournisseur: NomDeFournisseur }
  | { readonly configure: false; readonly motif: string };

export function etatDeLAgenda(env: Environnement = process.env): EtatAgenda {
  const fournisseur = env.AGENDA_FOURNISSEUR?.trim().toLowerCase();
  const cle = env.AGENDA_CLE_API?.trim();
  const sitePublie = env.SITE_PUBLIE?.trim().toLowerCase() === "oui";

  if (!fournisseur)
    return { configure: false, motif: "AGENDA_FOURNISSEUR n'est pas défini" };

  if (!FOURNISSEURS_CONNUS.includes(fournisseur as NomDeFournisseur))
    return { configure: false, motif: `fournisseur inconnu : ${fournisseur}` };

  const nom = fournisseur as NomDeFournisseur;

  if (sitePublie && RESERVE_AU_DEVELOPPEMENT.includes(nom))
    return {
      configure: false,
      motif: `${nom} est réservé au développement et ne peut pas servir un site publié`,
    };

  if (!cle && nom !== "simulation")
    return { configure: false, motif: "AGENDA_CLE_API n'est pas définie" };

  return { configure: true, fournisseur: nom };
}

/**
 * L'agenda du site, ou `null` s'il n'y en a pas.
 *
 * Renvoyer `null` plutôt que de lever : l'absence d'agenda est un état prévu du
 * site, pas une panne. La page de réservation l'affiche comme tel.
 */
export async function agendaDuSite(
  env: Environnement = process.env,
): Promise<Agenda | null> {
  const etat = etatDeLAgenda(env);
  if (!etat.configure) return null;

  switch (etat.fournisseur) {
    case "simulation": {
      const { agendaDeSimulation } = await import("@/lib/reservation/agenda-simulation");
      return agendaDeSimulation();
    }
    // Les deux adaptateurs réels s'écriront après l'essai comparatif des comptes.
    case "meetergo":
    case "calcom":
      return null;
  }
}
