/**
 * Mention sanitaire obligatoire, article L. 3323-4 du code de la santé publique.
 *
 * Elle est portée par le pied de page, donc présente sur toutes les pages du
 * site, plutôt que posée page par page sur celles qui présentent un produit.
 * C'est ce que le cahier des charges exige au minimum, et une obligation légale
 * ne se confie pas à la mémoire de celui qui écrira la prochaine page.
 * Le test du pied de page fait échouer la CI si elle disparaît.
 */
export function MessageSanitaire() {
  return (
    <div className="border-trait text-papier/55 mt-12 flex flex-wrap justify-between gap-5 border-t pt-6 text-[12.5px] tracking-[0.05em] uppercase">
      <span>
        L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec
        modération.
      </span>
      <span>Vente interdite aux mineurs de moins de 18 ans</span>
    </div>
  );
}
