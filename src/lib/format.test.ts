import { describe, expect, it } from "vitest";
import { preisText } from "@/lib/format";

// Beispiel-Test: zeigt, wie ein Test aussieht. Eigene Tests legt ihr genauso neben den Code.
describe("preisText", () => {
  it("zeigt 0 als gratis", () => {
    expect(preisText(0)).toBe("gratis");
  });
  it("zeigt ganze und halbe Euro mit „pro Tag“", () => {
    // Zwischen Zahl und € steht ein geschütztes Leerzeichen (\u00a0) – so formatiert Intl.
    expect(preisText(12)).toBe("12\u00a0€ pro Tag");
    expect(preisText(2.5)).toBe("2,50\u00a0€ pro Tag");
  });
});
