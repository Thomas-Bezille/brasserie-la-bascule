# Brasserie La Bascule

[![CI](https://github.com/Thomas-Bezille/brasserie-la-bascule/actions/workflows/ci.yml/badge.svg)](https://github.com/Thomas-Bezille/brasserie-la-bascule/actions/workflows/ci.yml)
[![Licence MIT](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENSE)

Site vitrine d'une microbrasserie artisanale à Vertou (44) : gamme de bières, réservation de
visites en ligne, formulaire de contact avec envoi réel, carte des points de vente.

> **Projet de démonstration.** L'entreprise est fictive. Le site sert de projet de portfolio et
> de banc d'essai pour la méthodologie projet web de Thomas Bezille : cadrage, cahier des
> charges, conception, développement en continu (65 pull requests à ce jour), performance,
> accessibilité, conformité (RGPD, loi Evin). La mention figure au pied de page du site publié.
>
> Documentation complète (cahier des charges, suivi de projet, échanges client fictifs) :
> `mimir/livrables/projet-web-perso/2026-08-26-brasserie-la-bascule/`, dans le dépôt du reste de
> la méthodologie de Thomas Bezille.

**Démo en ligne :** [brasserie-la-bascule.vercel.app](https://brasserie-la-bascule.vercel.app)
(protégée par mot de passe tant que le site n'est pas officiellement lancé — voir
[Déploiement](#déploiement)).

---

## Fonctionnalités

- **Gamme de sept bières**, fiche dédiée par bière en génération statique, données structurées
  `Product` pour chacune
- **Réservation de visites en ligne** (formule découverte et formule entreprise), agenda
  Meetergo, créneaux réduits aux horaires réellement publiés, calendrier mensuel
- **Formulaire de contact avec envoi réel** (adaptateur Resend), anti-spam sans script tiers ni
  cookie (champ appât, jeton horodaté signé)
- **Carte des points de vente** (bars, cavistes), MapLibre GL sur des tuiles libres
  (OpenFreeMap), sans dépendance à Google Maps
- **Mesure d'audience sans cookie** (Vercel Web Analytics), donc sans bandeau de consentement
- **Référencement complet** : métadonnées par page, Open Graph, données structurées `Brewery` et
  `Product`, plan du site limité aux pages réellement écrites
- **Préproduction fermée au public et aux moteurs de recherche**, par le site lui-même, sans
  dépendre d'une offre payante de l'hébergeur
- **Garde-fous automatisés** : une couleur de bière ne peut pas s'échapper de sa fiche, aucune
  mention promotionnelle ne peut apparaître (loi Evin), une donnée corrigée par le client ne peut
  pas réapparaître — tous vérifiés en intégration continue

## Stack technique

Next.js 16 (App Router, génération statique) · React 19 · TypeScript strict · Tailwind CSS 4 ·
Vitest · ESLint · Prettier · Husky · déploiement continu sur Vercel.

## Démarrer

Node **24 ou plus** (la version exacte est dans `.nvmrc`).

```bash
nvm use          # facultatif, aligne la version de Node
npm install
cp .env.example .env.local
npm run dev      # http://localhost:3000
```

Aucune variable n'est requise pour lancer le site en local avec son contenu statique. Le
formulaire de contact et l'agenda de réservation ont besoin de leurs variables respectives pour
fonctionner réellement ; sans elles, les pages concernées l'affichent clairement au visiteur
plutôt que de simuler un envoi qui n'aurait pas lieu. Le détail de chaque variable est commenté
dans `.env.example`, à copier en `.env.local` et à ne jamais commiter.

## Les commandes

| Commande          | Ce qu'elle fait                                |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Serveur de développement                       |
| `npm run build`   | Build de production                            |
| `npm start`       | Sert le build                                  |
| `npm run lint`    | ESLint                                         |
| `npm run types`   | Vérification TypeScript                        |
| `npm test`        | Vitest, en mode surveillance                   |
| `npm run format`  | Prettier sur tout le dépôt                     |
| `npm run recette` | Relit le site construit, après `npm run build` |

## Organisation du code

```
src/
├── app/            routes et layout. globals.css porte la charte
├── composants/
│   ├── chrome/     en-tête, navigation, pied de page
│   ├── accueil/    blocs propres à la page d'accueil
│   ├── biere/      fiche, visuel, vignette, spécifications
│   ├── contact/    formulaire, anti-spam
│   ├── ou-nous-trouver/  carte MapLibre, liste des points de vente
│   └── ui/         éléments transverses
├── donnees/        source unique des contenus structurés
└── lib/
    ├── contact/      messagerie (Resend), anti-spam
    ├── reservation/  agenda (Meetergo), grille d'horaires
    └── ...           SEO, garde-fous, utilitaires

docs/adr/           décisions d'architecture (contexte, options, conséquences)
scripts/recette.mjs relecture du site construit avant tout envoi
```

**Le code est en français**, du nom de fichier au nom de variable. Convention arrêtée le
22/09/2026 pour rester cohérente avec l'intégralité du dossier projet.

## Décisions d'architecture

Les choix techniques significatifs sont documentés en [ADR](docs/adr/) : contexte, options
envisagées, ce qui a été retenu et pourquoi, conséquences assumées. Par exemple, pourquoi la
protection de la préproduction est assurée par le site plutôt que par l'hébergeur
([0001](docs/adr/0001-protection-preproduction-applicative.md)), ou l'arbitrage posé entre poids
des polices et fidélité à l'identité visuelle pour tenir le budget de performance
([0005](docs/adr/0005-budget-lcp-polices-variables.md)).

## Deux règles à connaître avant de toucher au code

### 1. Une couleur de bière ne sort jamais de sa fiche

Correction non négociable de Sophie Vasseur, autrice de l'identité visuelle. Le jaune de
L'Abeille n'est pas une couleur de marque : si une couleur de bière devient la couleur du site,
aucune bière n'a plus d'identité propre sur une étagère de caviste.

En pratique : `globals.css` ne déclare que **trois** couleurs de contenu, encre, papier et béton.
Les sept couleurs de bière vivent dans `donnees/bieres.ts` et ne sont injectées qu'en variable
CSS locale `--biere`, sur le conteneur d'une fiche. Rien d'autre dans le site ne peut les
atteindre.

Il n'y a **pas de couleur d'accent décorative**. Liens et états se distinguent par le
soulignement, la graisse et la taille. Le test `src/lib/charte.test.ts` fait échouer la CI si une
couleur non prévue apparaît dans la feuille globale. **Seule exception, posée le 12/09/2026** :
`--color-erreur`, réservée aux erreurs de validation des formulaires — sans elle, un message
d'erreur trop discret passait inaperçu ([ADR 0006](docs/adr/0006-couleur-erreur-formulaires.md)).

### 2. Les données publiées ont une source unique

Horaires, prix, durées, effectifs, stationnement : `donnees/infos-pratiques.ts`, et nulle part
ailleurs. Six de ces valeurs étaient fausses dans la maquette parce qu'elles avaient été relevées
à l'oral, et le client les a corrigées le 21/09/2026. Dupliquées dans le code, la prochaine
correction en oubliera une.

**Aucune donnée technique sur les bières n'est écrite si elle ne vient pas de Marc**, co-gérant
brasseur. Un champ absent s'affiche comme absent, il ne s'invente pas.

## La recette, avant tout envoi au client

`npm run build && npm run recette` relit les pages **telles qu'elles seront servies**, ce qu'aucun
test de composant ne fait. Elle échoue si une page a perdu sa mention sanitaire, si une ancienne
valeur corrigée par le client est réapparue, si une mention promotionnelle s'est glissée dans un
texte, si une couleur de bière est sortie de sa fiche, si une image n'a pas d'alternative ou si une
page n'a pas exactement un titre de niveau 1.

Elle tourne en intégration continue après le build. Elle est aussi le dernier geste à faire avant
d'envoyer une adresse de préproduction au client.

## Contraintes tenues par le projet

- **Loi Evin.** Message sanitaire sur toute page présentant un produit. Aucune mention
  promotionnelle, la remise de 10 % ne figure nulle part
- **Performance.** Lighthouse 90 et plus, contenu principal affiché en moins de 2,5 s sur
  téléphone en 4G. C'est une exigence du cahier des charges, pas un confort (voir
  [ADR 0005](docs/adr/0005-budget-lcp-polices-variables.md) pour l'arbitrage posé face au
  dépassement mesuré)
- **Accessibilité.** Structure sémantique, focus visible, contrastes vérifiés
- **Mesure d'audience sans cookie**, donc sans bandeau de consentement
- **RGPD.** Politique de confidentialité qui ne documente que les traitements réels, sous-traitants
  identifiés (hébergement et mesure d'audience chez Vercel, envoi de messages chez Resend)

## Déploiement

Préproduction et production sur Vercel, en déploiement continu depuis `main`.

### La préproduction est fermée, et c'est le site qui la ferme

La protection par mot de passe de Vercel est réservée à son offre payante. Elle est donc assurée
par le site lui-même, dans `src/proxy.ts` : authentification HTTP Basic sur toutes les routes,
fichiers statiques compris, plus un en-tête `X-Robots-Tag: noindex` et un `robots.txt` fermé (le
choix et ses alternatives : [ADR 0001](docs/adr/0001-protection-preproduction-applicative.md)).

Deux variables la pilotent :

| Variable               | Rôle                                                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_PUBLIE`          | Vaut `non` jusqu'à la mise en ligne. Passée à `oui`, elle ouvre le site au public et aux moteurs. C'est le seul geste à faire le jour J |
| `MOT_DE_PASSE_PREPROD` | Le mot de passe, défini dans Vercel uniquement. **L'identifiant n'est pas vérifié**, n'importe lequel passe                             |

> **La fenêtre de connexion ne peut rien expliquer.** Elle réclame un nom d'utilisateur alors que
> seul le mot de passe compte, et les navigateurs n'affichent plus le `realm`, par mesure
> anti-hameçonnage. Le mail qui donne l'URL doit donc préciser que le premier champ est libre.

**Le comportement en cas d'oubli est fermé, pas ouvert.** Si `MOT_DE_PASSE_PREPROD` manque sur un
déploiement Vercel, le site répond 503. Un mot de passe oublié ne doit jamais se traduire par une
préproduction accessible à tous. En local, l'absence de mot de passe n'applique aucune protection.

> Le `noindex` compte autant que le mot de passe : le site présente une entreprise fictive, il ne
> doit pas se retrouver indexé comme un commerce réel.

Le site n'a pas de domaine personnalisé : l'adresse `brasserie-la-bascule.vercel.app` est
l'adresse canonique, choix documenté en [ADR 0004](docs/adr/0004-pas-de-domaine-personnalise.md).

## Licence

[MIT](LICENSE). Projet de démonstration : le code est librement réutilisable, les contenus
présentant la brasserie fictive (textes, données, identité visuelle) ne le sont pas.

## Auteur

**Thomas Bezille** — développeur web, région de Nantes.
