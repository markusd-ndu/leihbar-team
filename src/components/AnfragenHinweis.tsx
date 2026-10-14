"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { beobachteAnfragen } from "@/lib/anfragen-live";
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
        if (nummer === abfrage.current) setZahl(neu);
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
      className="flex min-h-11 shrink-0 items-center gap-1 text-foreground hover:opacity-80"
    >
      <Bell size={18} aria-hidden />
      <span className="min-w-5 rounded-full bg-accent px-1.5 text-center text-xs font-semibold leading-5 text-on-accent">
        {zahl}
      </span>
    </Link>
  );
}
