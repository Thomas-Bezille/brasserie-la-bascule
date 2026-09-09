/**
 * Les créneaux de visite se lisent en heure de Vertou (`Date.getHours()`,
 * local au processus). Sans ce réglage, les tests passent en local — la
 * machine de Thomas est à Paris — et échouent sur GitHub Actions, dont les
 * runners tournent en UTC.
 */
process.env.TZ = "Europe/Paris";

import "@testing-library/jest-dom/vitest";
