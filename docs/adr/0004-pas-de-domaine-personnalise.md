# ADR 0004 : pas de domaine personnalisé, adresse Vercel comme URL canonique

- **Date :** 2026-09-09
- **Statut :** accepté
- **Projet :** Brasserie La Bascule

## Contexte

Le projet vise une brasserie fictive. Un nom de domaine dédié (`labascule.fr`) avait été envisagé
comme faisant partie du portfolio, mais un domaine acheté et maintenu représente un coût
récurrent pour une entreprise qui n'existe pas et ne génère aucun revenu.

## Options envisagées

1. **Acheter `labascule.fr`**, ou un équivalent. Rendrait le site plus crédible visuellement,
   mais pour un coût récurrent (renouvellement annuel) sans contrepartie : aucun usage réel du
   domaine au-delà de l'affichage.
2. **Utiliser l'adresse fournie gratuitement par Vercel** (`brasserie-la-bascule.vercel.app`)
   comme URL canonique du site, dans les métadonnées, le plan du site et les données
   structurées.
3. **Mutualiser un domaine déjà possédé** sur plusieurs projets de portfolio. Non retenu à ce
   stade : aucun domaine de ce type n'était disponible au moment de la décision.

## Décision

Option 2. L'adresse Vercel devient la référence canonique partout où le site l'utilisait déjà
(`lib/seo.ts`, sitemap, données structurées). L'adresse e-mail `contact@labascule.fr` reste
affichée telle quelle sur le site, comme élément fictif assumé du projet, au même titre que le
numéro de téléphone : ce n'est pas une adresse en attente d'activation.

## Conséquences

- **Positives :** aucun coût récurrent pour un nom de domaine qui n'aurait servi qu'à l'affichage.
- **Négatives :** conséquence directe sur l'adaptateur d'envoi de messages (Resend) — faute de
  domaine personnalisé à vérifier, l'envoi se fait par le domaine bac à sable de Resend
  (`onboarding@resend.dev`), limité à une seule adresse de destination fixe (le compte Resend
  lui-même), impossible à changer sans passer par un vrai domaine.
- **À surveiller :** si un domaine était acquis un jour pour un usage mutualisé sur plusieurs
  projets de portfolio, cette décision serait à revoir avec ses deux conséquences (canonique SEO
  et envoi de messages).

## Coût récurrent induit

Aucun.
