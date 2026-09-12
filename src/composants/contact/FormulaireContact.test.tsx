import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { envoyerUnMessage } from "@/app/contact/actions";
import { FormulaireContact } from "@/composants/contact/FormulaireContact";
import { CHAMP_APPAT, CHAMP_JETON } from "@/lib/contact/champs-anti-spam";

vi.mock("@/app/contact/actions", () => ({
  envoyerUnMessage: vi.fn(),
}));

const JETON = "1700000000000.signature";

describe("le formulaire de contact", () => {
  it("rend obligatoires le nom, le courriel et le message, pas le reste", () => {
    render(<FormulaireContact jeton={JETON} />);

    expect(screen.getByLabelText("Votre nom")).toBeRequired();
    expect(screen.getByLabelText("Courriel")).toBeRequired();
    expect(screen.getByLabelText("Votre message")).toBeRequired();
    expect(screen.getByLabelText("Téléphone (facultatif)")).not.toBeRequired();
    expect(screen.getByLabelText("Entreprise (facultatif)")).not.toBeRequired();
  });

  /**
   * Anti-spam sans script tiers : le champ appât doit être hors de l'arbre
   * d'accessibilité et hors tabulation (un humain ne le voit pas, ne le
   * remplit pas), et le jeton du serveur doit être posé tel quel.
   */
  it("cache le champ appât et transporte le jeton anti-spam", () => {
    const { container } = render(<FormulaireContact jeton={JETON} />);

    const appat = container.querySelector<HTMLInputElement>(
      `input[name="${CHAMP_APPAT}"]`,
    );
    expect(appat).not.toBeNull();
    expect(appat!.tabIndex).toBe(-1);
    expect(appat!.getAttribute("autocomplete")).toBe("off");
    // Sous un ancêtre aria-hidden : hors de l'arbre d'accessibilité pour un
    // vrai lecteur d'écran, quoi qu'en dise le sélecteur de Testing Library.
    expect(appat!.closest("[aria-hidden='true']")).not.toBeNull();

    const jeton = container.querySelector<HTMLInputElement>(
      `input[name="${CHAMP_JETON}"]`,
    );
    expect(jeton?.value).toBe(JETON);
    expect(jeton?.type).toBe("hidden");
  });

  /**
   * Le CDC prévoyait une case de consentement. La politique de confidentialité,
   * écrite ensuite, fonde ce traitement sur l'intérêt légitime : une case
   * laisserait croire à un choix qui n'existe pas, puisque refuser rend la
   * réponse impossible. Ce qui est dû, c'est l'information.
   */
  it("informe sur l'usage des données sans faire cocher un faux consentement", () => {
    const { container } = render(<FormulaireContact jeton={JETON} />);

    expect(container.querySelector('input[type="checkbox"]')).toBeNull();
    expect(
      screen.getByText(/servent uniquement à répondre à votre message/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Politique de confidentialité/ }),
    ).toHaveAttribute("href", "/politique-de-confidentialite");
  });

  it("propose les motifs, mais laisse le champ sans réponse par défaut", () => {
    render(<FormulaireContact jeton={JETON} />);

    const motif = screen.getByLabelText(/Votre demande concerne/);
    expect(motif).toHaveValue("");
    expect(
      screen.getByRole("option", { name: "Vente aux bars et cavistes" }),
    ).toBeInTheDocument();
  });

  /**
   * Trouvé par Thomas le 12/09/2026 en testant à la main : un message trop
   * court était refusé, mais l'erreur ne se voyait pas (pas de rôle d'alerte,
   * simple soulignement, pas de focus renvoyé). Ce test verrouille les trois
   * correctifs pour que la régression ne repasse pas inaperçue une deuxième
   * fois.
   */
  it("annonce l'erreur en alerte colorée et y renvoie le focus", async () => {
    vi.mocked(envoyerUnMessage).mockResolvedValue({
      statut: "anomalies",
      anomalies: [
        { champ: "message", message: "Écrivez votre message, quelques mots suffisent." },
      ],
    });

    const utilisateur = userEvent.setup();
    render(<FormulaireContact jeton={JETON} />);

    await utilisateur.click(screen.getByRole("button", { name: /Envoyer le message/ }));

    const alerte = await screen.findByRole("alert");
    expect(alerte).toHaveTextContent("Écrivez votre message, quelques mots suffisent.");
    expect(alerte).toHaveClass("text-erreur");
    expect(screen.getByLabelText("Votre message")).toHaveFocus();
  });
});
