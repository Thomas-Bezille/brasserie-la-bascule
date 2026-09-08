import type { Metadata } from "next";
import { ContenuMentionsLegales } from "@/composants/legal/ContenuMentionsLegales";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Éditeur, hébergement et propriété intellectuelle du site Brasserie La Bascule.",
  alternates: { canonical: "/mentions-legales" },
};

export default function Page() {
  return (
    <main className="flex grow flex-col">
      <ContenuMentionsLegales />
    </main>
  );
}
