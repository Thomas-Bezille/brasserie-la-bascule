import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Biere } from "@/donnees/bieres";
import { VisuelBiere } from "./VisuelBiere";

const CORBEAU: Biere = {
  slug: "le-corbeau",
  nom: "Le Corbeau",
  type: "Stout",
  couleur: "#4A2F3D",
  etat: "permanente",
  tailleVisuel: "reduite",
};

const avecDessin = (biere: Biere): Biere => ({
  ...biere,
  illustration: "/illustrations/exemple.svg",
});

/**
 * Correction 3 de Sophie, la seule qu'elle a demandé à voir fonctionner avant
 * le reste : la fiche existe dans les deux états, et le repli n'est pas une
 * page d'erreur déguisée.
 */
describe("le repli typographique", () => {
  it("compose le nom quand il n'y a pas d'illustration", () => {
    render(<VisuelBiere biere={CORBEAU} />);
    expect(screen.getByText("Le Corbeau")).toBeInTheDocument();
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("s'efface dès que l'illustration existe", () => {
    render(<VisuelBiere biere={avecDessin(CORBEAU)} />);
    expect(
      screen.getByRole("img", { name: /étiquette du corbeau/i }),
    ).toBeInTheDocument();
  });
});

describe("les étiquettes scannées de 2022", () => {
  /**
   * La Carpe et Le Corbeau montrent le grain du papier au-delà d'une vingtaine
   * de centimètres. Sophie a préféré les afficher plus petits plutôt que de les
   * redessiner, ce qui lui coûterait deux week-ends.
   */
  it("s'affichent plus petites que les autres", () => {
    render(<VisuelBiere biere={avecDessin(CORBEAU)} />);
    expect(screen.getByRole("img")).toHaveClass("max-h-[240px]");
  });

  it("laissent les autres à leur taille normale", () => {
    render(<VisuelBiere biere={avecDessin({ ...CORBEAU, tailleVisuel: undefined })} />);
    expect(screen.getByRole("img")).toHaveClass("max-h-[340px]");
  });
});

describe("un dessin de travail", () => {
  it("le dit, pour qu'il ne passe pas pour l'étiquette définitive", () => {
    render(
      <VisuelBiere biere={{ ...avecDessin(CORBEAU), illustrationProvisoire: true }} />,
    );
    expect(screen.getByText(/illustration provisoire/i)).toBeInTheDocument();
  });

  it("ne le dit pas quand le dessin est celui de Sophie", () => {
    render(<VisuelBiere biere={avecDessin(CORBEAU)} />);
    expect(screen.queryByText(/illustration provisoire/i)).toBeNull();
  });
});
