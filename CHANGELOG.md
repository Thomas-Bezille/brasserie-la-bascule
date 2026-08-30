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
