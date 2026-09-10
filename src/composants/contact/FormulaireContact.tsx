"use client";

import Link from "next/link";
import { useActionState, useId } from "react";
import { envoyerUnMessage } from "@/app/contact/actions";
import { FORMULAIRE_CONTACT_VIERGE } from "@/app/contact/etat-formulaire";
import { CHAMP_APPAT, CHAMP_JETON } from "@/lib/contact/champs-anti-spam";
import { MOTIFS } from "@/lib/contact/types";

/**
 * Le formulaire de contact.
 *
 * **Il n'y a pas de case « j'accepte que mes coordonnées soient utilisées ».**
 * Le traitement repose sur l'intérêt légitime de la brasserie à répondre aux
 * personnes qui la sollicitent : une case laisserait croire à un choix qui
 * n'existe pas, puisque refuser rend la réponse impossible. Ce qui est dû, c'est
 * une information claire, et elle est ci-dessous. Voir le formulaire de
 * réservation, même parti pris.
 *
 * Trois champs sont obligatoires : le nom, l'adresse et le message. Le
 * téléphone est mis en avant, le client préférant rappeler qu'écrire, mais il
 * reste facultatif.
 *
 * **Deux champs cachés servent l'anti-spam** (`lib/contact/anti-spam.ts`) : le
 * champ appât, invisible et hors de l'ordre de tabulation, qu'un humain ne
 * remplit pas, et le jeton horodaté fourni par le serveur. Aucun script tiers,
 * aucun cookie.
 */

export function FormulaireContact({ jeton }: { jeton: string }) {
  const [etat, envoyer, enCours] = useActionState(
    envoyerUnMessage,
    FORMULAIRE_CONTACT_VIERGE,
  );
  const identifiant = useId();

  const anomalie = (champ: string) =>
    etat.statut === "anomalies"
      ? etat.anomalies.find((a) => a.champ === champ)
      : undefined;

  if (etat.statut === "envoye") {
    return (
      <div className="border-trait border p-[clamp(24px,3.5vw,40px)]" role="status">
        <h3 className="font-titre text-[clamp(24px,3vw,34px)] font-semibold">
          Message envoyé.
        </h3>
        <p className="text-papier/60 mt-4 max-w-[52ch] leading-[1.55]">
          Nous vous répondons sous deux jours ouvrés. Si c&apos;est urgent, la boutique
          est ouverte à tous le vendredi et le samedi.
        </p>
      </div>
    );
  }

  return (
    <form action={envoyer} className="max-w-[640px]" noValidate>
      {/*
        Anti-spam, sans script tiers ni cookie (lib/contact/anti-spam.ts).
        Le champ appât est sorti de l'affichage et de l'arbre d'accessibilité,
        hors tabulation, sans remplissage automatique : un humain ne le voit
        pas, un robot qui remplit tout le remplit. Le jeton horodaté vient du
        serveur, rendu à la requête pour être frais.
      */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={`${identifiant}-${CHAMP_APPAT}`}>
          Ne remplissez pas ce champ
        </label>
        <input
          id={`${identifiant}-${CHAMP_APPAT}`}
          type="text"
          name={CHAMP_APPAT}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <input type="hidden" name={CHAMP_JETON} defaultValue={jeton} />

      <div>
        <label htmlFor={`${identifiant}-motif`} className="text-[15px] font-medium">
          Votre demande concerne (facultatif)
        </label>
        <select
          id={`${identifiant}-motif`}
          name="motif"
          defaultValue=""
          className="border-trait bg-encre mt-2 w-full border px-3.5 py-3 text-[16px]"
        >
          <option value="">Je préfère ne pas préciser</option>
          {MOTIFS.map((motif) => (
            <option key={motif} value={motif}>
              {motif}
            </option>
          ))}
        </select>
        {anomalie("motif") && (
          <p className="mt-2 text-[14px] underline">{anomalie("motif")!.message}</p>
        )}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Champ
          identifiant={`${identifiant}-nom`}
          nom="nom"
          libelle="Votre nom"
          anomalie={anomalie("nom")}
        />
        <Champ
          identifiant={`${identifiant}-email`}
          nom="email"
          libelle="Courriel"
          type="email"
          anomalie={anomalie("email")}
        />
        <Champ
          identifiant={`${identifiant}-telephone`}
          nom="telephone"
          libelle="Téléphone (facultatif)"
          type="tel"
          obligatoire={false}
          anomalie={anomalie("telephone")}
          aide="Le plus simple pour vous répondre, on préfère souvent rappeler."
        />
        <Champ
          identifiant={`${identifiant}-entreprise`}
          nom="entreprise"
          libelle="Entreprise (facultatif)"
          obligatoire={false}
        />
      </div>

      <div className="mt-5">
        <label htmlFor={`${identifiant}-message`} className="text-[15px] font-medium">
          Votre message
        </label>
        <textarea
          id={`${identifiant}-message`}
          name="message"
          rows={5}
          required
          aria-invalid={anomalie("message") ? true : undefined}
          aria-describedby={
            anomalie("message") ? `${identifiant}-message-anomalie` : undefined
          }
          className="border-trait bg-encre mt-2 w-full border px-3.5 py-3 text-[16px]"
        />
        {anomalie("message") && (
          <p
            id={`${identifiant}-message-anomalie`}
            className="mt-2 text-[14px] underline"
          >
            {anomalie("message")!.message}
          </p>
        )}
      </div>

      {etat.statut === "indisponible" && (
        <p role="alert" className="border-papier/25 mt-6 border-l-2 pl-4 text-[15px]">
          L&apos;envoi du formulaire n&apos;est pas disponible pour le moment.{" "}
          <strong className="text-papier">Votre message n&apos;a pas été envoyé.</strong>{" "}
          Écrivez-nous directement à l&apos;adresse indiquée plus haut.
        </p>
      )}

      {etat.statut === "rejete" && (
        <p role="alert" className="border-papier/25 mt-6 border-l-2 pl-4 text-[15px]">
          <strong className="text-papier">Votre message n&apos;a pas été envoyé.</strong>{" "}
          {etat.message}
        </p>
      )}

      <p className="text-papier/55 mt-8 max-w-[58ch] text-[14px] leading-[1.6]">
        Vos coordonnées servent uniquement à répondre à votre message. Elles ne sont
        transmises à personne d&apos;autre et ne servent à aucun envoi commercial.{" "}
        <Link href="/politique-de-confidentialite" className="underline">
          Politique de confidentialité
        </Link>
        .
      </p>

      <button
        type="submit"
        disabled={enCours}
        className="bg-papier text-encre hover:bg-papier/85 mt-6 border px-[26px] py-3.5 text-[15px] font-medium transition-colors disabled:opacity-50"
      >
        {enCours ? "Envoi en cours…" : "Envoyer le message"}
      </button>
    </form>
  );
}

function Champ({
  identifiant,
  nom,
  libelle,
  type = "text",
  obligatoire = true,
  anomalie,
  aide,
}: {
  identifiant: string;
  nom: string;
  libelle: string;
  type?: string;
  obligatoire?: boolean;
  anomalie?: { readonly message: string };
  aide?: string;
}) {
  const idAide = aide ? `${identifiant}-aide` : undefined;
  const idAnomalie = anomalie ? `${identifiant}-anomalie` : undefined;
  const decritPar = [idAide, idAnomalie].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={identifiant} className="text-[15px] font-medium">
        {libelle}
      </label>
      <input
        id={identifiant}
        name={nom}
        type={type}
        required={obligatoire}
        aria-invalid={anomalie ? true : undefined}
        aria-describedby={decritPar}
        className="border-trait bg-encre mt-2 w-full border px-3.5 py-3 text-[16px]"
      />
      {aide && (
        <p id={idAide} className="text-papier/55 mt-2 text-[14px]">
          {aide}
        </p>
      )}
      {anomalie && (
        <p id={idAnomalie} className="mt-2 text-[14px] underline">
          {anomalie.message}
        </p>
      )}
    </div>
  );
}
