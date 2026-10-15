"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { motion } from "motion/react";
import { beobachteAnfragen } from "@/lib/anfragen-live";
import { dauer, kurve } from "@/lib/bewegung";
import { zaehleOffeneAnfragen } from "@/lib/offene-anfragen";
import { createClient } from "@/lib/supabase/client";

type Props = {
  nutzerId: string;
  /** Die eigenen Gegenstände – fragt jemand einen davon an, wird neu gezählt. */
  gegenstandIds: string[];
  /** Stand beim Laden der Seite (und nach dem eigenen Annehmen oder Ablehnen). */
  anzahl: number;
};

/** Glocke mit der Zahl offener Anfragen auf die eigenen Gegenstände; bei 0 unsichtbar. */
export default function AnfragenHinweis({ nutzerId, gegenstandIds, anzahl }: Props) {
  const [zahl, setZahl] = useState(anzahl);
  // Zählt hoch, wenn sich die Zahl nach dem Laden ändert: Dann springt sie einmal kurz (nicht beim ersten Anzeigen).
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
  const ids = gegenstandIds.join(",");

  useEffect(() => {
    if (!ids) return;
    const supabase = createClient();

    async function neuLaden() {
      const nummer = ++abfrage.current;
      try {
        const neu = await zaehleOffeneAnfragen(supabase, nutzerId);
        if (nummer === abfrage.current) {
          setZahl(neu);
        }
      } catch {
        // Kein Netz o. Ä.: Die alte Zahl bleibt stehen, beim nächsten Signal wird neu gezählt.
      }
    }

    const abmelden = ids.split(",").map((id) => beobachteAnfragen(id, neuLaden));
    return () => abmelden.forEach((ab) => ab());
  }, [ids, nutzerId]);

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
        className="min-w-6 rounded-full bg-action px-1 text-center text-xs font-semibold leading-6 text-on-action"
      >
        {zahl}
      </motion.span>
    </Link>
  );
}
