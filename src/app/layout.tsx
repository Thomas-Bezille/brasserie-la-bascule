import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import { BandeauPortesOuvertes } from "@/composants/chrome/BandeauPortesOuvertes";
import { Entete } from "@/composants/chrome/Entete";
import { PiedDePage } from "@/composants/chrome/PiedDePage";
import { DonneesStructurees } from "@/composants/ui/DonneesStructurees";
import { donneesBrasserie, URL_SITE } from "@/lib/seo";
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
  metadataBase: new URL(URL_SITE),
  title: {
    default: "Brasserie La Bascule · Microbrasserie artisanale à Vertou",
    template: "%s · Brasserie La Bascule",
  },
  description:
    "Six bières permanentes brassées à Vertou, près de Nantes. Boutique, marché du dimanche et visites de l'atelier avec dégustation.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Brasserie La Bascule",
    url: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${policeTitre.variable} ${policeTexte.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <DonneesStructurees donnees={donneesBrasserie()} />
        <Entete />
        {children}
        <PiedDePage />
        <BandeauPortesOuvertes />
      </body>
    </html>
  );
}
