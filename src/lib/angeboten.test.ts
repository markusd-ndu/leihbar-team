import { describe, expect, it } from "vitest";
import { angebotenAdresse, angebotenId, neuerEigenerGegenstand } from "@/lib/angeboten";

const id = "3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b";

describe("angebotenId", () => {
  it("nimmt eine gültige ID", () => {
    expect(angebotenId(id)).toBe(id);
  });
  it("gibt null bei fehlendem, mehrfachem oder ungültigem Wert", () => {
    expect(angebotenId(undefined)).toBeNull();
    expect(angebotenId([id, id])).toBeNull();
    expect(angebotenId("")).toBeNull();
    expect(angebotenId("abc")).toBeNull();
    expect(angebotenId(`${id}<script>`)).toBeNull();
    expect(angebotenId(`x${id}`)).toBeNull();
    expect(angebotenId(`${id}\n`)).toBeNull();
  });
});

describe("angebotenAdresse", () => {
  it("führt zur Startseite mit ID und zur Liste", () => {
    expect(angebotenAdresse(id)).toBe(`/?angeboten=${id}#gegenstaende`);
  });
  it("macht aus der Adresse wieder eine gültige ID", () => {
    const parameter = new URL(angebotenAdresse(id), "http://x").searchParams.get("angeboten");
    expect(angebotenId(parameter ?? undefined)).toBe(id);
  });
});

describe("neuerEigenerGegenstand", () => {
  const ich = "11111111-1111-4111-8111-111111111111";
  const liste = [
    { id, besitzerId: ich },
    { id: "22222222-2222-4222-8222-222222222222", besitzerId: "33333333-3333-4333-8333-333333333333" },
    { id: "44444444-4444-4444-8444-444444444444", besitzerId: null },
  ];
  it("gibt die ID eines eigenen Gegenstands aus der Liste zurück", () => {
    expect(neuerEigenerGegenstand(id, liste, ich)).toBe(id);
  });
  it("zeigt nichts für den Gegenstand einer anderen Person oder ohne Besitzer*in", () => {
    expect(neuerEigenerGegenstand("22222222-2222-4222-8222-222222222222", liste, ich)).toBeNull();
    expect(neuerEigenerGegenstand("44444444-4444-4444-8444-444444444444", liste, ich)).toBeNull();
  });
  it("zeigt nichts ohne Anmeldung, mit ungültiger ID oder wenn der Gegenstand nicht in der Liste steht", () => {
    expect(neuerEigenerGegenstand(id, liste, null)).toBeNull();
    expect(neuerEigenerGegenstand("abc", liste, ich)).toBeNull();
    expect(neuerEigenerGegenstand("55555555-5555-4555-8555-555555555555", liste, ich)).toBeNull();
  });
});
