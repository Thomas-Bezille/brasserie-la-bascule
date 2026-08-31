import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Entete } from "./Entete";

const cheminCourant = vi.hoisted(() => ({ valeur: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => cheminCourant.valeur }));

beforeEach(() => {
  cheminCourant.valeur = "/";
});

describe("le bouton de réservation", () => {
  /**
   * Correction 8, demandée par Marc le 21/09/2026 : le bouton porte l'objectif
   * n° 1 du site et la maquette le cachait sous 960 px. Tailwind étant
   * mobile-first, une classe `hidden` sans préfixe d'écran le masque sur
   * téléphone : c'est exactement la régression que ce test attrape, et elle
   * s'écrit en un caractère.
   */
  it("reste visible sur téléphone", () => {
    render(<Entete />);
    const bouton = screen.getByRole("link", { name: /réserver/i });

    expect(bouton).toBeInTheDocument();
    expect(bouton.className.split(/\s+/)).not.toContain("hidden");
  });

  it("mène à la page de réservation", () => {
    render(<Entete />);
    expect(screen.getByRole("link", { name: /réserver/i })).toHaveAttribute(
      "href",
      "/visites-et-degustations",
    );
  });
});

describe("le menu sur téléphone", () => {
  it("est fermé au chargement", () => {
    render(<Entete />);
    expect(screen.getByRole("button", { name: /ouvrir le menu/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("s'ouvre et se referme au bouton", async () => {
    const utilisateur = userEvent.setup();
    render(<Entete />);

    await utilisateur.click(screen.getByRole("button", { name: /ouvrir le menu/i }));
    const bouton = screen.getByRole("button", { name: /fermer le menu/i });
    expect(bouton).toHaveAttribute("aria-expanded", "true");

    await utilisateur.click(bouton);
    expect(screen.getByRole("button", { name: /ouvrir le menu/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("se referme quand on choisit une page", async () => {
    const utilisateur = userEvent.setup();
    render(<Entete />);

    await utilisateur.click(screen.getByRole("button", { name: /ouvrir le menu/i }));
    const menu = screen.getByRole("navigation", { name: /téléphone/i });
    await utilisateur.click(within(menu).getByRole("link", { name: "Contact" }));

    expect(screen.getByRole("button", { name: /ouvrir le menu/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("se referme à la touche Échap", async () => {
    const utilisateur = userEvent.setup();
    render(<Entete />);

    await utilisateur.click(screen.getByRole("button", { name: /ouvrir le menu/i }));
    await utilisateur.keyboard("{Escape}");

    expect(screen.getByRole("button", { name: /ouvrir le menu/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});

describe("la page courante", () => {
  it("se signale par aria-current et non par une couleur", () => {
    cheminCourant.valeur = "/nos-bieres";
    render(<Entete />);

    const liens = screen.getAllByRole("link", { name: "Nos bières" });
    expect(liens.length).toBeGreaterThan(0);
    for (const lien of liens) expect(lien).toHaveAttribute("aria-current", "page");
  });

  it("ne marque pas l'accueil quand on est ailleurs", () => {
    cheminCourant.valeur = "/contact";
    render(<Entete />);

    for (const lien of screen.getAllByRole("link", { name: "Accueil" })) {
      expect(lien).not.toHaveAttribute("aria-current");
    }
  });
});

describe("le lien du logo", () => {
  /**
   * WCAG 2.5.3 « intitulé dans le nom » : le nom accessible d'un lien doit
   * contenir le texte qu'on lit dessus. Un aria-label qui reformule le logo
   * l'écrase à la place, et quelqu'un qui pilote son navigateur à la voix
   * demande alors une cible qui n'existe pas. Relevé par Lighthouse le
   * 31/08/2026 sur les deux pages en ligne, avec « Brasserie La Bascule,
   * accueil » posé sur un logo qui affiche « La Bascule ».
   */
  it("annonce le texte que le logo affiche", () => {
    cheminCourant.valeur = "/contact";
    render(<Entete />);

    const lien = screen.getAllByRole("link").find((l) => l.getAttribute("href") === "/");
    expect(lien).toBeDefined();

    const nomAccessible = (lien!.textContent ?? "").replace(/\s+/g, " ").trim();
    expect(nomAccessible).toContain("La Bascule");
    expect(nomAccessible).toContain("Brasserie artisanale");
    expect(lien!).not.toHaveAttribute("aria-label");
  });
});
