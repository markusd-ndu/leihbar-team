"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { anfrageUmschalten, type AnfrageZustand } from "@/app/gegenstaende/[id]/actions";
import AnfragenZaehler from "@/components/AnfragenZaehler";

type Props = {
  gegenstandId: string;
  anzahl: number;
  angefragt: boolean;
  angemeldet: boolean;
};

const knopf = "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 font-medium shadow-sm transition sm:w-auto";

export default function AnfrageButton({ gegenstandId, anzahl, angefragt, angemeldet }: Props) {
  const [zustand, formAction, laeuft] = useActionState<AnfrageZustand, FormData>(
    anfrageUmschalten.bind(null, gegenstandId),
    {},
  );

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      {angemeldet ? (
        <form action={formAction} className="sm:shrink-0">
          <input type="hidden" name="aktion" value={angefragt ? "zurueckziehen" : "anfragen"} />
          <button
            type="submit"
            disabled={laeuft}
            aria-pressed={angefragt}
            className={`${knopf} ${
              angefragt
                ? "border border-border bg-card text-foreground hover:bg-background"
                : "bg-accent text-on-accent hover:opacity-90"
            } disabled:opacity-60`}
          >
            {angefragt ? (
              <>
                Angefragt <Check size={18} aria-hidden />
              </>
            ) : (
              "Ausleihen anfragen"
            )}
          </button>
        </form>
      ) : (
        <Link
          href={`/anmelden?weiter=/gegenstaende/${encodeURIComponent(gegenstandId)}`}
          className={`${knopf} bg-accent text-on-accent hover:opacity-90`}
        >
          Ausleihen anfragen
        </Link>
      )}

      <p aria-live="polite" className="text-muted">
        Anfragen: <AnfragenZaehler gegenstandId={gegenstandId} anzahl={anzahl} />
        {angefragt && <span className="ml-1">· Tipp erneut, um zurückzuziehen.</span>}
      </p>

      {zustand.fehler && (
        <p role="alert" className="text-sm font-medium text-danger">
          {zustand.fehler}
        </p>
      )}
    </div>
  );
}
