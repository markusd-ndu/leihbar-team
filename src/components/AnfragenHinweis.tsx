"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { motion } from "motion/react";
import { beobachteAnfragen } from "@/lib/anfragen-live";
import { dauer, kurve } from "@/lib/bewegung";
import { zaehleOffeneAnfragen } from "@/lib/offene-anfragen";
import { createClient } from "@/lib/supabase/client";

type Hinweis = {
  /** Die eigenen Gegenstände – fragt jemand einen davon an, wird neu gezählt. */
  gegenstandIds: string[];
  /** Stand beim Laden der Seite (und nach dem eigenen Annehmen oder Ablehnen). */
  anzahl: number;
};

/**
 * Zahl der offenen Anfragen auf die eigenen Gegenstände, live über die Kanäle der Gegenstände.
 * Glocke und Konto-Zettel lesen dieselbe Zahl, deshalb wird sie einmal in der Navigation gezählt.
 * `sprung` zählt hoch, wenn sich die Zahl nach dem Laden ändert (nicht beim ersten Anzeigen).
 */
export function useOffeneAnfragen(nutzerId: string | null, hinweis: Hinweis | null): { zahl: number; sprung: number } {
  const anzahl = hinweis?.anzahl ?? 0;
  const [zahl, setZahl] = useState(anzahl);
  const [sprung, setSprung] = useState(0);
  const [gesehen, setGesehen] = useState(anzahl);
  if (zahl !== gesehen) {
    setGesehen(zahl);
    setSprung((s) => s + 1);
  }
  // Kommt vom Server ein neuer Stand (z. B. nach dem eigenen Annehmen), gilt der.
  const [vomServer, setVomServer] = useState(anzahl);
  if (anzahl !== vomServer) {
    setVomServer(anzahl);
    setZahl(anzahl);
  }

  // Zählt die Abfragen mit, damit eine langsame ältere Antwort keine neuere überschreibt.
  const abfrage = useRef(0);
  // Als Text, damit eine neue, aber gleiche Liste die Kanäle nicht neu aufbaut.
  const ids = hinweis?.gegenstandIds.join(",") ?? "";

  useEffect(() => {
    if (!ids || !nutzerId) return;
    const supabase = createClient();

    async function neuLaden() {
      const nummer = ++abfrage.current;
      try {
        const neu = await zaehleOffeneAnfragen(supabase, nutzerId!);
        if (nummer === abfrage.current) {
          setZahl(neu);
        }
      } catch {
        // Kein Netz o. Ä.: Die alte Zahl bleibt stehen, beim nächsten Signal wird neu gezählt.
      }
    }

    const beenden = ids.split(",").map((id) => beobachteAnfragen(id, neuLaden));
    return () => beenden.forEach((ab) => ab());
  }, [ids, nutzerId]);

  return { zahl, sprung };
}

/** Glocke mit der Zahl offener Anfragen als eckige gelbe Plakette; bei 0 gibt es sie nicht. */
export default function AnfragenHinweis({ zahl, sprung }: { zahl: number; sprung: number }) {
  if (zahl === 0) return null;

  const text = zahl === 1 ? "1 offene Anfrage an dich" : `${zahl} offene Anfragen an dich`;
  return (
    <Link
      href="/anfragen-an-mich"
      aria-label={text}
      title={text}
      className="flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1 text-ink transition-colors duration-(--duration-fast) ease-standard hover:text-muted"
    >
      <Bell size={18} aria-hidden />
      <motion.span
        key={sprung}
        initial={sprung ? { scale: 0.7 } : false}
        animate={{ scale: 1 }}
        transition={{ duration: dauer.base, ease: kurve.standard }}
        className="min-w-6 border border-border bg-signal px-1 text-center text-xs font-semibold leading-5 text-on-signal"
      >
        {zahl}
      </motion.span>
    </Link>
  );
}
