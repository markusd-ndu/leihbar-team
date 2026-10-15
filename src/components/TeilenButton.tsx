"use client";

import { useEffect, useRef, useState } from "react";
import { Check, CircleAlert, Share2 } from "lucide-react";
import { knopf } from "@/components/stile";

type Props = {
  titel: string;
};

type Rueckmeldung = "kopiert" | "fehler" | null;

/** Kopiert Text in die Zwischenablage; ältere Browser und Seiten ohne https bekommen den Umweg über ein Textfeld. */
async function kopiere(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const feld = document.createElement("textarea");
    feld.value = text;
    feld.setAttribute("readonly", "");
    feld.style.position = "fixed";
    feld.style.opacity = "0";
    document.body.appendChild(feld);
    feld.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      feld.remove();
    }
  }
}

export default function TeilenButton({ titel }: Props) {
  const [rueckmeldung, setRueckmeldung] = useState<Rueckmeldung>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function zeigeRueckmeldung(art: Exclude<Rueckmeldung, null>) {
    setRueckmeldung(art);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setRueckmeldung(null), 2500);
  }

  async function teilen() {
    const link = window.location.href;
    // Am Handy (Touch ohne Maus) öffnet sich das Teilen-Menü; am Laptop wird der Link kopiert.
    const amHandy = window.matchMedia("(pointer: coarse) and (hover: none)").matches;
    const daten = { title: titel, url: link };

    if (amHandy && typeof navigator.share === "function" && navigator.canShare?.(daten) !== false) {
      try {
        await navigator.share(daten);
        return;
      } catch (fehler) {
        // Wer das Menü schließt, hat nichts falsch gemacht – dann keine Meldung.
        if (fehler instanceof DOMException && fehler.name === "AbortError") return;
      }
    }

    if (await kopiere(link)) zeigeRueckmeldung("kopiert");
    else zeigeRueckmeldung("fehler");
  }

  return (
    <div className="-my-2 flex items-center gap-2">
      <p aria-live="polite" className="text-sm font-medium">
        {rueckmeldung === "kopiert" && (
          <span className="flex items-center gap-1">
            <Check size={16} aria-hidden /> Link kopiert
          </span>
        )}
        {rueckmeldung === "fehler" && (
          <span className="flex items-center gap-1 text-danger">
            <CircleAlert size={16} aria-hidden /> Der Link konnte nicht kopiert werden.
          </span>
        )}
      </p>
      <button
        type="button"
        onClick={teilen}
        aria-label={`„${titel}“ teilen`}
        title="Teilen"
        className={`${knopf("zweit")} px-0`}
      >
        <Share2 size={20} aria-hidden />
      </button>
    </div>
  );
}
