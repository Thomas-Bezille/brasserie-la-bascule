import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { etatDeLaMessagerie, messagerieDuSite } from "@/lib/contact/messagerie";
import {
  messagesDeSimulation,
  oublierLesMessagesDeSimulation,
} from "@/lib/contact/messagerie-simulation";
import type { DemandeDeContact } from "@/lib/contact/types";

const demande = (modifications: Partial<DemandeDeContact> = {}): DemandeDeContact => ({
  nom: "Camille Rouaud",
  email: "camille@exemple.fr",
  message: "Bonjour, je souhaite organiser une visite pour mon comité d'entreprise.",
  ...modifications,
});

const resend = {
  MESSAGERIE_FOURNISSEUR: "resend",
  MAIL_API_KEY: "re_cle",
  MAIL_TO: "brasserie@exemple.fr",
  MAIL_FROM: "onboarding@resend.dev",
};

describe("la configuration de la messagerie", () => {
  it("n'existe pas tant que rien n'est configuré", () => {
    expect(etatDeLaMessagerie({})).toEqual({
      configure: false,
      motif: "MESSAGERIE_FOURNISSEUR n'est pas défini",
    });
  });

  it("refuse un service qu'elle ne connaît pas", () => {
    expect(etatDeLaMessagerie({ MESSAGERIE_FOURNISSEUR: "mailchimp" }).configure).toBe(
      false,
    );
  });

  it("exige la clé, le destinataire et l'expéditeur d'un service réel", () => {
    expect(etatDeLaMessagerie({ MESSAGERIE_FOURNISSEUR: "resend" }).configure).toBe(
      false,
    );
    expect(etatDeLaMessagerie({ ...resend, MAIL_TO: undefined }).configure).toBe(false);
    expect(etatDeLaMessagerie(resend)).toEqual({
      configure: true,
      fournisseur: "resend",
    });
  });

  /**
   * La garde qui compte. Une messagerie de démonstration servant un site ouvert
   * accepterait des messages que personne ne recevrait : c'est exactement ce que
   * ce client a vécu de 2023 à 2026.
   */
  it("refuse la simulation dès que le site est publié", () => {
    expect(etatDeLaMessagerie({ MESSAGERIE_FOURNISSEUR: "simulation" }).configure).toBe(
      true,
    );

    const enLigne = etatDeLaMessagerie({
      MESSAGERIE_FOURNISSEUR: "simulation",
      SITE_PUBLIE: "oui",
    });
    expect(enLigne.configure).toBe(false);
    expect(enLigne.configure === false && enLigne.motif).toMatch(
      /réservé au développement/,
    );
  });

  it("ne rend aucune messagerie quand rien n'est configuré, plutôt que de lever", async () => {
    await expect(messagerieDuSite({})).resolves.toBeNull();
  });

  it("rend la messagerie Resend une fois clé, expéditeur et destinataire fournis", async () => {
    const messagerie = await messagerieDuSite(resend);
    expect(messagerie?.fournisseur).toBe("resend");
  });
});

describe("la messagerie de simulation", () => {
  beforeEach(() => oublierLesMessagesDeSimulation());
  afterEach(() => oublierLesMessagesDeSimulation());

  it("garde en mémoire une demande valide et la déclare envoyée", async () => {
    const messagerie = await messagerieDuSite({ MESSAGERIE_FOURNISSEUR: "simulation" });
    expect(messagerie).not.toBeNull();

    const resultat = await messagerie!.envoyer(demande());
    expect(resultat.etat).toBe("envoye");
    expect(messagesDeSimulation()).toHaveLength(1);
  });

  it("ne déclare jamais envoyée une demande invalide", async () => {
    const messagerie = (await messagerieDuSite({
      MESSAGERIE_FOURNISSEUR: "simulation",
    }))!;

    const resultat = await messagerie.envoyer(demande({ email: "pas-une-adresse" }));
    expect(resultat.etat).toBe("refuse");
    expect(messagesDeSimulation()).toHaveLength(0);
  });
});
