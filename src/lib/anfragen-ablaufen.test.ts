import { describe, expect, it } from "vitest";
import { ablaufGrenze, istAutorisiert } from "@/lib/anfragen-ablaufen";

describe("ablaufGrenze", () => {
  it("liegt genau sieben Tage vor dem Zeitpunkt", () => {
    const grenze = ablaufGrenze(new Date("2026-10-15T12:00:00Z"));
    expect(grenze.toISOString()).toBe("2026-10-08T12:00:00.000Z");
  });
});

describe("istAutorisiert", () => {
  it("lässt den richtigen Bearer-Wert durch", () => {
    expect(istAutorisiert("Bearer geheim", "geheim")).toBe(true);
  });
  it("lehnt fehlenden oder falschen Kopf ab", () => {
    expect(istAutorisiert(null, "geheim")).toBe(false);
    expect(istAutorisiert("Bearer falsch", "geheim")).toBe(false);
    expect(istAutorisiert("geheim", "geheim")).toBe(false);
  });
  it("lehnt alles ab, wenn kein Geheimnis eingestellt ist", () => {
    expect(istAutorisiert("Bearer undefined", undefined)).toBe(false);
    expect(istAutorisiert("Bearer ", "")).toBe(false);
  });
});
