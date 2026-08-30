import { avisGoogle } from "@/donnees/infos-pratiques";

/**
 * La note Google, comprise dans le socle du devis.
 *
 * **Ce bloc n'était pas au plan de développement.** Le découpage en composants a
 * été fait à partir de la maquette validée et des corrections, sans repasser sur
 * la liste des fonctionnalités vendues du cahier des charges : l'affichage des
 * avis y figure pourtant en priorité haute, et il est bien sur la maquette.
 *
 * **Le verbatim d'avis de la maquette n'est pas repris.** La loi Evin limite le
 * contenu publicitaire d'une boisson alcoolisée à des indications objectives, et
 * la liste est limitative : degré, origine, composition, mode d'élaboration,
 * distinctions. Un témoignage élogieux n'y entre pas, et celui de la maquette
 * parle du carton qu'on remporte. La note et le nombre d'avis, eux, sont des
 * faits vérifiables, et c'est exactement ce que le devis a vendu.
 */
export function NoteGoogle() {
  const note = avisGoogle.note.toLocaleString("fr-FR", { minimumFractionDigits: 1 });

  return (
    <section className="px-marge border-trait border-t py-[clamp(48px,7vw,88px)]">
      <div className="mx-auto flex max-w-[1240px] items-baseline gap-4">
        <span
          className="font-titre text-[70px] leading-none font-semibold"
          style={{ fontVariationSettings: '"SOFT" 30, "WONK" 1' }}
        >
          {note}
        </span>
        <div>
          <p className="text-[18px]">sur {avisGoogle.nombre} avis Google</p>
          {avisGoogle.url ? (
            <a
              href={avisGoogle.url}
              className="text-papier/60 hover:text-papier mt-1 inline-block text-[14px] underline"
              rel="noopener"
            >
              Lire les avis sur Google
            </a>
          ) : (
            <p className="text-papier/55 mt-1 text-[14px]">Mis à jour chaque mois</p>
          )}
        </div>
      </div>
    </section>
  );
}
