# Journal des modifications

Les dates sont celles du calendrier du projet.

## [Non publié]

### Ajouté

- Initialisation du projet : Next.js 16, React 19, TypeScript strict, Tailwind CSS 4
- Charte de Sophie Vasseur en tokens : encre, papier, béton, et rien d'autre
- Polices Fraunces (axes SOFT, WONK, opsz) et Work Sans, auto-hébergées
- Outillage qualité : ESLint, Prettier, Vitest, Husky, lint-staged, CI GitHub Actions
- Test de garde-fou sur la charte, qui interdit toute couleur hors des trois du site
- Protection de la préproduction par mot de passe et `noindex`, assurée par le site
  (`src/proxy.ts`), la protection de Vercel étant réservée à son offre payante
- Couche de données : `donnees/bieres.ts`, les six permanentes et la palette de Sophie,
  les champs techniques optionnels tant que Marc ne les a pas fournis
- Couche de données : `donnees/infos-pratiques.ts`, source unique des dix données publiées
  vérifiées par le client le 21/09
- Test de garde-fou loi Evin, qui refuse toute mention promotionnelle dans le site
- En-tête : navigation, bouton « Réserver une visite » visible en permanence sur téléphone
  (correction 8 de Marc), menu déroulant sur petit écran
- Pied de page allégé de moitié (correction 7 de Sophie), horaires lus dans la source unique,
  mention sanitaire de la loi Evin sur toutes les pages
- Composants transverses : logo en repli typographique, surtitre, mention sanitaire
- Mise en forme française des heures, avec espaces insécables
- Pages d'attente pour les routes du menu non encore écrites, en `noindex`
- Fiche de bière et ses deux états, illustration ou repli typographique (correction 3 de Sophie)
- Tableau technique qui affiche l'attente d'une donnée plutôt qu'une valeur inventée
- Une page par bière en génération statique, à l'adresse figée par le cahier des charges
- Vignette de bière, réutilisée en bas de fiche et par l'aperçu de la gamme à venir
- Test de garde-fou d'architecture : une couleur de bière n'est injectée que sur sa fiche
- Dessin de travail du Renard, repris de la maquette, affiché comme provisoire
- Accueil : ouverture avec illustration débordante (correction 2), bande des informations
  pratiques sur le gris béton (correction 5) portant « la boutique est ouverte à tous »
  (correction 9), aperçu de la gamme et appel vers les visites
- Mise en forme française des durées
- Le garde-fou loi Evin reconnaît la formulation « 10 % sur la boutique », qu'aucun de ses
  motifs n'attrapait
