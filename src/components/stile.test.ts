import { describe, expect, it } from "vitest";
import { knopf } from "@/components/stile";

// Tailwind löst Widersprüche nach der Reihenfolge im Stylesheet auf, nicht nach dem Klassentext.
// Deshalb darf jede Eigenschaft in einem Knopf nur einmal vorkommen.
const klassen = (text: string) => text.split(/\s+/);

describe("knopf", () => {
  it("quadratisch hat keinen seitlichen Abstand von 20 px", () => {
    const k = klassen(knopf("zweit", { quadrat: true }));
    expect(k).toContain("px-0");
    expect(k).not.toContain("px-5");
    expect(k).not.toContain("px-4");
  });

  it("klein hat 16 px Abstand, kleine Schrift und keinen Ruheschatten", () => {
    const k = klassen(knopf("haupt", { klein: true }));
    expect(k).toContain("px-4");
    expect(k).not.toContain("px-5");
    expect(k).toContain("text-sm");
    expect(k).not.toContain("text-base");
    expect(k).not.toContain("shadow-1");
  });

  it("normal hat 20 px Abstand und den gelben Schatten", () => {
    const k = klassen(knopf("haupt"));
    expect(k).toContain("px-5");
    expect(k).toContain("shadow-1");
    expect(k).toContain("text-base");
  });

  it("flach hat keinen Schatten und kein Reinrutschen, behält aber die Schrift", () => {
    const k = klassen(knopf("haupt", { flach: true }));
    expect(k).not.toContain("shadow-1");
    expect(k).not.toContain("active:translate-x-1");
    expect(k).toContain("text-base");
    expect(k).toContain("px-5");
  });

  it("hoch hat genau eine Mindesthöhe: 48 statt 44 px", () => {
    const k = klassen(knopf("haupt", { hoch: true }));
    expect(k).toContain("min-h-12");
    expect(k).not.toContain("min-h-11");
  });

  it("der Rahmen-Knopf hat nie einen Schatten", () => {
    expect(klassen(knopf("rahmen"))).not.toContain("shadow-1");
  });
});
