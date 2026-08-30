# CLAUDE.md

Site vitrine de la Brasserie La Bascule. Lire le `README.md` avant tout, il porte les commandes,
l'organisation du code et les contraintes du projet.

## Les trois règles qui ne se discutent pas

1. **Une couleur de bière ne sort jamais de sa fiche.** `globals.css` ne déclare que trois
   couleurs. Les couleurs de bière vivent dans `donnees/bieres.ts` et ne sont injectées qu'en
   variable locale `--biere` sur le conteneur d'une fiche. Pas de couleur d'accent, nulle part.
2. **Aucune donnée technique sur les bières qui ne vienne de Marc.** Degré, IBU, malts, houblons,
   origines : un champ absent s'affiche comme absent. Ne jamais combler un trou par une valeur
   plausible.
3. **Loi Evin.** Message sanitaire sur toute page présentant un produit, aucune mention
   promotionnelle.

## Conventions

- **Tout est en français**, noms de fichiers, composants, types, props, variables, URLs.
- Les données publiées (horaires, prix, durées, stationnement) ont une source unique :
  `donnees/infos-pratiques.ts`.
- Génération statique. Le slug d'une fiche de bière est figé à vie et ne dépend d'aucun état :
  une fiche n'est jamais supprimée, y compris hors saison.
- Avant de proposer un changement de structure, vérifier le plan de développement dans
  `mimir/livrables/projet-web-perso/2026-08-26-brasserie-la-bascule/03-conception/`.
