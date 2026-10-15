"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { dauer, kurve } from "@/lib/bewegung";

/** Wie lange die Meldung steht, bevor sie sich von selbst schließt. */
const STEHT_MS = 5000;

/**
 * Gelber Hinweis unten im Bild nach dem Anbieten. Blendet in 0,3 s ein und steigt dabei 16 px,
 * geht nach 5 s von selbst. „Bewegung reduzieren“: erscheint und verschwindet ohne Bewegung.
 * Der Bereich mit `role="status"` ist von Anfang an da und bekommt den Satz erst danach –
 * so liest ein Screenreader ihn vor. Er fängt keine Klicks ab, die Seite bleibt darunter bedienbar.
 * Die Adresse wird gleich beim Anzeigen wieder sauber (ohne `angeboten`), damit Neuladen oder Teilen
 * die Meldung nicht noch einmal zeigt.
 */
export default function ErfolgsMeldung({ text }: { text: string }) {
  const reduziert = useReducedMotion();
  const [offen, setOffen] = useState(false);

  useEffect(() => {
    // Adresse aufräumen, ohne die Seite neu zu laden; der Anker #gegenstaende bleibt.
    const adresse = new URL(window.location.href);
    if (adresse.searchParams.has("angeboten")) {
      adresse.searchParams.delete("angeboten");
      window.history.replaceState(window.history.state, "", adresse.pathname + adresse.search + adresse.hash);
    }
    const zeigen = setTimeout(() => setOffen(true), 100);
    const schliessen = setTimeout(() => setOffen(false), 100 + STEHT_MS);
    return () => {
      clearTimeout(zeigen);
      clearTimeout(schliessen);
    };
  }, []);

  const hinein = reduziert ? { duration: 0 } : { duration: dauer.slow, ease: kurve.standard };
  const hinaus = reduziert ? { duration: 0 } : { duration: dauer.slow, ease: kurve.exit };

  return (
    <div role="status" className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4">
      <AnimatePresence>
        {offen && (
          <motion.p
            className="flex w-full max-w-md items-center gap-3 border-2 border-on-signal bg-signal p-4 text-base font-medium text-on-signal shadow-2"
            initial={{ opacity: 0, y: reduziert ? 0 : 16 }}
            animate={{ opacity: 1, y: 0, transition: hinein }}
            exit={{ opacity: 0, y: 0, transition: hinaus }}
          >
            <Check size={20} aria-hidden className="shrink-0" />
            {text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
