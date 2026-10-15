// Anzeige-Helfer, die mehrere Seiten brauchen.

const euro = (betrag: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(betrag) ? 0 : 2,
  }).format(betrag);

/** Preis pro Tag in zwei Teilen, damit die Zahl groß stehen kann: 0 → „gratis“ ohne Einheit, 12 → „12 €“ und „pro Tag“. */
export function preisTeile(preisProTag: number): { betrag: string; einheit: string | null } {
  return preisProTag === 0 ? { betrag: "gratis", einheit: null } : { betrag: euro(preisProTag), einheit: "pro Tag" };
}

/** Preis pro Tag für die Anzeige: 0 → „gratis“, 12 → „12 € pro Tag“, 2.5 → „2,50 € pro Tag“. */
export function preisText(preisProTag: number): string {
  const { betrag, einheit } = preisTeile(preisProTag);
  return einheit ? `${betrag} ${einheit}` : betrag;
}
