/**
 * Vérification des identifiants de la préproduction.
 *
 * Isolée du proxy pour être testable sans le runtime Edge de Next.
 * Seul le mot de passe est vérifié : l'identifiant est ignoré, il n'existe que
 * parce que l'authentification HTTP Basic en impose un.
 */
export function identifiantsCorrects(
  entete: string | null,
  motDePasseAttendu: string,
): boolean {
  if (!entete?.startsWith("Basic ")) return false;

  let decode: string;
  try {
    decode = atob(entete.slice("Basic ".length));
  } catch {
    return false;
  }

  const separateur = decode.indexOf(":");
  if (separateur === -1) return false;

  return decode.slice(separateur + 1) === motDePasseAttendu;
}
