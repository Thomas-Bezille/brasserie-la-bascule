# ADR 0002 : agenda de réservation, Meetergo plutôt que Cal.com

- **Date :** 2026-09-01
- **Statut :** accepté
- **Projet :** Brasserie La Bascule

## Contexte

Le site vend un module de réservation de visites (formule découverte et formule entreprise), qui
a besoin d'un agenda en ligne réel : créneaux, disponibilité, confirmation. Budget de portfolio,
donc un service gratuit ou à coût minime est préférable, sans sacrifier la fiabilité.

## Options envisagées

1. **Meetergo** : plan gratuit, accès API confirmé par un essai direct avec un jeton personnel
   (Personal Access Token). Types de rendez-vous configurables séparément par formule.
2. **Cal.com** : alternative sérieuse, également dotée d'un plan gratuit et d'une API. Envisagée
   comme solution de repli en cas de blocage sur Meetergo, mais jamais testée en pratique faute
   de besoin.
3. **Développement d'un agenda maison** (créneaux et réservations en base de données propre).
   Rejeté d'emblée : complexité et charge de maintenance disproportionnées face à des services
   existants qui couvrent déjà le besoin gratuitement.

## Décision

Meetergo, une fois l'accès API vérifié en pratique. L'intégration est isolée derrière une
interface commune (`src/lib/reservation/agenda.ts`), qui ne connaît des noms de fournisseurs
qu'à un seul endroit : changer de service ne demanderait de toucher qu'un adaptateur, pas le
reste du site. Cal.com reste déclaré dans le type des fournisseurs connus comme repli de
réversibilité, mais son adaptateur n'a jamais été écrit, Meetergo ayant suffi.

## Conséquences

- **Positives :** intégration rapide, aucun coût, la sortie de créneaux respecte nativement
  les contraintes du site (délai avant réservation, fenêtre glissante) une fois les bons réglages
  posés côté Meetergo.
- **Négatives :** dépendance à l'API et aux limites du plan gratuit de Meetergo (nombre de
  requêtes, fonctionnalités avancées réservées aux offres payantes) ; le repli Cal.com n'étant
  pas implémenté, un changement de fournisseur demanderait un vrai développement, pas une bascule
  de configuration.
- **À surveiller :** toute évolution tarifaire ou fonctionnelle de Meetergo qui remettrait en
  cause le plan gratuit.

## Coût récurrent induit

Aucun, tant que le plan gratuit de Meetergo suffit au volume du site.
