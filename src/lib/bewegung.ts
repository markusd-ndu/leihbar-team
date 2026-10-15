// Bewegung für Motion – dieselben Zeiten und Kurven wie die CSS-Tokens in globals.css (duration-*, easing-*).
// Nur transform und opacity bewegen; nichts läuft in Dauerschleife.

/** Sekunden: schnell für Rückmeldung auf Klick und Hover, normal für Ein- und Ausblenden, langsam für Meldungen. */
export const dauer = { fast: 0.12, base: 0.2, slow: 0.3 } as const;

type Kurve = [number, number, number, number];

/** `standard` für alles, was sich bewegt oder ändert; `exit` für alles, was verschwindet. */
export const kurve: { standard: Kurve; exit: Kurve } = {
  standard: [0.2, 0, 0, 1],
  exit: [0.4, 0, 1, 1],
};
