# ADR 0001 : protection de la préproduction par le site lui-même

- **Date :** 2026-08-30
- **Statut :** accepté
- **Projet :** Brasserie La Bascule

## Contexte

Le site doit être testable en préproduction (client, relecture) avant sa mise en ligne, sans être
accessible au public ni indexé par les moteurs de recherche entre-temps. Vercel propose une
protection par mot de passe native, mais réservée à ses offres payantes (Pro et au-dessus) ; ce
projet tourne sur le plan Hobby, gratuit.

## Options envisagées

1. **Passer sur un plan Vercel payant** pour la protection native. Simple à activer, mais un coût
   récurrent pour un projet qui n'en a pas besoin par ailleurs (le plan Hobby suffit à tout le
   reste).
2. **Protection applicative**, assurée par le site : authentification HTTP Basic dans le code
   (middleware/proxy), plus un en-tête `X-Robots-Tag: noindex` et un `robots.txt` fermé. Aucun coût,
   mais à écrire et maintenir soi-même.
3. **Aucune protection**, en comptant sur le fait que l'URL de préproduction n'est pas publiée.
   Rejeté d'emblée : une URL Vercel de préproduction est prévisible et peut être devinée ou
   partagée par erreur, et rien n'empêche son indexation.

## Décision

Option 2. L'authentification HTTP Basic est vérifiée dans `src/proxy.ts`, sur toutes les routes y
compris les fichiers statiques, avec un comportement **fermé par défaut** : si le mot de passe
n'est pas configuré sur un déploiement Vercel, le site répond 503 plutôt que de s'ouvrir en
silence. En local, l'absence de mot de passe n'applique aucune protection, pour ne pas gêner le
développement.

## Conséquences

- **Positives :** aucun coût récurrent, protection active dès le premier déploiement, cohérente
  avec le plan Hobby utilisé pour tout le reste du projet.
- **Négatives :** la fenêtre de connexion du navigateur ne peut rien expliquer au visiteur — elle
  réclame un nom d'utilisateur qui n'est pas vérifié, et les navigateurs récents n'affichent plus
  le `realm` par mesure anti-hameçonnage. Le mail qui transmet l'URL doit donc préciser que le
  premier champ est libre. Protection à maintenir dans le code plutôt que déléguée à l'hébergeur.
- **À surveiller :** si le projet devait un jour passer sur une offre Vercel payante pour une
  autre raison, la protection native redeviendrait une option à reconsidérer, plus simple que le
  code applicatif actuel.

## Coût récurrent induit

Aucun.
