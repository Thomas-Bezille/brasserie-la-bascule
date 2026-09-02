import { Surtitre } from "@/composants/ui/Surtitre";

/**
 * Les bars et cavistes partenaires, et leur carte.
 *
 * **En attente de la liste.** Julien a envoyé une liste brute le 30/09 (fil
 * client § 31), renvoyée à son arbitrage le 01/10 (§ 32) : quatre lignes à
 * retirer, deux à trancher, dix-sept à garder, et les adresses complètes
 * manquantes. La carte (fond libre, points cliquables, CDC 5.2) et la liste
 * arrivent avec ces adresses.
 *
 * En attendant, la section existe et dit ce qui manque, plutôt qu'un vide. La
 * recette refuse la mention « en préparation » dès que `SITE_PUBLIE=oui` : la
 * page ne peut pas être publiée dans cet état.
 */
export function PointsDeVente() {
  return (
    <section className="px-marge border-trait border-t py-[clamp(56px,9vw,110px)]">
      <div className="mx-auto max-w-[1240px]">
        <Surtitre className="text-papier/55">Bars et cavistes</Surtitre>
        <h2 className="mt-5 max-w-[22ch] text-[clamp(30px,4.5vw,52px)]">
          Où trouver nos bières ailleurs.
        </h2>
        <p className="text-papier/60 mt-6 max-w-[56ch] text-[19px] leading-[1.55]">
          Une quinzaine de bars et de cavistes servent ou vendent nos bières autour de
          Vertou, Nantes et Clisson. La carte de nos points de vente est en préparation,
          nous finissons de la caler avec la brasserie.
        </p>
      </div>
    </section>
  );
}
