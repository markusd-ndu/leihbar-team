// Gemeinsame Klassen für Knöpfe, Felder und Meldungen – eine Quelle, damit alles überall gleich aussieht.
// Der Look kommt aus dem Design-System „Leihbar Team“ (Update 2026); alle Farben sind Tokens aus globals.css.

const knopfGrund =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 border px-5 text-base font-medium " +
  "transition duration-(--duration-fast) ease-standard " +
  // Gedrückt: der Knopf rutscht 4 px in seinen Schatten.
  "active:translate-x-1 active:translate-y-1 active:shadow-none " +
  // Ausgeschaltet: klare Fläche, lesbare Schrift, kein Schatten – nicht mit Deckkraft verblasst.
  "disabled:translate-0 disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled disabled:text-disabled-text disabled:shadow-none " +
  // Lädt: bleibt schwarz und flach, klickt nicht mehr durch.
  "aria-busy:cursor-progress aria-busy:shadow-none";

const varianten = {
  /** Die eine Hauptaktion einer Ansicht. */
  haupt: `${knopfGrund} border-transparent bg-action text-on-action shadow-1 hover:bg-action-hover active:bg-action-pressed aria-busy:bg-action aria-busy:text-on-action`,
  /** Zweite oder umschaltbare Aktion. */
  zweit: `${knopfGrund} border-border bg-raised text-ink shadow-1 hover:bg-bg`,
  /** Zweiter Aufruf neben einem Hauptknopf, ohne Schatten. */
  rahmen: `${knopfGrund} border-border bg-transparent text-ink hover:bg-raised active:translate-0`,
  /** Nur der Anmelden-Link im Header. */
  pille: "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border px-4 text-sm font-medium text-ink transition duration-(--duration-fast) ease-standard hover:bg-raised active:translate-y-0.5",
} as const;

export type Knopfart = keyof typeof varianten;

/** Klein: für Zeilen in Listen (Annehmen / Ablehnen). Flach, kleinere Schrift. */
const klein = "px-4 text-sm shadow-none";

export function knopf(art: Knopfart, { klein: istKlein = false }: { klein?: boolean } = {}) {
  return istKlein ? `${varianten[art]} ${klein}` : varianten[art];
}

/** Eingabefeld, Auswahl und Textfeld. 16 px und mehr, damit iOS nicht hineinzoomt. */
export const feld =
  "min-h-11 w-full border border-border bg-raised px-3 py-2 text-base text-ink placeholder:text-muted " +
  "transition-shadow duration-(--duration-fast) ease-standard hover:shadow-[inset_0_0_0_1px_var(--line)] " +
  "aria-[invalid=true]:border-danger aria-[invalid=true]:shadow-[inset_0_0_0_1px_var(--danger)] " +
  "disabled:cursor-not-allowed disabled:border-dashed disabled:bg-disabled disabled:text-disabled-text " +
  "read-only:aria-busy:cursor-progress read-only:aria-busy:bg-bg read-only:aria-busy:text-muted";

/** Fehlersatz unter einem Knopf oder Feld, immer mit Warnzeichen davor. */
export const fehlerSatz = "flex items-start gap-2 text-sm font-medium text-danger";

/** Fehlerkasten über einem Formular. */
export const fehlerKasten =
  "flex items-start gap-2 border border-danger bg-danger-bg px-4 py-3 text-sm font-medium text-danger";

/** Fläche für leere Zustände und Hinweise. */
export const hinweisFlaeche = "border border-border bg-raised px-4 py-3";

/** Link in der Hauptnavigation: ruhig; die aktuelle Seite und der Zeiger werden vom gleitenden Strich markiert. */
export const navLink =
  "flex min-h-11 items-center px-2 text-sm text-muted transition-colors duration-(--duration-fast) ease-standard " +
  "hover:text-ink aria-[current=page]:text-ink";
