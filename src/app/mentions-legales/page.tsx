import type { Metadata } from "next";
import { PageEnPreparation } from "@/composants/ui/PageEnPreparation";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageEnPreparation titre="Mentions légales" />;
}
