# ADR 0006 : une couleur d'erreur pour les formulaires, seule exception à la charte

- **Date :** 2026-09-12
- **Statut :** accepté
- **Projet :** Brasserie La Bascule

## Contexte

Le formulaire de contact valide le message envoyé (au moins 10 caractères) et affiche
l'anomalie sous le champ concerné. En le testant à la main, Thomas a envoyé un message trop
court (« test ») : l'envoi a été refusé, mais rien ne l'a alerté sur la raison. Le message
d'erreur existait bien dans le code, mais sans aucun rôle d'alerte pour les technologies
d'assistance, sans mise en avant visuelle au-delà d'un simple soulignement, et sans déplacement
du focus vers le champ concerné — largement insuffisant pour être vu.

La charte du site interdit toute couleur d'accent depuis la correction de Sophie Vasseur du
20/09/2026 (« une couleur de bière ne sort jamais de sa fiche », étendue à l'absence totale de
couleur d'accent décorative). `src/lib/charte.test.ts` fait échouer la CI si une couleur non
prévue apparaît dans `globals.css`.

## Options envisagées

1. **Rester dans les trois couleurs existantes** (encre, papier, béton), en ne comptant que sur
   le gras, le rôle d'alerte et le renvoi du focus. Respecte la charte à la lettre, mais un
   message d'erreur reste visuellement identique au reste du texte du site — seul son
   emplacement et son rôle ARIA le distinguent, insuffisant pour un balayage visuel rapide.
2. **Une couleur dédiée aux erreurs de formulaire**, ajoutée à la liste fermée que
   `charte.test.ts` autorise. Casse la lecture stricte de la règle (« pas de couleur d'accent »)
   mais respecte son intention (aucune couleur de bière ni décorative ne contamine le site) : une
   couleur d'erreur est un signal fonctionnel, pas une décoration.
3. **Une icône plutôt qu'une couleur.** Envisagée puis écartée : demande une ressource visuelle
   supplémentaire (pas dans le périmètre de Sophie), et n'aide pas plus qu'une couleur pour la
   même charge de travail.

## Décision

Option 2, combinée au renvoi de focus et au rôle d'alerte (les trois corrigés dans la même
session). Une seule couleur, `--color-erreur: #e0674f`, ajoutée à `globals.css` et à la liste
fermée de `charte.test.ts`. Contraste vérifié avec `src/lib/contraste.ts` face au fond `encre` :
5,57:1, au-dessus du seuil AA de 4,5 pour du texte normal. Utilisée uniquement sur les messages
d'erreur de validation des formulaires de contact et de réservation, jamais ailleurs.

Ce n'est pas un assouplissement de la règle de Sophie sur les couleurs de bière, qui reste
entière : aucune couleur de bière ne peut sortir de sa fiche, et cette couleur d'erreur n'en est
pas une. C'est la liste des couleurs autorisées du site qui s'allonge d'une unité, pour un usage
fonctionnel et non décoratif, toujours fermée et vérifiée par le même test.

## Conséquences

- **Positives :** un message d'erreur se voit désormais au premier coup d'œil, se fait annoncer
  par les lecteurs d'écran (`role="alert"`), et reçoit le focus clavier automatiquement — plus
  besoin de faire défiler la page à la recherche d'une explication.
- **Négatives :** la charte n'est plus à zéro couleur d'accent au sens strict, ce qui demande de
  garder cette exception documentée (ici, dans `globals.css` et dans le README) pour qu'elle ne
  soit pas prise pour un relâchement général la prochaine fois qu'une couleur est proposée
  ailleurs sur le site.
- **À surveiller :** toute nouvelle demande de couleur doit être comparée à celle-ci : un usage
  fonctionnel et exceptionnel (comme une erreur) est de nature différente d'un usage décoratif
  ou de marque, qui reste interdit.

## Coût récurrent induit

Aucun.
