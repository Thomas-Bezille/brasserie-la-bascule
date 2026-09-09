import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * `CartePointsDeVente.tsx` pointe `setWorkerUrl` vers une copie statique de
 * ces deux fichiers dans `public/maplibre/`, plutôt que vers ce que Turbopack
 * empaquette lui-même : sans ça, la carte reste blanche (tuiles et style
 * chargés, mais le worker qui les décode ne répond jamais, sans erreur
 * visible). Si `maplibre-gl` change de version sans que la copie suive, la
 * carte casse en silence. Ce test le rend bruyant.
 */
const FICHIERS = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];

describe("la copie statique du worker MapLibre", () => {
  it.each(FICHIERS)("%s est identique à la version installée", (nom) => {
    const installe = readFileSync(
      join(process.cwd(), "node_modules/maplibre-gl/dist", nom),
      "utf-8",
    );
    const copie = readFileSync(join(process.cwd(), "public/maplibre", nom), "utf-8");
    expect(copie).toBe(installe);
  });
});
