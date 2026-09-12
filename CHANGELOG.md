# Journal des modifications

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/), avec des sections datées
plutôt que des numéros de version : le site est déployé en continu sur Vercel, il n'y a pas de
publication versionnée. Les dates sont celles des commits, du plus récent au plus ancien.

## [Non publié]

### Corrigé

- Formulaires (contact, réservation) : les erreurs de validation par champ passaient inaperçues
  (aucun rôle d'alerte, pas de mise en avant visuelle, pas de focus renvoyé vers le champ
  concerné). Ajout d'une couleur d'erreur dédiée (seule exception à la charte visuelle, voir
  [ADR 0006](docs/adr/0006-couleur-erreur-formulaires.md)), d'un rôle `alert` et du renvoi
  automatique du focus vers le premier champ en erreur

## 2026-09-12

### Modifié

- Dépendances : `next` / `eslint-config-next` 16.3.5, `typescript` 6.0.3 (étape intermédiaire,
  la 7.0 est bloquée par `typescript-eslint` qui refuse explicitement de tourner dessus tant que
  son support n'est pas prêt), `vitest` 5, `@types/node` 26.5.1. `eslint` reste en 9, bloqué en
  amont par `eslint-plugin-react` (embarqué par `eslint-config-next`), qui ne supporte pas encore
  ESLint 10 en stable

## 2026-09-11

### Ajouté

- Mesure d'audience : Vercel Web Analytics, sans cookie ni bandeau de consentement, données
  déjà couvertes par le sous-traitant Vercel existant (hébergement)

### Corrigé

- Politique de confidentialité : Resend correctement nommé comme sous-traitant e-mail
  (hébergement des données aux États-Unis, clauses contractuelles types), qui remplace une
  entrée générique laissée `à confirmer` depuis son intégration

### Performance

- Polices : retrait des axes variables `SOFT` et `WONK` de Fraunces, jamais utilisés en
  pratique (toujours fixés à une valeur constante) mais téléchargés en intégralité — -54 Ko sur
  le poids de page, LCP mobile mesuré en amélioration nette sur la préproduction

## 2026-09-10

### Ajouté

- Contact : adaptateur Resend pour l'envoi réel des messages du formulaire (`Reply-To` sur
  l'adresse du visiteur, comportement fermé sans configuration)
- Page « Notre histoire », origine de la brasserie et sens du nom
- Contact : anti-spam sans script tiers ni cookie (champ appât caché, jeton horodaté signé)
- « Notre histoire » : quatre photos d'illustration, mise en page mixte bandeau et grille

## 2026-09-09

### Ajouté

- Visites : grille d'horaires de visite publiée (vendredi et samedi), qui filtre tous les
  fournisseurs d'agenda
- Page « Où nous trouver » : remplacement du texte d'attente par la carte (MapLibre GL, tuiles
  libres OpenFreeMap) et la liste des bars et cavistes partenaires

### Corrigé

- Visites : retrait d'un nombre de places affiché par le calendrier, trompeur au regard du
  réglage réel de l'agenda
- « Où nous trouver » : fond de carte resté blanc en préproduction (le bundler n'embarquait pas
  correctement le worker de décodage des tuiles)

### Modifié

- SEO : remplacement d'un nom de domaine non acquis par l'adresse Vercel réelle dans les
  métadonnées, le plan du site et les données structurées
- Coffrets cadeaux publiés sur la page « Où nous trouver »

## 2026-09-08

### Ajouté

- Bières : IBU, malts, houblons, origine des ingrédients et notes de dégustation pour les sept
  bières de la gamme
- Page « Nos bières », grille des sept fiches, remplace la page d'attente
- Page « Mentions légales » complète (éditeur, hébergement, propriété intellectuelle, TVA
  intracommunautaire, numéro d'entrepositaire agréé)
- Image de partage par défaut sur tout le site, et par bière sur chaque fiche
- Contact : numéro de téléphone (préfixe réservé par l'ARCEP aux œuvres de fiction, garanti
  sans abonné réel)
- Visites : calendrier mensuel pour choisir un créneau, remplace une liste déroulante plate

### Corrigé

- Performance : CLS sur les fiches bière (dimensions de l'étiquette non réservées) et priorité
  réseau de l'image de LCP restée basse malgré le préchargement Next.js

### Performance

- Étiquettes et illustrations converties en WebP, poids du dépôt réduit de 78 %

## 2026-09-07

### Ajouté

- Illustrations du Sanglier (animal et étiquette de bouteille), bière de la page Portes ouvertes
- Portes ouvertes reliée au menu principal et au plan du site
- Degré d'alcool des six bières permanentes restantes, lu sur les étiquettes bon à tirer

## 2026-09-04

### Ajouté

- Illustrations définitives des sept bières : l'animal au trait pour les vignettes, l'étiquette
  de bouteille complète pour la fiche
- Page « Portes ouvertes » : programme, dégustation, bandeau d'accueil
- Bandeau Portes ouvertes rendu persistant (sticky, fermable, mémorisé) sur tout le site plutôt
  que la seule page d'accueil

### Corrigé

- Accueil sur téléphone : illustration du héro mal centrée, scroll horizontal causé par une
  légende qui ne pouvait pas passer à la ligne

## 2026-09-02

### Ajouté

- Page Contact et sa messagerie, indépendante du fournisseur d'envoi (repli fermé sans
  configuration)
- Page « Où nous trouver » : atelier, boutique, bloc coffrets (masqué jusqu'à leur mise en vente)
- Étiquettes définitives des bières intégrées

### Corrigé

- Réservation : fenêtre de créneaux ramenée à 8 semaines glissantes, un réglage à 4 mois avait
  vidé l'agenda affiché

## 2026-09-01

### Ajouté

- Politique de confidentialité, sur les traitements réellement effectués par le site
- Réservation : adaptateur Meetergo pour l'agenda de visites

### Corrigé

- Trois corrections visuelles de Sophie Vasseur (identité visuelle) appliquées sur la
  préproduction
- Réservation : transmission des identifiants d'hôtes à Meetergo pour lister les créneaux,
  tolérance aux guillemets superflus dans les variables d'environnement

## 2026-08-31

### Ajouté

- Contraste des couleurs de bière tenu par un calcul plutôt qu'une valeur choisie à l'œil
- Page « Visites et dégustations », sans encore son module de réservation
- Note de dégustation du Renard (bière offerte au lot 1), passée au filtre loi Evin
- Couche de réservation indépendante du fournisseur, formulaire et affichage des créneaux

### Corrigé

- Nom accessible du logo, qui ne portait pas le texte réellement affiché

## 2026-08-30

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
- Données structurées : `Brewery` avec adresse, horaires et formules de visite, `Product` par
  bière, sans baliser une donnée que Marc n'a pas fournie
- Métadonnées par page, adresses canoniques et Open Graph
- `sitemap.xml`, limité aux pages réellement écrites
- Note Google sur l'accueil, comprise dans le socle et absente du plan de développement
- L'adresse publique du site tolère une variable d'environnement vide ou sans protocole,
  au lieu de faire échouer le déploiement
- Contraste du texte secondaire remonté au seuil AA, avec le test qui mesure les opacités
  réellement employées dans le dépôt
- `npm run recette` : relecture du site construit avant tout envoi au client, en CI après le build
