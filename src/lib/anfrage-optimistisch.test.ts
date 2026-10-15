import { describe, expect, it } from "vitest";
import { angezeigteZahl, optimistischerStand } from "./anfrage-optimistisch";

describe("optimistischerStand", () => {
  it("zählt beim Anfragen sofort eins dazu", () => {
    expect(optimistischerStand({ angefragt: false, anzahl: 2 }, "anfragen")).toStrictEqual({ angefragt: true, anzahl: 3 });
  });

  it("zählt beim Zurückziehen sofort eins ab", () => {
    expect(optimistischerStand({ angefragt: true, anzahl: 3 }, "zurueckziehen")).toStrictEqual({ angefragt: false, anzahl: 2 });
  });

  it("zählt nicht doppelt, wenn schon angefragt ist", () => {
    expect(optimistischerStand({ angefragt: true, anzahl: 3 }, "anfragen")).toStrictEqual({ angefragt: true, anzahl: 3 });
  });

  it("zieht nichts ab, wenn gar nicht angefragt war", () => {
    expect(optimistischerStand({ angefragt: false, anzahl: 3 }, "zurueckziehen")).toStrictEqual({ angefragt: false, anzahl: 3 });
  });

  it("wird nie negativ", () => {
    expect(optimistischerStand({ angefragt: true, anzahl: 0 }, "zurueckziehen").anzahl).toBe(0);
  });
});

describe("angezeigteZahl", () => {
  it("zeigt vor dem frischen Stand die vorläufige Zahl", () => {
    expect(angezeigteZahl({ echt: 2, aenderung: 1, frischNachKlick: false })).toBe(3);
    expect(angezeigteZahl({ echt: 2, aenderung: -1, frischNachKlick: false })).toBe(1);
  });

  it("addiert nie auf den frischen Stand: der echte Wert gilt", () => {
    // Die Datenbank hat die eigene Anfrage schon mitgezählt (3); +1 darf nicht auf 4 führen.
    expect(angezeigteZahl({ echt: 3, aenderung: 1, frischNachKlick: true })).toBe(3);
    expect(angezeigteZahl({ echt: 1, aenderung: -1, frischNachKlick: true })).toBe(1);
  });

  it("zeigt ohne Änderung den echten Stand", () => {
    expect(angezeigteZahl({ echt: 4, aenderung: 0, frischNachKlick: false })).toBe(4);
  });

  it("wird nie negativ", () => {
    expect(angezeigteZahl({ echt: 0, aenderung: -1, frischNachKlick: false })).toBe(0);
  });
});
