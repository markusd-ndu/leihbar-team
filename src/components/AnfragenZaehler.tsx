"use client";

import { useEffect, useRef, useState } from "react";
import { beobachteAnfragen } from "@/lib/anfragen-live";
import { createClient } from "@/lib/supabase/client";

type Props = {
  gegenstandId: string;
  /** Stand beim Laden der Seite (und nach dem eigenen Klick). */
  anzahl: number;
};

/**
 * Zeigt die Zahl der Anfragen und aktualisiert sie ohne Neuladen.
 * Die Datenbank meldet über Realtime nur „hier hat sich etwas geändert“;
 * die Zahl selbst kommt immer frisch aus `anzahl_anfragen` – so wird nichts doppelt gezählt.
 */
export default function AnfragenZaehler({ gegenstandId, anzahl }: Props) {
  const [zahl, setZahl] = useState(anzahl);
  // Kommt vom Server ein neuer Stand (z. B. nach dem eigenen Klick), gilt der.
  const [vomServer, setVomServer] = useState(anzahl);
  if (anzahl !== vomServer) {
    setVomServer(anzahl);
    setZahl(anzahl);
  }

  // Zählt die Abfragen mit, damit eine langsame ältere Antwort keine neuere überschreibt.
  const abfrage = useRef(0);

  useEffect(() => {
    const supabase = createClient();

    async function neuLaden() {
      const nummer = ++abfrage.current;
      const { data, error } = await supabase.rpc("anzahl_anfragen", { gegenstand: gegenstandId });
      if (!error && nummer === abfrage.current) setZahl(Number(data));
    }

    return beobachteAnfragen(gegenstandId, neuLaden);
  }, [gegenstandId]);

  return <span className="font-semibold text-ink">{zahl}</span>;
}
