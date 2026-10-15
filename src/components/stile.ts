// Gemeinsame Klassen für Knöpfe, Felder und Meldungen – eine Quelle, damit alles überall gleich aussieht.
// Der Look kommt aus dem Design-System „Leihbar Team“ (Update 2026); alle Farben sind Tokens aus globals.css.

// Jede Eigenschaft kommt genau einmal vor (Größe, Abstand, Schatten): Tailwind entscheidet bei Widersprüchen
// nach der Reihenfolge im Stylesheet, nicht nach der Reihenfolge im Klassentext – Überschreiben geht schief.
const knopfGrund =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 border font-medium " +
  "transition duration-(--duration-fast) ease-standard " +
  // Ausgeschaltet: klare Fläche, lesbare Schrift, kein Schatten – nicht mit Deckkraft verblasst.
  "disabled:translate-0 disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled disabled:text-disabled-text disabled:shadow-none " +
  // Lädt: bleibt schwarz und flach, klickt nicht mehr durch.
  "aria-busy:cursor-progress aria-busy:shadow-none";

const varianten = {
  /** Die eine Hauptaktion einer Ansicht. */
  haupt: {
    farbe:
      "border-transparent bg-action text-on-action hover:bg-action-hover active:bg-action-pressed aria-busy:bg-action aria-busy:text-on-action",
    schatten: true,
  },
  /** Zweite oder umschaltbare Aktion. */
  zweit: { farbe: "border-border bg-raised text-ink hover:bg-bg", schatten: true },
  /** Zweiter Aufruf neben einem Hauptknopf, ohne Schatten. */
  rahmen: { farbe: "border-border bg-transparent text-ink hover:bg-raised", schatten: false },
} as const;

export type Knopfart = keyof typeof varianten;

type Groesse = {
  /** Klein: für Zeilen in Listen (Annehmen / Ablehnen). Flach, kleinere Schrift. */
  klein?: boolean;
  /** Quadratisch: nur ein Icon, 44 × 44 px (z. B. Teilen). */
  quadrat?: boolean;
  /** Flach: ohne eigenen Schatten, für Knöpfe in einer Fläche, die schon einen Schatten trägt (z. B. die Karte). */
  flach?: boolean;
  /** Hoch: 48 statt 44 px, für die eine Hauptaktion einer Karte. */
  hoch?: boolean;
};

export function knopf(art: Knopfart, { klein = false, quadrat = false, flach = false, hoch = false }: Groesse = {}) {
  const { farbe, schatten } = varianten[art];
  const abstand = quadrat ? "px-0 text-base" : klein ? "px-4 text-sm" : "px-5 text-base";
  // Klein ist flach; sonst: 4 px gelber Schatten, gedrückt rutscht der Knopf hinein.
  const mitSchatten = schatten && !klein && !flach;
  const druck = mitSchatten ? "shadow-1 active:translate-x-1 active:translate-y-1 active:shadow-none" : "";
  // Die Höhe wird im Grundtext getauscht, nicht angehängt: zwei min-h-Klassen widersprächen sich.
  const grund = hoch ? knopfGrund.replace("min-h-11", "min-h-12") : knopfGrund;
  return `${grund} ${farbe} ${abstand} ${druck}`.trim();
}

/** Eckige Plakette mit Zeichen und Wort: Status, Kategorie. Fläche und Rahmenart (durchgezogen/gestrichelt) kommen dazu. */
export const plakette = "inline-flex items-center gap-1.5 border border-border px-2.5 py-1 text-sm font-medium";

/** „Anbieten“ im Header: die eine Hauptaktion der Leiste. Eigenständig statt von knopf() abgeleitet, weil sich Klassen dort nicht überschreiben lassen. */
export const navKnopf =
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 border border-transparent bg-action px-3 text-sm font-medium text-on-action shadow-1 " +
  "transition duration-(--duration-fast) ease-standard hover:bg-action-hover " +
  "active:translate-x-1 active:translate-y-1 active:bg-action-pressed active:shadow-none sm:px-4";

/** „Konto“ im Header (nur ab 768 px): eckig mit Rahmen, öffnet den Zettel mit den persönlichen Seiten. */
export const kontoKnopf =
  "relative hidden min-h-11 shrink-0 items-center gap-1.5 border border-border px-3 text-sm font-medium text-ink " +
  "transition-colors duration-(--duration-fast) ease-standard hover:bg-bg aria-expanded:bg-bg md:inline-flex";

/** Nur der Anmelden-Link im Header. */
export const pille =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border px-4 text-sm font-medium text-ink transition duration-(--duration-fast) ease-standard hover:bg-raised active:translate-y-0.5";

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
