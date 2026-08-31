import { Surtitre } from "@/composants/ui/Surtitre";
import { stationnement } from "@/donnees/infos-pratiques";

/**
 * Les questions qu'on pose avant de venir.
 *
 * Ce bloc existe pour une raison précise : le visiteur est sur le point
 * d'engager un groupe et une date, et chacune de ces questions sans réponse est
 * un appel au client, ou une réservation qui ne se fait pas.
 *
 * **Le nombre de places de stationnement vient de la source unique.** Vingt
 * places étaient annoncées à tort dans la maquette, le client a corrigé à douze
 * le 21/09/2026 et préfère annoncer ce chiffre : quelqu'un qui trouve la place
 * qu'on lui a promise ne rappelle pas.
 *
 * **Rien ici ne parle des bières ni ne vante la visite** : la loi Evin limite ce
 * qu'on peut écrire autour d'une boisson alcoolisée à des indications
 * objectives, et ces réponses sont toutes matérielles.
 *
 * Le parking n'est pas annoncé « gratuit », et ce n'est pas un oubli. Le
 * contrôle de recette refuse le mot, avec `offert` et `remise`, et il a raison
 * de ratisser large : c'est ce filet qui empêche une formule commerciale
 * d'entrer dans une page six semaines plus tard. Un parking devant un atelier
 * est présumé libre, la phrase ne perd rien, et **le texte s'adapte à la règle
 * plutôt que la règle au texte**.
 */
const questions = [
  {
    question: "Où se garer ?",
    reponse: `Un parking de ${stationnement.places} places devant l'atelier, rue des Vignes. Les cars peuvent déposer devant le portail.`,
  },
  {
    question: "L'atelier est-il accessible ?",
    reponse:
      "L'atelier et la salle de dégustation sont de plain-pied. Seule la passerelle au-dessus des cuves ne l'est pas : elle se contourne sans rien manquer de la visite.",
  },
  {
    question: "Et si quelqu'un ne boit pas d'alcool ?",
    reponse:
      "Dites-le en réservant. Une boisson sans alcool est prévue pour les personnes concernées, et la visite se suit à l'identique.",
  },
  {
    question: "Peut-on venir avec des enfants ?",
    reponse:
      "Oui, la visite se fait en famille. La dégustation est réservée aux personnes majeures.",
  },
] as const;

export function AvantDeVenir() {
  return (
    <section className="px-marge border-trait border-t py-[clamp(56px,9vw,110px)]">
      <div className="mx-auto max-w-[1240px]">
        <Surtitre className="text-papier/55">Avant de venir</Surtitre>
        <h2 className="mt-5 max-w-[18ch] text-[clamp(30px,4.5vw,52px)]">
          Les questions qu&apos;on nous pose.
        </h2>

        <dl className="mt-10 grid gap-x-[clamp(30px,5vw,80px)] gap-y-8 lg:grid-cols-2">
          {questions.map(({ question, reponse }) => (
            <div key={question} className="border-trait border-t pt-5">
              <dt className="text-[18px] font-medium">{question}</dt>
              <dd className="text-papier/60 mt-2 max-w-[52ch] leading-[1.55]">
                {reponse}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
