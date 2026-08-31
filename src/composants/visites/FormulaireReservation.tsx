"use client";

import Link from "next/link";
import { useActionState, useId, useMemo, useState } from "react";
import {
  demanderUneReservation,
  FORMULAIRE_VIERGE,
} from "@/app/visites-et-degustations/actions";
import type { Formule } from "@/donnees/infos-pratiques";
import type { Creneau } from "@/lib/reservation/types";

/**
 * Le formulaire de réservation.
 *
 * **Il n'y a pas de case « j'accepte que mes coordonnées soient utilisées ».**
 * La maquette en prévoyait une, et c'est une erreur répandue : le traitement de
 * ces données est nécessaire à l'exécution de la prestation demandée, sa base
 * légale est donc contractuelle et non le consentement. Une case obligatoire
 * laisserait croire à un choix qui n'existe pas, puisque sans coordonnées il n'y
 * a pas de réservation possible. Ce qui est dû à la personne, c'est une
 * information claire, et elle est ci-dessous. Une case ne redeviendrait
 * nécessaire que pour un usage secondaire, une lettre d'information par exemple,
 * qui est hors périmètre.
 *
 * Les créneaux arrivent du serveur, déjà filtrés sur ceux qui ont de la place.
 */

const formaterCreneau = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

export function FormulaireReservation({
  formules,
  creneauxParFormule,
}: {
  formules: readonly Formule[];
  creneauxParFormule: Readonly<Record<string, readonly Creneau[]>>;
}) {
  const [etat, envoyer, enCours] = useActionState(
    demanderUneReservation,
    FORMULAIRE_VIERGE,
  );
  const [formuleChoisie, setFormuleChoisie] = useState(formules[0]?.nom ?? "");
  const identifiant = useId();

  const creneaux = creneauxParFormule[formuleChoisie] ?? [];
  const formule = useMemo(
    () => formules.find((f) => f.nom === formuleChoisie),
    [formules, formuleChoisie],
  );

  const anomalie = (champ: string) =>
    etat.statut === "anomalies"
      ? etat.anomalies.find((a) => a.champ === champ)
      : undefined;

  if (etat.statut === "confirme") {
    return (
      <div className="border-trait border p-[clamp(24px,3.5vw,40px)]" role="status">
        <h3 className="font-titre text-[clamp(24px,3vw,34px)] font-semibold">
          C&apos;est réservé.
        </h3>
        <p className="text-papier/60 mt-4 max-w-[52ch] leading-[1.55]">
          Vous allez recevoir la confirmation par courriel, avec l&apos;adresse et
          l&apos;heure. Votre référence est{" "}
          <strong className="text-papier">{etat.reference}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form action={envoyer} className="max-w-[640px]" noValidate>
      <fieldset className="border-0 p-0">
        <legend className="text-[15px] font-medium">La formule</legend>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {formules.map((f) => (
            <label
              key={f.nom}
              className={`cursor-pointer border px-4 py-2.5 text-[15px] ${
                formuleChoisie === f.nom
                  ? "border-papier bg-papier text-encre"
                  : "border-trait"
              }`}
            >
              <input
                type="radio"
                name="formule"
                value={f.nom}
                checked={formuleChoisie === f.nom}
                onChange={() => setFormuleChoisie(f.nom)}
                className="sr-only"
              />
              {f.nom}
            </label>
          ))}
        </div>
      </fieldset>

      <p className="text-papier/55 mt-3 text-[14px]">
        {formule
          ? `De ${formule.effectifMin} à ${formule.effectifMax} personnes.`
          : "Choisissez une formule."}
      </p>

      <div className="mt-8">
        <label htmlFor={`${identifiant}-creneau`} className="text-[15px] font-medium">
          Le créneau
        </label>
        {creneaux.length === 0 ? (
          <p className="text-papier/60 mt-3">
            Aucun créneau n&apos;est ouvert pour cette formule en ce moment.
          </p>
        ) : (
          <select
            id={`${identifiant}-creneau`}
            name="creneau"
            required
            defaultValue=""
            className="border-trait bg-encre mt-3 w-full border px-3.5 py-3 text-[16px]"
          >
            <option value="" disabled>
              Choisissez un créneau
            </option>
            {creneaux.map((creneau) => (
              <option key={creneau.debut} value={creneau.debut}>
                {formaterCreneau(creneau.debut)} · {creneau.placesRestantes} places
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Champ
          identifiant={`${identifiant}-personnes`}
          nom="nombreDePersonnes"
          libelle="Nombre de personnes"
          type="number"
          anomalie={anomalie("nombreDePersonnes")}
          attributs={{ min: formule?.effectifMin, max: formule?.effectifMax }}
        />
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
          libelle="Téléphone"
          type="tel"
          anomalie={anomalie("telephone")}
        />
        <div className="sm:col-span-2">
          <Champ
            identifiant={`${identifiant}-entreprise`}
            nom="entreprise"
            libelle="Entreprise (facultatif)"
            obligatoire={false}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor={`${identifiant}-message`} className="text-[15px] font-medium">
          Votre message (facultatif)
        </label>
        <textarea
          id={`${identifiant}-message`}
          name="message"
          rows={3}
          className="border-trait bg-encre mt-2 w-full border px-3.5 py-3 text-[16px]"
        />
        <p className="text-papier/55 mt-2 text-[14px]">
          Dites-nous ici si quelqu&apos;un ne boit pas d&apos;alcool, une boisson sans
          alcool est prévue.
        </p>
      </div>

      {etat.statut === "creneau-complet" && (
        <p role="alert" className="border-papier/25 mt-6 border-l-2 pl-4 text-[15px]">
          Ce créneau vient d&apos;être complété. Choisissez-en un autre, votre demande
          n&apos;a pas été enregistrée.
        </p>
      )}

      {etat.statut === "indisponible" && (
        <p role="alert" className="border-papier/25 mt-6 border-l-2 pl-4 text-[15px]">
          La réservation en ligne n&apos;est pas disponible pour le moment.{" "}
          <strong className="text-papier">Votre demande n&apos;a pas été envoyée.</strong>
        </p>
      )}

      <p className="text-papier/55 mt-8 max-w-[58ch] text-[14px] leading-[1.6]">
        Vos coordonnées servent uniquement à traiter cette réservation et à vous joindre
        en cas d&apos;imprévu. Elles ne sont transmises à personne d&apos;autre et ne
        servent à aucun envoi commercial.{" "}
        <Link href="/politique-de-confidentialite" className="underline">
          Politique de confidentialité
        </Link>
        .
      </p>

      <button
        type="submit"
        disabled={enCours || creneaux.length === 0}
        className="bg-papier text-encre hover:bg-papier/85 mt-6 border px-[26px] py-3.5 text-[15px] font-medium transition-colors disabled:opacity-50"
      >
        {enCours ? "Envoi en cours…" : "Réserver ce créneau"}
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
  attributs,
}: {
  identifiant: string;
  nom: string;
  libelle: string;
  type?: string;
  obligatoire?: boolean;
  anomalie?: { readonly message: string };
  attributs?: Record<string, string | number | undefined>;
}) {
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
        aria-describedby={anomalie ? `${identifiant}-anomalie` : undefined}
        className="border-trait bg-encre mt-2 w-full border px-3.5 py-3 text-[16px]"
        {...attributs}
      />
      {anomalie && (
        <p id={`${identifiant}-anomalie`} className="mt-2 text-[14px] underline">
          {anomalie.message}
        </p>
      )}
    </div>
  );
}
