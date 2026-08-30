import type { Metadata } from "next";
import { PageEnPreparation } from "@/composants/ui/PageEnPreparation";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageEnPreparation titre="Politique de confidentialité" />;
}
