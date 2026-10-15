"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { statusSetzen, type AnfrageZustand } from "@/app/gegenstaende/[id]/actions";
import StatusChip from "@/components/StatusChip";
import { fehlerSatz, knopf } from "@/components/stile";
import type { ErhalteneAnfrage } from "@/lib/anfragen";

type Props = {
  gegenstandId: string;
  anfragen: ErhalteneAnfrage[];
};

/** Nur für die Besitzer*in: wer angefragt hat, mit „Annehmen“ und „Ablehnen“. */
export default function ErhalteneAnfragen({ gegenstandId, anfragen }: Props) {
  return (
    <section aria-labelledby="erhaltene-anfragen" className="mb-6 border border-border bg-raised p-4">
      <h2 id="erhaltene-anfragen" className="mb-3 font-display text-xl font-normal">
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
          <Link href="/#gegenstaende" className="font-medium text-ink underline underline-offset-4">
            Zur Liste
          </Link>
        </p>
      )}
    </section>
  );
}

/** Ein Antwort-Knopf: Der gerade gedrückte zeigt beim Speichern den drehenden Kreis. */
function AntwortKnopf({ wert, aktuellerStatus, art, children }: {
  wert: "angenommen" | "abgelehnt";
  aktuellerStatus: string;
  art: "haupt" | "zweit";
  children: React.ReactNode;
}) {
  const { pending, data } = useFormStatus();
  const gedrueckt = pending && data?.get("status") === wert;
  return (
    <button
      type="submit"
      name="status"
      value={wert}
      // Der Knopf, der zum aktuellen Status passt, ist ausgeschaltet. Beim Speichern sind beide ruhig.
      disabled={aktuellerStatus === wert && !pending}
      aria-busy={gedrueckt}
      onClick={(e) => pending && e.preventDefault()}
      className={`${knopf(art, { klein: true })} flex-1 sm:flex-none ${gedrueckt && art === "zweit" ? "aria-busy:bg-raised aria-busy:text-ink" : ""}`}
    >
      {gedrueckt && <LoaderCircle size={18} aria-hidden className="animate-spin" />}
      {children}
    </button>
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
  const [zustand, formAction] = useActionState<AnfrageZustand, FormData>(
    statusSetzen.bind(null, anfrage.id, gegenstandId),
    {},
  );

  return (
    <li className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        {titel && (
          <Link href={`/gegenstaende/${gegenstandId}`} className="flex min-h-11 items-center font-semibold underline underline-offset-4">
            {titel}
          </Link>
        )}
        <p className="mb-1 break-words font-medium">{anfrage.email}</p>
        <StatusChip status={anfrage.status} />
      </div>
      <form action={formAction} className="flex gap-2">
        <AntwortKnopf wert="angenommen" aktuellerStatus={anfrage.status} art="haupt">
          Annehmen
        </AntwortKnopf>
        <AntwortKnopf wert="abgelehnt" aktuellerStatus={anfrage.status} art="zweit">
          Ablehnen
        </AntwortKnopf>
      </form>
      {zustand.fehler && (
        <p role="alert" className={fehlerSatz}>
          <CircleAlert size={18} aria-hidden className="mt-1 shrink-0" />
          {zustand.fehler}
        </p>
      )}
    </li>
  );
}
