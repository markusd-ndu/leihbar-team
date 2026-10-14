"use client";

import { useActionState } from "react";
import Link from "next/link";
import { statusSetzen, type AnfrageZustand } from "@/app/gegenstaende/[id]/actions";
import type { ErhalteneAnfrage } from "@/lib/anfragen";

type Props = {
  gegenstandId: string;
  anfragen: ErhalteneAnfrage[];
};

const knopf = "flex min-h-11 flex-1 items-center justify-center rounded-xl px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none";

/** Nur für die Besitzer*in: wer angefragt hat, mit „Annehmen“ und „Ablehnen“. */
export default function ErhalteneAnfragen({ gegenstandId, anfragen }: Props) {
  return (
    <section aria-labelledby="erhaltene-anfragen" className="mb-6 rounded-2xl border border-border bg-card p-4">
      <h2 id="erhaltene-anfragen" className="mb-3 text-lg font-semibold">
        Anfragen an dich
      </h2>
      {anfragen.length > 0 ? (
        <ul className="divide-y divide-border">
          {anfragen.map((anfrage) => (
            <AnfrageZeile key={anfrage.id} gegenstandId={gegenstandId} anfrage={anfrage} />
          ))}
        </ul>
      ) : (
        <p className="text-muted">
          Noch hat niemand angefragt.{" "}
          <Link href="/#gegenstaende" className="font-medium text-foreground underline">
            Zur Liste
          </Link>
        </p>
      )}
    </section>
  );
}

/** Eine Anfrage mit „Annehmen“ und „Ablehnen“. Mit `titel` steht der Gegenstand als Link dabei. */
export function AnfrageZeile({
  gegenstandId,
  anfrage,
  titel,
}: {
  gegenstandId: string;
  anfrage: ErhalteneAnfrage;
  titel?: string;
}) {
  const [zustand, formAction, laeuft] = useActionState<AnfrageZustand, FormData>(
    statusSetzen.bind(null, anfrage.id, gegenstandId),
    {},
  );

  return (
    <li className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        {titel && (
          <Link href={`/gegenstaende/${gegenstandId}`} className="font-semibold underline">
            {titel}
          </Link>
        )}
        <p className="break-words font-medium">{anfrage.email}</p>
        <p className="text-sm text-muted">Status: {anfrage.status}</p>
      </div>
      <form action={formAction} className="flex gap-2">
        <button
          type="submit"
          name="status"
          value="angenommen"
          disabled={laeuft || anfrage.status === "angenommen"}
          className={`${knopf} bg-accent text-on-accent hover:opacity-90`}
        >
          Annehmen
        </button>
        <button
          type="submit"
          name="status"
          value="abgelehnt"
          disabled={laeuft || anfrage.status === "abgelehnt"}
          className={`${knopf} border border-border bg-card hover:bg-background`}
        >
          Ablehnen
        </button>
      </form>
      {zustand.fehler && (
        <p role="alert" className="text-sm font-medium text-danger">
          {zustand.fehler}
        </p>
      )}
    </li>
  );
}
