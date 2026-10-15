// Nach dem Anbieten leitet die Action auf die Startseite mit der ID des neuen Gegenstands weiter.
// Die Adresse kann jede*r selbst tippen – deshalb wird die ID hier streng geprüft.

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const istUuid = (wert: string) => uuid.test(wert);

/** Die Adresse, auf die nach dem Speichern weitergeleitet wird. */
export const angebotenAdresse = (id: string) => `/?angeboten=${encodeURIComponent(id)}#gegenstaende`;

/**
 * Die ID des neuen Gegenstands, wenn der Link zu einem eigenen Gegenstand aus der Liste führt – sonst `null`.
 * Gegenstands-IDs sind öffentlich: Ohne die Prüfung auf die Besitzer*in könnte ein selbst gebauter Link
 * jemandem ein falsches „Geschafft“ zeigen.
 */
export function neuerEigenerGegenstand(
  parameter: string | string[] | undefined,
  gegenstaende: { id: string; besitzerId?: string | null }[],
  nutzerId: string | null,
): string | null {
  const id = angebotenId(parameter);
  if (id === null || nutzerId === null) return null;
  return gegenstaende.some((g) => g.id === id && g.besitzerId === nutzerId) ? id : null;
}

/** Aus dem Suchparameter `angeboten` die ID machen – `null`, wenn er fehlt, mehrfach vorkommt oder keine gültige ID ist. */
export function angebotenId(parameter: string | string[] | undefined): string | null {
  return typeof parameter === "string" && istUuid(parameter) ? parameter : null;
}
