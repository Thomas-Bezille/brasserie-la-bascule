import type { Metadata } from "next";
import { PageEnPreparation } from "@/composants/ui/PageEnPreparation";

export const metadata: Metadata = {
  title: "Où nous trouver",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageEnPreparation titre="Où nous trouver" />;
}
