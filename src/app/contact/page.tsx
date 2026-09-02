import type { Metadata } from "next";
import Link from "next/link";
import { ModuleContact } from "@/composants/contact/ModuleContact";
import { Surtitre } from "@/composants/ui/Surtitre";
import { contact } from "@/donnees/infos-pratiques";

/**
 * La page Contact.
 *
 * Deux voies : le courriel direct, toujours affiché, et le formulaire, qui
 * n&apos;apparaît qu&apos;une fois le service d&apos;envoi branché. Il n&apos;y a
 * pas de numéro de téléphone : aucun n&apos;a été fourni pour publication, et la
 * page est écrite pour s&apos;en passer proprement.
 *
 * Les demandes de visite avec créneau passent par la page Visites : le lien
 * l&apos;indique pour ne pas dédoubler le parcours de réservation.
 */
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Écrire à la Brasserie La Bascule à Vertou : visites de groupe, vente aux bars et aux cavistes, presse, portes ouvertes.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <main className="px-marge mx-auto w-full max-w-[1240px] grow py-[clamp(48px,7vw,96px)]">
      <Surtitre className="text-papier/55">Contact</Surtitre>
      <h1 className="mt-5 max-w-[18ch] text-[clamp(40px,6.5vw,80px)]">Nous écrire.</h1>
      <p className="text-papier/60 mt-8 max-w-[58ch] text-[19px] leading-[1.55]">
        Pour une visite de groupe, la vente en bar ou en cave, la presse, ou toute autre
        question. Pour réserver une visite avec un créneau,{" "}
        <Link href="/visites-et-degustations" className="underline">
          passez par la page Visites
        </Link>
        .
      </p>

      <div className="border-trait mt-12 border-t pt-8">
        <Surtitre as="h2" className="text-papier/55">
          Directement
        </Surtitre>
        <p className="mt-4 text-[19px]">
          <a href={`mailto:${contact.email}`} className="underline">
            {contact.email}
          </a>
        </p>
        <p className="text-papier/55 mt-3 max-w-[52ch] text-[15px]">
          La boutique est ouverte à tous le vendredi et le samedi, sans rendez-vous.
        </p>
      </div>

      <section id="ecrire" className="mt-14">
        <Surtitre as="h2" className="text-papier/55">
          Par le formulaire
        </Surtitre>
        <ModuleContact />
      </section>
    </main>
  );
}
