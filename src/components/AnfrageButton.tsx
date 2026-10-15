"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Check, CircleAlert, LoaderCircle } from "lucide-react";
import { anfrageUmschalten, type AnfrageZustand } from "@/app/gegenstaende/[id]/actions";
import AnfragenZaehler from "@/components/AnfragenZaehler";
import { fehlerSatz, knopf } from "@/components/stile";

type Props = {
  gegenstandId: string;
  anzahl: number;
  angefragt: boolean;
  angemeldet: boolean;
};

const breit = "w-full sm:w-auto";

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
            aria-pressed={angefragt}
            aria-busy={laeuft}
            onClick={(e) => laeuft && e.preventDefault()}
            className={`${knopf(angefragt ? "zweit" : "haupt")} ${breit} ${laeuft && angefragt ? "aria-busy:bg-raised aria-busy:text-ink" : ""}`}
          >
            {laeuft && <LoaderCircle size={18} aria-hidden className="animate-spin" />}
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
          className={`${knopf("haupt")} ${breit}`}
        >
          Ausleihen anfragen
        </Link>
      )}

      <p aria-live="polite" className="text-muted">
        Anfragen: <AnfragenZaehler gegenstandId={gegenstandId} anzahl={anzahl} />
        {angefragt && <span className="ml-1">· Tipp erneut, um zurückzuziehen.</span>}
      </p>

      {zustand.fehler && (
        <p role="alert" className={fehlerSatz}>
          <CircleAlert size={18} aria-hidden className="mt-1 shrink-0" />
          {zustand.fehler}
        </p>
      )}
    </div>
  );
}
