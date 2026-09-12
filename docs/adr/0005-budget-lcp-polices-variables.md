# ADR 0005 : budget de performance LCP, retrait partiel des axes variables de Fraunces

- **Date :** 2026-09-11
- **Statut :** accepté
- **Projet :** Brasserie La Bascule

## Contexte

Le cahier des charges impose un LCP (contenu principal affiché) sous 2,5 s sur téléphone en 4G,
présenté comme une exigence et non un confort. Trois mesures Lighthouse mobile sur la
préproduction en ligne le dépassaient nettement (1,9 / 3,0 / 3,1 s). En décomposant la trace,
la cause n'était pas l'image du héro (déjà optimisée) mais le poids des polices : Fraunces à elle
seule pesait 172 Ko, plus que l'image, à cause de trois axes variables demandés (`SOFT`, `WONK`,
`opsz`). Deux de ces axes, `SOFT` et `WONK`, ne sont jamais fait varier dans la feuille de style
du site : leur plage complète est téléchargée pour un usage figé.

## Options envisagées

1. **Ne rien changer.** Aucun coût, mais le dépassement du budget de performance reste entier.
2. **Retirer `SOFT` et `WONK`, garder `opsz`** : vérifié à 67 Ko (-44 % sur la police), en
   perdant l'arrondi des terminaisons et les glyphes penchés que ces deux axes apportaient au
   rendu, mais en conservant l'adaptation optique de la police selon la taille du texte (utile sur
   les grands titres).
3. **Tout figer en statique**, aucun axe variable : 18 Ko (-85 %), mais perd aussi `opsz`, dont
   l'intérêt sur les titres (46 à 104 px) est réel.

## Décision

Option 2, tranchée par Thomas après présentation des trois chiffres et de leur coût visuel
respectif. Le changement de rendu est assumé : les titres perdent l'arrondi et l'inclinaison que
l'identité visuelle avait posés, mais restent lisibles et élégants, avec un Fraunces plus
classique.

## Conséquences

- **Positives :** poids de page total ramené de 525 à 471 Ko, poids des polices de 172 à 118 Ko,
  LCP médian amélioré d'environ 0,3 s, variance entre les mesures nettement resserrée.
- **Négatives :** le budget de 2,5 s n'est toujours pas garanti à chaque mesure (2,7-2,8 s sur
  deux mesures sur trois après le correctif) — décision explicite de s'arrêter là plutôt que de
  poursuivre l'optimisation, l'écart restant étant jugé suffisamment réduit. Le cahier des charges
  n'a pas été révisé en conséquence : ce n'est pas le seuil qui a changé, c'est le choix de ne
  plus y travailler.
- **À surveiller :** le seul levier de performance restant identifié est le poids du JavaScript
  (environ 154 Ko, pour l'essentiel le socle Next.js/React), jugé peu compressible sans un
  chantier disproportionné pour le gain attendu. Non engagé.

## Coût récurrent induit

Aucun.
