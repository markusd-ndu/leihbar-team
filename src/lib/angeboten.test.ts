import { describe, expect, it } from "vitest";
import { angebotenAdresse, angebotenId } from "@/lib/angeboten";

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
