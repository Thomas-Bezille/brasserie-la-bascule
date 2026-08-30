/**
 * Insère un bloc JSON-LD dans la page.
 *
 * Le contenu est sérialisé puis les chevrons échappés : une donnée qui
 * contiendrait `</script>` fermerait la balise et le reste s'exécuterait comme
 * du code. Nos données viennent du dépôt et non d'une saisie, mais un garde-fou
 * qui ne coûte rien se met avant d'en avoir besoin, pas après.
 */
export function DonneesStructurees({ donnees }: { donnees: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(donnees).replace(/</g, "\\u003c"),
      }}
    />
  );
}
