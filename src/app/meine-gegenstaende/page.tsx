import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox, PackageOpen, Plus } from "lucide-react";
import GegenstandKarte from "@/components/GegenstandKarte";
import { ladeNutzer } from "@/lib/auth";
import { ladeMeineGegenstaende } from "@/lib/items";

export const metadata: Metadata = { title: "Meine Gegenstände" };

// Hauptknopf des Design-Systems: Tinte mit gelbem Schatten, beim Drücken rutscht er hinein.
const anbietenKnopf =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-none bg-lb-action px-5 font-semibold text-lb-on-action shadow-lb-1 transition duration-120 hover:bg-lb-action-hover active:translate-x-1 active:translate-y-1 active:bg-lb-action-pressed active:shadow-none";

export default async function MeineGegenstaende() {
  // Der Proxy leitet schon um; diese Prüfung ist die zweite Absicherung.
  const nutzer = await ladeNutzer();
  if (!nutzer) redirect("/anmelden?weiter=/meine-gegenstaende");

  const gegenstaende = await ladeMeineGegenstaende(nutzer);

  return (
    <main className="w-full flex-1 bg-lb-bg text-lb-text">
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-4">
          <div>
            <h1 className="text-3xl font-extrabold uppercase leading-[1.1]">Meine Gegenstände</h1>
            {gegenstaende.length > 0 && <p className="mt-2 text-lb-muted">Die neuesten stehen oben.</p>}
          </div>
          {gegenstaende.length > 0 && (
            <Link href="/anbieten" className={anbietenKnopf}>
              <Plus size={18} aria-hidden />
              Etwas anbieten
            </Link>
          )}
        </div>
        {gegenstaende.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gegenstaende.map((g, index) => (
              <li key={g.id}>
                <GegenstandKarte
                  stil="brett"
                  gegenstand={g}
                  vorladen={index === 0}
                  ueberschrift="h2"
                  zusatz={
                    g.offeneAnfragen > 0 ? (
                      <p className="mt-1 flex min-h-8 items-center gap-2 rounded-full border border-lb-border bg-lb-signal px-3 text-sm font-semibold text-lb-on-signal">
                        <Inbox size={18} aria-hidden />
                        <span className="sr-only">Offene Anfragen:</span>
                        {g.offeneAnfragen === 1 ? "1 offene Anfrage" : `${g.offeneAnfragen} offene Anfragen`}
                      </p>
                    ) : (
                      <p className="mt-1 flex min-h-8 items-center gap-2 text-sm text-lb-muted">
                        <Inbox size={18} aria-hidden />
                        <span className="sr-only">Offene Anfragen:</span>0 offene Anfragen
                      </p>
                    )
                  }
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-4 border border-lb-border bg-lb-raised p-8 text-center shadow-lb-1">
            <PackageOpen size={40} className="text-lb-muted" aria-hidden />
            <p className="text-lb-muted">Du bietest noch nichts an. Was bei dir im Schrank liegt, freut jemand anderen.</p>
            <Link href="/anbieten" className={anbietenKnopf}>
              <Plus size={18} aria-hidden />
              Etwas anbieten
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
