"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { angezeigteZahl } from "@/lib/anfrage-optimistisch";
import { beobachteAnfragen } from "@/lib/anfragen-live";
import { dauer, kurve } from "@/lib/bewegung";
import { createClient } from "@/lib/supabase/client";

type Props = {
  gegenstandId: string;
  /** Stand beim Laden der Seite (und nach dem eigenen Klick). */
  anzahl: number;
  /** Vorläufige Änderung durch den eigenen Klick, solange die Datenbank noch nicht geantwortet hat (+1, -1 oder 0). */
  aenderung?: number;
  /** Zählt bei jedem eigenen Klick hoch. */
  klick?: number;
};

/**
 * Zeigt die Zahl der Anfragen und aktualisiert sie ohne Neuladen.
 * Die Datenbank meldet über Realtime nur „hier hat sich etwas geändert“;
 * die Zahl selbst kommt immer frisch aus `anzahl_anfragen` – so wird nichts doppelt gezählt.
 * Der eigene Klick ändert die Zahl sofort (`aenderung`); sobald nach dem Klick ein frischer Stand
 * aus der Datenbank da ist, gilt nur noch der.
 */
export default function AnfragenZaehler({ gegenstandId, anzahl, aenderung = 0, klick = 0 }: Props) {
  const [zahl, setZahl] = useState(anzahl);
  // Kommt vom Server ein neuer Stand (z. B. nach dem eigenen Klick), gilt der.
  const [vomServer, setVomServer] = useState(anzahl);
  if (anzahl !== vomServer) {
    setVomServer(anzahl);
    setZahl(anzahl);
  }

  // Bei welchem Klick zuletzt ein frischer Stand aus der Datenbank kam.
  const [frischBeiKlick, setFrischBeiKlick] = useState(-1);
  const aktuellerKlick = useRef(klick);
  // Zählt die Abfragen mit, damit eine langsame ältere Antwort keine neuere überschreibt.
  const abfrage = useRef(0);

  useEffect(() => {
    aktuellerKlick.current = klick;
    // Eine Abfrage, die vor dem Klick losging, kennt die eigene Änderung noch nicht – ihre Antwort wird verworfen.
    abfrage.current++;
  }, [klick]);

  useEffect(() => {
    const supabase = createClient();

    async function neuLaden() {
      const nummer = ++abfrage.current;
      const { data, error } = await supabase.rpc("anzahl_anfragen", { gegenstand: gegenstandId });
      if (!error && nummer === abfrage.current) {
        setZahl(Number(data));
        setFrischBeiKlick(aktuellerKlick.current);
      }
    }

    return beobachteAnfragen(gegenstandId, neuLaden);
  }, [gegenstandId]);

  const angezeigt = angezeigteZahl({ echt: zahl, aenderung, frischNachKlick: frischBeiKlick === klick });

  // Mit „Bewegung reduzieren“ springt die Zahl nicht (auch kein einzelnes Bild bei 0,7).
  const weniger = useReducedMotion();
  // Ändert sich die angezeigte Zahl nach dem ersten Anzeigen, „springt“ sie einmal kurz.
  const [vorher, setVorher] = useState(angezeigt);
  const [sprung, setSprung] = useState(0);
  if (angezeigt !== vorher) {
    setVorher(angezeigt);
    setSprung((s) => s + 1);
  }

  return (
    <motion.span
      key={sprung}
      initial={sprung && !weniger ?{ scale: 0.7 } : false}
      animate={{ scale: 1 }}
      transition={{ duration: dauer.base, ease: kurve.standard }}
      className="inline-block font-semibold text-ink"
    >
      {angezeigt}
    </motion.span>
  );
}
