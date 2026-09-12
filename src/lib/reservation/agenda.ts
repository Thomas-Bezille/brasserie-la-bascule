import { filtrerSurLesHorairesDeVisite } from "@/lib/reservation/grille-horaire";
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
 * L'adaptateur `meetergo` est écrit et en service (`agenda-meetergo.ts`), filtré
 * par la grille d'horaires de visite publiée (`grille-horaire.ts`). `calcom`
 * reste un repli de réversibilité déclaré mais jamais implémenté (son
 * adaptateur renvoie `null`, traité comme une absence d'agenda) : Meetergo a
 * suffi, l'écrire n'a jamais été nécessaire.
 */

type NomDeFournisseur = "meetergo" | "calcom" | "simulation";

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

async function agendaBrutDuFournisseur(
  fournisseur: NomDeFournisseur,
  env: Environnement,
): Promise<Agenda | null> {
  switch (fournisseur) {
    case "simulation": {
      const { agendaDeSimulation } = await import("@/lib/reservation/agenda-simulation");
      return agendaDeSimulation();
    }
    case "meetergo": {
      const { agendaDeMeetergo } = await import("@/lib/reservation/agenda-meetergo");
      return agendaDeMeetergo(env);
    }
    // Cal.com reste le repli de réversibilité, son adaptateur n'est pas écrit.
    case "calcom":
      return null;
  }
}

/**
 * L'agenda du site, ou `null` s'il n'y en a pas.
 *
 * Renvoyer `null` plutôt que de lever : l'absence d'agenda est un état prévu du
 * site, pas une panne. La page de réservation l'affiche comme tel.
 *
 * **Les créneaux sont toujours réduits aux horaires de visite publiés**
 * (`grille-horaire.ts`), quel que soit le fournisseur : c'est ici, au seul
 * endroit qui les assemble tous, que la règle s'applique une fois pour toutes,
 * plutôt que dans chaque adaptateur.
 */
export async function agendaDuSite(
  env: Environnement = process.env,
): Promise<Agenda | null> {
  const etat = etatDeLAgenda(env);
  if (!etat.configure) return null;

  const brut = await agendaBrutDuFournisseur(etat.fournisseur, env);
  if (!brut) return null;

  return {
    fournisseur: brut.fournisseur,
    async creneaux(formule, depuis, jusqua) {
      const creneaux = await brut.creneaux(formule, depuis, jusqua);
      return filtrerSurLesHorairesDeVisite(creneaux, formule);
    },
    reserver: (demande) => brut.reserver(demande),
  };
}
