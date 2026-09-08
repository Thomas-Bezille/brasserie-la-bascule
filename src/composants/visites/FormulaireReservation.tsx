"use client";

import Link from "next/link";
import { useActionState, useId, useMemo, useState } from "react";
import { demanderUneReservation } from "@/app/visites-et-degustations/actions";
import { FORMULAIRE_VIERGE } from "@/app/visites-et-degustations/etat-formulaire";
import type { Formule } from "@/donnees/infos-pratiques";
import { formaterHeure } from "@/lib/formats";
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
 * **Un jour fermé et un jour complet reçoivent donc le même traitement** dans
 * `CalendrierCreneaux` ci-dessous : aucun créneau ce jour-là, dans les deux
 * cas, et rien dans la donnée reçue ne distingue pourquoi.
 */

/** `"2026-09-11"`, clé de regroupement par jour civil, lu dans le fuseau du visiteur. */
function cleDuJour(date: Date): string {
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const jour = String(date.getDate()).padStart(2, "0");
  return `${annee}-${mois}-${jour}`;
}

/** L'heure seule d'un créneau, dans le même format que le reste du site. */
function heureDuCreneau(iso: string): string {
  const date = new Date(iso);
  const heures = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return formaterHeure(`${heures}:${minutes}`);
}

/** Les créneaux d'une formule, regroupés par jour civil. */
function creneauxParJour(creneaux: readonly Creneau[]): ReadonlyMap<string, Creneau[]> {
  const groupes = new Map<string, Creneau[]>();
  for (const creneau of creneaux) {
    const cle = cleDuJour(new Date(creneau.debut));
    const groupe = groupes.get(cle);
    if (groupe) groupe.push(creneau);
    else groupes.set(cle, [creneau]);
  }
  return groupes;
}

/**
 * Les semaines d'un mois, lundi en tête, en cases de 7. Les jours hors du
 * mois affiché sont `null` plutôt que ceux du mois voisin : cliquer sur le
 * 31 août dans la grille de septembre en ferait changer de mois sans que
 * l'utilisateur l'ait demandé.
 */
function semainesDuMois(premierJour: Date): (Date | null)[][] {
  const annee = premierJour.getFullYear();
  const mois = premierJour.getMonth();
  const nombreDeJours = new Date(annee, mois + 1, 0).getDate();
  // getDay() donne 0 pour dimanche ; décalé pour que la semaine commence lundi.
  const decalage = (new Date(annee, mois, 1).getDay() + 6) % 7;

  const cases: (Date | null)[] = [
    ...Array.from({ length: decalage }, () => null),
    ...Array.from({ length: nombreDeJours }, (_, i) => new Date(annee, mois, i + 1)),
  ];
  while (cases.length % 7 !== 0) cases.push(null);

  const semaines: (Date | null)[][] = [];
  for (let i = 0; i < cases.length; i += 7) semaines.push(cases.slice(i, i + 7));
  return semaines;
}

const premierJourDuMois = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const JOURS_DE_LA_SEMAINE = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"] as const;

/** Référence stable : un `?? []` inline recréerait un tableau à chaque rendu. */
const CRENEAUX_VIDES: readonly Creneau[] = [];

/**
 * Le calendrier des créneaux, correctif du 08/09/2026 sur une liste `<select>`
 * plate signalée illisible. Grille mensuelle, jours ouverts et disponibles
 * cliquables, le reste grisé sans distinction (voir plus haut). Cliquer sur un
 * jour disponible déplie ses horaires juste en dessous, dans la grille.
 *
 * `key={formule}` sur l'appelant réinitialise mois affiché et jour déplié à
 * chaque changement de formule : plus simple qu'un `useEffect` à surveiller.
 */
function CalendrierCreneaux({
  creneaux,
  creneauChoisi,
  onChoisir,
}: {
  creneaux: readonly Creneau[];
  creneauChoisi: string;
  onChoisir: (debut: string) => void;
}) {
  const parJour = useMemo(() => creneauxParJour(creneaux), [creneaux]);

  const bornes = useMemo(() => {
    const dates = creneaux.map((c) => new Date(c.debut));
    return {
      min: premierJourDuMois(new Date(Math.min(...dates.map((d) => d.getTime())))),
      max: premierJourDuMois(new Date(Math.max(...dates.map((d) => d.getTime())))),
    };
  }, [creneaux]);

  const [moisAffiche, setMoisAffiche] = useState(bornes.min);
  const [jourDeplie, setJourDeplie] = useState<string | null>(null);

  const memeMois = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  const decalerMois = (delta: number) =>
    setMoisAffiche(
      new Date(moisAffiche.getFullYear(), moisAffiche.getMonth() + delta, 1),
    );

  return (
    <div className="border-trait mt-3 border p-[clamp(16px,3vw,24px)]">
      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={memeMois(moisAffiche, bornes.min)}
          onClick={() => decalerMois(-1)}
          aria-label="Mois précédent"
          className="text-papier/70 hover:text-papier disabled:text-papier/25 px-2 py-1 text-[18px] disabled:cursor-default"
        >
          ‹
        </button>
        <p className="text-[15px] font-medium first-letter:uppercase">
          {moisAffiche.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
        </p>
        <button
          type="button"
          disabled={memeMois(moisAffiche, bornes.max)}
          onClick={() => decalerMois(1)}
          aria-label="Mois suivant"
          className="text-papier/70 hover:text-papier disabled:text-papier/25 px-2 py-1 text-[18px] disabled:cursor-default"
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1">
        {JOURS_DE_LA_SEMAINE.map((jour) => (
          <p key={jour} className="text-papier/55 text-center text-[12px]">
            {jour}
          </p>
        ))}

        {semainesDuMois(moisAffiche).map((semaine, indexSemaine) => {
          const cleDepliee = semaine.find(
            (date) => date && cleDuJour(date) === jourDeplie,
          );
          return (
            <div className="contents" key={indexSemaine}>
              {semaine.map((date, indexJour) => {
                if (!date) return <div key={indexJour} aria-hidden />;
                const cle = cleDuJour(date);
                const creneauxDuJour = parJour.get(cle);
                const disponible = !!creneauxDuJour?.length;
                const ouvert = jourDeplie === cle;
                return (
                  <button
                    key={cle}
                    type="button"
                    disabled={!disponible}
                    aria-expanded={disponible ? ouvert : undefined}
                    onClick={() => setJourDeplie(ouvert ? null : cle)}
                    className={`aspect-square text-[14px] ${
                      !disponible
                        ? "text-papier/25 cursor-default"
                        : ouvert
                          ? "border-papier bg-papier text-encre border"
                          : "border-trait hover:border-papier border"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}

              {cleDepliee && (
                <div className="border-trait col-span-7 mt-1 border p-4">
                  <p className="text-[14px] font-medium first-letter:uppercase">
                    {cleDepliee.toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2.5">
                    {parJour.get(jourDeplie!)!.map((creneau) => (
                      <label
                        key={creneau.debut}
                        className={`cursor-pointer border px-4 py-2.5 text-[15px] ${
                          creneauChoisi === creneau.debut
                            ? "border-papier bg-papier text-encre"
                            : "border-trait"
                        }`}
                      >
                        <input
                          type="radio"
                          name="creneau"
                          value={creneau.debut}
                          required
                          checked={creneauChoisi === creneau.debut}
                          onChange={() => onChoisir(creneau.debut)}
                          className="sr-only"
                        />
                        {heureDuCreneau(creneau.debut)} · {creneau.placesRestantes}{" "}
                        {creneau.placesRestantes > 1 ? "places" : "place"}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
  const [creneauChoisi, setCreneauChoisi] = useState("");
  const identifiant = useId();

  const creneaux = creneauxParFormule[formuleChoisie] ?? CRENEAUX_VIDES;
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
                onChange={() => {
                  setFormuleChoisie(f.nom);
                  // Les créneaux d'une formule ne sont pas ceux de l'autre.
                  setCreneauChoisi("");
                }}
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
        <p className="text-[15px] font-medium">Le créneau</p>
        {creneaux.length === 0 ? (
          <p className="text-papier/60 mt-3">
            Aucun créneau n&apos;est ouvert pour cette formule en ce moment.
          </p>
        ) : (
          <>
            <CalendrierCreneaux
              key={formuleChoisie}
              creneaux={creneaux}
              creneauChoisi={creneauChoisi}
              onChoisir={setCreneauChoisi}
            />
            <p className="text-papier/55 mt-3 text-[14px]">
              {creneauChoisi
                ? `Créneau choisi : ${new Date(creneauChoisi).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    },
                  )}, ${heureDuCreneau(creneauChoisi)}.`
                : "Cliquez sur un jour disponible pour voir ses horaires."}
            </p>
          </>
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
