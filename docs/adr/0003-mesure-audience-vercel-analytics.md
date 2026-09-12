# ADR 0003 : mesure d'audience, Vercel Web Analytics plutôt que Plausible

- **Date :** 2026-09-11
- **Statut :** accepté
- **Projet :** Brasserie La Bascule

## Contexte

Le site s'interdit tout cookie et tout bandeau de consentement (aucun texte du site ne mentionne
de bandeau, et l'ajouter changerait la promesse faite au visiteur). La mesure d'audience doit
donc être compatible avec cette contrainte dès le départ, pas ajoutée puis rendue conforme après
coup. Google Analytics est écarté sans discussion : basé sur des cookies, il imposerait un
bandeau.

## Options envisagées

1. **Plausible** : outil de référence pour l'analytics sans cookie, hébergé dans l'Union
   Européenne. Environ 6 à 9 €/mois selon le volume, à vie (pas de palier gratuit permanent).
   Nouveau sous-traitant à ajouter à la politique de confidentialité.
2. **Vercel Web Analytics** : gratuit sur le plan Hobby déjà utilisé pour l'hébergement, jusqu'à
   50 000 évènements par mois. Identification par hash de la requête, session jetée à 24 h,
   exemptée de bandeau par la doctrine CNIL. Les données transitent par les serveurs de Vercel,
   déjà sous-traitant déclaré pour l'hébergement.
3. **Ne rien mesurer**. Rejeté : le cahier des charges promet une mesure d'audience au client,
   et le portfolio a besoin de données réelles pour parler de performance en toute connaissance
   de cause.

## Décision

Vercel Web Analytics. Contrairement à Plausible, ce choix ne demande aucun budget récurrent et
ne complexifie pas la politique de confidentialité : le rôle de Vercel comme sous-traitant est
déjà arrêté pour l'hébergement, la mesure d'audience s'ajoute simplement à son entrée existante
plutôt que d'en créer une nouvelle marquée « à confirmer ».

## Conséquences

- **Positives :** aucun coût, aucun sous-traitant supplémentaire à documenter, conforme à
  l'exigence « sans cookie donc sans bandeau » dès l'intégration.
- **Négatives :** dépendance renforcée à Vercel comme plateforme d'hébergement — changer
  d'hébergeur demanderait aussi de reconsidérer l'outil de mesure d'audience.
- **À surveiller :** le palier de 50 000 évènements par mois du plan Hobby, largement suffisant
  pour un site de cette taille, mais à revoir si le trafic changeait d'échelle.

## Coût récurrent induit

Aucun, inclus dans le plan Hobby de Vercel déjà utilisé pour l'hébergement.
