import type { Metadata } from "next";
import { ContenuPolitiqueConfidentialite } from "@/composants/legal/ContenuPolitiqueConfidentialite";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Quelles données la Brasserie La Bascule collecte sur ce site, pour quelles finalités, combien de temps elles sont conservées et quels sont vos droits.",
  alternates: { canonical: "/politique-de-confidentialite" },
};

export default function Page() {
  return (
    <main className="flex grow flex-col">
      <ContenuPolitiqueConfidentialite />
    </main>
  );
}
