import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DonneesStructurees } from "./DonneesStructurees";

describe("le bloc de données structurées", () => {
  it("échappe les chevrons, qui fermeraient la balise", () => {
    const { container } = render(
      <DonneesStructurees donnees={{ name: "</script><img onerror=1>" }} />,
    );
    const script = container.querySelector("script");

    expect(script?.innerHTML).not.toContain("</script>");
    expect(script?.innerHTML).toContain("\\u003c");
  });

  it("reste du JSON valide une fois échappé", () => {
    const { container } = render(<DonneesStructurees donnees={{ name: "La Guêpe" }} />);
    const brut = container.querySelector("script")?.innerHTML ?? "";

    expect(JSON.parse(brut.replace(/\\u003c/g, "<"))).toEqual({ name: "La Guêpe" });
  });
});
