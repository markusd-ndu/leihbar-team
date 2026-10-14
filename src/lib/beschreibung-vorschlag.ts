// LEI-5: Regeln rund um den KI-Vorschlag für eine Beschreibung – ohne KI-Aufruf, damit sie sich testen lassen.
// Eingabe prüfen, Antwort prüfen (2–3 Sätze, keine Telefonnummer, kein Preis, kein Link) und das Rate Limit.
import { kategorien } from "@/data/gegenstaende";

/** Wählbare Tonarten. Der Server nimmt nur diese Werte – freier Text käme sonst beim Modell an. */
export const toene = ["sachlich", "freundlich", "locker"] as const;
export type Ton = (typeof toene)[number];

export type VorschlagEingabe = { titel: string; kategorie: string; ort: string; ton: Ton };

/** So viele Vorschläge pro Person und Minute – der nächste Klick bekommt eine Meldung. */
export const MAX_PRO_MINUTE = 5;

const text = (wert: unknown, max: number) => (typeof wert === "string" ? wert.trim().slice(0, max) : "");

/** Was der Browser schickt, als geprüfte Eingabe – `null`, wenn der Titel fehlt. */
export function eingabeAus(daten: unknown): VorschlagEingabe | null {
  if (!daten || typeof daten !== "object") return null;
  const d = daten as Record<string, unknown>;
  const titel = text(d.titel, 200);
  if (!titel) return null;
  const kategorie = text(d.kategorie, 50);
  return {
    titel,
    // Nur bekannte Kategorien – alles andere wäre freier Text, der beim Modell landet.
    kategorie: (kategorien as readonly string[]).includes(kategorie) ? kategorie : "",
    ort: text(d.ort, 100),
    ton: (toene as readonly string[]).includes(d.ton as string) ? (d.ton as Ton) : "freundlich",
  };
}

/** Sätze grob zählen: Satzende ist ., ! oder ? vor Leerraum oder am Ende. */
export function saetzeZaehlen(antwort: string): number {
  return antwort
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter((satz) => /[A-Za-zÄÖÜäöüß]/.test(satz)).length;
}

const TELEFON = /\+?\d[\d\s/()-]{5,}\d/;
const PREIS = /(\d+([.,]\d+)?\s?(€|eur\b|euro\b))|(€\s?\d)|\b(gratis|kostenlos|umsonst|preis)\w*/i;
const LINK = /https?:\/\/|www\.|\S+@\S+\.\S+/i;

export type Pruefung = { ok: true } | { ok: false; grund: string };

/** Darf diese Antwort ins Beschreibungsfeld? */
export function vorschlagPruefen(antwort: string): Pruefung {
  const saetze = saetzeZaehlen(antwort);
  if (saetze < 2 || saetze > 3) return { ok: false, grund: `${saetze} Sätze statt 2–3` };
  if (TELEFON.test(antwort)) return { ok: false, grund: "Telefonnummer" };
  if (PREIS.test(antwort)) return { ok: false, grund: "Preis" };
  if (LINK.test(antwort)) return { ok: false, grund: "Link oder E-Mail" };
  return { ok: true };
}

/**
 * Rate Limit im Speicher des Servers: pro Schlüssel (Person) höchstens MAX_PRO_MINUTE Anfragen in 60 Sekunden.
 * Auf Vercel zählt jede Server-Instanz für sich – für dieses Issue genügt das.
 */
export function ratenLimit(max = MAX_PRO_MINUTE, fensterMs = 60_000) {
  const zeiten = new Map<string, number[]>();
  return {
    erlaubt(schluessel: string, jetzt = Date.now()): boolean {
      const frisch = (zeiten.get(schluessel) ?? []).filter((t) => jetzt - t < fensterMs);
      if (frisch.length >= max) {
        zeiten.set(schluessel, frisch);
        return false;
      }
      frisch.push(jetzt);
      zeiten.set(schluessel, frisch);
      return true;
    },
  };
}
