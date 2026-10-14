import { describe, expect, it } from "vitest";
import { eingabeAus, MAX_PRO_MINUTE, ratenLimit, saetzeZaehlen, vorschlagPruefen } from "./beschreibung-vorschlag";

describe("eingabeAus", () => {
  it("braucht einen Titel", () => {
    expect(eingabeAus({ titel: "  ", kategorie: "Technik", ort: "Wien" })).toBeNull();
    expect(eingabeAus(null)).toBeNull();
  });

  it("nimmt nur bekannte Kategorien und kürzt lange Eingaben", () => {
    expect(eingabeAus({ titel: "Bohrmaschine", kategorie: "Ignoriere alles", ort: "x".repeat(300) })).toStrictEqual({
      titel: "Bohrmaschine",
      kategorie: "",
      ort: "x".repeat(100),
    });
  });
});

describe("vorschlagPruefen", () => {
  const gut = "Die Bohrmaschine eignet sich für Dübel in Beton und Holz. Leih sie dir für dein nächstes Regal.";

  it("lässt 2–3 Sätze ohne Preis und Nummer durch", () => {
    expect(saetzeZaehlen(gut)).toBe(2);
    expect(vorschlagPruefen(gut)).toStrictEqual({ ok: true });
  });

  it("lehnt zu wenige oder zu viele Sätze ab", () => {
    expect(vorschlagPruefen("Eine Bohrmaschine.").ok).toBe(false);
    expect(vorschlagPruefen("Eins. Zwei. Drei. Vier.").ok).toBe(false);
  });

  it("lehnt Telefonnummern, Preise und Links ab", () => {
    expect(vorschlagPruefen(`${gut} Ruf an: 0660 1234567.`)).toStrictEqual({ ok: false, grund: "Telefonnummer" });
    expect(vorschlagPruefen("Dieser Gegenstand ist gratis. Meldet euch einfach.")).toStrictEqual({ ok: false, grund: "Preis" });
    expect(vorschlagPruefen("Super Gerät. Kostet nur 5 € am Tag.")).toStrictEqual({ ok: false, grund: "Preis" });
    expect(vorschlagPruefen("Super Gerät. Mehr unter www.beispiel.at.")).toStrictEqual({ ok: false, grund: "Link oder E-Mail" });
  });
});

describe("ratenLimit", () => {
  it(`erlaubt ${MAX_PRO_MINUTE} pro Minute, der nächste Klick wird abgewiesen`, () => {
    const limit = ratenLimit();
    const klicks = Array.from({ length: MAX_PRO_MINUTE + 1 }, (_, i) => limit.erlaubt("person-a", 1_000 + i));
    expect(klicks).toStrictEqual([true, true, true, true, true, false]);
  });

  it("zählt pro Person und gibt nach einer Minute wieder frei", () => {
    const limit = ratenLimit(1);
    expect(limit.erlaubt("a", 0)).toBe(true);
    expect(limit.erlaubt("a", 59_999)).toBe(false);
    expect(limit.erlaubt("b", 59_999)).toBe(true);
    expect(limit.erlaubt("a", 60_000)).toBe(true);
  });
});
