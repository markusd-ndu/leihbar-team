// Reine Logik für „Anfragen ohne Warten“: Was zeigen Button und Zähler, solange die Datenbank noch nicht geantwortet hat?

export type AnfrageAktion = "anfragen" | "zurueckziehen";

export type AnfrageStand = { angefragt: boolean; anzahl: number };

/**
 * Der Stand, den man sofort nach dem Klick sieht. Wiederholt man die Aktion, ändert sich nichts mehr
 * (wer schon angefragt hat, zählt nicht zweimal); die Zahl wird nie negativ.
 */
export function optimistischerStand(stand: AnfrageStand, aktion: AnfrageAktion): AnfrageStand {
  if (aktion === "anfragen") {
    return stand.angefragt ? stand : { angefragt: true, anzahl: stand.anzahl + 1 };
  }
  return stand.angefragt ? { angefragt: false, anzahl: Math.max(0, stand.anzahl - 1) } : stand;
}

/**
 * Welche Zahl der Zähler zeigt. `echt` ist der letzte Stand aus der Datenbank, `aenderung` die
 * vorläufige Änderung durch den eigenen Klick (+1, -1 oder 0). Hat die Datenbank nach dem Klick
 * schon einen frischen Stand geliefert, gilt der allein – sonst würde die eigene Anfrage doppelt gezählt.
 */
export function angezeigteZahl({
  echt,
  aenderung,
  frischNachKlick,
}: {
  echt: number;
  aenderung: number;
  frischNachKlick: boolean;
}): number {
  return frischNachKlick ? echt : Math.max(0, echt + aenderung);
}
