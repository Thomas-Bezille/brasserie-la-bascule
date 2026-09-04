import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Relecture du site construit, avant l'envoi au client.
 *
 * Les tests unitaires vérifient des composants isolés ; celui-ci relit les
 * pages telles qu'elles seront servies. C'est la dernière barrière avant qu'un
 * client ne lise sur son site une donnée que personne n'a revérifiée, et c'est
 * la seule qui voie le résultat de l'assemblage.
 *
 * Se lance après le build : `npm run recette`.
 */

const DOSSIER = ".next/server/app";

const ANCIENNES_VALEURS = [
  ["19 h 30", "horaire du vendredi, avancé à 19 h en septembre 2026"],
  ["15 h – 19 h", "ouverture du samedi après-midi, corrigée à 14 h 30"],
  ["3,20", "prix de la 33 cl, passé à 3,50 € en juin"],
  ["6,50", "prix de la 75 cl, passé à 6,90 € en juin"],
  ["20 places", "stationnement, le client préfère annoncer 12 places"],
  ["6,4", "degré du Renard : l'étiquette imprimée porte 6,2 % vol. et fait foi"],
];

const COULEURS_DE_BIERE = {
  "#b25537": "la-rouquine",
  "#5f7a3c": "le-renard",
  "#e3ae2b": "l-abeille",
  "#7fa9a6": "la-carpe",
  "#4a2f3d": "le-corbeau",
  "#9e2b25": "la-guepe",
  "#6b4226": "le-sanglier",
};

/**
 * Ce qui n'a pas le droit d'exister sur un site ouvert au public.
 *
 * Ces marqueurs sont normaux en préproduction et interdits en production : une
 * page d'attente ou un bloc « ça arrive » qui survit à la mise en ligne est une
 * promesse faite au visiteur que personne ne tient. Le contrôle ne s'active
 * qu'avec `SITE_PUBLIE=oui`, c'est-à-dire au seul moment où il compte, et il
 * fait échouer la recette plutôt que de laisser passer.
 *
 * Vise en particulier le bloc de réservation en préparation : la réservation
 * est vendue 600 € et c'est le seul appel à l'action de l'en-tête.
 */
const MARQUEURS_D_ATTENTE = [
  [/en cours d'écriture/i, "page d'attente"],
  [/n'est pas encore rédigée/i, "page d'attente"],
  [/en cours d'installation/i, "bloc en préparation"],
  [/la réservation en ligne arrive/i, "réservation non développée"],
  [/formulaire de contact ouvrira/i, "formulaire de contact non branché"],
  [/carte de nos points de vente est en préparation/i, "points de vente non fournis"],
  [/illustration provisoire/i, "dessin de travail encore en ligne"],
];

const MENTIONS_PROMOTIONNELLES =
  /\bremises?\b|\bpromo|\br[ée]ductions?\b|\bgratuit|\boffert|\d{1,3}\s*%\s*(sur\b|de\s+remise)/i;

const pages = () =>
  readdirSync(DOSSIER, { recursive: true, encoding: "utf-8" })
    .filter((chemin) => chemin.endsWith(".html") && !chemin.startsWith("_"))
    .map((chemin) => ({
      nom: chemin,
      html: readFileSync(join(DOSSIER, chemin), "utf-8"),
    }));

/** Le texte visible, entités décodées et espaces insécables ramenés à l'espace. */
const texteVisible = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;| | /g, " ")
    .replace(/\s+/g, " ");

const fautes = [];
const signaler = (page, message) => fautes.push(`${page} : ${message}`);

for (const { nom, html } of pages()) {
  const texte = texteVisible(html);

  for (const [valeur, explication] of ANCIENNES_VALEURS) {
    if (texte.includes(valeur))
      signaler(nom, `ancienne valeur « ${valeur} » (${explication})`);
  }

  if (process.env.SITE_PUBLIE === "oui") {
    for (const [motif, quoi] of MARQUEURS_D_ATTENTE) {
      if (motif.test(texte))
        signaler(nom, `${quoi} encore en place alors que le site est publié`);
    }
  }

  if (MENTIONS_PROMOTIONNELLES.test(texte)) {
    signaler(nom, "mention promotionnelle, interdite par la loi Evin");
  }

  if (!/l'abus d'alcool est dangereux pour la santé/i.test(texte)) {
    signaler(nom, "mention sanitaire absente");
  }

  const titres = html.match(/<h1[\s>]/g) ?? [];
  if (titres.length !== 1)
    signaler(nom, `${titres.length} titre(s) de niveau 1, il en faut un`);

  /**
   * L'ordre des titres, relevé par Lighthouse le 31/08/2026 sur la page des
   * visites : des cartes en `h3` suivaient directement le `h1`. Un niveau sauté
   * ne se voit pas à l'écran, mais quelqu'un qui parcourt la page au lecteur
   * d'écran perd la structure.
   */
  let precedent = 0;
  for (const [, niveau] of html.matchAll(/<h([1-6])[\s>]/g)) {
    const actuel = Number(niveau);
    if (precedent > 0 && actuel > precedent + 1)
      signaler(
        nom,
        `titre de niveau ${actuel} après un niveau ${precedent}, un niveau est sauté`,
      );
    precedent = actuel;
  }

  for (const [balise] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(balise)) signaler(nom, "une image sans attribut alt");
  }

  for (const [couleur, proprietaire] of Object.entries(COULEURS_DE_BIERE)) {
    if (html.toLowerCase().includes(couleur) && !nom.includes(proprietaire)) {
      signaler(nom, `couleur ${couleur} hors de la fiche ${proprietaire}`);
    }
  }
}

/**
 * **Les pages qu'on n'a pas pu relire.**
 *
 * La recette lit le HTML produit au build. Une page rendue à la requête n'en
 * produit aucun : elle sort donc du contrôle **sans que rien ne le signale**,
 * et c'est arrivé le 31/08/2026 à la page des visites, la plus importante du
 * site, le jour où son module de réservation a dû devenir dynamique pour ne pas
 * afficher des créneaux figés au déploiement. Le compte est passé de 13 pages à
 * 12, et il aurait pu le rester longtemps.
 *
 * Le trou n'est pas refermé ici, il est rendu visible : relire une page
 * dynamique suppose de démarrer un serveur, ce qui est un autre chantier. En
 * attendant, toute route sans HTML est nommée, et la recette échoue si l'une
 * d'elles n'est pas déclarée ci-dessous en connaissance de cause.
 */
const ROUTES_DYNAMIQUES_ADMISES = new Set([
  "/visites-et-degustations", // module de réservation, créneaux lus à la requête
]);

const routesDuBuild = () => {
  const manifeste = JSON.parse(
    readFileSync(join(".next", "app-path-routes-manifest.json"), "utf-8"),
  );
  return Object.values(manifeste).filter(
    (route) =>
      typeof route === "string" &&
      !route.startsWith("/_") &&
      !route.includes("[") &&
      // Écarte ce qui n'est pas une page : icône, plan du site, robots.
      !route.split("/").pop().includes("."),
  );
};

const fichierAttendu = (route) =>
  route === "/" ? "index.html" : `${route.replace(/^\//, "")}.html`;

const relues = new Set(pages().map(({ nom }) => nom));
for (const route of routesDuBuild()) {
  if (relues.has(fichierAttendu(route))) continue;
  if (ROUTES_DYNAMIQUES_ADMISES.has(route)) {
    console.log(`  · ${route} : rendue à la requête, non relue par la recette`);
    continue;
  }
  signaler(
    route,
    "aucun HTML produit : la page échappe à la recette sans que ce soit déclaré",
  );
}

const accueil = pages().find(({ nom }) => nom === "index.html");
if (accueil) {
  const texte = texteVisible(accueil.html).toLowerCase();
  const attendus = [
    ["16 h – 19 h", "horaires du vendredi"],
    ["14 h 30 – 19 h", "réouverture du samedi"],
    ["15 € / personne", "visite découverte"],
    ["25 € / personne", "visite entreprise"],
    ["2 h 30", "durée de la visite entreprise"],
    ["ouverte à tous", "mention réclamée par le client"],
    ["12 rue des Vignes", "adresse"],
  ];
  for (const [valeur, quoi] of attendus) {
    // Comparaison insensible à la casse : « Ouverte à tous » en début de ligne
    // est la même mention que celle du cahier des charges.
    if (!texte.includes(valeur.toLowerCase())) {
      signaler("index.html", `${quoi} absent : « ${valeur} »`);
    }
  }
}

if (fautes.length > 0) {
  console.error(`\n✖ Recette : ${fautes.length} point(s) à corriger\n`);
  for (const faute of fautes) console.error(`  · ${faute}`);
  console.error("");
  process.exit(1);
}

console.log(`✓ Recette : ${pages().length} pages relues, rien à signaler`);
