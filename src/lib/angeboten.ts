// Nach dem Anbieten leitet die Action auf die Startseite mit der ID des neuen Gegenstands weiter.
// Die Adresse kann jede*r selbst tippen – deshalb wird die ID hier streng geprüft.

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const istUuid = (wert: string) => uuid.test(wert);

/** Die Adresse, auf die nach dem Speichern weitergeleitet wird. */
export const angebotenAdresse = (id: string) => `/?angeboten=${encodeURIComponent(id)}#gegenstaende`;

/** Aus dem Suchparameter `angeboten` die ID machen – `null`, wenn er fehlt, mehrfach vorkommt oder keine gültige ID ist. */
export function angebotenId(parameter: string | string[] | undefined): string | null {
  return typeof parameter === "string" && istUuid(parameter) ? parameter : null;
}
