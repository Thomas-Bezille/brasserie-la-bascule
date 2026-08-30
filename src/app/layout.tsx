import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";

// Titres. Axes variables demandés par Sophie : SOFT arrondit les terminaisons,
// WONK active les glyphes penchés, opsz adapte le dessin à la taille.
// Fraunces remplace Recoleta, dont la licence est desktop uniquement.
const policeTitre = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--police-titre",
  display: "swap",
});

const policeTexte = Work_Sans({
  subsets: ["latin"],
  variable: "--police-texte",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Brasserie La Bascule · Microbrasserie artisanale à Vertou",
    template: "%s · Brasserie La Bascule",
  },
  description:
    "Six bières permanentes brassées à Vertou, près de Nantes. Boutique, marché du dimanche et visites de l'atelier avec dégustation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${policeTitre.variable} ${policeTexte.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
