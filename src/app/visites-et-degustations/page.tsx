import type { Metadata } from "next";
import { PageEnPreparation } from "@/composants/ui/PageEnPreparation";

export const metadata: Metadata = {
  title: "Visites et dégustations",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PageEnPreparation titre="Visites et dégustations" />;
}
