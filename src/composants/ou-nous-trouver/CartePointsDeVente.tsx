"use client";

import { useEffect, useRef } from "react";
import type { PointDeVente } from "@/donnees/points-de-vente";

import "maplibre-gl/dist/maplibre-gl.css";

/**
 * La carte des points de vente.
 *
 * **Fond de carte libre, sans compte de facturation** (CDC 5.2) : MapLibre GL,
 * une bibliothèque libre, sur les tuiles vectorielles gratuites d'OpenFreeMap —
 * pas de clé, pas d'abonnement, pas de traceur publicitaire. C'est la carte des
 * données OpenStreetMap, pas Google Maps.
 *
 * **La carte est un complément visuel, pas la source d'information.** Le clic
 * sur un point n'est pas un geste garanti au clavier ou au lecteur d'écran :
 * chaque nom et chaque adresse figurent aussi dans la liste texte à côté, qui
 * reste la version qui fait foi.
 *
 * Chargée uniquement côté client : MapLibre dessine sur un `<canvas>`, qui
 * n'existe pas au rendu serveur.
 *
 * **`setWorkerUrl` pointe vers `public/maplibre/`, pas vers le fichier que
 * Turbopack empaquette lui-même.** Sans ça, la carte restait blanche : le
 * style et les tuiles se chargeaient (confirmé au réseau), mais le worker qui
 * décode les tuiles vectorielles ne renvoyait jamais de résultat, sans la
 * moindre erreur. Les deux fichiers copiés (`maplibre-gl-worker.mjs` et sa
 * dépendance `maplibre-gl-shared.mjs`) viennent tels quels de
 * `node_modules/maplibre-gl/dist/` : à recopier si `maplibre-gl` change de
 * version, `maplibre-worker-copie.test.ts` fait échouer la CI si on l'oublie.
 *
 * **Le texte de la popup porte sa propre couleur, en style inline.** Son fond
 * reste blanc, réglé par MapLibre : sans cette couleur, le texte hérite du
 * papier clair du site et devient illisible sur ce fond clair.
 */
export function CartePointsDeVente({ points }: { points: readonly PointDeVente[] }) {
  const conteneur = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conteneur.current || points.length === 0) return;

    let carteACeMoment: import("maplibre-gl").Map | undefined;
    let annule = false;

    import("maplibre-gl").then((maplibregl) => {
      if (annule || !conteneur.current) return;

      maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

      const carte = new maplibregl.Map({
        container: conteneur.current,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: [points[0].longitude, points[0].latitude],
        zoom: 11,
        attributionControl: { compact: true },
      });
      carteACeMoment = carte;

      carte.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "top-right",
      );

      const limites = new maplibregl.LngLatBounds();

      for (const point of points) {
        const marqueur = document.createElement("div");
        marqueur.className = "bg-papier border-encre size-3.5 rounded-full border-2";
        marqueur.setAttribute("aria-hidden", "true");

        new maplibregl.Marker({ element: marqueur })
          .setLngLat([point.longitude, point.latitude])
          .setPopup(
            new maplibregl.Popup({ offset: 14, closeButton: false }).setHTML(
              `<div style="color:#14110f"><strong>${echapper(point.nom)}</strong><br>${echapper(point.adresse)}, ${echapper(point.commune)}</div>`,
            ),
          )
          .addTo(carte);

        limites.extend([point.longitude, point.latitude]);
      }

      if (points.length > 1) carte.fitBounds(limites, { padding: 48, maxZoom: 14 });
    });

    return () => {
      annule = true;
      carteACeMoment?.remove();
    };
  }, [points]);

  return (
    <div
      ref={conteneur}
      role="img"
      aria-label="Carte de situation des points de vente autour de Vertou et Nantes"
      className="border-trait h-[420px] w-full border"
    />
  );
}

/** Le HTML de la popup est construit à la main : on échappe ce qu'on y met. */
function echapper(texte: string): string {
  return texte
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
