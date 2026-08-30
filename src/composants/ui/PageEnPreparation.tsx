import { Surtitre } from "@/composants/ui/Surtitre";

/**
 * Page annoncée au menu mais pas encore écrite.
 *
 * **Pourquoi elle existe.** La préproduction du 25 ne porte que l'accueil et une
 * fiche de bière, alors que le menu, lui, doit être complet : c'est le menu que
 * Sophie doit juger. Sans cette page, un clic sur « Contact » répondrait 404, et
 * une erreur serveur au milieu d'une revue de design est un bruit qui mange le
 * temps de la revue.
 *
 * Elle porte `noindex` en propre, indépendamment du verrou de préproduction :
 * une page d'attente qu'on aurait oublié de remplacer ne doit en aucun cas se
 * retrouver dans un moteur de recherche.
 */
export function PageEnPreparation({ titre }: { titre: string }) {
  return (
    <main className="px-marge mx-auto w-full max-w-[1240px] grow py-24">
      <Surtitre className="text-papier/40">En cours d&apos;écriture</Surtitre>
      <h1 className="mt-6 text-[clamp(38px,6vw,68px)]">{titre}</h1>
      <p className="text-papier/60 mt-8 max-w-[62ch]">
        Cette page fait partie du site mais n&apos;est pas encore rédigée. La
        préproduction du 25 septembre porte l&apos;accueil et une fiche de bière, sur les
        données réelles.
      </p>
    </main>
  );
}
