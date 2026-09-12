import { createHmac, timingSafeEqual } from "node:crypto";
import { CHAMP_APPAT, CHAMP_JETON } from "@/lib/contact/champs-anti-spam";

/**
 * Anti-spam du formulaire de contact, **sans script tiers ni cookie**, dans la
 * lignée du reste du site.
 *
 * Deux pièges, tous deux vérifiés dans l'action serveur (`app/contact/actions.ts`) :
 *
 * 1. **Un champ appât caché** (`CHAMP_APPAT`). Un humain ne le voit pas, ni à
 *    l'écran ni au lecteur d'écran, et ne le remplit pas ; un robot qui remplit
 *    tous les champs le remplit. Rempli = rejeté.
 * 2. **Un jeton horodaté et signé** (`CHAMP_JETON`), posé au rendu de la page et
 *    renvoyé avec le formulaire. On rejette un envoi plus rapide que
 *    `DELAI_MINIMAL_MS` (vitesse de robot) ou plus vieux que `DUREE_DE_VIE_MS`
 *    (page laissée ouverte des heures, ou jeton rejoué). La signature HMAC
 *    empêche de fabriquer un horodatage plausible.
 *
 * **Un envoi rejeté ne renvoie jamais de faux « message envoyé ».** Le rare
 * humain qu'un de ces pièges toucherait (remplissage automatique du champ appât,
 * onglet resté ouvert une demi-journée) voit une erreur claire et le courriel
 * direct juste au-dessus, plutôt que son message perdu en silence. C'est la
 * leçon des dix-neuf demandes disparues de ce client.
 *
 * **Le secret est `CONTACT_FORM_SECRET`** (chaîne aléatoire). Absent, la
 * signature n'est pas vérifiée et seule la fenêtre de temps joue : suffisant en
 * développement, à poser en production comme les autres secrets.
 */

export { CHAMP_APPAT, CHAMP_JETON } from "@/lib/contact/champs-anti-spam";

/** En dessous, l'envoi vient d'un robot : un humain ne remplit pas ce
    formulaire en moins de trois secondes. */
export const DELAI_MINIMAL_MS = 3_000;

/** Au-delà, la page a trop vieilli : on fait recharger plutôt que d'accepter un
    jeton qui a pu être récolté puis rejoué. */
export const DUREE_DE_VIE_MS = 2 * 60 * 60 * 1_000;

type Env = Readonly<Partial<Record<string, string>>>;

function secret(env: Env): string | undefined {
  return env.CONTACT_FORM_SECRET?.trim() || undefined;
}

function signer(charge: string, cle: string): string {
  return createHmac("sha256", cle).update(charge).digest("base64url");
}

/**
 * Le jeton à poser dans un champ caché au rendu du formulaire. Signé si
 * `CONTACT_FORM_SECRET` est défini, sinon réduit au seul horodatage.
 */
export function jetonAntiSpam(
  maintenant: number = Date.now(),
  env: Env = process.env,
): string {
  const charge = String(maintenant);
  const cle = secret(env);
  return cle ? `${charge}.${signer(charge, cle)}` : charge;
}

type MotifDeRejet = "appat" | "trop-rapide" | "perime" | "jeton-invalide";

export type VerdictAntiSpam =
  { readonly ok: true } | { readonly ok: false; readonly motif: MotifDeRejet };

/**
 * Passe une soumission au crible des deux pièges. Ne touche ni au réseau ni à un
 * quelconque stockage : tout est dans le corps de la requête.
 */
export function verifierAntiSpam(
  donnees: FormData,
  maintenant: number = Date.now(),
  env: Env = process.env,
): VerdictAntiSpam {
  const appat = donnees.get(CHAMP_APPAT);
  if (typeof appat === "string" && appat.trim() !== "") {
    return { ok: false, motif: "appat" };
  }

  const jeton = donnees.get(CHAMP_JETON);
  if (typeof jeton !== "string" || jeton === "") {
    return { ok: false, motif: "jeton-invalide" };
  }

  const [charge, signature] = jeton.split(".");
  const horodatage = Number(charge);
  if (!charge || !Number.isFinite(horodatage)) {
    return { ok: false, motif: "jeton-invalide" };
  }

  const cle = secret(env);
  if (cle) {
    const attendue = Buffer.from(signer(charge, cle));
    const recue = Buffer.from(signature ?? "");
    if (recue.length !== attendue.length || !timingSafeEqual(recue, attendue)) {
      return { ok: false, motif: "jeton-invalide" };
    }
  }

  const age = maintenant - horodatage;
  if (age < 0) return { ok: false, motif: "jeton-invalide" };
  if (age > DUREE_DE_VIE_MS) return { ok: false, motif: "perime" };
  if (age < DELAI_MINIMAL_MS) return { ok: false, motif: "trop-rapide" };

  return { ok: true };
}
