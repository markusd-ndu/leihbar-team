import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox, PackageOpen, Plus } from "lucide-react";
import GegenstandKarte from "@/components/GegenstandKarte";
import { hinweisFlaeche, knopf } from "@/components/stile";
import { ladeNutzer } from "@/lib/auth";
import { ladeMeineGegenstaende } from "@/lib/items";

export const metadata: Metadata = { title: "Meine Gegenstände" };

export default async function MeineGegenstaende() {
  // Der Proxy leitet schon um; diese Prüfung ist die zweite Absicherung.
  const nutzer = await ladeNutzer();
  if (!nutzer) redirect("/anmelden?weiter=/meine-gegenstaende");

  const gegenstaende = await ladeMeineGegenstaende(nutzer);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
      <div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-4">
          <div>
            <h1 className="text-3xl">Meine Gegenstände</h1>
            {gegenstaende.length > 0 && <p className="mt-2 text-muted">Die neuesten stehen oben.</p>}
          </div>
          {gegenstaende.length > 0 && (
            <Link href="/anbieten" className={knopf("haupt")}>
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
                  gegenstand={g}
                  vorladen={index === 0}
                  ueberschrift="h2"
                  zusatz={
                    g.offeneAnfragen > 0 ? (
                      <p className="mt-1 flex min-h-8 items-center gap-2 rounded-full border border-on-signal bg-signal px-3 text-sm font-semibold text-on-signal">
                        <Inbox size={18} aria-hidden />
                        <span className="sr-only">Offene Anfragen:</span>
                        {g.offeneAnfragen === 1 ? "1 offene Anfrage" : `${g.offeneAnfragen} offene Anfragen`}
                      </p>
                    ) : (
                      <p className="mt-1 flex min-h-8 items-center gap-2 text-sm text-muted">
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
          <div className={`${hinweisFlaeche} flex flex-col items-center gap-4 p-8 text-center shadow-1`}>
            <PackageOpen size={40} className="text-muted" aria-hidden />
            <p className="text-muted">Du bietest noch nichts an. Was bei dir im Schrank liegt, freut jemand anderen.</p>
            <Link href="/anbieten" className={knopf("haupt")}>
              <Plus size={18} aria-hidden />
              Etwas anbieten
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
