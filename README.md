# Brasserie La Bascule

Site vitrine de la Brasserie La Bascule, microbrasserie artisanale à Vertou (44).

> **Projet de démonstration.** L'entreprise est fictive. Le site sert de projet de portfolio et
> de banc d'essai pour la méthodologie projet web de Thomas Bezille. La mention figure au pied de
> page du site publié.
>
> Documentation, cahier des charges et suivi :
> `mimir/livrables/projet-web-perso/2026-08-26-brasserie-la-bascule/`

---

## Démarrer

Node **24 ou plus** (la version exacte est dans `.nvmrc`).

```bash
nvm use          # facultatif, aligne la version de Node
npm install
cp .env.example .env.local
npm run dev      # http://localhost:3000
```

Aucune variable n'est nécessaire pour lancer le site en local à ce stade : les contenus sont
statiques. `.env.local` ne sert qu'à partir du lot 2 (formulaire) et du lot 3 (agenda).

## Les commandes

| Commande         | Ce qu'elle fait              |
| ---------------- | ---------------------------- |
| `npm run dev`    | Serveur de développement     |
| `npm run build`  | Build de production          |
| `npm start`      | Sert le build                |
| `npm run lint`   | ESLint                       |
| `npm run types`  | Vérification TypeScript      |
| `npm test`       | Vitest, en mode surveillance |
| `npm run format` | Prettier sur tout le dépôt   |

## Stack

Next.js 16 (App Router, génération statique) · React 19 · TypeScript strict · Tailwind CSS 4 ·
déploiement Vercel.

## Organisation du code

```
src/
├── app/            routes et layout. globals.css porte la charte
├── composants/
│   ├── chrome/     en-tête, navigation, pied de page
│   ├── accueil/    blocs propres à la page d'accueil
│   ├── biere/      fiche, visuel, vignette, spécifications
│   └── ui/         éléments transverses
├── donnees/        source unique des contenus structurés
└── lib/            utilitaires, SEO, garde-fous
```

**Le code est en français**, du nom de fichier au nom de variable. Convention arrêtée le
22/09/2026 pour rester cohérente avec l'intégralité du dossier projet.

## Deux règles à connaître avant de toucher au code

### 1. Une couleur de bière ne sort jamais de sa fiche

Correction non négociable de Sophie Vasseur, autrice de l'identité visuelle. Le jaune de
L'Abeille n'est pas une couleur de marque : si une couleur de bière devient la couleur du site,
aucune bière n'a plus d'identité propre sur une étagère de caviste.

En pratique : `globals.css` ne déclare que **trois** couleurs, encre, papier et béton. Les sept
couleurs de bière vivent dans `donnees/bieres.ts` et ne sont injectées qu'en variable CSS locale
`--biere`, sur le conteneur d'une fiche. Rien d'autre dans le site ne peut les atteindre.

Il n'y a **pas de couleur d'accent**. Liens et états se distinguent par le soulignement, la
graisse et la taille. Le test `src/lib/charte.test.ts` fait échouer la CI si une quatrième
couleur apparaît dans la feuille globale.

### 2. Les données publiées ont une source unique

Horaires, prix, durées, effectifs, stationnement : `donnees/infos-pratiques.ts`, et nulle part
ailleurs. Six de ces valeurs étaient fausses dans la maquette parce qu'elles avaient été relevées
à l'oral, et le client les a corrigées le 21/09/2026. Dupliquées dans le code, la prochaine
correction en oubliera une.

**Aucune donnée technique sur les bières n'est écrite si elle ne vient pas de Marc**, co-gérant
brasseur. Un champ absent s'affiche comme absent, il ne s'invente pas.

## Contraintes tenues par le projet

- **Loi Evin.** Message sanitaire sur toute page présentant un produit. Aucune mention
  promotionnelle, la remise de 10 % ne figure nulle part
- **Performance.** Lighthouse 90 et plus, contenu principal affiché en moins de 2,5 s sur
  téléphone en 4G. C'est une exigence du cahier des charges, pas un confort
- **Accessibilité.** Structure sémantique, focus visible, contrastes vérifiés
- **Mesure d'audience sans cookie**, donc sans bandeau de consentement

## Déploiement

Préproduction et production sur Vercel.

### La préproduction est fermée, et c'est le site qui la ferme

La protection par mot de passe de Vercel est réservée à son offre payante. Elle est donc assurée
par le site lui-même, dans `src/proxy.ts` : authentification HTTP Basic sur toutes les routes,
fichiers statiques compris, plus un en-tête `X-Robots-Tag: noindex` et un `robots.txt` fermé.

Deux variables la pilotent :

| Variable               | Rôle                                                                                                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_PUBLIE`          | Vaut `non` jusqu'à la mise en ligne. Passée à `oui`, elle ouvre le site au public et aux moteurs. C'est le seul geste à faire le jour J                                          |
| `MOT_DE_PASSE_PREPROD` | Le mot de passe, défini dans Vercel uniquement. **L'identifiant n'est pas vérifié**, n'importe lequel passe : la fenêtre du navigateur suggère `bascule` pour éviter la question |

**Le comportement en cas d'oubli est fermé, pas ouvert.** Si `MOT_DE_PASSE_PREPROD` manque sur un
déploiement Vercel, le site répond 503. Un mot de passe oublié ne doit jamais se traduire par une
préproduction accessible à tous. En local, l'absence de mot de passe n'applique aucune protection.

> Le `noindex` compte autant que le mot de passe : le site présente une entreprise fictive, il ne
> doit pas se retrouver indexé comme un commerce réel.

Le domaine `labascule.fr` est en cours de transfert. Si le transfert n'aboutit pas à temps, la
mise en ligne se fait sur une adresse temporaire puis bascule, sans décaler la date.
