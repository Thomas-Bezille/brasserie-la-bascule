import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { PopupProjetFictif } from "@/composants/chrome/PopupProjetFictif";

const CLE_FERMETURE = "popup-projet-fictif-ferme";

describe("la popup projet fictif", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("s'affiche par défaut, sans avoir été fermée", () => {
    render(<PopupProjetFictif />);
    expect(
      screen.getByRole("dialog", { name: "Projet de démonstration" }),
    ).toBeInTheDocument();
  });

  it("mentionne clairement le caractère fictif du site", () => {
    render(<PopupProjetFictif />);
    expect(screen.getByText(/entreprise fictive/)).toBeInTheDocument();
  });

  /**
   * Une popup qui réapparaît à chaque page se comporte comme un bandeau de
   * consentement, ce que ce site n'a justement pas.
   */
  it("reste cachée si déjà fermée sur ce navigateur", () => {
    window.localStorage.setItem(CLE_FERMETURE, "1");
    render(<PopupProjetFictif />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("se ferme au clic sur « Compris » et mémorise la fermeture", async () => {
    const utilisateur = userEvent.setup();
    render(<PopupProjetFictif />);

    await utilisateur.click(screen.getByRole("button", { name: "Compris" }));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(window.localStorage.getItem(CLE_FERMETURE)).toBe("1");
  });

  it("se ferme avec la touche Échap", async () => {
    const utilisateur = userEvent.setup();
    render(<PopupProjetFictif />);

    await utilisateur.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(window.localStorage.getItem(CLE_FERMETURE)).toBe("1");
  });

  it("place le focus sur le bouton de fermeture à l'ouverture", () => {
    render(<PopupProjetFictif />);
    expect(screen.getByRole("button", { name: "Compris" })).toHaveFocus();
  });
});
